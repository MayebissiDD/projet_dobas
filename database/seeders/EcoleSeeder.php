<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Ecole;

class EcoleSeeder extends Seeder
{
    public function run(): void
    {
        $ecoles = [
            [
                'nom' => 'Université de Brazzaville',
                'promoteur' => 'État',
                'contacts' => '0123456789',
                'filieres' => 'Informatique,Mathématiques,Lettres',
                'capacite' => 100,
                'adresse' => 'Brazzaville',
                'autres' => null,
                'logo' => null,
            ],
            [
                'nom' => 'Institut Polytechnique de Pointe-Noire',
                'promoteur' => 'État',
                'contacts' => '0987654321',
                'filieres' => 'Économie,Droit,Histoire',
                'capacite' => 80,
                'adresse' => 'Pointe-Noire',
                'autres' => null,
                'logo' => null,
            ],
            [
                'nom' => 'École Normale Supérieure',
                'promoteur' => 'État',
                'contacts' => '0112233445',
                'filieres' => 'Lettres,Histoire,Mathématiques',
                'capacite' => 60,
                'adresse' => 'Brazzaville',
                'autres' => null,
                'logo' => null,
            ],
        ];

        foreach ($ecoles as $data) {
            Ecole::create($data);
        }
    }
}
