<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Paiement extends Model
{
    protected $table = 'paiements';

    protected $fillable = [
        'etudiant_id',
        'dossier_id',
        'montant',
        'methode',
        'statut',
        'reference',
        'transaction_id',
        'details',
    ];

    protected $casts = [
        'details' => 'array',
    ];

    /**
     * Le paiement appartient à un étudiant.
     */
    public function etudiant(): BelongsTo
    {
        return $this->belongsTo(Etudiant::class, 'etudiant_id');
    }

    /**
     * Le paiement est associé à un dossier (candidature).
     */
    public function dossier(): BelongsTo
    {
        return $this->belongsTo(Dossier::class);
    }
}
