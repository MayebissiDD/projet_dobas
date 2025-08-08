<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class MTNTindaService
{
    protected $baseUrl;
    protected $token;
    protected $defaultSender;

    public function __construct()
    {
        $this->baseUrl = config('mtn_tinda.base_url');
        $this->token = config('mtn_tinda.token');
        $this->defaultSender = config('mtn_tinda.default_sender');
    }

    /**
     * Envoyer un SMS non personnalisé
     *
     * @param string $message
     * @param string|array $receivers
     * @param string|null $sender
     * @param string|null $email
     * @param string|null $msgMail
     * @param string|null $objetMail
     * @param string|null $dateEnvois
     * @param int|null $externalId
     * @param string|null $callbackUrl
     * @return array
     */
    public function sendSMS(
        string $message,
        $receivers,
        ?string $sender = null,
        ?string $email = null,
        ?string $msgMail = null,
        ?string $objetMail = null,
        ?string $dateEnvois = null,
        ?int $externalId = null,
        ?string $callbackUrl = null
    ): array {
        // Formater les destinataires
        if (is_array($receivers)) {
            $receivers = implode(',', $receivers);
        }

        // Préparer les données
        $data = [
            'msg' => $message,
            'receivers' => $receivers,
            'sender' => $sender ?? $this->defaultSender,
        ];

        // Ajouter les champs optionnels
        if ($email) {
            $data['email'] = $email;
        }
        if ($msgMail) {
            $data['msg_mail'] = $msgMail;
        }
        if ($objetMail) {
            $data['objet_mail'] = $objetMail;
        }
        if ($dateEnvois) {
            $data['date_envois'] = $dateEnvois;
        }
        if ($externalId) {
            $data['externalId'] = $externalId;
        }
        if ($callbackUrl) {
            $data['callback_url'] = $callbackUrl;
        }

        return $this->sendRequest($data);
    }

    /**
     * Envoyer un SMS personnalisé
     *
     * @param string $message
     * @param string $params
     * @param string|null $sender
     * @param int|null $isEmail
     * @param string|null $msgMail
     * @param string|null $objetMail
     * @param string|null $dateEnvois
     * @param int|null $externalId
     * @param string|null $callbackUrl
     * @return array
     */
    public function sendCustomSMS(
        string $message,
        string $params,
        ?string $sender = null,
        ?int $isEmail = null,
        ?string $msgMail = null,
        ?string $objetMail = null,
        ?string $dateEnvois = null,
        ?int $externalId = null,
        ?string $callbackUrl = null
    ): array {
        // Préparer les données
        $data = [
            'msg' => $message,
            'params' => $params,
            'sender' => $sender ?? $this->defaultSender,
        ];

        // Ajouter les champs optionnels
        if ($isEmail !== null) {
            $data['isemail'] = $isEmail;
        }
        if ($msgMail) {
            $data['msg_mail'] = $msgMail;
        }
        if ($objetMail) {
            $data['objet_mail'] = $objetMail;
        }
        if ($dateEnvois) {
            $data['date_envois'] = $dateEnvois;
        }
        if ($externalId) {
            $data['externalId'] = $externalId;
        }
        if ($callbackUrl) {
            $data['callback_url'] = $callbackUrl;
        }

        return $this->sendRequest($data);
    }

    /**
     * Vérifier le statut d'un SMS
     *
     * @param int $id
     * @return array
     */
    public function checkSMSStatus(int $id): array
    {
        $data = [
            'op' => 'status',
            'id' => $id,
        ];

        return $this->sendRequest($data);
    }

    /**
     * Envoyer la requête à l'API MTN Tinda
     *
     * @param array $data
     * @return array
     */
    protected function sendRequest(array $data): array
{
    try {
        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'Authorization' => 'Token ' . $this->token,
        ])->withoutVerifying() // Désactive la vérification SSL
        ->post($this->baseUrl, $data);
        
        if ($response->successful()) {
            return $response->json();
        }
        
        // En cas d'erreur, journaliser et retourner les détails
        Log::error('MTN Tinda API Error', [
            'status' => $response->status(),
            'response' => $response->body(),
            'data' => $data,
        ]);
        
        return [
            'status' => $response->status(),
            'error' => 'API request failed',
            'response' => $response->json(),
        ];
    } catch (\Exception $e) {
        Log::error('MTN Tinda API Exception', [
            'exception' => $e->getMessage(),
            'data' => $data,
        ]);
        
        return [
            'status' => 500,
            'error' => $e->getMessage(),
        ];
    }
}
}