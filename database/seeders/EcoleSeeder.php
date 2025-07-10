<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Ecole;
use App\Models\Filiere;

class EcoleSeeder extends Seeder
{
    public function run(): void
    {
        $ecoles = [
            [
                'nom' => 'Université de Brazzaville',
                'ville' => 'Brazzaville',
                'capacite' => 100,
                'filieres' => ['Informatique', 'Mathématiques', 'Lettres'],
            ],
            [
                'nom' => 'Institut Polytechnique de Pointe-Noire',
                'ville' => 'Pointe-Noire',
                'capacite' => 80,
                'filieres' => ['Économie', 'Droit', 'Histoire'],
            ],
            [
                'nom' => 'École Normale Supérieure',
                'ville' => 'Brazzaville',
                'capacite' => 60,
                'filieres' => ['Lettres', 'Histoire', 'Mathématiques'],
            ],
        ];

        foreach ($ecoles as $data) {
            $ecole = Ecole::create([
                'nom' => $data['nom'],
                'ville' => $data['ville'],
                'capacite' => $data['capacite'],
            ]);

            foreach ($data['filieres'] as $nomFiliere) {
                Filiere::create([
                    'nom' => $nomFiliere,
                    'ecole_id' => $ecole->id,
                ]);
            }
        }
    }
}
