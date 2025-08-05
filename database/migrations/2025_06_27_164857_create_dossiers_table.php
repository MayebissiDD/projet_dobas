<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('dossiers', function (Blueprint $table) {
            $table->id();
            $table->string('numero_dossier')->unique();
            $table->foreignId('etudiant_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('agent_id')->nullable()->constrained('users')->nullOnDelete();
            $table->date('date_decision')->nullable();
            $table->text('commentaire_agent')->nullable();
            $table->text('raison_refus')->nullable();
            $table->enum('statut', ['en_attente', 'en_cours', 'accepte', 'refuse', 'incomplet'])->default('en_attente');
            $table->enum('statut_paiement', ['non_paye', 'en_attente', 'paye', 'echec'])->default('non_paye');
            $table->foreignId('ecole_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('filiere_id')->nullable()->constrained()->onDelete('set null');
            $table->timestamp('date_soumission')->nullable();
            $table->string('type_bourse')->nullable();
            $table->string('etablissement')->nullable();
            $table->string('pays_souhaite')->nullable();
            $table->string('filiere_souhaitee')->nullable();
            $table->string('mode_paiement')->nullable();
            $table->boolean('cas_social')->default(false);
            $table->decimal('moyenne', 4, 2)->nullable();
            $table->string('niveau_etude')->nullable();
            
            // Colonnes pour le formulaire initial
            $table->string('nom')->nullable();
            $table->string('prenom')->nullable();
            $table->string('email')->nullable();
            $table->string('telephone')->nullable();
             $table->string('photo_identite')->nullable(); 
            $table->date('date_naissance')->nullable();
            $table->string('lieu_naissance')->nullable();
            $table->string('sexe')->nullable();
            $table->text('adresse')->nullable();
            
            $table->string('transaction_id')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dossiers');
    }
};