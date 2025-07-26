<?php

namespace App\Http\Controllers\Agent;

use App\Http\Controllers\Controller;
use App\Models\Dossier;
use App\Models\User;
use App\Models\Ecole;
use App\Notifications\NouvelleCandidatureNotification;
use App\Notifications\DossierValideNotification;
use App\Notifications\DossierRejeteNotification;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class DossierController extends Controller
{
    use AuthorizesRequests;

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
        $this->authorize('view', $dossier);

        $ecoles = Ecole::all()->map(function ($ecole) {
            $ecole->placesRestantes = $ecole->capacite - $ecole->dossiers()->count();
            return $ecole;
        });

        \App\Services\ActivityLogger::log(
            'view_dossier_details',
            Dossier::class,
            $dossier->id,
            "Consultation du dossier #{$dossier->id} ({$dossier->nom}) par un agent"
        );

        return Inertia::render('Agent/DossierDetails', [
            'dossier' => $dossier,
            'ecoles' => $ecoles,
        ]);
    }

    public function valider($id)
    {
        $dossier = Dossier::findOrFail($id);
        $dossier->statut = 'validé';
        $dossier->save();

        // Notification étudiant
        $user = User::where('email', $dossier->email)->first();
        if ($user) {
            $user->notify(new DossierValideNotification(
                optional($dossier->ecole)->nom,
                $dossier->filiere_affectee
            ));
        } elseif ($dossier->etudiant_id) {
            $etudiant = \App\Models\Etudiant::find($dossier->etudiant_id);
            if ($etudiant) {
                $etudiant->notify(new DossierValideNotification(
                    optional($dossier->ecole)->nom,
                    $dossier->filiere_affectee
                ));
            }
        }

        // Notification admins
        $admins = User::role('admin')->get();
        foreach ($admins as $admin) {
            $admin->notify(new DossierValideNotification(
                optional($dossier->ecole)->nom,
                $dossier->filiere_affectee
            ));
        }

        \App\Services\ActivityLogger::log(
            'validate_dossier',
            Dossier::class,
            $dossier->id,
            "Dossier #{$dossier->id} validé par un agent."
        );

        return back()->with('success', 'Dossier validé et notifications envoyées.');
    }

    public function rejeter($id, Request $request)
    {
        $dossier = Dossier::findOrFail($id);
        $dossier->statut = 'rejeté';
        $dossier->save();

        $motif = $request->motif ?? null;

        // Notification étudiant
        $user = User::where('email', $dossier->email)->first();
        if ($user) {
            $user->notify(new DossierRejeteNotification($motif));
        }

        // Notification admins
        $admins = User::role('admin')->get();
        foreach ($admins as $admin) {
            $admin->notify(new DossierRejeteNotification($motif));
        }

        \App\Services\ActivityLogger::log(
            'reject_dossier',
            Dossier::class,
            $dossier->id,
            "Dossier #{$dossier->id} rejeté par un agent."
        );

        return back()->with('success', 'Dossier rejeté et notifications envoyées.');
    }

    public function affecter(Request $request, $id)
    {
        $dossier = Dossier::findOrFail($id);
        $ecole = Ecole::findOrFail($request->ecole_id);

        if ($ecole->capacite - $ecole->dossiers()->count() <= 0) {
            return back()->withErrors(['ecole_id' => "Plus de places disponibles dans cette école."]);
        }

        $dossier->ecole_id = $ecole->id;
        $dossier->filiere_affectee = $request->filiere;
        $dossier->statut = 'accepté';
        $dossier->save();

        // Notifications
        $user = User::where('email', $dossier->email)->first();
        if ($user) {
            $user->notify(new DossierValideNotification($ecole->nom, $request->filiere));
        }

        $admins = User::role('admin')->get();
        foreach ($admins as $admin) {
            $admin->notify(new DossierValideNotification($ecole->nom, $request->filiere));
        }

        \App\Services\ActivityLogger::log(
            'affect_dossier',
            Dossier::class,
            $dossier->id,
            "Affectation du dossier #{$dossier->id} à l'école #{$ecole->id} ({$ecole->nom}) par un agent."
        );

        return back()->with('success', 'Dossier affecté à l\'école et notification envoyée.');
    }

    public function apiList()
    {
        $dossiers = Dossier::with(['bourse', 'user'])->latest()->paginate(20);
        return response()->json(['dossiers' => $dossiers]);
    }
}
