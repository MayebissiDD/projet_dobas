<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('bourses', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->text('description')->nullable();
            $table->decimal('montant', 12, 2)->nullable();
            $table->date('date_debut')->nullable();
            $table->date('date_fin')->nullable();
            $table->json('ecoles_eligibles')->nullable();
            $table->json('filieres_eligibles')->nullable();
            $table->string('statut')->default('active'); // active, archivee, etc.
            $table->timestamps();
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('bourses');
    }
};
