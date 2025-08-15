<?php
namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class DossierIncompletNotification extends Notification
{
    use Queueable;

    protected $commentaire;

    public function __construct($commentaire)
    {
        $this->commentaire = $commentaire;
    }

    public function via($notifiable)
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Votre dossier de candidature est incomplet')
            ->greeting('Bonjour ' . $notifiable->name . ',')
            ->line('Nous vous informons que votre dossier de candidature a été marqué comme incomplet.')
            ->line('Motif: ' . $this->commentaire)
            ->line('Veuillez compléter votre dossier en fournissant les informations manquantes.')
            ->action('Voir mon dossier', url('/etudiant/dossiers'))
            ->line('Merci de votre compréhension.');
    }

    public function toArray($notifiable)
    {
        return [
            'message' => 'Votre dossier de candidature a été marqué comme incomplet.',
            'commentaire' => $this->commentaire,
        ];
    }
}