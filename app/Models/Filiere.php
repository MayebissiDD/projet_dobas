<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Filiere extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'ecole_id',
        'description',
        'niveau', // Maintenant de type JSON
        'duree',
        'active',
    ];

    protected $casts = [
        'active' => 'boolean',
        'duree' => 'integer',
        'niveau' => 'array', // Cast automatique en tableau PHP
    ];

    /**
     * Relation : une filière appartient à une école.
     */
    public function ecole(): BelongsTo
    {
        return $this->belongsTo(Ecole::class);
    }

    /**
     * Relation : une filière peut avoir plusieurs dossiers.
     */
    public function dossiers(): HasMany
    {
        return $this->hasMany(Dossier::class);
    }

    /**
     * Accesseur pour formater les niveaux
     */
    public function getNiveauxListAttribute(): string
    {
        return implode(', ', $this->niveau ?? []);
    }
}