<?php
namespace App\Enums;

class DossierStatus
{
    const EN_ATTENTE = 'en_attente';
    const SOUMIS = 'soumis';
    const EN_COURS = 'en_cours';
    const ACCEPTE = 'accepte';
    const REJETE = 'rejete';
    const VALIDE = 'valide';
    const INCOMPLET = 'incomplet';
    const REORIENTE = 'reoriente';
    
    public static function all()
    {
        return [
            self::EN_ATTENTE,
            self::SOUMIS,
            self::EN_COURS,
            self::ACCEPTE,
            self::REJETE,
            self::VALIDE,
            self::INCOMPLET,
            self::REORIENTE,
        ];
    }
}