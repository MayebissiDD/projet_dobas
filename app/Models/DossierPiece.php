<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DossierPiece extends Model
{
    protected $table = 'dossier_piece';
    
    protected $fillable = [
        'dossier_id',
        'type_piece',
        'nom_original',
        'nom_stockage',
        'chemin',
        'taille',
        'type_mime',
    ];

    public function dossier(): BelongsTo
    {
        return $this->belongsTo(Dossier::class);
    }

    // Accès direct au nom de la pièce (helper)
    public function getNomPieceAttribute()
    {
        return $this->type_piece;
    }

    // Accès direct au chemin du fichier (helper)
    public function getUrlFichierAttribute()
    {
        return $this->chemin ? url('storage/' . $this->chemin) : null;
    }

    // Helper pour affichage dans les vues (nom complet)
    public function getLabelAttribute()
    {
        return $this->nom_piece . ' (' . basename($this->chemin) . ')';
    }
}