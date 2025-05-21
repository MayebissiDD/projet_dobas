<?php

namespace App\Http\Controllers\Agent;

use App\Http\Controllers\Controller;
use App\Models\Dossier;
use Inertia\Inertia;

class DossierController extends Controller
{
    public function index()
    {
        $dossiers = Dossier::latest()->paginate(10); // Tu peux filtrer ici aussi
        return Inertia::render('Agent/DossierList', [
            'dossiers' => $dossiers
        ]);
    }

    public function show($id)
    {
        $dossier = Dossier::findOrFail($id);
        return Inertia::render('Agent/DossierDetails', [
            'dossier' => $dossier
        ]);
    }
}

