<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    // Affiche la liste des utilisateurs
    public function index(): Response
    {
        $users = User::with('roles')->get();
        $roles = Role::all();
        
        return Inertia::render('Admin/Utilisateurs', [
            'users' => $users,
            'roles' => $roles,
        ]);
    }

    // Ajoute un utilisateur avec un rôle
    public function store(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8'],
            'role' => ['required', 'exists:roles,name'],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $user->assignRole($request->role);

        \App\Services\ActivityLogger::log(
            'create_user',
            User::class,
            $user->id,
            "Création de l'utilisateur {$user->name} ({$user->email}) avec le rôle {$request->role}"
        );

        return redirect()->back()->with('success', 'Utilisateur créé avec succès.');
    }

    // Met à jour un utilisateur et son rôle
    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'role' => ['required', 'exists:roles,name'],
        ]);

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
        ]);
        $user->syncRoles([$request->role]);

        \App\Services\ActivityLogger::log(
            'update_user',
            User::class,
            $user->id,
            "Mise à jour de l'utilisateur {$user->name} ({$user->email}) avec le rôle {$request->role}"
        );

        return redirect()->back()->with('success', 'Utilisateur mis à jour.');
    }

    // Supprime un utilisateur
    public function destroy(User $user)
    {
        $userName = $user->name;
        $userEmail = $user->email;
        $userId = $user->id;
        $user->delete();

        \App\Services\ActivityLogger::log(
            'delete_user',
            User::class,
            $userId,
            "Suppression de l'utilisateur $userName ($userEmail)"
        );

        return redirect()->back()->with('success', 'Utilisateur supprimé.');
    }

    // Affecte ou change le rôle d’un utilisateur uniquement
    public function assignRole(Request $request, User $user)
    {
        $request->validate([
            'role' => ['required', 'exists:roles,name'],
        ]);

        $user->syncRoles([$request->role]);

        \App\Services\ActivityLogger::log(
            'assign_role',
            User::class,
            $user->id,
            "Changement de rôle de l'utilisateur {$user->name} ({$user->email}) en {$request->role}"
        );

        return redirect()->back()->with('success', 'Rôle mis à jour.');
    }
}
