<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('historique_statut_dossier', function (Blueprint $table) {
            $table->id();
            $table->foreignId('dossier_id')->constrained()->onDelete('cascade');
            $table->enum('ancien_statut', ['en_attente', 'en_cours', 'accepte', 'refuse', 'incomplet']);
            $table->enum('nouveau_statut', ['en_attente', 'en_cours', 'accepte', 'refuse', 'incomplet']);
            $table->text('motif')->nullable();
            $table->foreignId('modifie_par')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('modifie_le')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('historique_statut_dossier');
    }
};