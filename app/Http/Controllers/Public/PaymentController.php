<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\LygosService;
use App\Models\Paiement;
use App\Notifications\CandidatureSoumiseNotification;
use App\Notifications\NouvelleCandidatureNotification;
use Illuminate\Support\Facades\Notification;

class PaymentController extends Controller
{
    protected $lygos;

    public function __construct(LygosService $lygos)
    {
        $this->lygos = $lygos;
    }

    /**
     * Traite le paiement Lygos depuis le formulaire public (Postuler).
     */
    public function pay(Request $request)
    {
        $request->validate([
            'fullName' => 'required|string|max:255',
            'email' => 'required|email',
            'telephone' => 'required|string|max:20',
            'type_bourse' => 'required|string',
            'montant' => 'required|numeric|min:1',
        ]);

        // Appel à l'API Lygos via le service
        $response = \Illuminate\Support\Facades\Http::withHeaders([
            'api-key' => $this->lygos->getApiKey(),
            'Content-Type' => 'application/json',
        ])->post($this->lygos->getApiUrl() . 'gateway', [
            'message' => '',
            'success_url' => url('/paiement/success'),  // URL callback succès paiement
            'failure_url' => url('/paiement/failure'),  // URL callback échec paiement
            'amount' => $request->montant,
            'shop_name' => env('APP_NAME', 'DOBAS'),
        ]);

        if ($response->successful() && isset($response['link'])) {
            return response()->json([
                'success' => true,
                'link' => $response['link'],
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Erreur lors de la création du paiement Lygos',
        ], 500);
    }

    /**
     * Callback appelé après paiement réussi.
     * Met à jour le paiement et valide la candidature associée.
     */
    public function success(Request $request)
    {
        $reference = $request->query('reference');

        if (!$reference) {
            return redirect('/postuler?error=missing_reference');
        }

        $paiement = Paiement::where('reference', $reference)->first();

        if (!$paiement) {
            return redirect('/postuler?error=paiement_non_trouve');
        }

        // Mise à jour du paiement
        $paiement->update([
            'statut' => 'payé',
            'transaction_id' => $request->query('transaction_id') ?? null,
            'details' => json_encode($request->all()),
            'paid_at' => now(),
        ]);

        // Mise à jour de la candidature liée
        $candidature = $paiement->candidature;
        if ($candidature) {
            $candidature->update(['statut' => 'validée']);

            // Notifier le candidat
            if ($candidature->user) {
                $candidature->user->notify(new CandidatureSoumiseNotification($candidature));
            }

            // Notifier les admins ou agents (adapter selon ta logique)
            // $adminsOrAgents = User::role(['admin', 'agent'])->get();
            // Notification::send($adminsOrAgents, new NouvelleCandidatureNotification($candidature));
        }

        return redirect('/postuler?success=1')->with('message', 'Paiement réussi et candidature validée !');
    }

    /**
     * Page callback en cas d'échec paiement.
     */
    public function failure()
    {
        return redirect('/postuler?error=payment_failed')->with('error', 'Le paiement a échoué. Veuillez réessayer.');
    }
}
