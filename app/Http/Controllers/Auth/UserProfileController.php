<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class UserProfileController extends Controller
{
    public function edit()
    {
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
            return redirect('/login');
        }
        
        return Inertia::render('Profile/Edit', [
            'user' => $user,
            'guard' => $guard
        ]);
    }
    
    public function update(Request $request)
    {
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
            return redirect('/login');
        }
        
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,'.$user->id.',id|unique:etudiants,email,'.$user->id.',id'],
            'telephone' => ['nullable', 'string', 'max:20'],
        ]);
        
        $user->update($validated);
        
        return back()->with('success', 'Profil mis à jour avec succès.');
    }
}