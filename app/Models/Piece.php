<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Piece extends Model
{
    protected $fillable = [
        'nom',
        'code',
        'description',
        'obligatoire',
        'type'
    ];
    
    protected $casts = [
        'obligatoire' => 'boolean'
    ];
    
    public function dossiers(): BelongsToMany
    {
        return $this->belongsToMany(Dossier::class, 'dossier_piece')
                    ->withPivot(['fichier', 'nom_original', 'nom_stockage', 'type_mime', 'taille'])
                    ->withTimestamps();
    }
}