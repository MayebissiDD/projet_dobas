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

            // ✅ Vérifie bien que $response est un tableau valide
            if (is_array($response) && !empty($response['success']) && !empty($response['payment_url'])) {
                DB::commit();

                return response()->json([
                    'success' => true,
                    'link' => $response['payment_url']
                ]);
            }

            // ❌ En cas d'erreur inattendue
            throw new \Exception('Réponse inattendue du service de paiement.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Erreur initiation paiement', [
                'error' => $e->getMessage(),
                'dossier_id' => $request->dossier_id
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
        \Log::info('Callback Lygos reçu', $request->all());

        // Tu peux traiter ici la confirmation de transaction
        // Exemple :
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
            $response = $this->lygosService->createPayment([
                'amount' => $paiement->montant,
                'phone' => $request->telephone,
                'email' => $request->email,
                'fullName' => $request->fullName,
                'reference' => $paiement->reference,
                'callback_url' => route('paiement.lygos.callback'),
                'return_url' => route('candidature.payment.success')
            ]);

            Log::info('Réponse de Lygos', $response);


            if (!empty($response['success']) && $response['success']) {
                $paiement->update([
                    'transaction_id' => $response['transaction_id'] ?? null,
                    'statut' => 'en_cours'
                ]);

                return [
                    'success' => true,
                    'payment_url' => $response['payment_url']
                ];
            }

            throw new \Exception($response['message'] ?? 'Erreur Lygos');
        } catch (\Exception $e) {
            $paiement->update(['statut' => 'echec']);
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
                    'payment_url' => $response['checkout_url']
                ];
            }

            throw new \Exception($response['message'] ?? 'Erreur Stripe');
        } catch (\Exception $e) {
            $paiement->update(['statut' => 'echec']);
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

        return redirect()->route('candidature.index')->with('error', 'Paiement non confirmé');
    }

    public function stripeCancel(Request $request)
    {
        return redirect()->route('candidature.index')->with('error', 'Paiement annulé');
    }

    public function lygosReturn(Request $request)
    {
        $transactionId = $request->query('transaction_id');

        // Vérifier le statut du paiement avec Lygos
        $status = $this->lygosService->checkTransactionStatus($transactionId);

        if ($status && $status['status'] === 'success') {
            // Mettre à jour le statut du paiement et du dossier
            $paiement = Paiement::where('transaction_id', $transactionId)->first();
            if ($paiement) {
                $this->markPaymentAsSuccessful($paiement);
            }

            return redirect()->route('candidature.confirmation', ['success' => 1]);
        }

        return redirect()->route('candidature.index')->with('error', 'Paiement non confirmé');
    }

    public function lygosCancel(Request $request)
    {
        return redirect()->route('candidature.index')->with('error', 'Paiement annulé');
    }

    /**
     * Webhook Lygos
     */
    public function handleLygosCallback(Request $request)
    {
        try {
            if (!$this->lygosService->verifyWebhookSignature($request)) {
                return response()->json(['error' => 'Invalid signature'], 401);
            }

            $paiement = Paiement::where('transaction_id', $request->input('transaction_id'))->first();

            if (!$paiement) {
                Log::warning('Paiement introuvable pour Lygos callback', [
                    'transaction_id' => $request->input('transaction_id')
                ]);
                return response()->json(['error' => 'Paiement not found'], 404);
            }

            if ($request->input('status') === 'success') {
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
            Log::error('Erreur callback Lygos', [
                'error' => $e->getMessage(),
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
                return response()->json(['error' => 'Invalid signature'], 401);
            }

            if ($request->input('type') === 'payment_intent.succeeded') {
                $paiement = Paiement::where('transaction_id', $request->input('data.object.id'))->first();

                if ($paiement) {
                    $this->markPaymentAsSuccessful($paiement);
                }
            }

            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            Log::error('Erreur callback Stripe', [
                'error' => $e->getMessage(),
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
            $postulerController = new \App\Http\Controllers\Public\PostulerController();
            $postulerController->handlePaymentSuccess(new Request([
                'dossier_id' => $paiement->dossier_id,
                'paiement_id' => $paiement->id
            ]));

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Erreur finalisation paiement', [
                'paiement_id' => $paiement->id,
                'error' => $e->getMessage()
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
}
