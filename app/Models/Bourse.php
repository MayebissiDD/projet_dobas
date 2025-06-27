<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bourse extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'description',
        'montant',
        'date_debut',
        'date_fin',
        'ecoles_eligibles',
        'filieres_eligibles',
        'diplomes_eligibles',
        'pieces_a_fournir',
        'frais_dossier',
        'statut',
    ];

    protected $casts = [
        'ecoles_eligibles' => 'array',
        'filieres_eligibles' => 'array',
        'diplomes_eligibles' => 'array',
        'pieces_a_fournir' => 'array',
        'date_debut' => 'date',
        'date_fin' => 'date',
        'frais_dossier' => 'float',
    ];

    public function dossiers()
    {
        return $this->hasMany(Dossier::class);
    }
}
