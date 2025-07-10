<?php
namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Dossier;
use App\Models\Paiement;
use App\Models\Piece;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Notification;
use App\Notifications\CandidatureSoumiseNotification;

class PostulerController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'date_naissance' => 'required|date',
            'lieu_naissance' => 'required|string',
            'adresse' => 'required|string',
            'telephone' => 'required|string|max:20',
            'email' => 'required|email',
            'diplome' => 'required|string',
            'ecole' => 'required|string',
            'filiere' => 'required|string',
            'niveau' => 'required|string',
            'type_bourse' => 'required|string',
            'paiement_mode' => 'required|string',
            'bourse_id' => 'required|integer',
            'montant' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $formData = $request->all();

        // Stocker temporairement les fichiers
        $uploadedFiles = [];
        foreach ($request->allFiles() as $key => $file) {
            $path = $file->store('temp/pieces');
            $uploadedFiles[$key] = $path;
        }

        Session::put('dossier_data', $formData);
        Session::put('dossier_files', $uploadedFiles);

        return response()->json([
            'success' => true,
            'redirect' => route('payment.initiate', ['mode' => $formData['paiement_mode']])
        ]);
    }

    public function finalize(Request $request)
    {
        $data = Session::get('dossier_data');
        $files = Session::get('dossier_files');

        if (!$data || !$files) {
            return response()->json(['success' => false, 'message' => 'Données expirées ou manquantes.'], 400);
        }

        DB::beginTransaction();

        try {
            $user = User::firstOrCreate(
                ['email' => $data['email']],
                [
                    'name' => $data['prenom'] . ' ' . $data['nom'],
                    'password' => bcrypt(Str::random(10)),
                    'role' => 'etudiant'
                ]
            );

            $dossier = Dossier::create([
                'user_id' => $user->id,
                'bourse_id' => $data['bourse_id'],
                'nom' => $data['nom'],
                'prenom' => $data['prenom'],
                'email' => $data['email'],
                'telephone' => $data['telephone'],
                'ecole' => $data['ecole'],
                'filiere' => $data['filiere'],
                'diplomes' => json_encode([$data['diplome']]),
                'statut' => 'en_attente',
                'date_soumission' => now()
            ]);

            foreach ($files as $key => $filePath) {
                $newPath = str_replace('temp/', 'pieces_dossier/', $filePath);
                Storage::move($filePath, $newPath);
                DB::table('dossier_piece')->insert([
                    'dossier_id' => $dossier->id,
                    'piece_id' => $this->resolvePieceId($key),
                    'fichier' => $newPath,
                    'created_at' => now(),
                    'updated_at' => now()
                ]);
            }

            Paiement::create([
                'user_id' => $user->id,
                'dossier_id' => $dossier->id,
                'montant' => $data['montant'],
                'methode' => $data['paiement_mode'],
                'statut' => 'payé',
                'reference' => strtoupper(Str::random(10))
            ]);

            Notification::route('mail', $user->email)->notify(new CandidatureSoumiseNotification($dossier));

            Session::forget(['dossier_data', 'dossier_files']);
            DB::commit();

            return redirect('/postuler?success=1');

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => 'Erreur serveur : ' . $e->getMessage()], 500);
        }
    }

    private function resolvePieceId($key)
    {
        $clean = str_replace('piece_', '', $key);
        $piece = Piece::where('nom', 'like', "%{$clean}%")->first();
        return $piece ? $piece->id : null;
    }
}
