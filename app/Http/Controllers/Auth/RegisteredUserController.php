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
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Affiche la vue d’enregistrement
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Enregistre un nouvel utilisateur (agent ou étudiant)
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email|unique:etudiants,email',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => ['required', 'in:agent,etudiant'],
        ]);

        if ($request->role === 'etudiant') {
            // ✅ Enregistrement dans la table "etudiants"
            $etudiant = Etudiant::create([
                'nom' => $request->name,
                'prenom' => '',
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);

            Auth::guard('etudiant')->login($etudiant);
            return redirect()->intended('/etudiant/dashboard');
        }

        // ✅ Enregistrement dans la table "users" (agent)
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $user->assignRole($request->role);

        event(new Registered($user));

        Auth::login($user);

        return redirect()->intended(
            $request->role === 'agent' ? '/agent/dashboard' : '/admin/dashboard'
        );
    }
}
