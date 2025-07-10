<?php

namespace App\Http\Controllers;

use App\Models\Dossier;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DossierController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $dossiers = Dossier::with(['bourse', 'user', 'pieces.piece'])->latest()->paginate(20);
        return Inertia::render('Admin/Dossiers', ['dossiers' => $dossiers]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/DossierCreate');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required',
            'description' => 'required',
        ]);

        Dossier::create($request->all());

        return redirect()->route('admin.dossiers')->with('success', 'Dossier créé avec succès.');
    }

    /**
     * Display the specified resource.
     */
    public function show($id): Response
    {
        $dossier = Dossier::with(['bourse', 'user', 'pieces.piece'])->findOrFail($id);
        $this->authorize('view', $dossier);
        return Inertia::render('Admin/DossierShow', ['dossier' => $dossier]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id): Response
    {
        $dossier = Dossier::findOrFail($id);
        return Inertia::render('Admin/DossierEdit', ['dossier' => $dossier]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'required',
            'description' => 'required',
        ]);

        $dossier = Dossier::findOrFail($id);
        $dossier->update($request->all());

        return redirect()->route('admin.dossiers')->with('success', 'Dossier modifié avec succès.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        Dossier::destroy($id);
        return redirect()->route('admin.dossiers')->with('success', 'Dossier supprimé avec succès.');
    }

    /**
     * Display a listing of the resource for API.
     */
    public function apiList()
    {
        $dossiers = Dossier::with(['bourse', 'user', 'pieces.piece'])->latest()->paginate(20);

        return response()->json(['dossiers' => $dossiers]);
    }
}