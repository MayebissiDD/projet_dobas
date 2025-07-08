<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CandidatureSoumiseNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $candidature;

    public function __construct($candidature)
    {
        $this->candidature = $candidature;
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Confirmation de votre candidature')
            ->greeting('Bonjour ' . $this->candidature->prenom . ' ' . $this->candidature->nom . ',')
            ->line('Nous avons bien reçu votre candidature pour la bourse.')
            ->line('Elle est actuellement en attente de traitement par nos équipes.')
            ->line('Vous serez notifié(e) dès qu’une décision sera prise.')
            ->line('Merci pour votre confiance et bonne chance !')
            ->salutation('Cordialement, L’équipe DOBAS');
    }
}
