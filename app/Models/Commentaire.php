<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Commentaire extends Model
{
    use HasFactory;
    
    protected $table = 'commentaire'; // Ajoutez cette ligne pour spécifier le nom exact de la table
    
    protected $fillable = [
        'dossier_id',
        'user_id',
        'commentaire',
        'type',
    ];
    
    public function dossier(): BelongsTo
    {
        return $this->belongsTo(Dossier::class);
    }
    
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}