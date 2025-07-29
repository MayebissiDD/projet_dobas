<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Etudiant;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Affiche la vue d'inscription
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Gère l'inscription d'un agent ou d'un étudiant
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'email',
                'max:255',
                'unique:users,email',
                'unique:etudiants,email',
            ],
            'password' => ['required', 'confirmed', Password::defaults()],
            'role' => ['required', 'in:agent,etudiant'],
        ]);

        if ($request->role === 'etudiant') {
            // ➤ Création d'un étudiant
            $etudiant = Etudiant::create([
                'nom' => $request->name,
                'prenom' => '', // à adapter si tu ajoutes le champ
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);

            // ➤ Connexion via le guard 'etudiant'
            Auth::guard('etudiant')->login($etudiant);

            return redirect()->intended('/etudiant/dashboard');
        }

        // ➤ Création d'un agent dans la table users
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // ➤ Attribution du rôle (ici 'agent')
        $user->assignRole($request->role); // si Spatie est bien utilisé

        // ➤ Déclenchement de l'événement d'inscription
        event(new Registered($user));

        // ➤ Connexion via le guard par défaut
        Auth::login($user);

        // ➤ Redirection selon le rôle (par défaut : admin ou agent)
        return redirect()->intended(
            $request->role === 'agent' ? '/agent/dashboard' : '/admin/dashboard'
        );
    }
}
