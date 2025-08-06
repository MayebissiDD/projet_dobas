<?php
namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\DatabaseNotification; // Ajout de cet import

class Etudiant extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;
    
    protected $table = 'etudiants';
    
    protected $fillable = [
        'nom',
        'prenom',
        'email',
        'telephone',
        'password',
        'date_naissance',
        'lieu_naissance',
        'adresse',
        'photo',
        'niveau_etude',
        // 'moyenne',
        // 'cas_social',
    ];
    
    protected $hidden = [
        'password',
        'remember_token',
    ];
    
    protected $casts = [
        'date_naissance' => 'date',
        'password' => 'hashed',
        'cas_social' => 'boolean',
        'prenom' => 'nullable',
    ];
    
    // Relations
    public function dossiers()
    {
        return $this->hasMany(Dossier::class, 'etudiant_id');
    }
    
    public function paiements()
    {
        return $this->hasMany(Paiement::class, 'etudiant_id');
    }
    
    // Correction de la relation notifications
    public function notifications()
    {
        return $this->morphMany(DatabaseNotification::class, 'notifiable')
            ->orderBy('created_at', 'desc');
    }
    
    public function unreadNotifications()
    {
        return $this->notifications()->whereNull('read_at');
    }
}