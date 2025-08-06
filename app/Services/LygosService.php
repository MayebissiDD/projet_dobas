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
        // Correction : éviter le double slash dans l'URL
        $endpoint = rtrim($this->apiUrl, '/') . '/gateway';
        
        $requestData = [
            'amount' => $data['amount'],
            'phone' => $data['phone'],
            'email' => $data['email'],
            'fullName' => $data['fullName'],
            'reference' => $data['reference'],
            'callback_url' => $data['callback_url'],
            'success_url' => $data['success_url'] ?? route('paiement.lygos.return'),
            'failure_url' => $data['failure_url'] ?? route('paiement.lygos.cancel'),
            'shop_name' => env('DIB-Business', 'MyApp')
        ];
        
        Log::info('Envoi de la requête à Lygos', [
            'endpoint' => $endpoint,
            'api_key_present' => !empty($this->apiKey)
        ]);
        
        $response = Http::withHeaders([
            'api-key' => $this->apiKey,
            'Content-Type' => 'application/json',
        ])->post($endpoint, $requestData);
        
        Log::info('Réponse reçue de Lygos', [
            'status' => $response->status(),
            'successful' => $response->successful(),
            'body' => $response->body()
        ]);
        
        if (!$response->successful()) {
            Log::error('Erreur communication Lygos', [
                'status' => $response->status(),
                'response' => $response->body(),
                'dossier_id' => $data['reference'] ?? null,
                'request_data' => $requestData
            ]);
            throw new \Exception('Erreur lors de la communication avec Lygos: ' . $response->body());
        }
        
        $json = $response->json();
        
        // Vérifie la présence du lien
        if (!isset($json['link']) || empty($json['link'])) {
            Log::error('Erreur initiation paiement - Lien manquant', [
                'response' => $json,
                'dossier_id' => $data['reference'] ?? null,
                'error_message' => $json['message'] ?? 'Pas de lien de paiement'
            ]);
            throw new \Exception($json['message'] ?? 'Lien de paiement non fourni par Lygos');
        }
        
        // Construction réponse standardisée
        $final = [
            'success' => true,
            'payment_url' => $json['link'],
            'transaction_id' => $json['id'] ?? null,
            'order_id' => $json['order_id'] ?? null,
            'full_response' => $json // Pour débogage
        ];
        
        return $final;
    } catch (\Exception $e) {
        Log::error('Exception dans LygosService', [
            'message' => $e->getMessage(),
            'trace' => $e->getTraceAsString(),
            'dossier_id' => $data['reference'] ?? null
        ]);
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
                Log::error('Erreur vérification statut Lygos', [
                    'status' => $response->status(),
                    'response' => $response->body(),
                    'transaction_id' => $transactionId
                ]);
                throw new \Exception('Erreur lors de la vérification du statut: ' . $response->body());
            }
            
            $result = $response->json();
            
            return $result;
        } catch (\Exception $e) {
            Log::error('Exception vérification statut Lygos', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'transaction_id' => $transactionId
            ]);
            throw $e;
        }
    }
    
    /**
     * Masque les données sensibles pour les logs
     */
    private function maskSensitiveData($data)
    {
        if (empty($data)) return $data;
        
        // Masquer le numéro de téléphone (garder les 2 premiers et 2 derniers caractères)
        if (strlen($data) > 4) {
            return substr($data, 0, 2) . str_repeat('*', strlen($data) - 4) . substr($data, -2);
        }
        
        return str_repeat('*', strlen($data));
    }
    
    /**
     * Masque l'email pour les logs
     */
    private function maskEmail($email)
    {
        if (empty($email) || !strpos($email, '@')) return $email;
        
        list($name, $domain) = explode('@', $email);
        $name = substr($name, 0, 2) . str_repeat('*', strlen($name) - 2);
        
        return $name . '@' . $domain;
    }
}