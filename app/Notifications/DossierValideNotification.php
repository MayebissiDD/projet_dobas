<?php
namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class DossierValideNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $ecole;
    protected $filiere;

    public function __construct($ecole, $filiere)
    {
        $this->ecole = $ecole;
        $this->filiere = $filiere;
    }

    public function via($notifiable)
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Votre candidature a été validée - DOBAS')
            ->greeting('Cher(e) ' . $notifiable->nom)
            ->line('Nous avons le plaisir de vous informer que votre candidature a été validée.')
            ->line('École : ' . $this->ecole)
            ->line('Filière : ' . $this->filiere)
            ->action('Consulter votre dossier', url('/etudiant/dossiers'))
            ->line('Merci de faire confiance à DOBAS !');
    }

    public function toArray($notifiable)
    {
        return [
            'ecole' => $this->ecole,
            'filiere' => $this->filiere,
            'message' => 'Votre candidature a été validée',
        ];
    }
}