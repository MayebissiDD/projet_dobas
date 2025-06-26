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
        // Crée les rôles si pas déjà faits
        Role::firstOrCreate(['name' => 'admin']);
        Role::firstOrCreate(['name' => 'agent']);
        Role::firstOrCreate(['name' => 'etudiant']);

        // Admin
        $admin = User::create([
            'name' => 'Super Admin',
            'email' => 'admin@dobas.cg',
            'password' => Hash::make('admin1234'),
        ]);
        $admin->assignRole('admin');

        // Agent
        $agent = User::create([
            'name' => 'Agent DOBAS',
            'email' => 'agent@dobas.cg',
            'password' => Hash::make('agent1234'),
        ]);
        $agent->assignRole('agent');

        // Étudiants
        for ($i = 1; $i <= 5; $i++) {
            $student = User::create([
                'name' => "Etudiant $i",
                'email' => "etudiant$i@dobas.cg",
                'password' => Hash::make('etudiant1234'),
            ]);
            $student->assignRole('etudiant');
        }

        // Affichage console pour la démo
        echo "\n[DEMO] Connexions de test :\n";
        echo "Admin    : admin@dobas.cg / admin1234\n";
        echo "Agent    : agent@dobas.cg / agent1234\n";
        echo "Etudiant : etudiant1@dobas.cg / etudiant1234\n";
    }
}
