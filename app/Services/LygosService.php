<?php

namespace App\Services;

class LygosService
{
    protected string $apiKey;

    public function __construct()
    {
        $this->apiKey = config('services.lygos.key');
    }

    /**
     * Retourne la clé API Lygos utilisée pour les paiements.
     */
    public function getApiKey(): string
    {
        return $this->apiKey;
    }

    /**
     * Exemple de méthode pour effectuer un appel à l'API Lygos.
     * À adapter selon la documentation de Lygos.
     */
    public function makePayment(array $data)
    {
        // Exemple d'utilisation de la clé
        // $this->apiKey
        // ...
    }
}
