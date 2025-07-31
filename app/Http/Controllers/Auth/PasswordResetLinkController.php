<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Inertia\Inertia;

class PasswordResetLinkController extends Controller
{
    /**
     * Affiche le formulaire pour demander un lien de réinitialisation.
     */
    public function create()
    {
        return Inertia::render('Auth/ForgotPassword');
    }

    /**
     * Envoie le lien de réinitialisation après avoir détecté l'utilisateur.
     */
    public function store(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        // Détection du broker selon l'email
        $broker = $this->getPasswordBroker($request->email);

        $status = Password::broker($broker)->sendResetLink(
            $request->only('email')
        );

        return back()->with('status', __($status));
    }

    /**
     * Retourne le broker approprié selon l'existence de l'email.
     */
    private function getPasswordBroker(string $email): string
    {
        if (\App\Models\Etudiant::where('email', $email)->exists()) {
            return 'etudiants';
        }

        return 'users';
    }
}
