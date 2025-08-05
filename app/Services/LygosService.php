<?php

namespace App\Services;

use Illuminate\Http\Request; // Ajout de cet import
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
                throw new \Exception('Erreur lors de la communication avec Lygos: ' . $response->body());
            }

            $json = $response->json();
            Log::debug('Réponse Lygos', $json);

            if (!isset($json['success']) || !$json['success']) {
                throw new \Exception($json['message'] ?? 'Erreur Lygos');
            }

            return [
                'success' => true,
                'payment_url' => $json['data']['payment_url'] ?? null,
                'transaction_id' => $json['data']['transaction_id'] ?? null,
            ];
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
        // Implémentez la vérification de signature selon la documentation de Lygos
        // Pour l'instante, nous retournons true
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
