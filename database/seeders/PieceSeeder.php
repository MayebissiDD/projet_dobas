<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Piece;

class PieceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $pieces = [
            [
                'code' => 'casier_judiciaire',
                'nom' => 'Casier judiciaire',
                'description' => 'Extrait de casier judiciaire',
                'obligatoire' => true,
                'type' => 'document'
            ],
            [
                'code' => 'certificat_nationalite',
                'nom' => 'Certificat de nationalité',
                'description' => 'Certificat de nationalité',
                'obligatoire' => true,
                'type' => 'document'
            ],
            [
                'code' => 'attestation_bac',
                'nom' => 'Attestation du Bac',
                'description' => 'Attestation du Baccalauréat',
                'obligatoire' => true,
                'type' => 'document'
            ],
            [
                'code' => 'certificat_medical',
                'nom' => 'Certificat médical',
                'description' => 'Certificat médical',
                'obligatoire' => true,
                'type' => 'document'
            ],
            [
                'code' => 'acte_naissance',
                'nom' => 'Acte de naissance',
                'description' => 'Acte de naissance',
                'obligatoire' => true,
                'type' => 'document'
            ],
            [
                'code' => 'passeport',
                'nom' => 'Passeport',
                'description' => 'Passeport en cours de validité',
                'obligatoire' => false,
                'type' => 'document'
            ],
            [
                'code' => 'preuve_paiement',
                'nom' => 'Preuve de paiement',
                'description' => 'Reçu de paiement des frais de dossier',
                'obligatoire' => false,
                'type' => 'document'
            ]
        ];

        foreach ($pieces as $piece) {
            Piece::firstOrCreate(
                ['code' => $piece['code']],
                $piece
            );
        }
    }
}