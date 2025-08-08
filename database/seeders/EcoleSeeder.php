<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use App\Models\Ecole;
use App\Models\Filiere;

class EcoleSeeder extends Seeder
{
    public function run(): void
    {
        DB::transaction(function () {
            // 1) Charger les données depuis un JSON pour éviter de recompiler en changeant le contenu
            $path = database_path('seeders/data/ecoles_filieres.json');
            if (!File::exists($path)) {
                throw new \RuntimeException("Fichier de données introuvable: {$path}");
            }
            $payload = json_decode(File::get($path), true);
            if (!is_array($payload)) {
                throw new \RuntimeException("Format JSON invalide dans {$path}");
            }
            foreach ($payload as $ecoleData) {
                // Créer/mettre à jour l'école avec les nouveaux champs
                $ecole = Ecole::updateOrCreate(
                    ['nom' => $ecoleData['nom']],
                    [
                        'promoteur' => $ecoleData['promoteur'] ?? null,
                        'contacts'  => $ecoleData['contacts']  ?? null,
                        'capacite'  => $ecoleData['capacite']  ?? null,
                        'adresse'   => $ecoleData['adresse']   ?? null,
                        'autres'    => $ecoleData['autres']    ?? null,
                        'logo'      => $ecoleData['logo']      ?? null,
                        'type_bourse' => $ecoleData['type_bourse'] ?? 'toutes', // Nouveau champ
                        'ville'      => $ecoleData['ville'] ?? null,            // Nouveau champ
                        'pays'       => $ecoleData['pays'] ?? 'Congo',          // Nouveau champ
                    ]
                );
                // 2) Créer/mettre à jour les filières rattachées
                if (!empty($ecoleData['filieres']) && is_array($ecoleData['filieres'])) {
                    foreach ($ecoleData['filieres'] as $f) {
                        // Helper: normaliser les niveaux
                        $niveau = $this->normalizeNiveau($f['niveau'] ?? null);
                        Filiere::updateOrCreate(
                            [
                                'ecole_id' => $ecole->id,
                                'nom'      => $f['nom'],
                            ],
                            [
                                'description' => $f['description'] ?? null,
                                'niveau'      => $niveau ? json_encode($niveau) : null,
                                'duree'       => $f['duree'] ?? null,
                                'active'      => $f['active'] ?? true,
                            ]
                        );
                    }
                }
            }
        });
    }
    
    /**
     * Accepte soit un tableau de niveaux explicites,
     * soit un "shorthand" comme { "type": "licence", "from": 1, "to": 3 } pour générer ["Licence 1","Licence 2","Licence 3"]
     * ou { "type": "master", "from": 1, "to": 2 }, etc.
     */
    private function normalizeNiveau($niveau)
    {
        if (!$niveau) return null;
        // Si déjà un tableau de strings -> on le renvoie tel quel
        if (is_array($niveau) && isset($niveau[0]) && is_string($niveau[0])) {
            return $niveau;
        }
        // Si objet "shorthand"
        if (is_array($niveau) && isset($niveau['type'], $niveau['from'], $niveau['to'])) {
            $type = strtolower($niveau['type']);
            $out  = [];
            for ($i = (int)$niveau['from']; $i <= (int)$niveau['to']; $i++) {
                $label = match ($type) {
                    'licence' => "Licence {$i}",
                    'master'  => "Master {$i}",
                    'bts'     => "BTS {$i}",
                    'dut'     => "DUT {$i}",
                    default   => ucfirst($type) . " {$i}",
                };
                $out[] = $label;
            }
            return $out;
        }
        // Sinon, on essaie de renvoyer tel quel (JSON libre ou autre)
        return $niveau;
    }
}