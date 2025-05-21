<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Dossier;

class DossierSeeder extends Seeder
{
    public function run(): void
    {
        \App\Models\Dossier::factory(50)->create();
    }
}
