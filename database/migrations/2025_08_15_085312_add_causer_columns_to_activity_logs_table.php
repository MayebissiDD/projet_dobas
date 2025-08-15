<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('activity_logs', function (Blueprint $table) {
            $table->string('causer_type')->nullable()->after('id');
            $table->unsignedBigInteger('causer_id')->nullable()->after('causer_type');
            $table->index(['causer_type', 'causer_id']);
        });
    }

    public function down(): void
    {
        Schema::table('activity_logs', function (Blueprint $table) {
            $table->dropColumn(['causer_type', 'causer_id']);
        });
    }
};