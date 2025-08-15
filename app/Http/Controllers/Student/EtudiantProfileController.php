<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class EtudiantProfileController extends Controller
{
    // Affiche le formulaire d'édition du profil étudiant
    public function edit()
    {
        $etudiant = Auth::guard('etudiant')->user();
        if (!$etudiant) {
            return redirect('/login');
        }
        return Inertia::render('Profile/Edit', [
            'user' => $etudiant,
            'guard' => 'etudiant',
        ]);
    }

    // Met à jour les informations du profil étudiant
    public function update(Request $request)
    {
        $etudiant = Auth::guard('etudiant')->user();
        if (!$etudiant) {
            return redirect('/login');
        }
        $validated = $request->validate([
            'nom' => ['required', 'string', 'max:255'],
            'prenom' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:etudiants,email,' . $etudiant->id],
            'telephone' => ['nullable', 'string', 'max:20'],
        ]);
        // Si la méthode update existe, on l'utilise, sinon on assigne manuellement
        if (method_exists($etudiant, 'update')) {
            $etudiant->update($validated);
        } else {
            foreach ($validated as $key => $value) {
                $etudiant->$key = $value;
            }
            $etudiant->save();
        }
        return back()->with('success', 'Profil mis à jour avec succès.');
    }

    // Met à jour le mot de passe de l'étudiant
    public function updatePassword(Request $request)
    {
        $etudiant = Auth::guard('etudiant')->user();
        if (!$etudiant) {
            return redirect('/login');
        }
        $validated = $request->validate([
            'current_password' => ['required', 'current_password:etudiant'],
            'password' => ['required', Password::defaults(), 'confirmed'],
        ]);
        if (!Hash::check($validated['current_password'], $etudiant->password)) {
            return back()->withErrors(['current_password' => 'Le mot de passe actuel est incorrect.']);
        }
        if (method_exists($etudiant, 'update')) {
            $etudiant->update([
                'password' => Hash::make($validated['password']),
            ]);
        } else {
            $etudiant->password = Hash::make($validated['password']);
            $etudiant->save();
        }
        return back()->with('status', 'Mot de passe mis à jour avec succès.');
    }
}
