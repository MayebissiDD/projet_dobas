<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DossierPiece extends Model
{
    protected $table = 'dossier_piece';
    
    protected $fillable = [
        'dossier_id',
        'piece_id',
        'fichier', // Utiliser 'fichier' au lieu de 'chemin'
        'nom_original',
        'nom_stockage',
        'type_mime',
        'taille',
    ];
    
    public function dossier(): BelongsTo
    {
        return $this->belongsTo(Dossier::class);
    }
    
    public function piece(): BelongsTo
    {
        return $this->belongsTo(Piece::class);
    }
    
    // Accès direct au nom de la pièce
    public function getNomPieceAttribute()
    {
        return $this->piece ? $this->piece->nom : 'Pièce inconnue';
    }
    
    // URL pour accéder au fichier
    public function getUrlFichierAttribute()
    {
        return $this->fichier ? asset('storage/' . $this->fichier) : null;
    }
    
    // Helper pour affichage dans les vues
    public function getLabelAttribute()
    {
        return $this->nom_piece . ' (' . basename($this->fichier) . ')';
    }
}