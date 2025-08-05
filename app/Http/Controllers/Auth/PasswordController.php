<?php
namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Facades\Auth;

class PasswordController extends Controller
{
    /**
     * Met à jour le mot de passe de l'utilisateur connecté (étudiant ou agent/admin).
     */
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', Password::defaults(), 'confirmed'],
        ]);

        // Récupérer l'utilisateur connecté selon le guard actif
        $user = null;
        $guard = null;
        
        if (Auth::guard('web')->check()) {
            $user = Auth::guard('web')->user();
            $guard = 'web';
        } elseif (Auth::guard('etudiant')->check()) {
            $user = Auth::guard('etudiant')->user();
            $guard = 'etudiant';
        }
        
        if (!$user) {
            return back()->withErrors(['current_password' => 'Utilisateur non authentifié.']);
        }

        // Vérifier le mot de passe actuel
        if (!Hash::check($validated['current_password'], $user->password)) {
            return back()->withErrors(['current_password' => 'Le mot de passe actuel est incorrect.']);
        }

        // Mettre à jour le mot de passe
        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        return back()->with('status', 'Mot de passe mis à jour avec succès.');
    }
}