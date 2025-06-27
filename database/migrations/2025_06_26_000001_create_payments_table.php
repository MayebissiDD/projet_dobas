<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('dossier_id')->nullable();
            $table->decimal('montant', 12, 2);
            $table->string('statut')->default('en_attente');
            $table->string('methode')->nullable();
            $table->string('reference')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();
            // Clés étrangères
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('dossier_id')->references('id')->on('dossiers')->onDelete('set null');
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
