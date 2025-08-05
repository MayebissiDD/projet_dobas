<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('dossier_piece', function (Blueprint $table) {
            $table->id();
            $table->foreignId('dossier_id')->constrained()->onDelete('cascade');
            $table->foreignId('piece_id')->constrained()->onDelete('cascade');
            $table->string('fichier'); // chemin du fichier uploadé
            $table->string('nom_original'); // nom original du fichier
            $table->string('type_mime'); // type MIME du fichier
            $table->integer('taille'); // taille du fichier en octets
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dossier_pieces');
    }
};