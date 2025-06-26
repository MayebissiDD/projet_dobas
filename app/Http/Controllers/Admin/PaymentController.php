<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Notifications\PaiementRecuNotification;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    // Appelée lors de la réception d'un paiement (callback ou validation)
    public function paiementRecu(Request $request)
    {
        // ... logique de validation du paiement ...

        // Notifier tous les admins et agents
        $admins = User::role('admin')->get();
        $agents = User::role('agent')->get();
        foreach ($admins as $admin) {
            $admin->notify(new PaiementRecuNotification());
        }
        foreach ($agents as $agent) {
            $agent->notify(new PaiementRecuNotification());
        }

        \App\Services\ActivityLogger::log(
            'paiement_recu',
            null,
            null,
            'Un paiement a été reçu et les notifications ont été envoyées.'
        );

        return response()->json(['success' => true]);
    }

    public function index(Request $request)
    {
        $query = \App\Models\Payment::with(['user', 'dossier'])->latest();
        if ($request->filled('statut')) {
            $query->where('statut', $request->statut);
        }
        if ($request->filled('methode')) {
            $query->where('methode', $request->methode);
        }
        $payments = $query->paginate(20);
        return \Inertia\Inertia::render('Admin/Paiements', [
            'payments' => $payments,
            'filters' => [
                'statut' => $request->statut,
                'methode' => $request->methode,
            ],
        ]);
    }
}
