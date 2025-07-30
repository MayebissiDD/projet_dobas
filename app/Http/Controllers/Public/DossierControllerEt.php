<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Dossier;
use App\Models\DossierPiece;
use App\Models\User;
use App\Notifications\DecisionCandidature;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

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

        $query = Dossier::with(['etudiant', 'pieces', 'transactions'])
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
                $q->where('nom', 'like', '%' . $search . '%')
                  ->orWhere('email', 'like', '%' . $search . '%')
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
            'transactions',
            'commentaires.user',
            'historique'
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
            'statut' => 'required|in:en_attente,accepte,refuse,en_cours',
            'commentaire' => 'nullable|string|max:1000',
            'raison_refus' => 'required_if:statut,refuse|string|max:500'
        ]);

        $ancienStatut = $dossier->statut;

        // Mettre à jour le dossier
        $dossier->update([
            'statut' => $request->statut,
            'commentaire_agent' => $request->commentaire,
            'raison_refus' => $request->raison_refus,
            'agent_id' => auth()->id(),
            'date_decision' => now()
        ]);

        // Enregistrer dans l'historique
        $dossier->historique()->create([
            'action' => 'changement_statut',
            'ancien_statut' => $ancienStatut,
            'nouveau_statut' => $request->statut,
            'commentaire' => $request->commentaire,
            'user_id' => auth()->id()
        ]);

        // Notifier l'étudiant de la décision
        if ($dossier->etudiant && in_array($request->statut, ['accepte', 'refuse'])) {
            $dossier->etudiant->notify(new DecisionCandidature($dossier));
        }

        return redirect()->back()->with('success', 'Statut mis à jour avec succès');
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
            $dossier->etudiant->notify(new \App\Notifications\NotificationPersonnalisee(
                $request->sujet,
                $request->message,
                $request->type,
                $dossier
            ));

            // Enregistrer dans l'historique
            $dossier->historique()->create([
                'action' => 'notification_envoyee',
                'commentaire' => "Notification envoyée: {$request->sujet}",
                'user_id' => auth()->id()
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

        $query = Dossier::with(['etudiant', 'transactions']);

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
            'acceptes' => Dossier::where('statut', 'accepte')->count(),
            'refuses' => Dossier::where('statut', 'refuse')->count(),
            'en_cours' => Dossier::where('statut', 'en_cours')->count()
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
                return $dossier->transactions->where('statut', 'reussi')->sum('montant');
            })
        ];
    }

    private function generateStatusReport($dossiers)
    {
        return [
            'titre' => 'Rapport par Statut',
            'details' => $dossiers->groupBy('statut')->map(function($group, $statut) {
                return [
                    'statut' => $statut,
                    'count' => $group->count(),
                    'pourcentage' => round(($group->count() / $group->count()) * 100, 2),
                    'dossiers' => $group->map(function($dossier) {
                        return [
                            'numero' => $dossier->numero_dossier,
                            'nom' => $dossier->nom,
                            'email' => $dossier->email,
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
        $pdf = app('dompdf.wrapper');
        $pdf->loadView('admin.reports.pdf', compact('data', 'type'));
        
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