<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Paiement;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaiementController extends Controller
{
    public function index()
    {
        $paiements = Paiement::latest()->paginate(20);
        return Inertia::render('Admin/Paiements', [
            'paiements' => $paiements
        ]);
    }

    public function paiementRecu(Request $request)
    {
        // Logique de validation manuelle d'un paiement reçu (à adapter selon le workflow)
        $paiement = Paiement::findOrFail($request->input('paiement_id'));
        $paiement->statut = 'valide';
        $paiement->save();
        // Notifier l'étudiant (User ou Etudiant) lors de la validation manuelle d'un paiement
        if ($paiement->etudiant_id) {
            $etudiant = \App\Models\Etudiant::find($paiement->etudiant_id);
            if ($etudiant) {
                $etudiant->notify(new \App\Notifications\PaiementRecuNotification());
            }
        }
        return back()->with('success', 'Paiement validé.');
    }
}
