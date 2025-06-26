<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function edit()
    {
        return Inertia::render('Profile/Edit');
    }

    public function update(Request $request)
    {
        // logiques de mise à jour à ajouter
        \App\Services\ActivityLogger::log(
            'update_profile',
            null,
            null,
            'Mise à jour du profil utilisateur'
        );
        return redirect()->back()->with('success', 'Profil mis à jour.');
    }

    public function destroy(Request $request)
    {
        // logiques de suppression à ajouter
        \App\Services\ActivityLogger::log(
            'delete_profile',
            null,
            null,
            'Suppression du profil utilisateur'
        );
        return redirect('/')->with('success', 'Profil supprimé.');
    }
}
