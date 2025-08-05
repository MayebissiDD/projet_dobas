<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class BienvenuePostulerController extends Notification implements ShouldQueue
{
    use Queueable;

    protected $motDePasse;

    public function __construct($motDePasse)
    {
        $this->motDePasse = $motDePasse;
    }

    public function via($notifiable)
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Bienvenue sur la plateforme DOBAS')
            ->greeting('Bonjour ' . $notifiable->nom . ',')
            ->line('Votre compte a été créé avec succès sur la plateforme DOBAS.')
            ->line('Votre mot de passe temporaire est : ' . $this->motDePasse)
            ->line('Veuillez le changer lors de votre première connexion.')
            ->action('Me connecter', url('/etudiant/login'))
            ->line('Merci de faire confiance à DOBAS !');
    }

    public function toArray($notifiable)
    {
        return [
            'mot_de_passe' => $this->motDePasse,
            'message' => 'Votre compte a été créé avec succès.'
        ];
    }
}