<?php

return [
    /*
    |--------------------------------------------------------------------------
    | MTN Tinda API Configuration
    |--------------------------------------------------------------------------
    |
    | Ce fichier contient les paramètres de configuration pour l'API MTN Tinda.
    |
    */

    'base_url' => env('MTN_TINDA_BASE_URL', 'https://sms.mtncongo.net/api/sms/'),
    'token' => env('MTN_TINDA_TOKEN', ''),
    'default_sender' => env('MTN_TINDA_DEFAULT_SENDER', ''),
];