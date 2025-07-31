<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Defaults
    |--------------------------------------------------------------------------
    |
    | Valeurs par défaut pour l'authentification.
    | Le guard "web" est utilisé pour les utilisateurs classiques (admins, agents).
    | Le broker "users" est utilisé pour la réinitialisation de mot de passe.
    |
    */

    'defaults' => [
        'guard' => 'web',
        'passwords' => 'users',
    ],

    /*
    |--------------------------------------------------------------------------
    | Authentication Guards
    |--------------------------------------------------------------------------
    |
    | Chaque guard représente une méthode d’authentification.
    | Le driver "session" est utilisé pour les connexions web avec formulaire.
    | On définit ici les guards "web" (users/admins/agents) et "etudiant".
    |
    */

    'guards' => [
        'web' => [
            'driver'   => 'session',
            'provider' => 'users',
        ],

        'etudiant' => [
            'driver'   => 'session',
            'provider' => 'etudiants',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | User Providers
    |--------------------------------------------------------------------------
    |
    | Détermine comment on récupère les utilisateurs dans la base de données.
    | Ici, on utilise Eloquent avec deux modèles : User et Etudiant.
    |
    */

    'providers' => [
        'users' => [
            'driver' => 'eloquent',
            'model'  => App\Models\User::class,
        ],

        'etudiants' => [
            'driver' => 'eloquent',
            'model'  => App\Models\Etudiant::class,
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Resetting Passwords
    |--------------------------------------------------------------------------
    |
    | Définition des brokers pour la réinitialisation de mot de passe.
    | Chaque type d'utilisateur a sa propre configuration.
    |
    */

    'passwords' => [
        'users' => [
            'provider' => 'users',
            'table'    => 'password_reset_tokens',
            'expire'   => 60,      // lien valable 60 minutes
            'throttle' => 60,      // délai entre deux tentatives
        ],

        'etudiants' => [
            'provider' => 'etudiants',
            'table'    => 'password_reset_tokens',
            'expire'   => 60,
            'throttle' => 60,
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Password Confirmation Timeout
    |--------------------------------------------------------------------------
    |
    | Durée en secondes avant qu’une confirmation de mot de passe ne soit requise.
    | Par défaut : 3 heures (10800 secondes).
    |
    */

    'password_timeout' => 10800,

];
