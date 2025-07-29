<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RedirectIfAuthenticated
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string[]  ...$guards
     * @return mixed
     */
    public function handle(Request $request, Closure $next, ...$guards)
    {
        $guards = empty($guards) ? [null] : $guards;

        foreach ($guards as $guard) {
            if (Auth::guard($guard)->check()) {
                $user = Auth::guard($guard)->user();

                // Rediriger les étudiants vers leur dashboard
                if ($guard === 'etudiant') {
                    return redirect()->route('etudiant.dashboard'); // meilleure pratique que '/etudiant/dashboard'
                }

                // Rediriger selon le rôle pour les utilisateurs "web"
                if ($user && method_exists($user, 'hasRole')) {
                    if ($user->hasRole('admin')) {
                        return redirect()->route('admin.dashboard');
                    }

                    if ($user->hasRole('agent')) {
                        return redirect()->route('agent.dashboard');
                    }
                }

                // Si l'utilisateur est connecté mais n'a pas de rôle
                return redirect()->route('dashboard'); // une route de fallback générale
            }
        }

        return $next($request);
    }
}
