<?php
namespace App\Http\Controllers\Agent;

use App\Http\Controllers\Controller;
use App\Models\Dossier;
use App\Models\Ecole;
use App\Models\Bourse;
use App\Models\Filiere;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class DossierListController extends Controller
{
    public function index(Request $request)
    {
        $query = Dossier::query()->with(['bourse', 'etudiant', 'ecole', 'filiere']);
        
        if ($request->filled('statut')) {
            $query->where('statut', $request->statut);
        }
        
        if ($request->filled('bourse_id')) {
            $query->where('bourse_id', $request->bourse_id);
        }
        
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->whereHas('etudiant', function($q) use ($search) {
                    $q->where('nom', 'like', "%{$search}%")
                      ->orWhere('prenom', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                })
                ->orWhere('numero_dossier', 'like', "%{$search}%")
                ->orWhere('nom', 'like', "%{$search}%")
                ->orWhere('prenom', 'like', "%{$search}%");
            });
        }
        
        $dossiers = $query->latest()->paginate(10)->appends($request->query());
        $bourses = Bourse::orderBy('nom')->get(['id', 'nom']);
        
        $stats = [
            'total' => Dossier::count(),
            'soumis' => Dossier::where('statut', 'soumis')->count(),
            'en_attente' => Dossier::where('statut', 'en_attente')->count(),
            'en_cours' => Dossier::where('statut', 'en_cours')->count(),
            'accepte' => Dossier::where('statut', 'accepte')->count(),
            'valide' => Dossier::where('statut', 'valide')->count(),
            'rejete' => Dossier::where('statut', 'rejete')->count(),
            'incomplet' => Dossier::where('statut', 'incomplet')->count(),
            'reoriente' => Dossier::where('statut', 'reoriente')->count(),
        ];
        
        \App\Services\ActivityLogger::log(
            'view_dossier_list',
            Dossier::class,
            null,
            'Consultation de la liste des dossiers par un agent'
        );
        
        return Inertia::render('Agent/DossierList', [
            'dossiers' => $dossiers,
            'bourses' => $bourses,
            'stats' => $stats,
            'filters' => [
                'statut' => $request->statut,
                'bourse_id' => $request->bourse_id,
                'search' => $request->search,
            ],
        ]);
    }
    
    public function show($id)
    {
        // Charger l'historique avec la relation modifiePar
        $dossier = Dossier::with([
            'bourse', 
            'etudiant', 
            'ecole', 
            'filiere', 
            'pieces', 
            'historique.modifiePar', // Charger la relation modifiePar
            'commentaires'
        ])->findOrFail($id);
        
        if (!Gate::allows('view', $dossier)) {
            abort(403, 'Accès non autorisé');
        }
        
        $ecoles = Ecole::all()->map(function ($ecole) {
            $ecole->placesRestantes = $ecole->capacite - $ecole->dossiers()->count();
            return $ecole;
        });
        
        $bourses = Bourse::orderBy('nom')->get();
        $filieres = Filiere::orderBy('nom')->get();
        
        \App\Services\ActivityLogger::log(
            'view_dossier_details',
            Dossier::class,
            $dossier->id,
            "Consultation du dossier #{$dossier->id} par un agent"
        );
        
        return Inertia::render('Agent/DossierDetails', [
            'dossier' => $dossier,
            'ecoles' => $ecoles,
            'bourses' => $bourses,
            'filieres' => $filieres,
        ]);
    }
    
    public function apiList()
    {
        $dossiers = Dossier::with(['bourse', 'etudiant', 'ecole', 'filiere'])->latest()->paginate(20);
        return response()->json(['dossiers' => $dossiers]);
    }
}