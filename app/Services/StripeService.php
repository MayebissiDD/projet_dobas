<?php

namespace App\Services;

use Illuminate\Http\Request; // Ajout de cet import
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Stripe\Stripe as StripeStripe;

class StripeService
{
    protected $apiKey;

    public function __construct()
    {
        $this->apiKey = config('services.stripe.secret_key');
        StripeStripe::setApiKey($this->apiKey);
    }
    // Ajouter la méthode createCheckoutSession
    public function createCheckoutSession(array $data)
    {
        try {
            $session = \Stripe\Checkout\Session::create([
                'payment_method_types' => ['card'],
                'line_items' => [
                    [
                        'price_data' => [
                            'currency' => $data['currency'],
                            'product_data' => [
                                'name' => 'Frais de dossier DOBAS',
                            ],
                            'unit_amount' => $data['amount'],
                        ],
                        'quantity' => 1,
                    ],
                ],
                'mode' => 'payment',
                'success_url' => $data['success_url'],
                'cancel_url' => $data['cancel_url'],
                'metadata' => $data['metadata'],
                'customer_email' => $data['receipt_email'],
            ]);

            return [
                'success' => true,
                'session_id' => $session->id,
                'checkout_url' => $session->url,
            ];
        } catch (\Exception $e) {
            Log::error('Erreur Stripe Service: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }

    // Ajouter la méthode getCheckoutSession
    public function getCheckoutSession($sessionId)
    {
        try {
            return \Stripe\Checkout\Session::retrieve($sessionId);
        } catch (\Exception $e) {
            Log::error('Erreur récupération session Stripe: ' . $e->getMessage());
            return null;
        }
    }
    /**
     * Crée une intention de paiement via Stripe
     */
    public function createPaymentIntent(array $data)
    {
        try {
            $paymentIntent = StripeStripe\PaymentIntent::create([
                'amount' => $data['amount'],
                'currency' => $data['currency'],
                'receipt_email' => $data['receipt_email'],
                'metadata' => $data['metadata'],
            ]);

            return [
                'success' => true,
                'payment_intent_id' => $paymentIntent->id,
                'client_secret' => $paymentIntent->client_secret,
                'checkout_url' => null, // Sera ajouté plus tard si nécessaire
            ];
        } catch (\Exception $e) {
            Log::error('Erreur Stripe Service: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }

    /**
     * Vérifie la signature du webhook
     */
    public function verifyWebhookSignature(Request $request)
    {
        $signature = $request->header('Stripe-Signature');
        $payload = $request->getContent();
        $event = null;

        try {
            $event = StripeStripe\Webhook::constructEvent(
                $payload,
                $signature,
                config('services.stripe.webhook_secret')
            );
            return true;
        } catch (\UnexpectedValueException $e) {
            Log::error('Erreur signature webhook Stripe: ' . $e->getMessage());
            return false;
        }
    }
}
