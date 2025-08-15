<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Dossier;
use App\Models\DossierPiece;
use App\Models\User;
use App\Models\HistoriqueStatutDossier;
use App\Models\Commentaire;
use App\Notifications\DecisionCandidature;
use App\Notifications\NotificationPersonnalisee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use PDF;

class DossierController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'role:admin|agent']);
    }

    /**
     * Liste de tous les dossiers
     */
    public function index(Request $request)
    {
        Gate::authorize('viewAny', Dossier::class);
        
        $query = Dossier::with(['etudiant', 'pieces', 'paiements'])
            ->whereIn('statut', ['accepte', 'valide'])
            ->orderBy('created_at', 'desc');
        
        // Filtres
        if ($request->filled('statut')) {
            $query->where('statut', $request->statut);
        }
        if ($request->filled('type_bourse')) {
            $query->where('type_bourse', $request->type_bourse);
        }
        if ($request->filled('etablissement')) {
            $query->where('etablissement', 'like', '%' . $request->etablissement . '%');
        }
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->whereHas('etudiant', function($q) use ($search) {
                    $q->where('nom', 'like', '%' . $search . '%')
                     ->orWhere('email', 'like', '%' . $search . '%');
                })
                ->orWhere('numero_dossier', 'like', '%' . $search . '%');
            });
        }
        
        $dossiers = $query->paginate(20)->appends($request->query());
        
        return Inertia::render('Admin/Dossiers/Index', [
            'dossiers' => $dossiers,
            'filters' => $request->only(['statut', 'type_bourse', 'etablissement', 'search']),
            'stats' => $this->getDossiersStats()
        ]);
    }

    /**
     * Afficher un dossier spécifique
     */
    public function show($id)
    {
        $dossier = Dossier::with([
            'etudiant', 
            'pieces', 
            'paiements',
            'commentaires.user',
            'historique.modifiePar',
            'bourse',
            'ecole',
            'filiere'
        ])->findOrFail($id);
        
        Gate::authorize('view', $dossier);
        
        return Inertia::render('Admin/Dossiers/Show', [
            'dossier' => $dossier,
            'pieces' => $dossier->pieces->groupBy('type_piece')
        ]);
    }

    /**
     * Mettre à jour le statut d'un dossier
     */
    public function updateStatus(Request $request, $id)
    {
        $dossier = Dossier::findOrFail($id);
        Gate::authorize('update', $dossier);
        
        $request->validate([
            'statut' => 'required|in:en_attente,en_cours,accepte,refuse,incomplet,valide',
            'commentaire' => 'nullable|string|max:1000',
            'raison_refus' => 'required_if:statut,refuse|string|max:500'
        ]);
        
        $ancienStatut = $dossier->statut;
        
        DB::transaction(function () use ($dossier, $request, $ancienStatut) {
            // Mettre à jour le dossier
            $dossier->update([
                'statut' => $request->statut,
                'commentaire_agent' => $request->commentaire,
                'raison_refus' => $request->raison_refus,
                'agent_id' => auth()->id(),
                'date_decision' => now()
            ]);
            
            // Enregistrer dans l'historique
            HistoriqueStatutDossier::create([
                'dossier_id' => $dossier->id,
                'ancien_statut' => $ancienStatut,
                'nouveau_statut' => $request->statut,
                'motif' => $request->commentaire,
                'modifie_par' => auth()->id()
            ]);
            
            // Notifier l'étudiant de la décision
            if ($dossier->etudiant && in_array($request->statut, ['accepte', 'refuse', 'valide'])) {
                $dossier->etudiant->notify(new DecisionCandidature($dossier));
            }
        });
        
        return redirect()->back()->with('success', 'Statut mis à jour avec succès');
    }

    /**
     * Validation/signer plusieurs dossiers à la fois
     */
    public function batchValidate(Request $request)
    {
        Gate::authorize('batchValidate', Dossier::class);
        
        $request->validate([
            'dossier_ids' => 'required|array',
            'dossier_ids.*' => 'exists:dossiers,id',
        ]);
        
        $dossiers = Dossier::whereIn('id', $request->dossier_ids)
            ->where('statut', 'accepte')
            ->get();
            
        if ($dossiers->isEmpty()) {
            return back()->with('error', 'Aucun dossier valide à traiter.');
        }
        
        DB::transaction(function () use ($dossiers) {
            foreach ($dossiers as $dossier) {
                $ancienStatut = $dossier->statut;
                
                $dossier->update([
                    'statut' => 'valide',
                    'date_validation_admin' => now(),
                    'admin_id' => auth()->id(),
                ]);
                
                HistoriqueStatutDossier::create([
                    'dossier_id' => $dossier->id,
                    'ancien_statut' => $ancienStatut,
                    'nouveau_statut' => 'valide',
                    'motif' => 'Validation finale par l\'admin',
                    'modifie_par' => auth()->id()
                ]);
                
                // Notifier l'étudiant de la réussite
                if ($dossier->etudiant) {
                    $dossier->etudiant->notify(new DecisionCandidature($dossier));
                }
            }
        });
        
        return back()->with('success', $dossiers->count() . ' dossier(s) validé(s) et notification(s) envoyée(s).');
    }

    /**
     * Imprimer la liste définitive des boursiers par école ou filière
     */
    public function printList(Request $request)
    {
        Gate::authorize('printList', Dossier::class);
        
        $request->validate([
            'type' => 'required|in:ecole,filiere',
            'id' => 'required|integer',
        ]);
        
        $query = Dossier::where('statut', 'valide')->with(['etudiant', 'bourse', 'ecole', 'filiere']);
        
        if ($request->type === 'ecole') {
            $query->where('ecole_id', $request->id);
        } else {
            $query->where('filiere_id', $request->id);
        }
        
        $dossiers = $query->get();
        
        if ($dossiers->isEmpty()) {
            return back()->with('error', 'Aucun dossier validé trouvé pour cette sélection.');
        }
        
        $typeLabel = $request->type === 'ecole' ? 'École' : 'Filière';
        $label = $request->type === 'ecole' 
            ? optional($dossiers->first()->ecole)->nom 
            : optional($dossiers->first()->filiere)->nom;
        
        $pdf = PDF::loadView('admin.liste_boursiers', compact('dossiers', 'typeLabel', 'label'));
        
        return $pdf->download('liste_boursiers_' . $typeLabel . '_' . $label . '.pdf');
    }

    /**
     * Télécharger une pièce justificative
     */
    public function downloadPiece($dossierId, $pieceId)
    {
        $dossier = Dossier::findOrFail($dossierId);
        $piece = DossierPiece::where('dossier_id', $dossierId)
                            ->where('id', $pieceId)
                            ->firstOrFail();
        
        Gate::authorize('view', $dossier);
        
        if (!Storage::disk('public')->exists($piece->chemin)) {
            abort(404, 'Fichier introuvable');
        }
        
        return Storage::disk('public')->download(
            $piece->chemin, 
            $piece->nom_original
        );
    }

    /**
     * Télécharger toutes les pièces d'un dossier (ZIP)
     */
    public function downloadAllPieces($dossierId)
    {
        $dossier = Dossier::with('pieces')->findOrFail($dossierId);
        Gate::authorize('view', $dossier);
        
        $zip = new \ZipArchive();
        $zipFileName = "dossier_{$dossier->numero_dossier}.zip";
        $zipPath = storage_path("app/temp/{$zipFileName}");
        
        // Créer le dossier temp s'il n'existe pas
        if (!file_exists(dirname($zipPath))) {
            mkdir(dirname($zipPath), 0755, true);
        }
        
        if ($zip->open($zipPath, \ZipArchive::CREATE) === TRUE) {
            foreach ($dossier->pieces as $piece) {
                $filePath = storage_path("app/public/{$piece->chemin}");
                if (file_exists($filePath)) {
                    $zip->addFile($filePath, $piece->type_piece . '_' . $piece->nom_original);
                }
            }
            $zip->close();
            
            return response()->download($zipPath)->deleteFileAfterSend(true);
        } else {
            abort(500, 'Impossible de créer l\'archive ZIP');
        }
    }

    /**
     * Ajouter un commentaire sur un dossier
     */
    public function addComment(Request $request, $id)
    {
        $dossier = Dossier::findOrFail($id);
        Gate::authorize('update', $dossier);
        
        $request->validate([
            'commentaire' => 'required|string|max:1000'
        ]);
        
        $dossier->commentaires()->create([
            'commentaire' => $request->commentaire,
            'user_id' => auth()->id(),
            'type' => 'commentaire_agent'
        ]);
        
        return redirect()->back()->with('success', 'Commentaire ajouté');
    }

    /**
     * Envoyer une notification personnalisée à l'étudiant
     */
    public function sendNotification(Request $request, $id)
    {
        $dossier = Dossier::with('etudiant')->findOrFail($id);
        Gate::authorize('update', $dossier);
        
        $request->validate([
            'sujet' => 'required|string|max:255',
            'message' => 'required|string|max:2000',
            'type' => 'required|in:info,demande_piece,convocation'
        ]);
        
        if ($dossier->etudiant) {
            $dossier->etudiant->notify(new NotificationPersonnalisee(
                $request->sujet,
                $request->message,
                $request->type,
                $dossier
            ));
            
            // Enregistrer dans l'historique
            HistoriqueStatutDossier::create([
                'dossier_id' => $dossier->id,
                'ancien_statut' => $dossier->statut,
                'nouveau_statut' => $dossier->statut,
                'motif' => "Notification envoyée: {$request->sujet}",
                'modifie_par' => auth()->id()
            ]);
        }
        
        return redirect()->back()->with('success', 'Notification envoyée');
    }

    /**
     * Générer un rapport des candidatures
     */
    public function generateReport(Request $request)
    {
        Gate::authorize('viewAny', Dossier::class);
        
        $request->validate([
            'date_debut' => 'nullable|date',
            'date_fin' => 'nullable|date|after_or_equal:date_debut',
            'type' => 'required|in:global,par_statut,par_bourse,par_etablissement',
            'format' => 'required|in:pdf,excel'
        ]);
        
        $query = Dossier::with(['etudiant', 'paiements']);
        
        // Filtres de date
        if ($request->filled('date_debut')) {
            $query->whereDate('created_at', '>=', $request->date_debut);
        }
        if ($request->filled('date_fin')) {
            $query->whereDate('created_at', '<=', $request->date_fin);
        }
        
        $dossiers = $query->get();
        
        // Générer le rapport selon le type
        switch ($request->type) {
            case 'global':
                $data = $this->generateGlobalReport($dossiers);
                break;
            case 'par_statut':
                $data = $this->generateStatusReport($dossiers);
                break;
            case 'par_bourse':
                $data = $this->generateBourseReport($dossiers);
                break;
            case 'par_etablissement':
                $data = $this->generateEtablissementReport($dossiers);
                break;
        }
        
        // Export selon le format
        if ($request->format === 'pdf') {
            return $this->exportToPdf($data, $request->type);
        } else {
            return $this->exportToExcel($data, $request->type);
        }
    }

    /**
     * Statistiques du dashboard
     */
    public function stats()
    {
        Gate::authorize('viewAny', Dossier::class);
        
        return response()->json([
            'total_dossiers' => Dossier::count(),
            'en_attente' => Dossier::where('statut', 'en_attente')->count(),
            'acceptes' => Dossier::where('statut', 'accepte')->count(),
            'refuses' => Dossier::where('statut', 'refuse')->count(),
            'en_cours' => Dossier::where('statut', 'en_cours')->count(),
            'incomplets' => Dossier::where('statut', 'incomplet')->count(),
            'valide' => Dossier::where('statut', 'valide')->count(),
            'paiements_recus' => Dossier::where('statut_paiement', 'paye')->count(),
            'paiements_attente' => Dossier::where('statut_paiement', 'en_attente')->count(),
            'bourses_locales' => Dossier::where('type_bourse', 'locale')->count(),
            'bourses_etrangeres' => Dossier::where('type_bourse', 'étrangère')->count(),
            'aides_scolaires' => Dossier::where('type_bourse', 'aide_scolaire')->count(),
            'nouveaux_aujourd_hui' => Dossier::whereDate('created_at', today())->count(),
            'nouveaux_cette_semaine' => Dossier::whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])->count()
        ]);
    }

    // ========================
    // MÉTHODES PRIVÉES
    // ========================
    
    private function getDossiersStats()
    {
        return [
            'total' => Dossier::count(),
            'en_attente' => Dossier::where('statut', 'en_attente')->count(),
            'en_cours' => Dossier::where('statut', 'en_cours')->count(),
            'acceptes' => Dossier::where('statut', 'accepte')->count(),
            'refuses' => Dossier::where('statut', 'refuse')->count(),
            'incomplets' => Dossier::where('statut', 'incomplet')->count(),
            'valide' => Dossier::where('statut', 'valide')->count(),
        ];
    }
    
    private function generateGlobalReport($dossiers)
    {
        return [
            'titre' => 'Rapport Global des Candidatures',
            'total_candidatures' => $dossiers->count(),
            'par_statut' => $dossiers->groupBy('statut')->map->count(),
            'par_type_bourse' => $dossiers->groupBy('type_bourse')->map->count(),
            'par_mois' => $dossiers->groupBy(function($item) {
                return $item->created_at->format('Y-m');
            })->map->count(),
            'revenus_total' => $dossiers->where('statut_paiement', 'paye')->sum(function($dossier) {
                return $dossier->paiements->where('statut', 'reussi')->sum('montant');
            })
        ];
    }
    
    private function generateStatusReport($dossiers)
    {
        return [
            'titre' => 'Rapport par Statut',
            'details' => $dossiers->groupBy('statut')->map(function($group, $statut) {
                $totalCount = $dossiers->count();
                return [
                    'statut' => $statut,
                    'count' => $group->count(),
                    'pourcentage' => $totalCount > 0 ? round(($group->count() / $totalCount) * 100, 2) : 0,
                    'dossiers' => $group->map(function($dossier) {
                        return [
                            'numero' => $dossier->numero_dossier,
                            'nom' => $dossier->etudiant->nom ?? 'N/A',
                            'email' => $dossier->etudiant->email ?? 'N/A',
                            'date_soumission' => $dossier->created_at->format('d/m/Y')
                        ];
                    })
                ];
            })
        ];
    }
    
    private function generateBourseReport($dossiers)
    {
        return [
            'titre' => 'Rapport par Type de Bourse',
            'details' => $dossiers->groupBy('type_bourse')->map(function($group, $type) {
                return [
                    'type' => $type,
                    'count' => $group->count(),
                    'etablissements' => $group->groupBy('etablissement')->map->count(),
                    'acceptes' => $group->where('statut', 'accepte')->count(),
                    'refuses' => $group->where('statut', 'refuse')->count()
                ];
            })
        ];
    }
    
    private function generateEtablissementReport($dossiers)
    {
        return [
            'titre' => 'Rapport par Établissement',
            'details' => $dossiers->groupBy('etablissement')->map(function($group, $etablissement) {
                return [
                    'etablissement' => $etablissement,
                    'total_candidatures' => $group->count(),
                    'acceptees' => $group->where('statut', 'accepte')->count(),
                    'refusees' => $group->where('statut', 'refuse')->count(),
                    'en_attente' => $group->where('statut', 'en_attente')->count(),
                    'taux_acceptance' => $group->count() > 0 ? round(($group->where('statut', 'accepte')->count() / $group->count()) * 100, 2) : 0
                ];
            })
        ];
    }
    
    private function exportToPdf($data, $type)
    {
        $pdf = PDF::loadView('admin.reports.pdf', compact('data', 'type'));
        
        return $pdf->download("rapport_candidatures_{$type}_" . date('Y-m-d') . ".pdf");
    }
    
    private function exportToExcel($data, $type)
    {
        return \Excel::download(
            new \App\Exports\DossiersExport($data), 
            "rapport_candidatures_{$type}_" . date('Y-m-d') . ".xlsx"
        );
    }
}