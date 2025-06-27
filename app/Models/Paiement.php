<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Paiement extends Model
{
    use HasFactory;

    protected $table = 'paiements';

    protected $fillable = [
        'user_id',
        'candidature_id',
        'montant',
        'methode',
        'statut',
        'reference',
        'transaction_id',
        'details',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function candidature()
    {
        return $this->belongsTo(Candidature::class);
    }
}
