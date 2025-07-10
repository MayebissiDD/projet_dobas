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
        'nom',
        'prenom',
        'date_naissance',
        'lieu_naissance',
        'adresse',
        'email',
        'telephone',
        'diplome',
        'annee_diplome',
        'ecole',
        'filiere',
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

    /**
     * Le dossier appartient à un étudiant.
     */
    public function etudiant(): BelongsTo
    {
        return $this->belongsTo(Etudiant::class, 'etudiant_id');
    }

    /**
     * Le dossier est lié à une bourse.
     */
    public function bourse(): BelongsTo
    {
        return $this->belongsTo(Bourse::class);
    }

    /**
     * Le dossier peut avoir plusieurs paiements.
     */
    public function paiements(): HasMany
    {
        return $this->hasMany(Paiement::class);
    }

    /**
     * Le dossier peut avoir plusieurs pièces justificatives.
     */
    public function pieces(): HasMany
    {
        return $this->hasMany(DossierPiece::class, 'dossier_id');
    }
}
