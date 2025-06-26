<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Dossier;
use App\Models\School;
use App\Models\Payment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class StatsController extends Controller
{
    public function dashboard(Request $request)
    {
        $bourses = \App\Models\Bourse::orderBy('nom')->get(['id', 'nom']);
        $query = Dossier::query();
        if ($request->filled('bourse_id')) {
            $query->where('bourse_id', $request->bourse_id);
        }
        $total = $query->count();
        $acceptes = (clone $query)->where('statut', 'accepté')->count();
        $valides = (clone $query)->where('statut', 'validé')->count();
        $rejetes = (clone $query)->where('statut', 'rejeté')->count();
        $en_attente = (clone $query)->where('statut', 'en attente')->count();
        $paiements = \App\Models\Payment::where('statut', 'valide')->sum('montant');

        $parEcole = \App\Models\School::withCount(['dossiers' => function($q) use ($request) {
            if ($request->filled('bourse_id')) {
                $q->where('bourse_id', $request->bourse_id);
            }
        }])->get()->map(function($s) {
            $s->taux_remplissage = $s->capacite ? round(100 * $s->dossiers_count / $s->capacite, 1) : null;
            return $s;
        });

        $parFiliere = Dossier::select('filiere_affectee', \DB::raw('count(*) as total'))
            ->whereNotNull('filiere_affectee')
            ->when($request->filled('bourse_id'), function($q) use ($request) {
                $q->where('bourse_id', $request->bourse_id);
            })
            ->groupBy('filiere_affectee')
            ->get();

        $parMois = Dossier::selectRaw('DATE_FORMAT(created_at, "%Y-%m") as mois, count(*) as total')
            ->when($request->filled('bourse_id'), function($q) use ($request) {
                $q->where('bourse_id', $request->bourse_id);
            })
            ->groupBy('mois')
            ->orderBy('mois')
            ->get();

        return Inertia::render('Admin/DashboardStats', [
            'stats' => [
                'total' => $total,
                'acceptes' => $acceptes,
                'valides' => $valides,
                'rejetes' => $rejetes,
                'en_attente' => $en_attente,
                'paiements' => $paiements,
            ],
            'parEcole' => $parEcole,
            'parFiliere' => $parFiliere,
            'parMois' => $parMois,
            'bourses' => $bourses,
            'selectedBourse' => $request->bourse_id,
        ]);
    }

    public function exportCsv(Request $request)
    {
        $query = \App\Models\Dossier::with(['bourse', 'school']);
        if ($request->filled('from')) {
            $query->whereDate('created_at', '>=', $request->from);
        }
        if ($request->filled('to')) {
            $query->whereDate('created_at', '<=', $request->to);
        }
        if ($request->filled('statut')) {
            $query->where('statut', $request->statut);
        }
        if ($request->filled('school_id')) {
            $query->where('school_id', $request->school_id);
        }
        if ($request->filled('bourse_id')) {
            $query->where('bourse_id', $request->bourse_id);
        }
        $dossiers = $query->get();
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="dossiers.csv"',
        ];
        $callback = function () use ($dossiers) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['ID', 'Nom', 'Email', 'Bourse', 'Statut', 'École', 'Filière', 'Date']);
            foreach ($dossiers as $dossier) {
                fputcsv($handle, [
                    $dossier->id,
                    $dossier->nom,
                    $dossier->email,
                    $dossier->bourse ? $dossier->bourse->nom : '',
                    $dossier->statut,
                    $dossier->school ? $dossier->school->nom : '',
                    $dossier->filiere_affectee,
                    $dossier->created_at,
                ]);
            }
            fclose($handle);
        };
        return response()->stream($callback, 200, $headers);
    }
}
