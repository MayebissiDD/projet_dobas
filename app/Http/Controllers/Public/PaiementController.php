<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Dossier;
use App\Models\Transaction;
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

            // Créer une transaction
            $transaction = Transaction::create([
                'dossier_id' => $dossier->id,
                'montant' => $request->montant,
                'mode_paiement' => $request->mode,
                'statut' => 'en_attente',
                'reference' => 'TXN-' . time() . '-' . $dossier->id,
                'email' => $request->email,
                'telephone' => $request->telephone,
                'nom_payeur' => $request->fullName
            ]);

            // Traitement selon le mode de paiement
            $response = $request->mode === 'mobile_money'
                ? $this->initiateMobileMoney($transaction, $request)
                : $this->initiateCardPayment($transaction, $request);

            DB::commit();

            // ✅ Retour clair au frontend
            return response()->json([
                'success' => true,
                'link' => $response['payment_url']
            ]);

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
     * Initier paiement Mobile Money via Lygos
     */
    private function initiateMobileMoney($transaction, $request)
    {
        try {
            $response = $this->lygosService->createPayment([
                'amount' => $transaction->montant,
                'phone' => $request->telephone,
                'email' => $request->email,
                'fullName' => $request->fullName,
                'reference' => $transaction->reference,
                'callback_url' => route('paiement.lygos.callback'),
                'return_url' => route('candidature.payment.success')
            ]);

            if (!empty($response['success']) && $response['success']) {
                $transaction->update([
                    'transaction_externe_id' => $response['transaction_id'] ?? null,
                    'statut' => 'en_cours'
                ]);

                return [
                    'success' => true,
                    'payment_url' => $response['payment_url']
                ];
            }

            throw new \Exception($response['message'] ?? 'Erreur Lygos');

        } catch (\Exception $e) {
            $transaction->update(['statut' => 'echec']);
            throw $e;
        }
    }

    /**
     * Initier paiement par carte via Stripe
     */
    private function initiateCardPayment($transaction, $request)
    {
        try {
            $response = $this->stripeService->createPaymentIntent([
                'amount' => $transaction->montant * 100, // en centimes
                'currency' => 'xaf',
                'receipt_email' => $request->email,
                'metadata' => [
                    'dossier_id' => $transaction->dossier_id,
                    'transaction_id' => $transaction->id,
                    'reference' => $transaction->reference
                ]
            ]);

            if (!empty($response['success']) && $response['success']) {
                $transaction->update([
                    'transaction_externe_id' => $response['payment_intent_id'],
                    'statut' => 'en_cours'
                ]);

                return [
                    'success' => true,
                    'payment_url' => $response['checkout_url']
                ];
            }

            throw new \Exception($response['message'] ?? 'Erreur Stripe');

        } catch (\Exception $e) {
            $transaction->update(['statut' => 'echec']);
            throw $e;
        }
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

            $transaction = Transaction::where('transaction_externe_id', $request->input('transaction_id'))->first();

            if (!$transaction) {
                Log::warning('Transaction introuvable pour Lygos callback', [
                    'transaction_id' => $request->input('transaction_id')
                ]);
                return response()->json(['error' => 'Transaction not found'], 404);
            }

            if ($request->input('status') === 'success') {
                $this->markPaymentAsSuccessful($transaction);
            } else {
                $transaction->update([
                    'statut' => 'echec',
                    'message_erreur' => $request->input('message', 'Paiement échoué')
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
                $transaction = Transaction::where('transaction_externe_id', $request->input('data.object.id'))->first();
                if ($transaction) {
                    $this->markPaymentAsSuccessful($transaction);
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
    private function markPaymentAsSuccessful($transaction)
    {
        DB::beginTransaction();

        try {
            $transaction->update([
                'statut' => 'reussi',
                'date_paiement' => now()
            ]);

            $candidatureController = new CandidatureController();
            $candidatureController->handlePaymentSuccess(new Request([
                'dossier_id' => $transaction->dossier_id,
                'transaction_id' => $transaction->id
            ]));

            DB::commit();

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Erreur finalisation paiement', [
                'transaction_id' => $transaction->id,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    /**
     * Vérifier le statut d'un paiement
     */
    public function checkStatus($transactionId)
    {
        $transaction = Transaction::find($transactionId);

        if (!$transaction) {
            return response()->json(['error' => 'Transaction not found'], 404);
        }

        return response()->json([
            'status' => $transaction->statut,
            'message' => $transaction->message_erreur,
            'date_paiement' => $transaction->date_paiement
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
     * Page d’échec
     */
    public function failure(Request $request)
    {
        return redirect()->route('candidature.index')->with('error', 'Paiement échoué. Veuillez réessayer.');
    }
}
