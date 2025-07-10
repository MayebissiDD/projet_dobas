<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Etudiant extends Authenticatable
{
    use Notifiable;

    protected $table = 'etudiants';

    protected $fillable = [
        'nom',
        'prenom',
        'email',
        'telephone',
        'password',
        'date_naissance',
        'lieu_naissance',
        'adresse',
        'photo',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    // Relations
    public function dossiers()
    {
        return $this->hasMany(Dossier::class, 'etudiant_id');
    }
    public function paiements()
    {
        return $this->hasMany(Paiement::class, 'etudiant_id');
    }
}
