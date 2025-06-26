<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Bourse;
use Illuminate\Support\Arr;

class BourseSeeder extends Seeder
{
    public function run(): void
    {
        $bourses = [
            [
                'nom' => 'Bourse Excellence',
                'description' => 'Pour les meilleurs étudiants',
                'montant' => 1000000,
                'date_debut' => now()->subMonth(),
                'date_fin' => now()->addMonths(2),
                'ecoles_eligibles' => [1, 2, 3],
                'filieres_eligibles' => ['Informatique', 'Mathématiques'],
                'statut' => 'actif',
            ],
            [
                'nom' => 'Bourse Mérite',
                'description' => 'Pour les étudiants méritants',
                'montant' => 700000,
                'date_debut' => now()->subDays(10),
                'date_fin' => now()->addMonth(),
                'ecoles_eligibles' => [2, 3],
                'filieres_eligibles' => ['Droit', 'Économie'],
                'statut' => 'actif',
            ],
            [
                'nom' => 'Bourse Sociale',
                'description' => 'Pour les étudiants en difficulté',
                'montant' => 500000,
                'date_debut' => now()->subDays(5),
                'date_fin' => now()->addMonths(3),
                'ecoles_eligibles' => [1],
                'filieres_eligibles' => ['Lettres', 'Histoire'],
                'statut' => 'actif',
            ],
            [
                'nom' => 'Bourse Fermée',
                'description' => 'Bourse expirée',
                'montant' => 300000,
                'date_debut' => now()->subMonths(3),
                'date_fin' => now()->subMonth(),
                'ecoles_eligibles' => [1, 2],
                'filieres_eligibles' => ['Informatique'],
                'statut' => 'inactif',
            ],
        ];
        foreach ($bourses as $bourse) {
            Bourse::create($bourse);
        }
    }
}
