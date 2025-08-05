<?php
namespace App\Http\Controllers\Etudiant;

use App\Http\Controllers\Controller;
use App\Models\Dossier;
use App\Models\Paiement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class EtudiantDashboardController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:etudiant');
    }

    /**
     * Tableau de bord de l'étudiant
     */
    public function index()
    {
        $etudiant = Auth::guard('etudiant')->user();
        
        // Récupérer les dossiers de l'étudiant
        $dossiers = Dossier::where('etudiant_id', $etudiant->id)
            ->with(['bourse', 'ecole', 'filiere'])
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();
        
        // Statistiques des dossiers
        $stats = [
            'total' => Dossier::where('etudiant_id', $etudiant->id)->count(),
            'en_attente' => Dossier::where('etudiant_id', $etudiant->id)->where('statut', 'en_attente')->count(),
            'en_cours' => Dossier::where('etudiant_id', $etudiant->id)->where('statut', 'en_cours')->count(),
            'acceptes' => Dossier::where('etudiant_id', $etudiant->id)->where('statut', 'accepte')->count(),
            'refuses' => Dossier::where('etudiant_id', $etudiant->id)->where('statut', 'refuse')->count(),
        ];
        
        // Récupérer les paiements
        $paiements = Paiement::whereHas('dossier', function($query) use ($etudiant) {
            $query->where('etudiant_id', $etudiant->id);
        })->orderBy('created_at', 'desc')->take(3)->get();
        
        // Récupérer les dernières notifications
        $notifications = $etudiant->notifications()->orderBy('created_at', 'desc')->take(5)->get();
        
        return Inertia::render('Etudiant/Dashboard', [
            'dossiers' => $dossiers,
            'stats' => $stats,
            'paiements' => $paiements,
            'notifications' => $notifications,
            'unreadNotifications' => $etudiant->unreadNotifications->count()
        ]);
    }
}
