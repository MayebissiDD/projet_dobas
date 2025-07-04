<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class School extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'logo',
        'promoteur',
        'contacts',
        'filieres',
        'capacite',
        'adresse',
        'autres',
    ];

    public function dossiers()
    {
        return $this->hasMany(Dossier::class);
    }
    // Suppression du modèle School, utiliser Ecole
    // public function placesRestantes() { ... }
}
