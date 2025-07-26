<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Dossier;
use App\Models\DossierPiece;
use App\Models\User;
use App\Models\Bourse;
use App\Notifications\NouvelleCandidatureNotification;
use App\Notifications\CandidatureSoumiseNotification;
use Illuminate\Http\Request;

class DossierControllerEt extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'date_naissance' => 'required|date',
            'lieu_naissance' => 'required|string',
            'adresse' => 'required|string',
            'telephone' => 'required|string',
            'email' => 'required|email',
            'bourse_id' => 'required|exists:bourses,id',
            'diplome' => 'required|string',
            'annee_diplome' => 'required|string',
            'ecole' => 'required|string',
            'filiere' => 'required|string',
            'paiement_mode' => 'required|string',
        ]);

        $bourse = Bourse::findOrFail($request->bourse_id);

        if ($bourse->pieces_a_fournir) {
            foreach ($bourse->pieces_a_fournir as $piece) {
                if (!$request->hasFile('piece_' . $piece)) {
                    return response()->json([
                        'success' => false,
                        'errors' => ['piece_' . $piece => 'Pièce requise']
                    ], 422);
                }
            }
        }

        $dossier = Dossier::create([
            'nom' => $request->nom,
            'prenom' => $request->prenom,
            'date_naissance' => $request->date_naissance,
            'lieu_naissance' => $request->lieu_naissance,
            'adresse' => $request->adresse,
            'telephone' => $request->telephone,
            'email' => $request->email,
            'bourse_id' => $request->bourse_id,
            'diplome' => $request->diplome,
            'annee_diplome' => $request->annee_diplome,
            'ecole' => $request->ecole,
            'filiere' => $request->filiere,
            'statut' => 'en attente',
        ]);

        // Stockage des fichiers
        if ($bourse->pieces_a_fournir) {
            foreach ($bourse->pieces_a_fournir as $piece) {
                $file = $request->file('piece_' . $piece);
                if ($file) {
                    $path = $file->store('dossiers/' . $dossier->id . '/pieces');
                    DossierPiece::create([
                        'dossier_id' => $dossier->id,
                        'nom' => $piece,
                        'fichier' => $path,
                    ]);
                }
            }
        }

        // Notifications
        $agents = User::role('agent')->get();
        $admins = User::role('admin')->get();

        foreach ($agents->merge($admins) as $user) {
            $user->notify(new NouvelleCandidatureNotification());
        }

        $etudiant = User::where('email', $dossier->email)->first();
        if ($etudiant) {
            $etudiant->notify(new CandidatureSoumiseNotification($dossier));
        }

        return response()->json(['success' => true, 'message' => 'Votre dossier a bien été soumis.']);
    }
}
