<?php

namespace Database\Factories;

use App\Models\Etudiant;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class EtudiantFactory extends Factory
{
    protected $model = Etudiant::class;

    public function definition()
    {
        return [
            'nom' => $this->faker->lastName(),
            'prenom' => $this->faker->firstName(),
            'email' => $this->faker->unique()->safeEmail(),
            'password' => bcrypt('password'),
            'date_naissance' => $this->faker->date(),
            'telephone' => $this->faker->phoneNumber(),
            // Ajoutez ici les champs obligatoires de votre modèle Etudiant
        ];
    }
}
