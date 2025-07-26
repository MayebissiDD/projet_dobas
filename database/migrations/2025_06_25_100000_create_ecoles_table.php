<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('ecoles', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string('promoteur')->nullable();
            $table->string('contacts')->nullable();
            $table->string('filieres')->nullable();
            $table->integer('capacite')->nullable();
            $table->string('adresse')->nullable();
            $table->string('autres')->nullable();
            $table->string('logo')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('ecoles');
    }
};
