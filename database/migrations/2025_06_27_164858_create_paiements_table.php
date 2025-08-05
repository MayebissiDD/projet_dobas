<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('paiements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('dossier_id')->constrained()->onDelete('cascade');
            $table->decimal('montant', 10, 2);
            $table->string('methode'); // mobile_money, carte, depot_physique
            $table->string('statut')->default('en_attente'); // en_attente, en_cours, reussi, echec
            $table->string('reference')->unique();
            $table->string('transaction_id')->nullable();
            $table->timestamp('date_paiement')->nullable();
            $table->json('details')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('paiements');
    }
};