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
        // Vérifier si l'utilisateur est connecté avec le guard web
        if (Auth::guard('web')->check()) {
            $user = Auth::guard('web')->user();
            
            if (!$user || !method_exists($user, 'hasRole') || !$user->hasRole($role)) {
                abort(403, 'Accès non autorisé.');
            }
            
            return $next($request);
        }
        
        // Pour les étudiants, on vérifie s'ils ont le rôle "etudiant"
        if (Auth::guard('etudiant')->check()) {
            if ($role !== 'etudiant') {
                abort(403, 'Accès non autorisé.');
            }
            
            return $next($request);
        }
        
        // Si non connecté ou rôle incorrect
        abort(403, 'Accès non autorisé.');
    }
}