<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ecole extends Model
{
    use HasFactory;

    protected $table = 'ecoles';

    protected $fillable = [
        'nom',
        'ville',
        'capacite',
    ];

    public function dossiers()
    {
        return $this->hasMany(Dossier::class);
    }
}
