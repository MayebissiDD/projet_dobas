<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Etudiant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class RegisteredUserController extends Controller
{
    public function create()
    {
        return inertia('Auth/Register');
    }
    
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users|unique:etudiants,email',
            'password' => 'required|string|min:8|confirmed',
            'user_type' => 'required|in:web,etudiant',
        ]);
        
        if ($validated['user_type'] === 'etudiant') {
            $user = Etudiant::create([
                'nom' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
            ]);
            
            Auth::guard('etudiant')->login($user);
            
            return redirect('/etudiant/dashboard');
        } else {
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
            ]);
            
            Auth::guard('web')->login($user);
            
            return redirect('/dashboard');
        }
    }
}