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
        })->latest()->paginate(10)
        ->through(function ($paiement) {
            return [
                'id' => $paiement->id,
                'montant' => $paiement->montant,
                'statut' => $paiement->statut,
                'methode' => $paiement->methode,
                'reference' => $paiement->reference,
                'date_paiement' => $paiement->date_paiement ? $paiement->date_paiement->format('d/m/Y H:i') : null,
                'dossier' => [
                    'id' => $paiement->dossier->id,
                    'numero_dossier' => $paiement->dossier->numero_dossier,
                ],
            ];
        });
        
        return Inertia::render('Etudiant/Paiements', [
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
        
        return Inertia::render('Etudiant/PaiementWebview', [
            'montant' => $montant,
            'dossierId' => $dossierId,
            'dossier' => [
                'id' => $dossier->id,
                'numero_dossier' => $dossier->numero_dossier,
            ]
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
            
            // Enregistrer le paiement
            Paiement::create([
                'dossier_id' => $dossierId,
                'montant' => $amount,
                'reference' => $data['transaction_id'],
                'methode' => 'Lygos',
                'statut' => 'en_attente',
                'date_paiement' => null,
            ]);
            
            return redirect($data['link']);
        } else {
            return back()->withErrors(['lygos' => 'Erreur lors de la création du paiement Lygos.']);
        }
    }

    public function stripeCallback(Request $request)
    {
        return redirect()->route('etudiant.paiements.index');
    }

    /**
     * Page de succès après paiement
     */
    public function success(Request $request)
    {
        // Mettre à jour le statut du paiement
        $transactionId = $request->input('transaction_id');
        $orderId = $request->input('order_id');
        
        if ($transactionId && $orderId) {
            $paiement = Paiement::where('reference', $transactionId)
                ->whereHas('dossier', function($query) use ($orderId) {
                    $query->where('id', $orderId);
                })
                ->first();
                
            if ($paiement) {
                $paiement->update([
                    'statut' => 'effectué',
                    'date_paiement' => now(),
                ]);
                
                // Mettre à jour le statut du dossier
                $dossier = $paiement->dossier;
                $dossier->update([
                    'statut_paiement' => 'paye',
                ]);
                
                // Envoyer une notification à l'étudiant
                $dossier->etudiant->notify(new PaiementRecuNotification($paiement));
            }
        }
        
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
            return response()->json($response->json());
        } else {
            return response()->json(['error' => 'Impossible de récupérer le statut du paiement Lygos.'], 400);
        }
    }
}