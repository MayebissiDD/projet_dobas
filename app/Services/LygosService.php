<?php

namespace App\Services;

/**
 * Service pour gérer les interactions avec l'API Lygos.
 */
class LygosService
{
    /**
     * Récupère la clé API Lygos depuis le fichier .env.
     *
     * @return string|null La clé API Lygos ou null si non définie.
     */
    public function getApiKey()
    {
        return env('LYGOS_API_KEY');
    }

    /**
     * Récupère l'URL de base de l'API Lygos depuis le fichier .env.
     *
     * @return string|null L'URL de l'API Lygos ou null si non définie.
     */
    public function getApiUrl()
    {
        return env('LYGOS_API_URL');
    }
}
