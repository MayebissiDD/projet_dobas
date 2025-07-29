<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Permission\Traits\HasRoles;
use App\Notifications\CustomResetPassword;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles;

    /**
     * Les attributs que l’on peut assigner en masse.
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
    ];

    /**
     * Notifications non lues — relation prête à l’emploi.
     */
    public function unreadNotifications()
    {
        return $this->notifications()->whereNull('read_at');
    }

    /**
     * Marquer toutes les notifications comme lues.
     */
    public function markAllNotificationsAsRead()
    {
        $this->unreadNotifications->get()->markAsRead();
    }

    /**
     * Regrouper les notifications par date.
     */
    public function notificationsGroupedByDate()
    {
        return $this->notifications->groupBy(function ($notification) {
            return $notification->created_at->format('Y-m-d');
        });
    }

    /**
     * Personnalise l'envoi de l'e-mail de réinitialisation du mot de passe.
     */
    public function sendPasswordResetNotification($token)
    {
        $this->notify(new CustomResetPassword($token));
    }
}
