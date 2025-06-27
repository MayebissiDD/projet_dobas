<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // Suppression des tables anglaises inutiles
        Schema::dropIfExists('schools');
        Schema::dropIfExists('payments');
        Schema::dropIfExists('scholarships');
    }
    public function down(): void
    {
        // Rien à faire
    }
};
