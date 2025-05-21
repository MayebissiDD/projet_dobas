<?php

namespace Database\Factories;

use App\Models\Dossier;
use Illuminate\Database\Eloquent\Factories\Factory;

class DossierFactory extends Factory
{
    protected $model = Dossier::class;

    public function definition(): array
    {
        return [
            'nom' => $this->faker->name,
            'email' => $this->faker->unique()->safeEmail,
            'bourse' => $this->faker->randomElement(['Licence', 'Master', 'Doctorat']),
            'statut' => $this->faker->randomElement(['en attente', 'accepté', 'rejeté']),
        ];
    }
}
