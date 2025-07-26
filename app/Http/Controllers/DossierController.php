<?php

namespace App\Http\Controllers\Etudiant;

use App\Http\Controllers\Controller;
use App\Models\Dossier;
use App\Models\User;
use App\Models\Ecole;
use App\Models\Bourse;
use App\Notifications\NouvelleCandidatureNotification;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DossierController extends Controller
{
    public function create()
    {
        $ecoles = Ecole::all();
        $bourses = Bourse::where('statut', 'actif')
            ->whereDate('date_debut', '<=', now())
            ->whereDate('date_fin', '>=', now())
            ->get();

        return Inertia::render('Student/DossierCreate', [
            'ecoles' => $ecoles,
            'bourses' => $bourses,
        ]);
    }

    public function store(Request $request)
    {
        // Empêcher la double candidature la même année
        $existe = Dossier::where('email', $request->email)
            ->whereYear('created_at', now()->year)
            ->exists();

        if ($existe) {
            return back()->withErrors(['email' => 'Vous avez déjà candidaté pour cette période.']);
        }

        $request->validate([
            'nom' => 'required|string|max:255',
            'email' => 'required|email',
            'bourse_id' => 'required|exists:bourses,id',
            'statut' => 'required|string|max:50',
        ]);

        $dossier = Dossier::create([
            'nom' => $request->nom,
            'email' => $request->email,
            'bourse_id' => $request->bourse_id,
            'statut' => $request->statut,
        ]);

        // Notifications
        $agents = User::role('agent')->get();
        $admins = User::role('admin')->get();

        foreach ($agents->merge($admins) as $user) {
            $user->notify(new NouvelleCandidatureNotification());
        }

        \App\Services\ActivityLogger::log(
            'create_dossier',
            Dossier::class,
            $dossier->id,
            "Nouvelle candidature créée par {$request->nom} ({$request->email}) pour la bourse ID {$request->bourse_id}"
        );

        return redirect()->back()->with('success', 'Votre candidature a bien été enregistrée !');
    }
}
