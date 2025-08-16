<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('historique_statut_dossier', function (Blueprint $table) {
            $table->string('ancien_statut', 100)->change();
            $table->string('nouveau_statut', 100)->change();
        });
    }

    public function down(): void
    {
        Schema::table('historique_statut_dossier', function (Blueprint $table) {
            $table->string('ancien_statut', 50)->change();
            $table->string('nouveau_statut', 50)->change();
        });
    }
};