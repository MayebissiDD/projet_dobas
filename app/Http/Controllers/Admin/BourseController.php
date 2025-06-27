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
        return response()->json(['bourse' => $bourse]);
    }
}
