<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('schools', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string('logo')->nullable();
            $table->string('promoteur')->nullable();
            $table->string('contacts')->nullable();
            $table->text('filieres')->nullable();
            $table->integer('capacite')->nullable();
            $table->string('adresse')->nullable();
            $table->text('autres')->nullable();
            $table->timestamps();
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('schools');
    }
};
