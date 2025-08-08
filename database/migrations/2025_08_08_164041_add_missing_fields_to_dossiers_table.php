<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('dossiers', function (Blueprint $table) {
            if (!Schema::hasColumn('dossiers', 'nationalite')) {
                $table->string('nationalite')->nullable()->after('photo_identite');
            }
            if (!Schema::hasColumn('dossiers', 'niveau_vise')) {
                $table->string('niveau_vise')->nullable()->after('niveau_etude');
            }
        });
    }

    public function down(): void
    {
        Schema::table('dossiers', function (Blueprint $table) {
            if (Schema::hasColumn('dossiers', 'nationalite')) {
                $table->dropColumn('nationalite');
            }
            if (Schema::hasColumn('dossiers', 'niveau_vise')) {
                $table->dropColumn('niveau_vise');
            }
        });
    }
};