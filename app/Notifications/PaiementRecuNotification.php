<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;

class PaiementRecuNotification extends Notification
{
    use Queueable;

    public function via(object $notifiable): array
    {
        return ['mail', 'broadcast'];
    }

    public function toMail(object $notifiable)
    {
        return (new \Illuminate\Notifications\Messages\MailMessage)
            ->line('Un paiement a été reçu pour une candidature.')
            ->action('Voir les paiements', url('/admin/paiements'))
            ->line('Merci d’utiliser DOBAS !');
    }

    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage([
            'message' => 'Un paiement a été reçu pour une candidature.',
        ]);
    }

    public function toArray(object $notifiable): array
    {
        return [
            'message' => 'Un paiement a été reçu pour une candidature.',
        ];
    }
}
