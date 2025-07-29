<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\User;
use App\Models\Etudiant;

class AuthenticatedSessionController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();
        $request->session()->regenerate();

        // Vérifie quel guard est actif
        if (Auth::guard('etudiant')->check()) {
            return redirect()->intended('/etudiant/dashboard');
        }

        if (Auth::guard('web')->check()) {
            $user = Auth::guard('web')->user();

            if ($user->hasRole('admin')) {
                return redirect()->intended('/admin/dashboard');
            }

            if ($user->hasRole('agent')) {
                return redirect()->intended('/agent/dashboard');
            }

            // Par défaut
            return redirect()->intended('/dashboard');
        }

        // Aucun utilisateur trouvé
        Auth::logout();
        return redirect('/login')->withErrors([
            'email' => 'Aucun utilisateur trouvé.',
        ]);
    }

    public function destroy(Request $request): RedirectResponse
    {
        if (Auth::guard('web')->check()) {
            Auth::guard('web')->logout();
        } elseif (Auth::guard('etudiant')->check()) {
            Auth::guard('etudiant')->logout();
        }

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
