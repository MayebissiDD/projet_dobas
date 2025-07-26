<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Dossier extends Model
{
    protected $fillable = [
        'etudiant_id',
        'bourse_id',
        'ecole_id',        // Nouveau
        'filiere_id',      // Nouveau
        'nom',
        'prenom',
        'date_naissance',
        'lieu_naissance',
        'adresse',
        'email',
        'telephone',
        'diplome',
        'annee_diplome',
        'paiement_mode',
        'statut',
        'niveau',
        'diplomes',
        'uploads',
        'date_soumission',
        'commentaire',
    ];

    protected $casts = [
        'diplomes' => 'array',
        'uploads' => 'array',
        'date_soumission' => 'datetime',
    ];

    public function etudiant(): BelongsTo
    {
        return $this->belongsTo(Etudiant::class, 'etudiant_id');
    }

    public function bourse(): BelongsTo
    {
        return $this->belongsTo(Bourse::class);
    }

    public function paiements(): HasMany
    {
        return $this->hasMany(Paiement::class);
    }

    public function pieces(): HasMany
    {
        return $this->hasMany(DossierPiece::class, 'dossier_id');
    }

    public function ecole(): BelongsTo
    {
        return $this->belongsTo(Ecole::class, 'ecole_id');
    }

    public function filiere(): BelongsTo
    {
        return $this->belongsTo(Filiere::class, 'filiere_id');
    }
}
