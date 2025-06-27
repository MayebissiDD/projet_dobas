<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'dossier_id',
        'montant',
        'statut',
        'methode',
        'reference',
        'paid_at',
    ];

    // Ce modèle est obsolète, utiliser Paiement à la place
    // public function user()
    // {
    //     return $this->belongsTo(User::class);
    // }

    // public function dossier()
    // {
    //     return $this->belongsTo(Dossier::class);
    // }
}
