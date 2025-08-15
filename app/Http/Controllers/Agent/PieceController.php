<?php
namespace App\Http\Controllers\Agent;

use App\Http\Controllers\Controller;
use App\Models\DossierPiece;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PieceController extends Controller
{
    /**
     * Télécharger une pièce jointe d'un dossier
     */
    public function download($dossierId, $pieceId)
    {
        // Vérification que l'utilisateur est bien un agent
        $user = auth()->user();
        if (!$user || !$user->hasRole('agent')) {
            abort(403, 'Accès non autorisé');
        }
        
        $piece = DossierPiece::where('dossier_id', $dossierId)
                              ->where('id', $pieceId)
                              ->firstOrFail();
        
        // Vérifier si le fichier existe
        if (!Storage::disk('public')->exists($piece->fichier)) {
            abort(404, 'Fichier non trouvé');
        }
        
        // Obtenir le type MIME du fichier
        $mimeType = Storage::disk('public')->mimeType($piece->fichier);
        
        // Télécharger le fichier avec son nom original
        return Storage::disk('public')->download($piece->fichier, $piece->nom_original, ['Content-Type' => $mimeType]);
    }
}