<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('ecoles', function (Blueprint $table) {
            $table->enum('type_bourse', ['locale', 'etrangere', 'toutes'])->default('toutes')->after('logo');
            $table->string('ville')->nullable()->after('type_bourse');
            $table->string('pays')->nullable()->after('ville');
        });
    }

    public function down()
    {
        Schema::table('ecoles', function (Blueprint $table) {
            $table->dropColumn(['type_bourse', 'ville', 'pays']);
        });
    }
};