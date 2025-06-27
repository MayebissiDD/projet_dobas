<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // Suppression des tables inutiles ou doublons
        Schema::dropIfExists('scholarships');
        // Schema::dropIfExists('schools'); // supprimé car on garde 'ecoles'
        // Schema::dropIfExists('payments'); // supprimé car on garde 'paiements'
    }
    public function down(): void
    {
        // Rien à faire, ces tables étaient inutiles ou doublons
    }
};
