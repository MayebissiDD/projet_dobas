<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('dossiers', function (Blueprint $table) {
            if (!Schema::hasColumn('dossiers', 'ecole_id')) {
                $table->foreignId('ecole_id')->nullable()->constrained()->onDelete('set null');
            }

            if (!Schema::hasColumn('dossiers', 'filiere_id')) {
                $table->foreignId('filiere_id')->nullable()->constrained()->onDelete('set null');
            }
        });
    }

    public function down(): void
    {
        Schema::table('dossiers', function (Blueprint $table) {
            if (Schema::hasColumn('dossiers', 'ecole_id')) {
                $table->dropForeign(['ecole_id']);
                $table->dropColumn('ecole_id');
            }

            if (Schema::hasColumn('dossiers', 'filiere_id')) {
                $table->dropForeign(['filiere_id']);
                $table->dropColumn('filiere_id');
            }
        });
    }
};
