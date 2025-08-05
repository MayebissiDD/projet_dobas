<?php
namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Permission\Traits\HasRoles;
use App\Notifications\CustomResetPassword;
use Illuminate\Notifications\DatabaseNotification; // Ajout de cet import
use Illuminate\Database\Eloquent\Relations\MorphMany;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles;
    
    /**
     * Les attributs que l'on peut assigner en masse.
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];
    
    /**
     * Les attributs qui doivent rester cachés lors de la sérialisation.
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];
    
    /**
     * Les attributs qui doivent être convertis.
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];
    
    /**
     * Toutes les notifications pour cet utilisateur.
     */
    public function notifications(): MorphMany
    {
        return $this->morphMany(DatabaseNotification::class, 'notifiable')
            ->orderBy('created_at', 'desc');
    }
    
    /**
     * Notifications non lues — relation prête à l'emploi.
     */
    public function unreadNotifications(): MorphMany
    {
        return $this->notifications()->whereNull('read_at');
    }
    
    /**
     * Regrouper les notifications par date.
     */
    public function notificationsGroupedByDate()
    {
        return $this->notifications()->groupBy(function ($notification) {
            return $notification->created_at->format('Y-m-d');
        });
    }
    
    /**
     * Marquer toutes les notifications comme lues.
     */
    public function markAllNotificationsAsRead(): void
    {
        $this->unreadNotifications()->update(['read_at' => now()]);
    }
    
    /**
     * Personnalise l'envoi de l'e-mail de réinitialisation du mot de passe.
     */
    public function sendPasswordResetNotification($token): void
    {
        $this->notify(new CustomResetPassword($token));
    }
}