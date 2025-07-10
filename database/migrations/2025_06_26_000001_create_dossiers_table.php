<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('dossiers', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('etudiant_id'); // Lien vers l'étudiant
            $table->unsignedBigInteger('bourse_id'); // Lien vers la bourse
            $table->unsignedBigInteger('ecole_id'); // Lien vers l'école
            $table->string('nom');
            $table->string('prenom');
            $table->string('email');
            $table->string('telephone')->nullable();
            $table->string('filiere');
            $table->string('niveau')->nullable(); // ex: Licence, Master
            $table->json('diplomes')->nullable(); // Liste des diplômes (multi-étapes)
            $table->json('uploads')->nullable(); // Pièces jointes (chemins des fichiers)
            $table->enum('statut', ['en_attente', 'valide', 'rejete', 'incomplet'])->default('en_attente');
            $table->timestamp('date_soumission')->nullable();
            $table->text('commentaire')->nullable(); // Pour les retours agents/admins
            $table->timestamps();

            // Clés étrangères
            $table->foreign('etudiant_id')->references('id')->on('etudiants')->onDelete('cascade');
            $table->foreign('bourse_id')->references('id')->on('bourses')->onDelete('cascade');
            $table->foreign('ecole_id')->references('id')->on('ecoles')->onDelete('cascade');
            // Pas de clé étrangère payment_id ici pour éviter les cycles
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('dossiers');
    }
};
