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
use App\Notifications\DossierIncompletNotification; // Ajout de cette ligne

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

        $dossier->statut = 'accepte'; // Changé de 'accepte' à 'accepte' pour la cohérence
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

        return back()->with('success', 'Dossier validé et notifications envoyées.');
    }

    public function rejeter($id, Request $request)
    {
        $dossier = Dossier::findOrFail($id);
        $ancienStatut = $dossier->statut;

        $dossier->statut = 'rejete'; // Changé de 'refuse' à 'rejete' pour la cohérence
        $dossier->raison_refus = $request->motif;
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

        return back()->with('success', 'Dossier rejeté et notifications envoyées.');
    }
    public function marquerIncomplet($id, Request $request)
    {
        $dossier = Dossier::findOrFail($id);
        $ancienStatut = $dossier->statut;

        $dossier->statut = 'incomplet';
        $dossier->commentaire_agent = $request->commentaire;
        $dossier->save();

        // Enregistrer dans l'historique
        HistoriqueStatutDossier::create([
            'dossier_id' => $dossier->id,
            'ancien_statut' => $ancienStatut,
            'nouveau_statut' => 'incomplet',
            'motif' => $request->commentaire,
            'modifie_par' => auth()->id()
        ]);

        // Notifier l'étudiant
        if ($dossier->etudiant) {
            // Utiliser une notification générique ou créer une notification spécifique
            $dossier->etudiant->notify(new \App\Notifications\DossierStatusNotification(
                $dossier,
                'incomplet',
                $request->commentaire
            ));
        }

        // Notifier les admins
        $admins = User::role('admin')->get();
        foreach ($admins as $admin) {
            $admin->notify(new \App\Notifications\DossierStatusNotification(
                $dossier,
                'incomplet',
                $request->commentaire
            ));
        }

        \App\Services\ActivityLogger::log(
            'mark_incomplete_dossier',
            Dossier::class,
            $dossier->id,
            "Dossier #{$dossier->id} marqué comme incomplet par un agent."
        );

        return back()->with('success', 'Dossier marqué comme incomplet et notification envoyée.');
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

        // Vérifier la capacité de l'école
        $placesRestantes = $ecole->capacite - $ecole->dossiers()->count();
        if ($placesRestantes <= 0) {
            return back()->withErrors(['ecole_id' => "Plus de places disponibles dans cette école."]);
        }

        $ancienStatut = $dossier->statut;

        $dossier->ecole_id = $ecole->id;
        $dossier->filiere_souhaitee = $request->filiere;
        $dossier->statut = 'accepte';
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
            $dossier->etudiant->notify(new DossierValideNotification($ecole->nom, $request->filiere));
        }

        // Notifier les admins
        $admins = User::role('admin')->get();
        foreach ($admins as $admin) {
            $admin->notify(new DossierValideNotification($ecole->nom, $request->filiere));
        }

        \App\Services\ActivityLogger::log(
            'affect_dossier',
            Dossier::class,
            $dossier->id,
            "Affectation du dossier #{$dossier->id} à l'école #{$ecole->id} ({$ecole->nom}) par un agent."
        );

        return back()->with('success', 'Dossier affecté à l\'école et notification envoyée.');
    }
}
