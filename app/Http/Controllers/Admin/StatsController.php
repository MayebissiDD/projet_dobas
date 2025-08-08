<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Dossier;
use App\Models\Paiement;
use App\Models\User;
use App\Models\Ecole;
use App\Models\Bourse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class StatsController extends Controller
{
    /**
     * Affiche la page des statistiques.
     */
    public function index(Request $request)
    {
        // --- Filtres dynamiques ---
        $query = Dossier::query();

        if ($request->filled('from')) {
            $query->whereDate('created_at', '>=', $request->from);
        }

        if ($request->filled('to')) {
            $query->whereDate('created_at', '<=', $request->to);
        }

        if ($request->filled('statut')) {
            $query->where('statut', $request->statut);
        }

        if ($request->filled('bourse_id')) {
            $query->where('bourse_id', $request->bourse_id);
        }

        if ($request->filled('school_id')) {
            $query->where('school_id', $request->school_id);
        }

        // --- Statistiques globales ---
        $stats = [
            'total'       => $query->count(),
            'acceptes'    => (clone $query)->where('statut', 'accepté')->count(),
            'valides'     => (clone $query)->where('statut', 'validé')->count(),
            'rejetes'     => (clone $query)->where('statut', 'rejeté')->count(),
            'en_attente'  => (clone $query)->where('statut', 'en attente')->count(),
            'paiements'   => Paiement::sum('montant'),
        ];

        // --- Totaux (Utilisateurs, Écoles, Bourses, Filières) ---
        $totals = [
            'users'    => User::count(),
            'ecoles'   => Ecole::count(),
            'bourses'  => Bourse::count(),
            'filieres' => Dossier::distinct('filiere_souhaitee')->count('filiere_souhaitee'),
        ];

        // --- Répartition par école ---
        $parEcole = Ecole::select('id', 'nom')
            ->withCount(['dossiers' => function ($q) use ($request) {
                if ($request->filled('from')) $q->whereDate('created_at', '>=', $request->from);
                if ($request->filled('to')) $q->whereDate('created_at', '<=', $request->to);
            }])
            ->get()
            ->map(function ($ecole) {
                $ecole->taux_remplissage = $ecole->dossiers_count > 0 ? round(($ecole->dossiers_count / 100) * 100, 2) : 0;
                return $ecole;
            });

        // --- Répartition par filière ---
        $parFiliere = Dossier::select('filiere_souhaitee', DB::raw('COUNT(*) as total'))
            ->when($request->filled('from'), fn($q) => $q->whereDate('created_at', '>=', $request->from))
            ->when($request->filled('to'), fn($q) => $q->whereDate('created_at', '<=', $request->to))
            ->groupBy('filiere_souhaitee')
            ->get();

        // --- Évolution par mois ---
        $parMois = Dossier::select(
                DB::raw("DATE_FORMAT(created_at, '%Y-%m') as mois"),
                DB::raw("COUNT(*) as total")
            )
            ->when($request->filled('from'), fn($q) => $q->whereDate('created_at', '>=', $request->from))
            ->when($request->filled('to'), fn($q) => $q->whereDate('created_at', '<=', $request->to))
            ->groupBy('mois')
            ->orderBy('mois')
            ->get();

        // --- Retour vers la vue Inertia ---
        return Inertia::render('Admin/DashboardStats', [
            'stats'    => $stats,
            'totals'   => $totals,
            'parEcole' => $parEcole,
            'parFiliere' => $parFiliere,
            'parMois'  => $parMois,
            'bourses'  => Bourse::select('id', 'nom')->get(),
            'filters'  => $request->only('from', 'to', 'statut', 'bourse_id', 'school_id'),
        ]);
    }

    /**
     * Export des statistiques en CSV.
     */
    public function exportCsv(Request $request)
    {
        $query = Dossier::query();

        if ($request->filled('from')) $query->whereDate('created_at', '>=', $request->from);
        if ($request->filled('to')) $query->whereDate('created_at', '<=', $request->to);
        if ($request->filled('statut')) $query->where('statut', $request->statut);

        $dossiers = $query->get(['id', 'nom', 'prenom', 'email', 'statut', 'created_at']);

        $filename = 'stats_' . now()->format('Y_m_d_His') . '.csv';
        $handle = fopen($filename, 'w+');
        fputcsv($handle, ['ID', 'Nom', 'Prénom', 'Email', 'Statut', 'Date']);

        foreach ($dossiers as $dossier) {
            fputcsv($handle, [
                $dossier->id,
                $dossier->nom,
                $dossier->prenom,
                $dossier->email,
                $dossier->statut,
                $dossier->created_at->format('Y-m-d'),
            ]);
        }

        fclose($handle);

        return response()->download($filename)->deleteFileAfterSend(true);
    }
}