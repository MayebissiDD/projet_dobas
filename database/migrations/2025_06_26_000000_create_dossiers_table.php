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
            $table->string('nom');
            $table->string('email');
            $table->string('statut')->default('en attente');
            $table->unsignedBigInteger('school_id')->nullable();
            $table->unsignedBigInteger('bourse_id')->nullable();
            $table->json('choix_ecoles')->nullable();
            $table->string('filiere_affectee')->nullable();
            $table->timestamps();
            $table->foreign('school_id')->references('id')->on('schools')->onDelete('set null');
            $table->foreign('bourse_id')->references('id')->on('bourses')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dossiers');
    }
};
