<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Bourse extends Model
{
    protected $fillable = [
        'nom',
        'description',
        'montant',
        'frais_dossier',
        'date_debut',
        'date_fin',
        'ecoles_eligibles',
        'filieres_eligibles',
        'diplomes_eligibles',
        'pieces_a_fournir',
        'statut',
    ];

    protected $casts = [
        'ecoles_eligibles' => 'array',
        'filieres_eligibles' => 'array',
        'diplomes_eligibles' => 'array',
        'pieces_a_fournir' => 'array',
        'date_debut' => 'date',
        'date_fin' => 'date',
    ];

    public function dossiers(): HasMany
    {
        return $this->hasMany(Dossier::class);
    }
}