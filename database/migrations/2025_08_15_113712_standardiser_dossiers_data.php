<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Mettre à jour les statuts pour être cohérents
        DB::statement("UPDATE dossiers SET statut = 'rejete' WHERE statut = 'refuse'");
        
        // Mettre à jour les dossiers existants pour utiliser les relations
        DB::statement('UPDATE dossiers SET ecole_id = (SELECT id FROM ecoles WHERE nom = dossiers.etablissement LIMIT 1) WHERE etablissement IS NOT NULL AND ecole_id IS NULL');
        DB::statement('UPDATE dossiers SET filiere_id = (SELECT id FROM filieres WHERE nom = dossiers.filiere_souhaitee LIMIT 1) WHERE filiere_souhaitee IS NOT NULL AND filiere_id IS NULL');
        
        // Créer les étudiants manquants
        $dossiersSansEtudiant = DB::table('dossiers')->whereNull('etudiant_id')->get();
        
        foreach ($dossiersSansEtudiant as $dossier) {
            $etudiantId = DB::table('etudiants')->insertGetId([
                'nom' => $dossier->nom,
                'prenom' => $dossier->prenom,
                'email' => $dossier->email,
                'telephone' => $dossier->telephone,
                'date_naissance' => $dossier->date_naissance,
                'lieu_naissance' => $dossier->lieu_naissance,
                'sexe' => $dossier->sexe,
                'adresse' => $dossier->adresse,
                'niveau_etude' => $dossier->niveau_etude,
                'moyenne' => $dossier->moyenne,
                'cas_social' => $dossier->cas_social,
                'photo_identite' => $dossier->photo_identite,
                'password' => bcrypt('password'), // Mot de passe temporaire
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            
            DB::table('dossiers')->where('id', $dossier->id)->update(['etudiant_id' => $etudiantId]);
            
            // Assigner le rôle étudiant
            DB::table('model_has_roles')->insert([
                'role_id' => DB::table('roles')->where('name', 'etudiant')->first()->id,
                'model_type' => 'App\Models\Etudiant',
                'model_id' => $etudiantId,
            ]);
        }
    }

    public function down(): void
    {
        // Cette migration est irréversible
    }
};