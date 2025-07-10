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
        $ecole = \App\Models\Ecole::inRandomOrder()->first();
        $statuts = ['en_attente', 'valide', 'rejete', 'incomplet'];
        return [
            'nom' => $this->faker->lastName(),
            'prenom' => $this->faker->firstName(),
            'email' => $this->faker->unique()->safeEmail(),
            'bourse_id' => $bourse ? $bourse->id : null,
            'ecole_id' => $ecole ? $ecole->id : null,
            'filiere' => $this->faker->randomElement(['Informatique', 'Mathématiques', 'Droit', 'Lettres', 'Histoire']),
            'statut' => $this->faker->randomElement($statuts),
            'telephone' => $this->faker->phoneNumber(),
            'niveau' => $this->faker->randomElement(['Licence', 'Master', 'Doctorat']),
            'diplomes' => json_encode(['Bac', 'Licence']),
            'uploads' => json_encode([]),
            'date_soumission' => now(),
            'commentaire' => null,
            'etudiant_id' => \App\Models\Etudiant::inRandomOrder()->first()?->id,
        ];
    }
}
