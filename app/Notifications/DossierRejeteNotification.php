<?php
namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class DossierRejeteNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $motif;

    public function __construct($motif)
    {
        $this->motif = $motif;
    }

    public function via($notifiable)
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Votre candidature a été rejetée - DOBAS')
            ->greeting('Cher(e) ' . $notifiable->nom)
            ->line('Nous regrettons de vous informer que votre candidature a été rejetée.')
            ->line('Motif : ' . $this->motif)
            ->action('Consulter votre dossier', url('/etudiant/dossiers'))
            ->line('N\'hésitez pas à nous contacter pour plus d\'informations.');
    }

    public function toArray($notifiable)
    {
        return [
            'motif' => $this->motif,
            'message' => 'Votre candidature a été rejetée',
        ];
    }
}