<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DossierPiece extends Model
{
    protected $table = 'dossier_piece';

    protected $fillable = ['dossier_id', 'piece_id', 'fichier'];

    // Relations pour accès rapide depuis le dossier ou la pièce
    public function dossier()
    {
        return $this->belongsTo(Dossier::class, 'dossier_id');
    }
    public function piece()
    {
        return $this->belongsTo(Piece::class, 'piece_id');
    }

    // Accès direct au nom de la pièce (helper)
    public function getNomPieceAttribute()
    {
        return $this->piece ? $this->piece->nom : null;
    }
    // Accès direct au chemin du fichier (helper)
    public function getUrlFichierAttribute()
    {
        return $this->fichier ? url('storage/' . $this->fichier) : null;
    }

    // Helper pour affichage dans les vues (nom complet)
    public function getLabelAttribute()
    {
        return $this->nom_piece ? ($this->nom_piece . ' (' . basename($this->fichier) . ')') : basename($this->fichier);
    }
}
