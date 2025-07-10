<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Bourse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BourseController extends Controller
{
    public function index()
    {
        $bourses = Bourse::latest()->paginate(20);
        return Inertia::render('Admin/Bourses', [
            'bourses' => $bourses
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/BoursesCreate');
    }

    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
            'description' => 'nullable|string',
            'montant' => 'nullable|numeric',
            'date_debut' => 'nullable|date',
            'date_fin' => 'nullable|date',
            'ecoles_eligibles' => 'nullable|array',
            'filieres_eligibles' => 'nullable|array',
            'statut' => 'required|string',
        ]);
        Bourse::create($request->all());
        return redirect()->route('admin.bourses.index')->with('success', 'Bourse ajoutée.');
    }

    public function edit($id)
    {
        $bourse = Bourse::findOrFail($id);
        return Inertia::render('Admin/BoursesEdit', [
            'bourse' => $bourse
        ]);
    }

    public function update(Request $request, $id)
    {
        $bourse = Bourse::findOrFail($id);
        $bourse->update($request->all());
        return redirect()->route('admin.bourses.index')->with('success', 'Bourse modifiée.');
    }

    public function destroy($id)
    {
        $bourse = Bourse::findOrFail($id);
        $bourse->delete();
        return redirect()->route('admin.bourses.index')->with('success', 'Bourse supprimée.');
    }

    public function publicList()
    {
        $bourses = \App\Models\Bourse::where('statut', 'actif')
            ->whereDate('date_debut', '<=', now())
            ->whereDate('date_fin', '>=', now())
            ->orderBy('date_debut', 'desc')
            ->get();
        return \Inertia\Inertia::render('Public/BoursesList', [
            'bourses' => $bourses
        ]);
    }

    public function apiShow($id)
    {
        $bourse = Bourse::findOrFail($id);
        // Ajout des champs dynamiques pour le front
        $bourse->diplomes_eligibles = $bourse->diplomes_eligibles ?? ["BAC", "Licence", "Master", "Doctorat"];
        $bourse->ecoles_eligibles = $bourse->ecoles_eligibles ?? [];
        $bourse->filieres_eligibles = $bourse->filieres_eligibles ?? [];
        $bourse->pieces_a_fournir = $bourse->pieces_a_fournir ?? [];
        $bourse->frais_dossier = $bourse->frais_dossier ?? 0;
        return response()->json(['bourse' => $bourse]);
    }

    public function apiList()
    {
        $bourses = Bourse::where('statut', 'actif')
            ->whereDate('date_debut', '<=', now())
            ->whereDate('date_fin', '>=', now())
            ->with(['dossiers'])
            ->orderBy('date_debut', 'desc')
            ->get();
        return response()->json(['bourses' => $bourses]);
    }
}
