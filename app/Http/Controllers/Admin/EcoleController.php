<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Ecole;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EcoleController extends Controller
{
    public function index()
    {
        $ecoles = Ecole::latest()->paginate(20);
        return Inertia::render('Admin/Ecoles', [
            'ecoles' => $ecoles
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/EcolesCreate');
    }

    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
            'ville' => 'nullable|string|max:255',
            'capacite' => 'nullable|integer',
        ]);
        Ecole::create($request->all());
        return redirect()->route('admin.ecoles.index')->with('success', 'École ajoutée.');
    }

    public function edit($id)
    {
        $ecole = Ecole::findOrFail($id);
        return Inertia::render('Admin/EcolesEdit', [
            'ecole' => $ecole
        ]);
    }

    public function update(Request $request, $id)
    {
        $ecole = Ecole::findOrFail($id);
        $ecole->update($request->all());
        return redirect()->route('admin.ecoles.index')->with('success', 'École modifiée.');
    }

    public function destroy($id)
    {
        $ecole = Ecole::findOrFail($id);
        $ecole->delete();
        return redirect()->route('admin.ecoles.index')->with('success', 'École supprimée.');
    }

    // API pour toutes les écoles avec filières
    public function apiList()
    {
        $ecoles = Ecole::with('filieres')->get();
        return response()->json(['ecoles' => $ecoles]);
    }

    public function apiEtablissements()
    {
        // Récupérer toutes les écoles avec leurs filières associées
        $ecoles = Ecole::with('filieres')->get();
        
        // Log pour le débogage
        \Log::info('Récupération des établissements avec filières', [
            'count' => $ecoles->count(),
            'ecoles' => $ecoles->toArray()
        ]);
        
        $etablissements = $ecoles->map(function ($ecole) {
            // Préparer les données de filières pour chaque école
            $filieresData = $ecole->filieres->map(function ($filiere) {
                return [
                    'id' => $filiere->id,
                    'nom' => $filiere->nom,
                    'description' => $filiere->description,
                    'niveau' => $filiere->niveau,
                    'duree' => $filiere->duree,
                    'active' => $filiere->active
                ];
            });
            
            $etablissement = [
                'id' => $ecole->id,
                'nom' => $ecole->nom,
                'type' => $this->convertTypeBourse($ecole->type_bourse),
                'localisation' => $ecole->ville . ($ecole->pays ? ', ' . $ecole->pays : ''),
                'filieres' => $filieresData
            ];
            
            // Log pour chaque établissement
            \Log::info('Établissement traité', [
                'nom' => $ecole->nom,
                'type_bourse' => $ecole->type_bourse,
                'type_converti' => $this->convertTypeBourse($ecole->type_bourse),
                'ville' => $ecole->ville,
                'pays' => $ecole->pays,
                'filieres_count' => $filieresData->count(),
                'filieres' => $filieresData->toArray()
            ]);
            
            return $etablissement;
        });
        
        // Log final avant envoi de la réponse
        \Log::info('Envoi de la liste des établissements', [
            'count' => $etablissements->count(),
            'etablissements' => $etablissements->toArray()
        ]);
        
        return response()->json(['etablissements' => $etablissements]);
    }

    private function convertTypeBourse($type)
    {
        switch ($type) {
            case 'locale':
                return 'local';
            case 'etrangere':
                return 'etranger';
            case 'toutes':
                return 'aide_scolaire';
            default:
                return 'aide_scolaire';
        }
    }
}
