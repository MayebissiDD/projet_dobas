<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ecole extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'ville',
        'capacite',
    ];

    /**
     * Une école a plusieurs filières.
     */
    public function filieres()
    {
        return $this->hasMany(Filiere::class);
    }

    /**
     * Une école peut être liée à plusieurs candidatures.
     * Si dans ta table candidatures tu as un champ "ecole" (string), cette relation ne s'applique pas.
     * Sinon, adapte ta migration pour utiliser une clé étrangère `ecole_id` pour la rendre relationnelle.
     */
    public function candidatures()
    {
        return $this->hasMany(Dossier::class);
    }

    /**
     * Relation : Une école a plusieurs dossiers
     */
    public function dossiers()
    {
        return $this->hasMany(Dossier::class, 'ecole_id');
    }
    /**
     * Une école peut être éligible à plusieurs bourses (stockées en JSON dans `bourses`).
     * Cette relation est virtuelle, donc pas de belongsToMany ici sauf si tu normalises la relation via une table pivot.
     */
}
