<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Filiere extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'ecole_id',
    ];

    /**
     * Relation : une filière appartient à une école.
     */
    public function ecole()
    {
        return $this->belongsTo(Ecole::class);
    }

    /**
     * Relation optionnelle : une filière peut avoir plusieurs candidatures.
     * À activer si ta table `candidatures` contient `filiere_id`
     */
    // public function candidatures()
    // {
    //     return $this->hasMany(Candidature::class);
    // }

    /**
     * Casts automatiques (optionnel).
     */
    protected $casts = [
        'ecole_id' => 'integer',
    ];
}
