<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Database\Seeders\DossierSeeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Création d’un utilisateur de test
        // User::factory()->create([
        //     'name' => 'Super Admin',
        //     'email' => 'admin@dobas.com',
        //     'password' => bcrypt('password'),
        //     'role' => 'admin',
        // ]);

        // Appel du seeder des utilisateurs
        $this->call([
            UserSeeder::class,
        ]);
        // Appel du seeder des dossiers
        $this->call([
            DossierSeeder::class,
        ]);
    }
}
