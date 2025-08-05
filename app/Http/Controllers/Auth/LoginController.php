<?php
namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class LoginController extends Controller
{
    /**
     * Affiche le formulaire de connexion (vue React via Inertia).
     */
    public function showLoginForm()
    {
        return Inertia::render('Auth/Login');
    }

    /**
     * Gère la tentative de connexion de l'utilisateur ou de l'étudiant.
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        // Tentative d'authentification pour les agents/admins (guard 'web')
        if (Auth::guard('web')->attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();
            
            $user = Auth::guard('web')->user();
            
            // Vérifier si l'utilisateur a un rôle valide
            if ($user->hasRole('admin')) {
                return redirect()->intended('/admin/dashboard');
            }
            
            if ($user->hasRole('agent')) {
                return redirect()->intended('/agent/dashboard');
            }
            
            // Si aucun rôle reconnu, déconnecter et retourner une erreur
            Auth::guard('web')->logout();
            return back()->withErrors([
                'email' => 'Aucun rôle valide attribué à ce compte.',
            ]);
        }

        // Tentative d'authentification pour les étudiants (guard 'etudiant')
        if (Auth::guard('etudiant')->attempt($credentials)) {
            $request->session()->regenerate();
            return redirect()->intended('/etudiant/dashboard');
        }

        // Échec total
        return back()->withErrors([
            'email' => 'Identifiants incorrects.',
        ]);
    }

    /**
     * Déconnecte l'utilisateur ou l'étudiant, selon le guard actif.
     */
    public function logout(Request $request)
    {
        // Déconnexion du guard web (utilisateurs)
        if (Auth::guard('web')->check()) {
            Auth::guard('web')->logout();
        }
        
        // Déconnexion du guard étudiant
        if (Auth::guard('etudiant')->check()) {
            Auth::guard('etudiant')->logout();
        }

        $request->session()->invalidate();
        $request->session()->regenerateToken();
        
        return redirect('/login');
    }
}