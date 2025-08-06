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
        Schema::table('paiements', function (Blueprint $table) {
            $table->string('token_verification')->nullable()->after('transaction_id');
            
            // Ajout d'un index pour optimiser les recherches par token
            $table->index('token_verification', 'paiements_token_verification_index');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('paiements', function (Blueprint $table) {
            // Supprimer l'index d'abord
            $table->dropIndex('paiements_token_verification_index');
            
            // Puis supprimer la colonne
            $table->dropColumn('token_verification');
        });
    }
};