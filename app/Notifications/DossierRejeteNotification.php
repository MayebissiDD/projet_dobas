<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;

class DossierRejeteNotification extends Notification
{
    use Queueable;

    public $motif;

    public function __construct($motif = null)
    {
        $this->motif = $motif;
    }

    public function via(object $notifiable): array
    {
        return ['mail', 'broadcast'];
    }

    public function toMail(object $notifiable)
    {
        return (new \Illuminate\Notifications\Messages\MailMessage)
            ->line('Votre dossier a été rejeté par la DOBAS.')
            ->line($this->motif ?: "N'hésitez pas à retenter votre chance lors d'une prochaine session.")
            ->action('Voir mon dossier', url('/etudiant/dossiers'))
            ->line('Merci d’utiliser DOBAS !');
    }

    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage([
            'message' => 'Votre dossier a été rejeté par la DOBAS. ' . ($this->motif ?: "N'hésitez pas à retenter votre chance.")
        ]);
    }

    public function toArray(object $notifiable): array
    {
        return [
            'message' => 'Votre dossier a été rejeté par la DOBAS. ' . ($this->motif ?: "N'hésitez pas à retenter votre chance.")
        ];
    }
}
