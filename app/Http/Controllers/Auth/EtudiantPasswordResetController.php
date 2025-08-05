<?php
namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\View\View;

class EtudiantPasswordResetController extends Controller
{
    /**
     * Affiche le formulaire pour demander un lien de réinitialisation pour les étudiants.
     */
    public function create(): View
    {
        return view('etudiant.auth.forgot-password');
    }

    /**
     * Envoie le lien de réinitialisation pour les étudiants.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        // Nous utiliserons le broker "etudiants" pour les étudiants
        $status = Password::broker('etudiants')->sendResetLink(
            $request->only('email')
        );

        return $status === Password::RESET_LINK_SENT
            ? back()->with(['status' => __($status)])
            : back()->with(['email' => __($status)]);
    }
}