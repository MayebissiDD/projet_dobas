<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('dossier_id')->nullable()->constrained()->onDelete('set null');
            $table->decimal('montant', 12, 2);
            $table->string('statut')->default('en_attente'); // en_attente, valide, echoue, rembourse
            $table->string('methode')->nullable(); // mobile_money, stripe, etc.
            $table->string('reference')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
