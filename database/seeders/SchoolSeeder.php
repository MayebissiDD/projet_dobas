<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\School;

class SchoolSeeder extends Seeder
{
    public function run(): void
    {
        $schools = [
            [
                'nom' => 'Université de Brazzaville',
                'adresse' => 'Brazzaville',
                'capacite' => 100,
                'filieres' => ['Informatique', 'Mathématiques', 'Lettres'],
            ],
            [
                'nom' => 'Institut Polytechnique de Pointe-Noire',
                'adresse' => 'Pointe-Noire',
                'capacite' => 80,
                'filieres' => ['Économie', 'Droit', 'Histoire'],
            ],
            [
                'nom' => 'École Normale Supérieure',
                'adresse' => 'Brazzaville',
                'capacite' => 60,
                'filieres' => ['Lettres', 'Histoire', 'Mathématiques'],
            ],
        ];
        foreach ($schools as $school) {
            School::create($school);
        }
    }
}
