<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        $user = Auth::user();
        if (!$user || !method_exists($user, 'hasRole')) {
            abort(403, 'Accès non autorisé.');
        }
        /** @var \App\Models\User $user */
        if (!$user->hasRole($role)) {
            abort(403, 'Accès non autorisé.');
        }
        return $next($request);
    }
}
