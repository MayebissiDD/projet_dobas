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
        'ecole_id',
        'filiere_id',
        'statut',
        'statut_paiement',
        'date_soumission',
        'date_decision',
        'agent_id',
        'commentaire_agent',
        'raison_refus',
        'numero_dossier',
        'type_bourse',
        'etablissement',
        'pays_souhaite',
        'filiere_souhaitee',
        'mode_paiement',
        'cas_social',
        'moyenne',
        'niveau_etude',
        'date_naissance',
        'lieu_naissance',
        'sexe',
        'adresse',
        'nom',
        'prenom',
        'email',
        'telephone',
        'photo_identite',
    ];

    protected $casts = [
        'date_soumission' => 'datetime',
        'date_decision' => 'date',
        'date_naissance' => 'date',
        'cas_social' => 'boolean',
    ];

    public function etudiant(): BelongsTo
    {
        return $this->belongsTo(Etudiant::class);
    }

    public function bourse(): BelongsTo
    {
        return $this->belongsTo(Bourse::class);
    }

    public function ecole(): BelongsTo
    {
        return $this->belongsTo(Ecole::class);
    }

    public function filiere(): BelongsTo
    {
        return $this->belongsTo(Filiere::class);
    }

    public function agent(): BelongsTo
    {
        return $this->belongsTo(User::class, 'agent_id');
    }

    public function pieces(): HasMany
    {
        return $this->hasMany(DossierPiece::class);
    }
    // Dans le modèle Dossier
    public function getPhotoUrlAttribute()
    {
        return $this->photo_identite ? asset('storage/' . $this->photo_identite) : null;
    }
    public function paiements(): HasMany
    {
        return $this->hasMany(Paiement::class);
    }

    public function historique(): HasMany
    {
        return $this->hasMany(HistoriqueStatutDossier::class);
    }

    public function commentaires(): HasMany
    {
        return $this->hasMany(Commentaire::class);
    }
}
