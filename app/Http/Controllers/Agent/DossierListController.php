<?php

namespace App\Http\Controllers\Agent;

use App\Http\Controllers\Controller;
use App\Models\Dossier;
use App\Models\Ecole;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class DossierListController extends Controller
{
    use AuthorizesRequests;

    public function index(Request $request)
    {
        $query = Dossier::query()->with('bourse');

        if ($request->filled('statut')) {
            $query->where('statut', $request->statut);
        }

        if ($request->filled('bourse_id')) {
            $query->where('bourse_id', $request->bourse_id);
        }

        $dossiers = $query->latest()->paginate(10);
        $bourses = \App\Models\Bourse::orderBy('nom')->get(['id', 'nom']);

        \App\Services\ActivityLogger::log(
            'view_dossier_list',
            Dossier::class,
            null,
            'Consultation de la liste des dossiers par un agent'
        );

        return Inertia::render('Agent/DossierList', [
            'dossiers' => $dossiers,
            'bourses' => $bourses,
            'filters' => [
                'statut' => $request->statut,
                'bourse_id' => $request->bourse_id,
            ],
        ]);
    }

    public function show($id)
    {
        $dossier = Dossier::findOrFail($id);
        $this->authorize('view', $dossier);

        $ecoles = Ecole::all()->map(function ($ecole) {
            $ecole->placesRestantes = $ecole->capacite - $ecole->dossiers()->count();
            return $ecole;
        });

        \App\Services\ActivityLogger::log(
            'view_dossier_details',
            Dossier::class,
            $dossier->id,
            "Consultation du dossier #{$dossier->id} ({$dossier->nom}) par un agent"
        );

        return Inertia::render('Agent/DossierDetails', [
            'dossier' => $dossier,
            'ecoles' => $ecoles,
        ]);
    }

    public function apiList()
    {
        $dossiers = Dossier::with(['bourse', 'user'])->latest()->paginate(20);
        return response()->json(['dossiers' => $dossiers]);
    }
}
