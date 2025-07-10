<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Paiement;

class PaiementPolicy
{
    public function view(User $user, Paiement $paiement)
    {
        return $user->hasRole('admin') || $user->hasRole('agent') || $user->id === $paiement->etudiant_id;
    }

    public function update(User $user, Paiement $paiement)
    {
        return $user->hasRole('admin');
    }
}
