<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Paiement;
use App\Models\Dossier;
use App\Models\Etudiant;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Notifications\PaiementRecuNotification;

class PaiementController extends Controller
{
    public function index()
    {
        $etudiant = Auth::guard('etudiant')->user();
        $paiements = Paiement::where('etudiant_id', $etudiant->id)->latest()->paginate(10);
        return Inertia::render('Student/Paiements', [
            'paiements' => $paiements
        ]);
    }

    public function webview(Request $request)
    {
        $dossierId = $request->query('dossier');
        $montant = 10000; // À adapter selon la bourse ou le dossier
        return Inertia::render('Student/PaiementWebview', [
            'montant' => $montant,
            'dossierId' => $dossierId,
        ]);
    }

    public function lygosCallback(Request $request)
    {
        $amount = $request->input('amount');
        $orderId = $request->input('order_id');
        $shopName = config('app.name');
        $successUrl = route('etudiant.paiement.webview');
        $failureUrl = route('etudiant.paiement.webview');

        $response = Http::withHeaders([
            'api-key' => config('services.lygos.api_key'),
            'Content-Type' => 'application/json',
        ])->post('https://api.lygosapp.com/v1/gateway', [
            'amount' => $amount,
            'shop_name' => $shopName,
            'order_id' => $orderId,
            'message' => 'Paiement bourse',
            'success_url' => $successUrl,
            'failure_url' => $failureUrl,
        ]);

        if ($response->successful()) {
            $data = $response->json();
            // Log activité
            \App\Services\ActivityLogger::log('paiement_initie', null, $orderId, 'Paiement Lygos initié.');
            // Notifier l'étudiant
            $etudiant = Auth::guard('etudiant')->user();
            if ($etudiant) {
                $etudiant->notify(new PaiementRecuNotification());
            }
            return redirect($data['link']);
        } else {
            \App\Services\ActivityLogger::log('paiement_erreur', null, $orderId, 'Erreur lors de la création du paiement Lygos.');
            return back()->withErrors(['lygos' => 'Erreur lors de la création du paiement Lygos.']);
        }
    }

    public function stripeCallback(Request $request)
    {
        // À adapter selon l'intégration Stripe
        \App\Services\ActivityLogger::log('paiement_stripe_callback', null, null, 'Callback Stripe reçu.');
        return redirect()->route('etudiant.paiements.index');
    }

    /**
     * Vérifie le statut d'un paiement Lygos par order_id
     */
    public function lygosStatus(Request $request)
    {
        $orderId = $request->input('order_id');
        $response = Http::withHeaders([
            'api-key' => config('services.lygos.api_key'),
        ])->get(config('services.lygos.api_url') . 'gateway/payin/' . $orderId);

        if ($response->successful()) {
            // Log activité
            \App\Services\ActivityLogger::log('paiement_status', null, $orderId, 'Statut paiement Lygos consulté.');
            return response()->json($response->json());
        } else {
            \App\Services\ActivityLogger::log('paiement_status_erreur', null, $orderId, 'Erreur lors de la récupération du statut Lygos.');
            return response()->json(['error' => 'Impossible de récupérer le statut du paiement Lygos.'], 400);
        }
    }
}
