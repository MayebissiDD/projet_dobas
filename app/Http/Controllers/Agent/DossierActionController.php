<?php
namespace App\Http\Controllers\Agent;

use App\Http\Controllers\Controller;
use App\Models\Dossier;
use App\Models\User;
use App\Models\Ecole;
use App\Models\HistoriqueStatutDossier;
use Illuminate\Http\Request;
use App\Notifications\DossierValideNotification;
use App\Notifications\DossierRejeteNotification;

class DossierActionController extends Controller
{
    public function valider($id)
    {
        $dossier = Dossier::findOrFail($id);
        $ancienStatut = $dossier->statut;
        
        $dossier->statut = 'accepte';
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
        
        $dossier->statut = 'refuse';
        $dossier->raison_refus = $request->motif;
        $dossier->save();
        
        // Enregistrer dans l'historique
        HistoriqueStatutDossier::create([
            'dossier_id' => $dossier->id,
            'ancien_statut' => $ancienStatut,
            'nouveau_statut' => 'refuse',
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

    public function affecter(Request $request, $id)
    {
        $dossier = Dossier::findOrFail($id);
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