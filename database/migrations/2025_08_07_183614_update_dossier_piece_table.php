<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('dossier_piece', function (Blueprint $table) {
            // Ajouter la colonne manquante si elle n'existe pas
            if (!Schema::hasColumn('dossier_piece', 'nom_stockage')) {
                $table->string('nom_stockage')->after('nom_original');
            }
            
            // Renommer la colonne 'chemin' en 'fichier' si elle existe
            if (Schema::hasColumn('dossier_piece', 'chemin')) {
                $table->renameColumn('chemin', 'fichier');
            }
            
            // S'assurer que la colonne 'piece_id' existe
            if (!Schema::hasColumn('dossier_piece', 'piece_id')) {
                $table->foreignId('piece_id')->after('dossier_id')->constrained()->onDelete('cascade');
            }
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('dossier_piece', function (Blueprint $table) {
            if (Schema::hasColumn('dossier_piece', 'nom_stockage')) {
                $table->dropColumn('nom_stockage');
            }
            
            if (Schema::hasColumn('dossier_piece', 'fichier')) {
                $table->renameColumn('fichier', 'chemin');
            }
            
            if (Schema::hasColumn('dossier_piece', 'piece_id')) {
                $table->dropForeign(['piece_id']);
                $table->dropColumn('piece_id');
            }
        });
    }
};