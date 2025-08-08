<?php
namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Dossier;
use App\Models\Paiement;
use App\Services\LygosService;
use App\Services\StripeService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class PaiementController extends Controller
{
    protected $lygosService;
    protected $stripeService;
    
    public function __construct(LygosService $lygosService, StripeService $stripeService)
    {
        $this->lygosService = $lygosService;
        $this->stripeService = $stripeService;
    }
    
    /**
     * Initier un paiement en ligne
     */
    public function initiate(Request $request)
    {
        $request->validate([
            'dossier_id' => 'required|exists:dossiers,id',
            'montant' => 'required|numeric|min:1',
            'mode' => 'required|in:mobile_money,carte',
            'fullName' => 'required|string',
            'email' => 'required|email',
            'telephone' => 'required|string'
        ]);
        
        try {
            DB::beginTransaction();
            
            $dossier = Dossier::findOrFail($request->dossier_id);
            
            // Créer un paiement
            $paiement = Paiement::create([
                'dossier_id' => $dossier->id,
                'montant' => $request->montant,
                'methode' => $request->mode,
                'statut' => 'en_attente',
                'reference' => 'TXN-' . time() . '-' . $dossier->id,
                'details' => [
                    'email' => $request->email,
                    'telephone' => $request->telephone,
                    'nom_payeur' => $request->fullName
                ]
            ]);
            
            // Traitement selon le mode de paiement
            $response = $request->mode === 'mobile_money'
                ? $this->initiateMobileMoney($paiement, $request)
                : $this->initiateCardPayment($paiement, $request);
            
            // Vérifie bien que $response est un tableau valide
            if (is_array($response) && !empty($response['success']) && !empty($response['payment_url'])) {
                DB::commit();
                
                // Correction : s'assurer que le transaction_id est bien récupéré
                $transactionId = $response['transaction_id'] ?? null;
                
                return response()->json([
                    'success' => true,
                    'link' => $response['payment_url'],
                    'transaction_id' => $transactionId
                ]);
            }
            
            // En cas d'erreur inattendue
            Log::error('Réponse inattendue du service de paiement', [
                'mode' => $request->mode,
                'response' => $response,
                'paiement_id' => $paiement->id
            ]);
            
            throw new \Exception('Réponse inattendue du service de paiement.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Erreur initiation paiement', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'dossier_id' => $request->dossier_id,
                'mode' => $request->mode ?? 'inconnu'
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'initiation du paiement'
            ], 500);
        }
    }
    
    /**
     * Callback Lygos
     */
    public function lygosCallback(Request $request)
    {
        $transactionId = $request->input('transaction_id');
        $status = $request->input('status');
        
        // TODO : mettre à jour la transaction en BDD (ex: marquer comme payé)
        return response()->json(['success' => true]);
    }
    
    /**
     * Initier paiement Mobile Money via Lygos
     */
    private function initiateMobileMoney($paiement, $request)
    {
        try {
            // Générer un token unique pour cette transaction
            $token = hash('sha256', $paiement->id . time() . random_bytes(16));
            
            // Sauvegarder ce token dans la base de données pour pouvoir le vérifier plus tard
            $paiement->update([
                'token_verification' => $token
            ]);
            
            // Créer les URLs de retour avec les paramètres personnalisés
            $successUrl = route('paiement.lygos.return') . '?token=' . $token . '&status=success&paiement_id=' . $paiement->id;
            $failureUrl = route('paiement.lygos.cancel') . '?token=' . $token . '&status=failed&paiement_id=' . $paiement->id;
            
            $paymentData = [
                'amount' => $paiement->montant,
                'phone' => $request->telephone,
                'email' => $request->email,
                'fullName' => $request->fullName,
                'reference' => $paiement->reference,
                'callback_url' => route('paiement.lygos.callback'),
                'success_url' => $successUrl,     // URL de succès avec paramètres
                'failure_url' => $failureUrl,     // URL d'échec avec paramètres
                'shop_name' => env('DIB-Business', 'MyApp')
            ];
            
            $response = $this->lygosService->createPayment($paymentData);
            
            if (!empty($response['success']) && $response['success']) {
                // Correction : s'assurer que le transaction_id est bien enregistré
                $transactionId = $response['order_id'] ?? null;
                
                $paiement->update([
                    'transaction_id' => $transactionId,
                    'statut' => 'en_cours'
                ]);
                
                // Correction : retourner également le transaction_id
                return [
                    'success' => true,
                    'payment_url' => $response['payment_url'],
                    'transaction_id' => $transactionId
                ];
            }
            
            Log::error('Échec initiation paiement Mobile Money', [
                'paiement_id' => $paiement->id,
                'response' => $response
            ]);
            
            throw new \Exception($response['message'] ?? 'Erreur Lygos');
        } catch (\Exception $e) {
            $paiement->update(['statut' => 'echec']);
            
            Log::error('Exception initiation paiement Mobile Money', [
                'paiement_id' => $paiement->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            throw $e;
        }
    }
    
    /**
     * Initier paiement par carte via Stripe
     */
    private function initiateCardPayment($paiement, $request)
    {
        try {
            $response = $this->stripeService->createCheckoutSession([
                'amount' => $paiement->montant * 100, // en centimes
                'currency' => 'xaf',
                'receipt_email' => $request->email,
                'success_url' => route('paiement.stripe.return') . '?session_id={CHECKOUT_SESSION_ID}',
                'cancel_url' => route('paiement.stripe.cancel'),
                'metadata' => [
                    'dossier_id' => $paiement->dossier_id,
                    'paiement_id' => $paiement->id,
                    'reference' => $paiement->reference
                ]
            ]);
            
            if (!empty($response['success']) && $response['success']) {
                $paiement->update([
                    'transaction_id' => $response['session_id'],
                    'statut' => 'en_cours'
                ]);
                
                return [
                    'success' => true,
                    'payment_url' => $response['checkout_url'],
                    'transaction_id' => $response['session_id']
                ];
            }
            
            Log::error('Échec initiation paiement par carte', [
                'paiement_id' => $paiement->id,
                'response' => $response
            ]);
            
            throw new \Exception($response['message'] ?? 'Erreur Stripe');
        } catch (\Exception $e) {
            $paiement->update(['statut' => 'echec']);
            
            Log::error('Exception initiation paiement par carte', [
                'paiement_id' => $paiement->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            throw $e;
        }
    }
    
    // Ajouter les méthodes de retour pour les paiements
    public function stripeReturn(Request $request)
    {
        $sessionId = $request->query('session_id');
        
        // Vérifier le statut du paiement avec Stripe
        $session = $this->stripeService->getCheckoutSession($sessionId);
        
        if ($session && $session->payment_status === 'paid') {
            // Mettre à jour le statut du paiement et du dossier
            $this->markPaymentAsSuccessful($session->metadata->paiement_id);
            
            return redirect()->route('candidature.confirmation', ['success' => 1]);
        }
        
        Log::warning('Paiement Stripe non confirmé', [
            'session_id' => $sessionId,
            'payment_status' => $session->payment_status ?? 'inconnu'
        ]);
        
        return redirect()->route('candidature.index')->with('error', 'Paiement non confirmé');
    }
    
    public function stripeCancel(Request $request)
    {
        return redirect()->route('candidature.index')->with('error', 'Paiement annulé');
    }
    
    public function lygosReturn(Request $request)
    {
        // Récupérer tous les paramètres de l'URL pour le débogage
        $allParams = $request->query();
        
        Log::info('Début du traitement du retour Lygos (succès)', [
            'all_params' => $allParams,
            'url' => $request->fullUrl()
        ]);
        
        // Récupérer les paramètres personnalisés
        $token = $request->query('token');
        $status = $request->query('status');
        $paiementId = $request->query('paiement_id');
        
        // Vérifier que nous avons tous les paramètres nécessaires
        if (!$token || !$status || !$paiementId) {
            Log::error('Paramètres manquants dans le retour Lygos', [
                'token' => $token,
                'status' => $status,
                'paiement_id' => $paiementId
            ]);
            
            return redirect()->route('candidature.index', ['error' => 'Paramètres de vérification manquants']);
        }
        
        // Vérifier que le paiement existe et que le token est valide
        $paiement = Paiement::find($paiementId);
        
        if (!$paiement || $paiement->token_verification !== $token) {
            Log::error('Token de vérification invalide ou paiement non trouvé', [
                'paiement_id' => $paiementId,
                'token_found' => $token,
                'token_expected' => $paiement ? $paiement->token_verification : 'N/A'
            ]);
            
            return redirect()->route('candidature.index', ['error' => 'Information de paiement invalide']);
        }
        
        Log::info('Token de vérification valide, traitement du paiement', [
            'paiement_id' => $paiementId,
            'status' => $status
        ]);
        
        // Si le statut est "success", on vérifie le statut réel auprès de Lygos
        if ($status === 'success') {
            try {
                $transactionId = $paiement->transaction_id;
                
                Log::info('transaction ', ['transaction_id' => $transactionId]);
                if ($transactionId) {
                    Log::info('Vérification du statut de la transaction auprès de Lygos', ['transaction_id' => $transactionId]);
                    
                    $lygosStatus = $this->lygosService->checkTransactionStatus($transactionId);
                    
                    Log::info('Statut de la transaction reçu de Lygos', [
                        'transaction_id' => $transactionId,
                        'status_response' => $lygosStatus
                    ]);
                    
                    if ($lygosStatus && isset($lygosStatus['status']) && $lygosStatus['status'] === 'success') {
                        Log::info('Paiement confirmé comme réussi', ['transaction_id' => $transactionId]);
                        
                        $this->markPaymentAsSuccessful($paiement);
                        
                        Log::info('Redirection vers la page de confirmation', ['success' => 1]);
                        return redirect()->route('candidature.confirmation', ['success' => 1]);
                    }
                }
                
                // Si on ne peut pas vérifier auprès de Lygos, on fait confiance à notre paramètre
                Log::warning('Impossible de vérifier le statut auprès de Lygos, utilisation du paramètre local', [
                    'paiement_id' => $paiementId
                ]);
                
                $this->markPaymentAsSuccessful($paiement);
                
                return redirect()->route('candidature.confirmation', ['success' => 1]);
                
            } catch (\Exception $e) {
                Log::error('Erreur lors de la vérification du statut Lygos', [
                    'paiement_id' => $paiementId,
                    'error' => $e->getMessage()
                ]);
                
                // En cas d'erreur, on fait confiance à notre paramètre
                $this->markPaymentAsSuccessful($paiement);
                
                return redirect()->route('candidature.confirmation', ['success' => 1,'payment_status' => 'success']);
            }
        }
        
        // Si le statut est "failed", on marque le paiement comme échoué
        Log::info('Paiement marqué comme échoué', ['paiement_id' => $paiementId]);
        
        $paiement->update([
            'statut' => 'echec',
            'details' => array_merge($paiement->details ?? [], [
                'message_erreur' => 'Paiement échoué',
                'date_echec' => now()
            ])
        ]);
        
        return redirect()->route('candidature.index', ['error' => 'Paiement échoué']);
    }

    public function lygosCancel(Request $request)
    {
        // Récupérer tous les paramètres de l'URL pour le débogage
        $allParams = $request->query();
        
        Log::info('Début du traitement du retour Lygos (annulation)', [
            'all_params' => $allParams,
            'url' => $request->fullUrl()
        ]);
        
        // Récupérer les paramètres personnalisés
        $token = $request->query('token');
        $status = $request->query('status');
        $paiementId = $request->query('paiement_id');
        
        // Vérifier que nous avons tous les paramètres nécessaires
        if (!$token || !$status || !$paiementId) {
            Log::error('Paramètres manquants dans le retour Lygos', [
                'token' => $token,
                'status' => $status,
                'paiement_id' => $paiementId
            ]);
            
            return redirect()->route('candidature.index', ['error' => 'Paramètres de vérification manquants']);
        }
        
        // Vérifier que le paiement existe et que le token est valide
        $paiement = Paiement::find($paiementId);
        
        if (!$paiement || $paiement->token_verification !== $token) {
            Log::error('Token de vérification invalide ou paiement non trouvé', [
                'paiement_id' => $paiementId,
                'token_found' => $token,
                'token_expected' => $paiement ? $paiement->token_verification : 'N/A'
            ]);
            
            return redirect()->route('candidature.index', ['error' => 'Information de paiement invalide']);
        }
        
        Log::info('Token de vérification valide, traitement du paiement', [
            'paiement_id' => $paiementId,
            'status' => $status
        ]);
        
        // Marquer le paiement comme annulé
        Log::info('Paiement marqué comme annulé', ['paiement_id' => $paiementId]);
        
        $paiement->update([
            'statut' => 'echec',
            'details' => array_merge($paiement->details ?? [], [
                'message_erreur' => 'Paiement annulé par l\'utilisateur',
                'date_annulation' => now()
            ])
        ]);
        
        return redirect()->route('candidature.index', ['error' => 'Paiement annulé']);
    }
        
    /**
     * Webhook Lygos
     */
    public function handleLygosCallback(Request $request)
    {
        try {
            if (!$this->lygosService->verifyWebhookSignature($request)) {
                Log::warning('Signature webhook Lygos invalide', [
                    'headers' => $request->headers->all(),
                    'payload' => $request->all()
                ]);
                
                return response()->json(['error' => 'Invalid signature'], 401);
            }
            
            $transactionId = $request->input('transaction_id');
            $status = $request->input('status');
            
            $paiement = Paiement::where('transaction_id', $transactionId)->first();
            
            if (!$paiement) {
                Log::warning('Paiement introuvable pour webhook Lygos', [
                    'transaction_id' => $transactionId
                ]);
                
                return response()->json(['error' => 'Paiement not found'], 404);
            }
            
            if ($status === 'success') {
                $this->markPaymentAsSuccessful($paiement);
            } else {
                $paiement->update([
                    'statut' => 'echec',
                    'details' => array_merge($paiement->details ?? [], [
                        'message_erreur' => $request->input('message', 'Paiement échoué')
                    ])
                ]);
            }
            
            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            Log::error('Erreur traitement webhook Lygos', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'request' => $request->all()
            ]);
            
            return response()->json(['error' => 'Internal error'], 500);
        }
    }
    
    /**
     * Webhook Stripe
     */
    public function handleStripeCallback(Request $request)
    {
        try {
            if (!$this->stripeService->verifyWebhookSignature($request)) {
                Log::warning('Signature webhook Stripe invalide', [
                    'headers' => $request->headers->all(),
                    'type' => $request->input('type')
                ]);
                
                return response()->json(['error' => 'Invalid signature'], 401);
            }
            
            if ($request->input('type') === 'payment_intent.succeeded') {
                $paymentIntentId = $request->input('data.object.id');
                
                $paiement = Paiement::where('transaction_id', $paymentIntentId)->first();
                
                if ($paiement) {
                    $this->markPaymentAsSuccessful($paiement);
                } else {
                    Log::warning('Paiement non trouvé pour webhook Stripe', [
                        'payment_intent_id' => $paymentIntentId
                    ]);
                }
            }
            
            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            Log::error('Erreur traitement webhook Stripe', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'request' => $request->all()
            ]);
            
            return response()->json(['error' => 'Internal error'], 500);
        }
    }
    
    /**
     * Marquer un paiement comme réussi
     */
    private function markPaymentAsSuccessful($paiement)
    {
        DB::beginTransaction();
        
        try {
            $paiement->update([
                'statut' => 'reussi',
                'date_paiement' => now()
            ]);
            
            // Mettre à jour le statut de paiement du dossier
            $dossier = $paiement->dossier;
            $dossier->update([
                'statut_paiement' => 'paye'
            ]);
            
            // Finaliser la candidature si nécessaire
            // Utiliser l'injection de dépendances au lieu d'instancier directement
            $postulerController = app(\App\Http\Controllers\Public\PostulerController::class);
            $postulerController->handlePaymentSuccess(new Request([
                'dossier_id' => $paiement->dossier_id,
                'paiement_id' => $paiement->id
            ]));
            
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            
            Log::error('Erreur finalisation paiement', [
                'paiement_id' => $paiement->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            throw $e;
        }
    }
    
    /**
     * Vérifier le statut d'un paiement
     */
    public function checkStatus($paiementId)
    {
        $paiement = Paiement::find($paiementId);
        
        if (!$paiement) {
            Log::warning('Paiement non trouvé pour vérification statut', [
                'paiement_id' => $paiementId
            ]);
            
            return response()->json(['error' => 'Paiement not found'], 404);
        }
        
        return response()->json([
            'status' => $paiement->statut,
            'message' => $paiement->details['message_erreur'] ?? null,
            'date_paiement' => $paiement->date_paiement
        ]);
    }
    
    /**
     * Page de succès
     */
    public function success(Request $request)
    {
        return redirect()->route('candidature.confirmation', ['success' => 1]);
    }
    
    /**
     * Page d'échec
     */
    public function failure(Request $request)
    {
        return redirect()->route('candidature.index')->with('error', 'Paiement échoué. Veuillez réessayer.');
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