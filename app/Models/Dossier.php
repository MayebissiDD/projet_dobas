<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Dossier extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'email',
        'statut',
        'school_id',
        'choix_ecoles',
        'filiere_affectee',
        'bourse_id',
    ];

    public function bourse()
    {
        return $this->belongsTo(Bourse::class);
    }

    public function ecole()
    {
        return $this->belongsTo(Ecole::class, 'school_id');
    }
}
