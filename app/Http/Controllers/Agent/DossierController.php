<?php

namespace App\Http\Controllers\Agent;

use App\Http\Controllers\Controller;
use App\Models\Dossier;
use App\Models\User;
use App\Notifications\NouvelleCandidatureNotification;
use App\Notifications\DossierValideNotification;
use App\Notifications\DossierRejeteNotification;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DossierController extends Controller
{
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
        $schools = \App\Models\School::all()->map(function($school) {
            $school->placesRestantes = $school->placesRestantes();
            return $school;
        });
        \App\Services\ActivityLogger::log(
            'view_dossier_details',
            Dossier::class,
            $dossier->id,
            "Consultation du dossier #{$dossier->id} ({$dossier->nom}) par un agent"
        );
        return \Inertia\Inertia::render('Agent/DossierDetails', [
            'dossier' => $dossier,
            'schools' => $schools
        ]);
    }

    public function create()
    {
        $schools = \App\Models\School::all();
        $bourses = \App\Models\Bourse::where('statut', 'actif')
            ->whereDate('date_debut', '<=', now())
            ->whereDate('date_fin', '>=', now())
            ->get();
        return \Inertia\Inertia::render('Student/DossierCreate', [
            'schools' => $schools,
            'bourses' => $bourses,
        ]);
    }

    // Création d'un dossier par un étudiant (POST /etudiant/dossiers)
    public function store(Request $request)
    {
        // Empêcher la double candidature sur la même période (ex: année en cours)
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

        // Notifier tous les agents en charge des candidatures
        $agents = User::role('agent')->get();
        foreach ($agents as $agent) {
            $agent->notify(new NouvelleCandidatureNotification());
        }
        // Notifier aussi le système (ex: admin principal)
        $admins = User::role('admin')->get();
        foreach ($admins as $admin) {
            $admin->notify(new NouvelleCandidatureNotification());
        }

        \App\Services\ActivityLogger::log(
            'create_dossier',
            Dossier::class,
            $dossier->id,
            "Nouvelle candidature créée par {$request->nom} ({$request->email}) pour la bourse ID {$request->bourse_id}"
        );

        return redirect()->back()->with('success', 'Votre candidature a bien été enregistrée !');
    }

    // Validation d'un dossier par un agent (exemple)
    public function valider($id)
    {
        $dossier = Dossier::findOrFail($id);
        $dossier->statut = 'validé';
        $dossier->save();

        // Notifier l'étudiant concerné
        $user = User::where('email', $dossier->email)->first();
        if ($user) {
            // Si le dossier a une affectation, notification personnalisée, sinon notification simple
            if ($dossier->school_id && $dossier->filiere_affectee) {
                $school = \App\Models\School::find($dossier->school_id);
                $user->notify(new DossierValideNotification($school ? $school->nom : '', $dossier->filiere_affectee));
            } else {
                $user->notify(new DossierValideNotification(null, null));
            }
        }

        // Notifier les admins
        $admins = User::role('admin')->get();
        foreach ($admins as $admin) {
            if ($dossier->school_id && $dossier->filiere_affectee) {
                $school = \App\Models\School::find($dossier->school_id);
                $admin->notify(new DossierValideNotification($school ? $school->nom : '', $dossier->filiere_affectee));
            } else {
                $admin->notify(new DossierValideNotification(null, null));
            }
        }

        \App\Services\ActivityLogger::log(
            'validate_dossier',
            Dossier::class,
            $dossier->id,
            "Dossier #{$dossier->id} validé par un agent."
        );

        return redirect()->back()->with('success', 'Dossier validé et notifications envoyées.');
    }

    // Rejet d'un dossier par un agent (exemple)
    public function rejeter($id, Request $request)
    {
        $dossier = Dossier::findOrFail($id);
        $dossier->statut = 'rejeté';
        $dossier->save();
        // Notifier l'étudiant concerné
        $user = \App\Models\User::where('email', $dossier->email)->first();
        if ($user) {
            $motif = $request->motif ?? null;
            $user->notify(new \App\Notifications\DossierRejeteNotification($motif));
        }
        // Notifier les admins
        $admins = \App\Models\User::role('admin')->get();
        foreach ($admins as $admin) {
            $admin->notify(new \App\Notifications\DossierRejeteNotification($motif));
        }
        \App\Services\ActivityLogger::log(
            'reject_dossier',
            Dossier::class,
            $dossier->id,
            "Dossier #{$dossier->id} rejeté par un agent."
        );

        return redirect()->back()->with('success', 'Dossier rejeté et notifications envoyées.');
    }

    public function affecter(Request $request, $id)
    {
        $dossier = Dossier::findOrFail($id);
        $school = \App\Models\School::findOrFail($request->school_id);
        if ($school->placesRestantes() <= 0) {
            return back()->withErrors(['school_id' => "Plus de places disponibles dans cette école."]);
        }
        $dossier->school_id = $school->id;
        $dossier->filiere_affectee = $request->filiere;
        $dossier->statut = 'accepté';
        $dossier->save();
        // Notification à l'étudiant
        $user = \App\Models\User::where('email', $dossier->email)->first();
        if ($user) {
            $user->notify(new \App\Notifications\DossierValideNotification($school->nom, $request->filiere));
        }
        // Notification aux admins
        $admins = \App\Models\User::role('admin')->get();
        foreach ($admins as $admin) {
            $admin->notify(new \App\Notifications\DossierValideNotification($school->nom, $request->filiere));
        }
        \App\Services\ActivityLogger::log(
            'affect_dossier',
            Dossier::class,
            $dossier->id,
            "Affectation du dossier #{$dossier->id} à l'école #{$school->id} ({$school->nom}) par un agent."
        );
        return back()->with('success', 'Dossier affecté à l\'école et notification envoyée.');
    }

    // Soumission finale d'un dossier public après paiement validé
    public function publicStore(Request $request)
    {
        // Validation stricte
        $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'date_naissance' => 'required|date',
            'lieu_naissance' => 'required|string',
            'adresse' => 'required|string',
            'telephone' => 'required|string',
            'email' => 'required|email',
            'bourse_id' => 'required|exists:bourses,id',
            'diplome' => 'required|string',
            'ecole' => 'required|string',
            'filiere' => 'required|string',
            // Ajoutez ici la validation des fichiers uploadés si besoin
        ]);
        // Création du dossier
        $dossier = Dossier::create([
            'nom' => $request->nom,
            'prenom' => $request->prenom,
            'date_naissance' => $request->date_naissance,
            'lieu_naissance' => $request->lieu_naissance,
            'adresse' => $request->adresse,
            'telephone' => $request->telephone,
            'email' => $request->email,
            'bourse_id' => $request->bourse_id,
            'diplome' => $request->diplome,
            'ecole' => $request->ecole,
            'filiere' => $request->filiere,
            'statut' => 'en attente',
        ]);
        // Notifier agents/admins
        $agents = User::role('agent')->get();
        foreach ($agents as $agent) {
            $agent->notify(new NouvelleCandidatureNotification());
        }
        $admins = User::role('admin')->get();
        foreach ($admins as $admin) {
            $admin->notify(new NouvelleCandidatureNotification());
        }
        // Notifier l'étudiant (email)
        // ...
        return response()->json(['success' => true, 'message' => 'Votre dossier a bien été soumis.']);
    }
}

