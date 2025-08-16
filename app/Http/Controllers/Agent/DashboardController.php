<?php
namespace App\Http\Controllers\Agent;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Dossier;
use App\Models\HistoriqueStatutDossier;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class DashboardController extends Controller
{
    /**
     * Tableau de bord de l'agent : statistiques + derniers dossiers
     */
    public function dashboard(Request $request)
    {
        // Vérifier que l'utilisateur est un agent
        $user = Auth::user();
        if (!$user || !$user->hasRole('agent')) {
            abort(403, 'Accès non autorisé');
        }
        
        // Initialiser la requête pour les statistiques
        $query = Dossier::query();
        
        // Récupération des derniers dossiers avec leurs pièces, bourse et étudiant
        $dossiers = Dossier::with(['bourse', 'pieces', 'etudiant'])
                          ->latest()
                          ->take(10)
                          ->get();
        
        // Statistiques par statut
        $stats = [
            'soumis' => (clone $query)->where('statut', 'soumis')->count(),
            'en_attente' => (clone $query)->where('statut', 'en_attente')->count(),
            'en_cours' => (clone $query)->where('statut', 'en_cours')->count(),
            'accepte' => (clone $query)->where('statut', 'accepte')->count(),
            'valide' => (clone $query)->where('statut', 'valide')->count(),
            'rejete' => (clone $query)->where('statut', 'rejete')->count(),
            'incomplet' => (clone $query)->where('statut', 'incomplet')->count(),
            'reoriente' => (clone $query)->where('statut', 'reoriente')->count(),
            'total' => (clone $query)->count(),
        ];
        
        // Récupérer les activités récentes depuis l'historique des statuts
        $recentActivities = HistoriqueStatutDossier::with(['dossier', 'modifiePar'])
                                                   ->orderBy('modifie_le', 'desc')
                                                   ->take(10)
                                                   ->get()
                                                   ->map(function ($activity) {
                                                       return [
                                                           'id' => $activity->id,
                                                           'description' => "Le statut du dossier #{$activity->dossier_id} a été changé de \"{$activity->ancien_statut}\" à \"{$activity->nouveau_statut}\"",
                                                           'created_at' => $activity->modifie_le,
                                                           'dossier_id' => $activity->dossier_id,
                                                           'modifie_par' => $activity->modifiePar->name ?? 'Système'
                                                       ];
                                                   });
        
        return Inertia::render('Agent/Dashboard', [
            'dossiers' => $dossiers,
            'stats' => $stats,
            'recentActivities' => $recentActivities,
        ]);
    }
}