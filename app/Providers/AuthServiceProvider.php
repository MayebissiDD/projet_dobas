<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;
use App\Models\Dossier;
use App\Policies\DossierPolicy;
use App\Models\Paiement;
use App\Policies\PaiementPolicy;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        Dossier::class => DossierPolicy::class,
        Paiement::class => PaiementPolicy::class,
    ];

    public function boot()
    {
        $this->registerPolicies();
    }
}
