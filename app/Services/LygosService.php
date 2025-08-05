<?php

namespace App\Services;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class LygosService
{
    protected $apiKey;
    protected $apiUrl;

    public function __construct()
    {
        $this->apiKey = config('services.lygos.api_key');
        $this->apiUrl = config('services.lygos.api_url');
    }

    /**
     * Crée un paiement via Lygos
     */
    public function createPayment(array $data)
    {
        try {
            $response = Http::withHeaders([
                'api-key' => $this->apiKey,
                'Content-Type' => 'application/json',
            ])->post($this->apiUrl . '/gateway', [
                'amount' => $data['amount'],
                'phone' => $data['phone'],
                'email' => $data['email'],
                'fullName' => $data['fullName'],
                'reference' => $data['reference'],
                'callback_url' => $data['callback_url'],
                'return_url' => $data['return_url'],
                'shop_name' => env('DIB-Business', 'MyApp')
            ]);

            if (!$response->successful()) {
                Log::error('Erreur communication Lygos: ' . $response->body());
                throw new \Exception('Erreur lors de la communication avec Lygos.');
            }

            $json = $response->json();
            Log::debug('Réponse Lygos', $json);

            // Vérifie la présence du lien
            if (!isset($json['link']) || empty($json['link'])) {
                Log::error('Erreur initiation paiement', ['error' => $json['message'] ?? 'Pas de lien de paiement', 'dossier_id' => $data['reference'] ?? null]);
                throw new \Exception($json['message'] ?? 'Lien de paiement non fourni par Lygos');
            }

            // Construction réponse standardisée
            $final = [
                'success' => true,
                'payment_url' => $json['link'],
                'transaction_id' => $json['id'] ?? null,
            ];

            Log::info('Réponse de Lygos', $final);
            return $final;

        } catch (\Exception $e) {
            Log::error('Erreur Lygos Service: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Vérifie la signature du webhook
     */
    public function verifyWebhookSignature(Request $request)
    {
        // À implémenter selon la documentation Lygos
        return true;
    }

    /**
     * Vérifie le statut d'une transaction
     */
    public function checkTransactionStatus($transactionId)
    {
        try {
            $response = Http::withHeaders([
                'api-key' => $this->apiKey,
            ])->get($this->apiUrl . '/gateway/payin/' . $transactionId);

            if (!$response->successful()) {
                throw new \Exception('Erreur lors de la vérification du statut: ' . $response->body());
            }

            return $response->json();
        } catch (\Exception $e) {
            Log::error('Erreur vérification statut Lygos: ' . $e->getMessage());
            throw $e;
        }
    }
}
