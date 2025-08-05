<?php
namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Paiement;
use App\Models\Dossier;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Notifications\PaiementRecuNotification;

class PaiementController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:etudiant');
    }

    public function index()
    {
        $etudiant = Auth::guard('etudiant')->user();
        $paiements = Paiement::whereHas('dossier', function($query) use ($etudiant) {
            $query->where('etudiant_id', $etudiant->id);
        })->latest()->paginate(10);
        
        return Inertia::render('Student/Paiements', [
            'paiements' => $paiements
        ]);
    }

    public function webview(Request $request)
    {
        $dossierId = $request->query('dossier');
        $dossier = Dossier::where('id', $dossierId)
            ->where('etudiant_id', Auth::guard('etudiant')->id())
            ->firstOrFail();
            
        $montant = 7500; // Frais de dossier fixes
        
        return Inertia::render('Student/PaiementWebview', [
            'montant' => $montant,
            'dossierId' => $dossierId,
            'dossier' => $dossier
        ]);
    }

    public function lygosCallback(Request $request)
    {
        $dossierId = $request->input('order_id');
        $dossier = Dossier::where('id', $dossierId)
            ->where('etudiant_id', Auth::guard('etudiant')->id())
            ->firstOrFail();
            
        $amount = 7500; // Frais de dossier fixes
        $shopName = config('app.name');
        $successUrl = route('etudiant.paiement.success');
        $failureUrl = route('etudiant.paiement.failure');
        
        $response = Http::withHeaders([
            'api-key' => config('services.lygos.api_key'),
            'Content-Type' => 'application/json',
        ])->post('https://api.lygosapp.com/v1/gateway', [
            'amount' => $amount,
            'shop_name' => $shopName,
            'order_id' => $dossierId,
            'message' => 'Paiement frais de dossier DOBAS',
            'success_url' => $successUrl,
            'failure_url' => $failureUrl,
        ]);
        
        if ($response->successful()) {
            $data = $response->json();
            // Log activité
            \App\Services\ActivityLogger::log('paiement_initie', Dossier::class, $dossierId, 'Paiement Lygos initié.');
            
            return redirect($data['link']);
        } else {
            \App\Services\ActivityLogger::log('paiement_erreur', Dossier::class, $dossierId, 'Erreur lors de la création du paiement Lygos.');
            return back()->withErrors(['lygos' => 'Erreur lors de la création du paiement Lygos.']);
        }
    }

    public function stripeCallback(Request $request)
    {
        \App\Services\ActivityLogger::log('paiement_stripe_callback', null, null, 'Callback Stripe reçu.');
        return redirect()->route('etudiant.paiements.index');
    }

    /**
     * Page de succès après paiement
     */
    public function success(Request $request)
    {
        return redirect()->route('etudiant.paiements.index')->with('success', 'Paiement effectué avec succès!');
    }

    /**
     * Page d'échec après paiement
     */
    public function failure(Request $request)
    {
        return redirect()->route('etudiant.paiements.index')->with('error', 'Le paiement a échoué. Veuillez réessayer.');
    }

    /**
     * Vérifie le statut d'un paiement Lygos par order_id
     */
    public function lygosStatus(Request $request)
    {
        $orderId = $request->input('order_id');
        $dossier = Dossier::where('id', $orderId)
            ->where('etudiant_id', Auth::guard('etudiant')->id())
            ->firstOrFail();
            
        $response = Http::withHeaders([
            'api-key' => config('services.lygos.api_key'),
        ])->get(config('services.lygos.api_url') . 'gateway/payin/' . $orderId);
        
        if ($response->successful()) {
            \App\Services\ActivityLogger::log('paiement_status', Dossier::class, $orderId, 'Statut paiement Lygos consulté.');
            return response()->json($response->json());
        } else {
            \App\Services\ActivityLogger::log('paiement_status_erreur', Dossier::class, $orderId, 'Erreur lors de la récupération du statut Lygos.');
            return response()->json(['error' => 'Impossible de récupérer le statut du paiement Lygos.'], 400);
        }
    }
}