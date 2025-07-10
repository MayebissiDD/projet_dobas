<?php

namespace App\Services;

use App\Models\User;
use App\Notifications\NouvelleCandidatureNotification;
use App\Notifications\DossierValideNotification;
use App\Notifications\DossierRejeteNotification;

class NotificationService
{
    /**
     * Notifie tous les agents et admins d'une nouvelle candidature.
     */
    public static function notifyNouvelleCandidature($candidature)
    {
        $admins = User::role('admin')->get();
        $agents = User::role('agent')->get();
        foreach ($admins->merge($agents) as $user) {
            $user->notify(new NouvelleCandidatureNotification());
        }
    }

    /**
     * Notifie l’étudiant et l’admin lors de la validation d’un dossier.
     */
    public static function notifyDossierValide($dossier)
    {
        if ($dossier->etudiant) {
            $dossier->etudiant->notify(new DossierValideNotification($dossier->ecole->nom, $dossier->filiere_affectee));
        }
        $admins = User::role('admin')->get();
        foreach ($admins as $admin) {
            $admin->notify(new DossierValideNotification($dossier->ecole->nom, $dossier->filiere_affectee));
        }
    }

    /**
     * Notifie l’étudiant et l’admin lors du rejet d’un dossier.
     */
    public static function notifyDossierRejete($dossier, $motif = null)
    {
        if ($dossier->etudiant) {
            $dossier->etudiant->notify(new DossierRejeteNotification($motif));
        }
        $admins = User::role('admin')->get();
        foreach ($admins as $admin) {
            $admin->notify(new DossierRejeteNotification($motif));
        }
    }
}
