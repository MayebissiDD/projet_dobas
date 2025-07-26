<?php

namespace Database\Factories;

use App\Models\Paiement;
use Illuminate\Database\Eloquent\Factories\Factory;

class PaiementFactory extends Factory
{
    protected $model = Paiement::class;

    public function definition()
    {
        return [
            'etudiant_id' => \App\Models\Etudiant::factory(),
            'montant' => $this->faker->numberBetween(10000, 100000),
            'statut' => 'valide',
            'methode' => $this->faker->randomElement(['carte', 'virement', 'espèces']),
            'reference' => $this->faker->uuid(),
            'date_paiement' => $this->faker->date(),
            // Ajoutez ici les champs obligatoires de votre modèle Paiement
        ];
    }
}
