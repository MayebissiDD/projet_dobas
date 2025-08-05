<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Filiere extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'ecole_id',
        'description',
        'niveau',
        'duree',
        'active',
    ];

    protected $casts = [
        'active' => 'boolean',
        'duree' => 'integer',
    ];

    /**
     * Relation : une filière appartient à une école.
     */
    public function ecole(): BelongsTo
    {
        return $this->belongsTo(Ecole::class);
    }

    /**
     * Relation : une filière peut avoir plusieurs dossiers.
     */
    public function dossiers(): HasMany
    {
        return $this->hasMany(Dossier::class);
    }
}