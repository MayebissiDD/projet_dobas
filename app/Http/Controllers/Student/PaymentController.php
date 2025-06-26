<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function index()
    {
        $payments = Payment::where('user_id', Auth::id())->latest()->paginate(10);
        return Inertia::render('Student/Paiements', [
            'payments' => $payments
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
        // Exemple de récupération des infos depuis Lygos
        $reference = $request->input('reference');
        $statut = $request->input('statut'); // success, failed
        $montant = $request->input('montant');
        $userId = $request->input('user_id');
        $dossierId = $request->input('dossier_id');

        if ($statut === 'success') {
            $payment = \App\Models\Payment::create([
                'user_id' => $userId,
                'dossier_id' => $dossierId,
                'montant' => $montant,
                'statut' => 'valide',
                'methode' => 'mobile_money',
                'reference' => $reference,
                'paid_at' => now(),
            ]);
            // Notifier admin/agent
            $admins = \App\Models\User::role('admin')->get();
            $agents = \App\Models\User::role('agent')->get();
            foreach ($admins as $admin) {
                $admin->notify(new \App\Notifications\PaiementRecuNotification());
            }
            foreach ($agents as $agent) {
                $agent->notify(new \App\Notifications\PaiementRecuNotification());
            }
            \App\Services\ActivityLogger::log('paiement_valide', \App\Models\Payment::class, $payment->id, 'Paiement Mobile Money validé.');
            return redirect()->route('etudiant.paiements.index')->with('success', 'Paiement validé.');
        } else {
            $payment = \App\Models\Payment::create([
                'user_id' => $userId,
                'dossier_id' => $dossierId,
                'montant' => $montant,
                'statut' => 'echoue',
                'methode' => 'mobile_money',
                'reference' => $reference,
            ]);
            \App\Services\ActivityLogger::log('paiement_echoue', \App\Models\Payment::class, $payment->id, 'Paiement Mobile Money échoué.');
            return redirect()->route('etudiant.paiements.index')->with('error', 'Le paiement a échoué. Veuillez réessayer.');
        }
    }

    public function stripeCallback(Request $request)
    {
        // Exemple de récupération des infos depuis Stripe
        $reference = $request->input('reference');
        $statut = $request->input('statut'); // success, failed
        $montant = $request->input('montant');
        $userId = $request->input('user_id');
        $dossierId = $request->input('dossier_id');

        if ($statut === 'success') {
            $payment = \App\Models\Payment::create([
                'user_id' => $userId,
                'dossier_id' => $dossierId,
                'montant' => $montant,
                'statut' => 'valide',
                'methode' => 'stripe',
                'reference' => $reference,
                'paid_at' => now(),
            ]);
            // Notifier admin/agent
            $admins = \App\Models\User::role('admin')->get();
            $agents = \App\Models\User::role('agent')->get();
            foreach ($admins as $admin) {
                $admin->notify(new \App\Notifications\PaiementRecuNotification());
            }
            foreach ($agents as $agent) {
                $agent->notify(new \App\Notifications\PaiementRecuNotification());
            }
            \App\Services\ActivityLogger::log('paiement_valide', \App\Models\Payment::class, $payment->id, 'Paiement Stripe validé.');
            return redirect()->route('etudiant.paiements.index')->with('success', 'Paiement validé.');
        } else {
            $payment = \App\Models\Payment::create([
                'user_id' => $userId,
                'dossier_id' => $dossierId,
                'montant' => $montant,
                'statut' => 'echoue',
                'methode' => 'stripe',
                'reference' => $reference,
            ]);
            \App\Services\ActivityLogger::log('paiement_echoue', \App\Models\Payment::class, $payment->id, 'Paiement Stripe échoué.');
            return redirect()->route('etudiant.paiements.index')->with('error', 'Le paiement a échoué. Veuillez réessayer.');
        }
    }
}
