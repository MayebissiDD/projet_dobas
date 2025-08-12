<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Filiere;
use Illuminate\Http\Request;

class FiliereController extends Controller
{
    /**
     * Récupère les niveaux disponibles pour une filière spécifique
     */
    public function apiFiliereNiveaux($filiereId)
    {
        $filiere = Filiere::findOrFail($filiereId);
        $niveaux = [];
        
        // Gérer les différents formats de niveau
        if (isset($filiere->niveau)) {
            if (is_array($filiere->niveau)) {
                $niveaux = $filiere->niveau;
            } elseif (is_object($filiere->niveau) && isset($filiere->niveau->type)) {
                $type = $filiere->niveau->type;
                $from = $filiere->niveau->from ?? 1;
                $to = $filiere->niveau->to ?? 1;
                
                for ($i = $from; $i <= $to; $i++) {
                    $niveaux[] = ucfirst($type) . ' ' . $i;
                }
            }
        }
        
        return response()->json(['niveaux' => $niveaux]);
    }
}