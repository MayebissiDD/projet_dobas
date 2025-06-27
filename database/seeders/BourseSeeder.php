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
                'diplomes_eligibles' => ['Licence', 'Master'],
                'pieces_a_fournir' => ['Lettre de motivation', 'Relevé de notes', 'Pièce d’identité'],
                'frais_dossier' => 5000,
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
                'diplomes_eligibles' => ['Licence'],
                'pieces_a_fournir' => ['Lettre de motivation', 'Relevé de notes'],
                'frais_dossier' => 3000,
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
                'diplomes_eligibles' => ['Baccalauréat'],
                'pieces_a_fournir' => ['Attestation de situation', 'Relevé de notes'],
                'frais_dossier' => 0,
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
                'diplomes_eligibles' => ['Licence'],
                'pieces_a_fournir' => ['Lettre de motivation'],
                'frais_dossier' => 0,
                'statut' => 'inactif',
            ],
        ];
        foreach ($bourses as &$bourse) {
            // Correction : s'assurer que diplômes_eligibles est toujours présent et non vide
            if (empty($bourse['diplomes_eligibles'])) {
                $bourse['diplomes_eligibles'] = ['Baccalauréat', 'Licence', 'Master'];
            }
        }
        unset($bourse);
        foreach ($bourses as $bourse) {
            Bourse::create($bourse);
        }
    }
}
