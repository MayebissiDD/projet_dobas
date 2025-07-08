<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Piece extends Model
{
    use HasFactory;

    // Nom de la table si différent de 'pieces'
    protected $table = 'pieces';

    /**
     * Champs remplissables
     */
    protected $fillable = [
        'nom', // Exemple : "Acte de naissance", "Relevé de notes"
    ];

    /**
     * Relation avec les candidatures (Many-to-Many avec pivot).
     * On utilise la table "candidature_piece"
     * et on accède au champ "fichier" via pivot.
     */
    public function candidatures()
    {
        return $this->belongsToMany(Candidature::class, 'candidature_piece')
                    ->withPivot('fichier')       // Le nom du fichier uploadé
                    ->withTimestamps();          // created_at & updated_at dans la table pivot
    }
}
