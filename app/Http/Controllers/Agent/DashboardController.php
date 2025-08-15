<?php
namespace App\Http\Controllers\Agent;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Dossier;
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
        
<<<<<<< HEAD
        // Récupération des dossiers assignés à l'agent ou tous les dossiers si l'agent a la permission
        $query = Dossier::query();
        
        // Si l'agent n'est pas admin, ne montrer que les dossiers qui lui sont assignés
        if (!$user->hasRole('admin')) {
            $query->where('agent_id', $user->id);
        }
=======
        // Récupération des derniers dossiers avec leurs pièces
        $dossiers = Dossier::with(['bourse', 'pieces'])
                          ->latest()
                          ->take(10)
                          ->get();
>>>>>>> e970dd4
        
        // Statistiques par statut
        $stats = [
            'en_attente' => (clone $query)->where('statut', 'en_attente')->count(),
            'en_cours' => (clone $query)->where('statut', 'en_cours')->count(),
            'accepte' => (clone $query)->where('statut', 'accepte')->count(),
            'valide' => (clone $query)->where('statut', 'valide')->count(),
            'rejete' => (clone $query)->where('statut', 'rejete')->count(),
            'incomplet' => (clone $query)->where('statut', 'incomplet')->count(),
            'reoriente' => (clone $query)->where('statut', 'reoriente')->count(),
            'total' => (clone $query)->count(),
        ];
        
<<<<<<< HEAD
        // Derniers dossiers
        $dossiers = (clone $query)->with(['etudiant', 'bourse', 'ecole', 'filiere'])
            ->latest()
            ->take(10)
            ->get();
        
        // Activités récentes de l'agent
        $recentActivities = \App\Models\ActivityLog::where('causer_type', Dossier::class)
            ->where('causer_id', $user->id)
            ->latest()
            ->take(5)
            ->get();
        
=======
>>>>>>> e970dd4
        return Inertia::render('Agent/Dashboard', [
            'dossiers' => $dossiers,
            'stats' => $stats,
            'recentActivities' => $recentActivities,
        ]);
    }
}