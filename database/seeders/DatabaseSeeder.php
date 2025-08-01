<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Database\Seeders\RolepermissionSeeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        
        // Appel du seeder des utilisateurs
        $this->call([
            UserSeeder::class,
            RolepermissionSeeder::class,
            EcoleSeeder::class,
            BourseSeeder::class,
        ]);
    }
}
