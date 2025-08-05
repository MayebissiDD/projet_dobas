<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides a sane
    | default location for this type of information, allowing packages
    | to have a conventional file to locate the various service credentials.
    |
    */
    
    'lygos' => [
        'api_key' => env('LYGOS_API_KEY'),
        'api_url' => env('LYGOS_API_URL', 'https://api.lygosapp.com/v1/'),
    ],
    
    'stripe' => [
        'secret_key' => env('STRIPE_SECRET'),
        'webhook_secret' => env('STRIPE_WEBHOOK_SECRET'),
        'publishable_key' => env('STRIPE_PUBLISHABLE_KEY'),
    ],
];