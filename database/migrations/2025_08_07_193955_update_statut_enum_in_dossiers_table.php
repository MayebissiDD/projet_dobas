<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Modifier l'énumération pour inclure la valeur 'soumis'
        DB::statement("ALTER TABLE dossiers MODIFY COLUMN statut ENUM('en_attente', 'en_cours', 'accepte', 'refuse', 'incomplet', 'soumis') DEFAULT 'en_attente'");
    }

    public function down(): void
    {
        // Revenir à l'énumération précédente
        DB::statement("ALTER TABLE dossiers MODIFY COLUMN statut ENUM('en_attente', 'en_cours', 'accepte', 'refuse', 'incomplet') DEFAULT 'en_attente'");
    }
};