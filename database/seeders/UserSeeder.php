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
        // Création des rôles s'ils n'existent pas déjà
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $agentRole = Role::firstOrCreate(['name' => 'agent']);
        $studentRole = Role::firstOrCreate(['name' => 'etudiant']);

        // Création ou mise à jour de l'utilisateur admin
        $admin = User::updateOrCreate(
            ['email' => 'admin@dobas.cg'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('admin1234'),
            ]
        );
        $admin->syncRoles([$adminRole]);

        // Création ou mise à jour de l'agent
        $agent = User::updateOrCreate(
            ['email' => 'agent@dobas.cg'],
            [
                'name' => 'Agent DOBAS',
                'password' => Hash::make('agent1234'),
            ]
        );
        $agent->syncRoles([$agentRole]);


        // Affichage console
        $this->command->info("✨ Comptes de démonstration créés :");
        $this->command->line("🔐 Admin     : admin@dobas.cg     / admin1234");
        $this->command->line("👨‍💼 Agent     : agent@dobas.cg     / agent1234");
    }
}
