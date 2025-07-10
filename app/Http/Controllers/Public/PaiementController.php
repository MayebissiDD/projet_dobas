<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\LygosService;
use App\Models\Paiement;
use App\Notifications\CandidatureSoumiseNotification;
use App\Notifications\NouvelleCandidatureNotification;
use Illuminate\Support\Facades\Notification;

class PaiementController extends Controller
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
            'mode' => 'required|string',
        ]);

        // Appel à l'API Lygos ou Stripe selon le mode
        if ($request->mode === 'mobile_money') {
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
        } else if ($request->mode === 'stripe') {
            // TODO: Intégration Stripe (à compléter selon vos clés Stripe)
            return response()->json([
                'success' => false,
                'message' => 'Paiement Stripe non encore disponible.',
            ], 501);
        }

        return response()->json([
            'success' => false,
            'message' => 'Erreur lors de la création du paiement.',
        ], 500);
    }

    /**
     * Callback appelé après paiement réussi.
     * Met à jour le paiement et valide la dossier associée.
     */
    public function success(Request $request)
    {
        $reference = $request->query('reference');
        if (!$reference) {
            return redirect('/postuler?error=missing_reference');
        }
        $paiement = \App\Models\Paiement::where('reference', $reference)->first();
        if (!$paiement) {
            return redirect('/postuler?error=paiement_non_trouve');
        }
        // Mise à jour du paiement
        $paiement->update([
            'statut' => 'payé',
        ]);
        // Validation du dossier associé
        $dossier = \App\Models\Dossier::find($paiement->dossier_id);
        if ($dossier) {
            $dossier->statut = 'soumis';
            $dossier->save();
            // Notifier l'étudiant
            $user = \App\Models\User::where('email', $dossier->email)->first();
            if ($user) {
                $user->notify(new \App\Notifications\CandidatureSoumiseNotification($dossier));
            }
        }
        // Notifier admins/agents
        $admins = \App\Models\User::role('admin')->get();
        foreach ($admins as $admin) {
            $admin->notify(new \App\Notifications\PaiementRecuNotification());
        }
        $agents = \App\Models\User::role('agent')->get();
        foreach ($agents as $agent) {
            $agent->notify(new \App\Notifications\PaiementRecuNotification());
        }
        return redirect('/postuler?success=1');
    }

    /**
     * Page callback en cas d'échec paiement.
     */
    public function failure()
    {
        return redirect('/postuler?error=payment_failed')->with('error', 'Le paiement a échoué. Veuillez réessayer.');
    }
}
