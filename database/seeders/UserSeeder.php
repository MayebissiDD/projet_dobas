<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Vérifie que les rôles existent
        foreach (['admin', 'agent', 'etudiant'] as $role) {
            Role::firstOrCreate(['name' => $role]);
        }

        // Admin
        $admin = User::firstOrCreate(
            ['email' => 'admin@dobas.cg'],
            [
                'name' => 'Admin Test',
                'password' => Hash::make('password'),
            ]
        );
        $admin->syncRoles(['admin']);

        // Agent
        $agent = User::firstOrCreate(
            ['email' => 'agent@dobas.cg'],
            [
                'name' => 'Agent Test',
                'password' => Hash::make('password'),
            ]
        );
        $agent->syncRoles(['agent']);

        // Étudiant
        $etudiant = User::firstOrCreate(
            ['email' => 'etudiant@dobas.cg'],
            [
                'name' => 'Etudiant Test',
                'password' => Hash::make('password'),
            ]
        );
        $etudiant->syncRoles(['etudiant']);
    }
}
