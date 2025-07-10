<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class School extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'ville',
        'capacite',
    ];

    public function filieres()
    {
        return $this->hasMany(Filiere::class);
    }

    public function dossiers()
    {
        return $this->hasMany(Dossier::class);
    }

    public function placesRestantes()
    {
        // Capacité - nombre de dossiers affectés à cette école
        return $this->capacite - $this->dossiers()->count();
    }
}
