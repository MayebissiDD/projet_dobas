<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Paiement extends Model
{
    protected $fillable = [
        'dossier_id',
        'etudiant_id',
        'montant',
        'methode',
        'statut',
        'reference',
        'transaction_id',
        'date_paiement',
        'token_verification',
        'details',
    ];

    protected $casts = [
        'date_paiement' => 'datetime',
        'details' => 'array',
    ];

    public function dossier(): BelongsTo
    {
        return $this->belongsTo(Dossier::class);
    }

    public function etudiant(): BelongsTo
    {
        return $this->belongsTo(Etudiant::class);
    }
}