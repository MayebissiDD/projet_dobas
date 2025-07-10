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
}
