<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('filieres', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->foreignId('ecole_id')->constrained()->onDelete('cascade');
            $table->text('description')->nullable();
            $table->string('niveau')->nullable(); // Ex: Licence, Master, BTS
            $table->integer('duree')->nullable(); // Durée en années
            $table->boolean('active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('filieres');
    }
};