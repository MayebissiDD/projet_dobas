<?php

namespace App\Http\Controllers;

use App\Models\Dossier;
use App\Models\Paiement;
use App\Services\LygosService;
use App\Services\StripeService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class WebhookController extends Controller
{
    protected $lygosService;
    protected $stripeService;
    
    public function __construct(LygosService $lygosService, StripeService $stripeService)
    {
        $this->lygosService = $lygosService;
        $this->stripeService = $stripeService;
    }
    
    /**
     * Webhook pour Lygos
     */
    public function lygos(Request $request)
    {
        try {
            // Vérifier la signature
            if (!$this->lygosService->verifyWebhookSignature($request)) {
                Log::warning('Signature webhook Lygos invalide');
                return response()->json(['error' => 'Invalid signature'], 401);
            }
            
            $payload = $request->all();
            Log::info('Webhook Lygos reçu', $payload);
            
            // Traiter le webhook
            return $this->processLygosWebhook($payload);
            
        } catch (\Exception $e) {
            Log::error('Erreur webhook Lygos', [
                'error' => $e->getMessage(),
                'payload' => $request->all()
            ]);
            return response()->json(['error' => 'Internal server error'], 500);
        }
    }
    
    /**
     * Webhook pour Stripe
     */
    public function stripe(Request $request)
    {
        try {
            // Vérifier la signature
            if (!$this->stripeService->verifyWebhookSignature($request)) {
                Log::warning('Signature webhook Stripe invalide');
                return response()->json(['error' => 'Invalid signature'], 401);
            }
            
            $payload = json_decode($request->getContent(), true);
            $event = $payload['type'] ?? null;
            
            Log::info('Webhook Stripe reçu', ['event' => $event]);
            
            // Traiter le webhook
            return $this->processStripeWebhook($payload);
            
        } catch (\Exception $e) {
            Log::error('Erreur webhook Stripe', [
                'error' => $e->getMessage(),
                'payload' => $request->all()
            ]);
            return response()->json(['error' => 'Internal server error'], 500);
        }
    }
    
    /**
     * Traiter un webhook Lygos
     */
    private function processLygosWebhook($payload)
    {
        $transactionId = $payload['transaction_id'] ?? null;
        $orderId = $payload['order_id'] ?? null;
        
        if (!$transactionId || !$orderId) {
            Log::error('Données manquantes dans le webhook Lygos', $payload);
            return response()->json(['error' => 'Missing data'], 400);
        }
        
        // Trouver le dossier
        $dossier = Dossier::find($orderId);
        if (!$dossier) {
            Log::warning('Dossier non trouvé pour le webhook Lygos', ['order_id' => $orderId]);
            return response()->json(['error' => 'Dossier not found'], 404);
        }
        
        // Trouver ou créer le paiement
        $paiement = Paiement::firstOrCreate(
            ['dossier_id' => $dossier->id, 'reference' => $transactionId],
            [
                'montant' => 7500,
                'methode' => 'mobile_money',
                'statut' => 'en_attente'
            ]
        );
        
        // Traiter selon le statut
        if (isset($payload['status']) && $payload['status'] === 'success') {
            return $this->handleSuccessfulPayment($paiement, $payload, 'lygos');
        } else {
            return $this->handleFailedPayment($paiement, $payload, 'lygos');
        }
    }
    
    /**
     * Traiter un webhook Stripe
     */
    private function processStripeWebhook($payload)
    {
        $event = $payload['type'] ?? null;
        
        switch ($event) {
            case 'payment_intent.succeeded':
                $paymentIntent = $payload['data']['object'];
                return $this->handleStripeSuccess($paymentIntent);
                
            case 'payment_intent.payment_failed':
                $paymentIntent = $payload['data']['object'];
                return $this->handleStripeFailure($paymentIntent);
                
            default:
                Log::info('Événement Stripe non traité', ['event' => $event]);
                return response()->json(['success' => true, 'message' => 'Event not handled']);
        }
    }
    
    /**
     * Gérer un paiement réussi
     */
    private function handleSuccessfulPayment($paiement, $payload, $provider)
    {
        DB::beginTransaction();
        try {
            // Mettre à jour le paiement
            $paiement->update([
                'statut' => 'reussi',
                'date_paiement' => now(),
                'transaction_id' => $payload['transaction_id'] ?? $payload['id'] ?? null,
                'details' => array_merge($paiement->details ?? [], [
                    'provider' => $provider,
                    'webhook_data' => $payload
                ])
            ]);
            
            // Mettre à jour le dossier
            $dossier = $paiement->dossier;
            if ($dossier) {
                $dossier->update([
                    'statut_paiement' => 'paye'
                ]);
                
                // Finaliser la candidature si nécessaire
                if ($dossier->statut === 'en_attente') {
                    $this->finalizeCandidature($dossier);
                }
            }
            
            DB::commit();
            
            // Envoyer les notifications
            if ($dossier && $dossier->etudiant) {
                $dossier->etudiant->notify(new \App\Notifications\PaiementRecuNotification($paiement));
            }
            
            Log::info('Paiement traité avec succès', [
                'paiement_id' => $paiement->id,
                'provider' => $provider
            ]);
            
            return response()->json(['success' => true]);
            
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Erreur traitement paiement réussi', [
                'paiement_id' => $paiement->id,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }
    
    /**
     * Gérer un paiement échoué
     */
    private function handleFailedPayment($paiement, $payload, $provider)
    {
        $paiement->update([
            'statut' => 'echoue',
            'details' => array_merge($paiement->details ?? [], [
                'provider' => $provider,
                'webhook_data' => $payload,
                'error_message' => $payload['message'] ?? 'Paiement échoué'
            ])
        ]);
        
        // Envoyer une notification d'échec
        if ($paiement->dossier && $paiement->dossier->etudiant) {
            $paiement->dossier->etudiant->notify(new \App\Notifications\PaiementEchoueNotification($paiement));
        }
        
        Log::info('Paiement échoué traité', [
            'paiement_id' => $paiement->id,
            'provider' => $provider
        ]);
        
        return response()->json(['success' => true]);
    }
    
    /**
     * Gérer un succès Stripe
     */
    private function handleStripeSuccess($paymentIntent)
    {
        $metadata = $paymentIntent['metadata'] ?? [];
        $dossierId = $metadata['dossier_id'] ?? null;
        
        if (!$dossierId) {
            Log::error('Dossier ID manquant dans le webhook Stripe', $paymentIntent);
            return response()->json(['error' => 'Dossier ID missing'], 400);
        }
        
        $dossier = Dossier::find($dossierId);
        if (!$dossier) {
            Log::warning('Dossier non trouvé pour le webhook Stripe', ['dossier_id' => $dossierId]);
            return response()->json(['error' => 'Dossier not found'], 404);
        }
        
        // Trouver ou créer le paiement
        $paiement = Paiement::firstOrCreate(
            ['dossier_id' => $dossier->id, 'transaction_id' => $paymentIntent['id']],
            [
                'montant' => $paymentIntent['amount'] / 100, // Convertir des centimes
                'methode' => 'carte',
                'statut' => 'en_attente'
            ]
        );
        
        return $this->handleSuccessfulPayment($paiement, $paymentIntent, 'stripe');
    }
    
    /**
     * Gérer un échec Stripe
     */
    private function handleStripeFailure($paymentIntent)
    {
        $metadata = $paymentIntent['metadata'] ?? [];
        $dossierId = $metadata['dossier_id'] ?? null;
        
        if (!$dossierId) {
            Log::error('Dossier ID manquant dans le webhook Stripe', $paymentIntent);
            return response()->json(['error' => 'Dossier ID missing'], 400);
        }
        
        $dossier = Dossier::find($dossierId);
        if (!$dossier) {
            Log::warning('Dossier non trouvé pour le webhook Stripe', ['dossier_id' => $dossierId]);
            return response()->json(['error' => 'Dossier not found'], 404);
        }
        
        // Trouver ou créer le paiement
        $paiement = Paiement::firstOrCreate(
            ['dossier_id' => $dossier->id, 'transaction_id' => $paymentIntent['id']],
            [
                'montant' => $paymentIntent['amount'] / 100,
                'methode' => 'carte',
                'statut' => 'en_attente'
            ]
        );
        
        return $this->handleFailedPayment($paiement, $paymentIntent, 'stripe');
    }
    
    /**
     * Finaliser la candidature après paiement
     */
    private function finalizeCandidature($dossier)
    {
        // Créer le compte étudiant si nécessaire
        if (!$dossier->etudiant_id) {
            $motDePasse = Str::random(10);
            $etudiant = \App\Models\Etudiant::create([
                'nom' => $dossier->nom,
                'email' => $dossier->email,
                'telephone' => $dossier->telephone,
                'password' => Hash::make($motDePasse),
                'date_naissance' => $dossier->date_naissance,
                'lieu_naissance' => $dossier->lieu_naissance,
                'sexe' => $dossier->sexe,
                'adresse' => $dossier->adresse,
                'niveau_etude' => $dossier->niveau_etude,
            ]);
            
            // Assigner le rôle étudiant
            $etudiant->assignRole('etudiant');
            
            // Mettre à jour le dossier
            $dossier->update([
                'etudiant_id' => $etudiant->id,
                'statut' => 'soumis',
                'date_soumission' => now()
            ]);
            
            // Envoyer l'email de bienvenue
            $etudiant->notify(new \App\Notifications\BienvenuePostulerController($motDePasse));
        } else {
            // Juste mettre à jour le statut
            $dossier->update([
                'statut' => 'soumis',
                'date_soumission' => now()
            ]);
        }
        
        // Notifier les agents
        $agents = \App\Models\User::role('agent')->get();
        Notification::send($agents, new \App\Notifications\NouvellePostulerController($dossier));
        
        Log::info('Candidature finalisée après paiement', ['dossier_id' => $dossier->id]);
    }
}