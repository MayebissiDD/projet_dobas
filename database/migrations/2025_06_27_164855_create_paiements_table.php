<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePaiementsTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('paiements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('candidature_id')->nullable()->constrained()->onDelete('cascade');
            $table->integer('montant');
            $table->string('methode'); // lygos, stripe, mobile_money, etc.
            $table->string('statut')->default('en_attente'); // en_attente, payé, échoué
            $table->string('reference')->nullable();
            $table->string('transaction_id')->nullable();
            $table->json('details')->nullable(); // réponse API
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('paiements');
    }
};
