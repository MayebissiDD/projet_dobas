<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Piece extends Model
{
    protected $fillable = ['nom'];

    public function dossiers(): BelongsToMany
    {
        return $this->belongsToMany(Dossier::class, 'dossier_piece')
                    ->withPivot('fichier')
                    ->withTimestamps();
    }
}
