<?php

namespace App\Http\Controllers\Agent;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Dossier;

class DashboardController extends Controller
{
    /**
     * Tableau de bord de l'agent : statistiques + derniers dossiers
     */
    public function dashboard(Request $request)
    {
        $agent = auth()->user();
        if (!$agent || !$agent->hasRole('agent')) {
            abort(403, 'Accès non autorisé');
        }

        // Récupération de tous les dossiers
        $dossiers = Dossier::latest()->take(10)->get(); // Derniers 10 dossiers

        // Statistiques par statut
        $stats = [
            'en_attente' => Dossier::where('statut', 'en_attente')->count(),
            'valides'    => Dossier::where('statut', 'valide')->count(),
            'rejetes'    => Dossier::where('statut', 'rejete')->count(),
            'incomplets' => Dossier::where('statut', 'incomplet')->count(),
            'total'      => Dossier::count(),
        ];

        return Inertia::render('Agent/Dashboard', [
            'dossiers' => $dossiers,
            'stats'    => $stats,
        ]);
    }
}
