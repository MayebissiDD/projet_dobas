<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HistoriqueStatutDossier extends Model
{
    use HasFactory;

    protected $fillable = [
        'dossier_id',
        'ancien_statut',
        'nouveau_statut',
        'motif',
        'modifie_par',
        'modifie_le',
    ];

    protected $casts = [
        'modifie_le' => 'datetime',
    ];

    public function dossier(): BelongsTo
    {
        return $this->belongsTo(Dossier::class);
    }

    public function modifiePar(): BelongsTo
    {
        return $this->belongsTo(User::class, 'modifie_par');
    }
}