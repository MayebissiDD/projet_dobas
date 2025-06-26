<?php

namespace Database\Factories;

use App\Models\Dossier;
use Illuminate\Database\Eloquent\Factories\Factory;

class DossierFactory extends Factory
{
    protected $model = Dossier::class;

    public function definition(): array
    {
        $bourse = \App\Models\Bourse::inRandomOrder()->first();
        $school = \App\Models\School::inRandomOrder()->first();
        $statuts = ['en attente', 'accepté', 'rejeté', 'validé'];
        return [
            'nom' => $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail(),
            'bourse_id' => $bourse ? $bourse->id : null,
            'school_id' => $school ? $school->id : null,
            'statut' => $this->faker->randomElement($statuts),
            'choix_ecoles' => json_encode([
                ['ecole' => $school ? $school->id : null, 'options' => ['Informatique', 'Mathématiques']],
                ['ecole' => null, 'options' => ['Droit', 'Économie']],
                ['ecole' => null, 'options' => ['Lettres', 'Histoire']],
            ]),
            'filiere_affectee' => $this->faker->randomElement(['Informatique', 'Mathématiques', 'Droit', 'Lettres', 'Histoire', null]),
        ];
    }
}
