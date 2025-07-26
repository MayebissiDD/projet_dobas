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

        $guard = Auth::getDefaultDriver();
        $user = Auth::user();

        // 🎯 Redirection selon le guard
        if ($guard === 'etudiant' || $user instanceof \App\Models\Etudiant) {
            return redirect()->intended('/etudiant/dashboard');
        }

        if ($user instanceof User) {
            if ($user->hasRole('admin')) {
                return redirect()->intended('/admin/dashboard');
            }

            if ($user->hasRole('agent')) {
                return redirect()->intended('/agent/dashboard');
            }
        }

        // 🔒 Si aucun rôle valide trouvé
        Auth::logout();
        return redirect('/login')->withErrors([
            'email' => 'Rôle utilisateur invalide.',
        ]);
    }

    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
