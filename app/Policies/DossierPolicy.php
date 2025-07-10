<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Dossier;

class DossierPolicy
{
    public function view(User $user, Dossier $dossier)
    {
        return $user->hasRole('admin') || $user->hasRole('agent') || $user->id === $dossier->etudiant_id;
    }

    public function update(User $user, Dossier $dossier)
    {
        return $user->hasRole('admin') || $user->hasRole('agent');
    }

    public function delete(User $user, Dossier $dossier)
    {
        return $user->hasRole('admin');
    }
}
