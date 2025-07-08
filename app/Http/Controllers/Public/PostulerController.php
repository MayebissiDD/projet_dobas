<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Candidature;
use App\Models\Paiement;
use App\Models\Piece;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
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
            'paiement_mode' => 'required|string',
            'bourse_id' => 'required|integer',
            'montant' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $formData = $request->all();

        // Sauvegarder les fichiers temporairement et enregistrer les chemins
        $uploadedFiles = [];
        foreach ($request->allFiles() as $key => $file) {
            $path = $file->store('temp/pieces');
            $uploadedFiles[$key] = $path;
        }

        Session::put('candidature_data', $formData);
        Session::put('candidature_files', $uploadedFiles);

        // Redirection vers le paiement (Stripe / Lygos)
        return response()->json([
            'success' => true,
            'redirect' => route('payment.initiate', ['mode' => $formData['paiement_mode']])
        ]);
    }

    public function finalize(Request $request)
    {
        $data = Session::get('candidature_data');
        $files = Session::get('candidature_files');

        if (!$data || !$files) {
            return response()->json(['success' => false, 'message' => 'Données manquantes ou expirées.'], 400);
        }

        DB::beginTransaction();

        try {
            // Créer ou récupérer l'utilisateur
            $user = User::firstOrCreate(
                ['email' => $data['email']],
                [
                    'name' => $data['prenom'] . ' ' . $data['nom'],
                    'password' => bcrypt(Str::random(10)),
                    'role' => 'etudiant'
                ]
            );

            $candidature = Candidature::create([
                'user_id' => $user->id,
                'nom' => $data['nom'],
                'prenom' => $data['prenom'],
                'date_naissance' => $data['date_naissance'],
                'lieu_naissance' => $data['lieu_naissance'],
                'adresse' => $data['adresse'],
                'telephone' => $data['telephone'],
                'email' => $data['email'],
                'diplome' => $data['diplome'],
                'ecole' => $data['ecole'],
                'filiere' => $data['filiere'],
                'statut' => 'en_attente'
            ]);

            foreach ($files as $key => $filePath) {
                $newPath = str_replace('temp/', 'pieces_candidature/', $filePath);
                Storage::move($filePath, $newPath);
                DB::table('candidature_piece')->insert([
                    'candidature_id' => $candidature->id,
                    'piece_id' => $this->resolvePieceId($key),
                    'fichier' => $newPath,
                    'created_at' => now(),
                    'updated_at' => now()
                ]);
            }

            Paiement::create([
                'user_id' => $user->id,
                'candidature_id' => $candidature->id,
                'montant' => $data['montant'],
                'methode' => $data['paiement_mode'],
                'statut' => 'payé',
                'reference' => strtoupper(Str::random(10))
            ]);

            Notification::route('mail', $user->email)->notify(new CandidatureSoumiseNotification($candidature));

            Session::forget(['candidature_data', 'candidature_files']);
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
