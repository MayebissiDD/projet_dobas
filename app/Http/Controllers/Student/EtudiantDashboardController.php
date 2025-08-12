<?php
namespace App\Http\Controllers\Student;

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
        
        // Récupérer les dossiers de l'étudiant avec relations
        $dossiers = Dossier::where('etudiant_id', $etudiant->id)
            ->with(['bourse', 'ecole', 'filiere'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($dossier) {
                return [
                    'id' => $dossier->id,
                    'numero_dossier' => $dossier->numero_dossier,
                    'bourse' => $dossier->bourse->nom ?? 'Non spécifiée',
                    'ecole' => $dossier->ecole->nom ?? 'Non spécifiée',
                    'filiere' => $dossier->filiere->nom ?? 'Non spécifiée',
                    'statut' => $dossier->statut,
                    'statut_paiement' => $dossier->statut_paiement,
                    'date_soumission' => $dossier->date_soumission ? $dossier->date_soumission->format('d/m/Y') : null,
                    'created_at' => $dossier->created_at->format('d/m/Y'),
                ];
            });
        
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
        })->orderBy('created_at', 'desc')->take(3)->get()
        ->map(function ($paiement) {
            return [
                'id' => $paiement->id,
                'montant' => $paiement->montant,
                'statut' => $paiement->statut,
                'methode' => $paiement->methode,
                'reference' => $paiement->reference,
                'date_paiement' => $paiement->date_paiement ? $paiement->date_paiement->format('d/m/Y H:i') : null,
            ];
        });
        
        // Récupérer les dernières notifications
        $notifications = $etudiant->notifications()
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($notification) {
                return [
                    'id' => $notification->id,
                    'type' => $notification->type,
                    'message' => $notification->data['message'] ?? 'Notification',
                    'read_at' => $notification->read_at,
                    'created_at' => $notification->created_at->format('d/m/Y H:i'),
                ];
            });
        
        return Inertia::render('Student/Dashboard', [
            'dossiers' => $dossiers,
            'stats' => $stats,
            'paiements' => $paiements,
            'notifications' => $notifications,
            'unreadNotifications' => $etudiant->unreadNotifications->count()
        ]);
    }
}