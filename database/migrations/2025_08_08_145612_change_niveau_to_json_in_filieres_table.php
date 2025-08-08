<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('filieres', function (Blueprint $table) {
            $table->json('niveau')->change();
        });
    }

    public function down()
    {
        Schema::table('filieres', function (Blueprint $table) {
            $table->string('niveau')->change();
        });
    }
};