<?php

namespace App\Http\Controllers\Agent;

use App\Http\Controllers\Controller;
use App\Models\Dossier;
use App\Models\User;
use App\Models\Ecole;
use App\Models\Filiere;
use App\Models\HistoriqueStatutDossier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\DB;
use App\Notifications\DossierValideNotification;
use App\Notifications\DossierRejeteNotification;
use App\Notifications\NotificationPersonnalisee;

class DossierActionController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'role:agent']);
    }

    public function valider($id)
    {
        $dossier = Dossier::findOrFail($id);
        Gate::authorize('update', $dossier);

        $ancienStatut = $dossier->statut;

        DB::transaction(function () use ($dossier, $ancienStatut) {
            $dossier->statut = 'accepte'; // Utiliser 'accepte' au lieu de 'accepte'
            $dossier->agent_id = auth()->id();
            $dossier->date_decision = now();
            $dossier->save();

            // Enregistrer dans l'historique
            HistoriqueStatutDossier::create([
                'dossier_id' => $dossier->id,
                'ancien_statut' => $ancienStatut,
                'nouveau_statut' => 'accepte',
                'motif' => 'Dossier validé par un agent',
                'modifie_par' => auth()->id()
            ]);

            // Notifier l'étudiant
            if ($dossier->etudiant) {
                $dossier->etudiant->notify(new DossierValideNotification(
                    optional($dossier->ecole)->nom,
                    $dossier->filiere_souhaitee
                ));
            }

            // Notifier les admins
            $admins = User::role('admin')->get();
            foreach ($admins as $admin) {
                $admin->notify(new DossierValideNotification(
                    optional($dossier->ecole)->nom,
                    $dossier->filiere_souhaitee
                ));
            }

            \App\Services\ActivityLogger::log(
                'validate_dossier',
                Dossier::class,
                $dossier->id,
                "Dossier #{$dossier->id} validé par un agent."
            );
        });

        return back()->with('success', 'Dossier validé et notifications envoyées.');
    }

    public function rejeter($id, Request $request)
    {
        $dossier = Dossier::findOrFail($id);
        Gate::authorize('update', $dossier);

        $request->validate([
            'motif' => 'required|string|max:500',
        ]);

        $ancienStatut = $dossier->statut;

        DB::transaction(function () use ($dossier, $request, $ancienStatut) {
            $dossier->statut = 'rejete'; // Utiliser 'rejete' au lieu de 'refuse'
            $dossier->raison_refus = $request->motif;
            $dossier->agent_id = auth()->id();
            $dossier->date_decision = now();
            $dossier->save();

            // Enregistrer dans l'historique
            HistoriqueStatutDossier::create([
                'dossier_id' => $dossier->id,
                'ancien_statut' => $ancienStatut,
                'nouveau_statut' => 'rejete',
                'motif' => $request->motif,
                'modifie_par' => auth()->id()
            ]);

            // Notifier l'étudiant
            if ($dossier->etudiant) {
                $dossier->etudiant->notify(new DossierRejeteNotification($request->motif));
            }

            // Notifier les admins
            $admins = User::role('admin')->get();
            foreach ($admins as $admin) {
                $admin->notify(new DossierRejeteNotification($request->motif));
            }

            \App\Services\ActivityLogger::log(
                'reject_dossier',
                Dossier::class,
                $dossier->id,
                "Dossier #{$dossier->id} rejeté par un agent."
            );
        });

        return back()->with('success', 'Dossier rejeté et notifications envoyées.');
    }

    /**
     * Affecter un dossier à une école
     */
    public function affecter(Request $request, $id)
    {
        $dossier = Dossier::findOrFail($id);
        Gate::authorize('update', $dossier);

        $request->validate([
            'ecole_id' => 'required|exists:ecoles,id',
            'filiere_id' => 'required|exists:filieres,id', // Ajout de la validation de la filière
        ]);

        $ecole = Ecole::findOrFail($request->ecole_id);
        $filiere = Filiere::findOrFail($request->filiere_id);

        // Vérifier que la filière appartient bien à l'école
        if ($filiere->ecole_id !== $ecole->id) {
            return back()->withErrors(['filiere_id' => "Cette filière n'appartient pas à l'école sélectionnée."]);
        }

        // Vérifier la capacité de l'école
        $placesRestantes = $ecole->capacite - $ecole->dossiers()->count();
        if ($placesRestantes <= 0) {
            return back()->withErrors(['ecole_id' => "Plus de places disponibles dans cette école."]);
        }

        $ancienStatut = $dossier->statut;

        DB::transaction(function () use ($dossier, $request, $ecole, $filiere, $ancienStatut) {
            $dossier->ecole_id = $ecole->id;
            $dossier->filiere_id = $filiere->id; // Correction: utiliser filiere_id au lieu de filiere_souhaitee
            $dossier->statut = 'accepte';
            $dossier->agent_id = auth()->id();
            $dossier->date_decision = now();
            $dossier->save();

            // Enregistrer dans l'historique
            HistoriqueStatutDossier::create([
                'dossier_id' => $dossier->id,
                'ancien_statut' => $ancienStatut,
                'nouveau_statut' => 'accepte',
                'motif' => "Affectation à l'école {$ecole->nom}",
                'modifie_par' => auth()->id()
            ]);

            // Notifier l'étudiant
            if ($dossier->etudiant) {
                $dossier->etudiant->notify(new DossierValideNotification($ecole->nom, $filiere->nom));
            }

            // Notifier les admins
            $admins = User::role('admin')->get();
            foreach ($admins as $admin) {
                $admin->notify(new DossierValideNotification($ecole->nom, $filiere->nom));
            }

            \App\Services\ActivityLogger::log(
                'affect_dossier',
                Dossier::class,
                $dossier->id,
                "Affectation du dossier #{$dossier->id} à l'école #{$ecole->id} ({$ecole->nom}) par un agent."
            );
        });

        return back()->with('success', 'Dossier affecté à l\'école et notification envoyée.');
    }

    /**
     * Réorienter une candidature vers une autre école/filière
     */
    public function reorienter(Request $request, $id)
    {
        $dossier = Dossier::findOrFail($id);
        Gate::authorize('update', $dossier);

        $request->validate([
            'ecole_id' => 'required|exists:ecoles,id',
            'filiere_id' => 'required|exists:filieres,id',
            'motif' => 'nullable|string|max:500',
        ]);

        $ecole = Ecole::findOrFail($request->ecole_id);
        $filiere = Filiere::findOrFail($request->filiere_id);

        // Vérifier que la filière appartient bien à l'école
        if ($filiere->ecole_id !== $ecole->id) {
            return back()->withErrors(['filiere_id' => "Cette filière n'appartient pas à l'école sélectionnée."]);
        }

        $ancienEcole = optional($dossier->ecole)->nom;
        $ancienneFiliere = optional($dossier->filiere)->nom;
        $ancienStatut = $dossier->statut;

        DB::transaction(function () use ($dossier, $request, $ecole, $filiere, $ancienEcole, $ancienneFiliere, $ancienStatut) {
            $dossier->ecole_id = $request->ecole_id;
            $dossier->filiere_id = $request->filiere_id;
            $dossier->statut = 'reoriente';
            $dossier->agent_id = auth()->id();
            $dossier->date_decision = now();
            $dossier->save();

            // Enregistrer dans l'historique
            HistoriqueStatutDossier::create([
                'dossier_id' => $dossier->id,
                'ancien_statut' => $ancienStatut,
                'nouveau_statut' => 'reoriente',
                'motif' => 'Réorientation vers une autre école/filière. ' . ($request->motif ?? ''),
                'modifie_par' => auth()->id()
            ]);

            // Notifier l'étudiant
            if ($dossier->etudiant) {
                $dossier->etudiant->notify(new NotificationPersonnalisee(
                    'Réorientation de votre candidature',
                    "Votre candidature a été réorientée de {$ancienEcole} ({$ancienneFiliere}) vers {$ecole->nom} ({$filiere->nom}). " . ($request->motif ?? ''),
                    'info',
                    $dossier
                ));
            }

            // Notifier les admins
            $admins = User::role('admin')->get();
            foreach ($admins as $admin) {
                $admin->notify(new NotificationPersonnalisee(
                    'Réorientation d\'une candidature',
                    "La candidature de {$dossier->etudiant->nom} {$dossier->etudiant->prenom} a été réorientée de {$ancienEcole} ({$ancienneFiliere}) vers {$ecole->nom} ({$filiere->nom}).",
                    'info',
                    $dossier
                ));
            }

            \App\Services\ActivityLogger::log(
                'reorient_dossier',
                Dossier::class,
                $dossier->id,
                "Réorientation du dossier #{$dossier->id} de {$ancienEcole} vers {$ecole->nom} par un agent."
            );
        });

        return back()->with('success', 'Candidature réorientée et notifications envoyées.');
    }
}
