<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;

class DossierValideNotification extends Notification
{
    use Queueable;

    public $school;
    public $filiere;

    public function __construct($school, $filiere)
    {
        $this->school = $school;
        $this->filiere = $filiere;
    }

    public function via(object $notifiable): array
    {
        return ['mail', 'broadcast'];
    }

    public function toMail(object $notifiable)
    {
        return (new \Illuminate\Notifications\Messages\MailMessage)
            ->line('Félicitations ! Votre dossier a été validé par un agent DOBAS.')
            ->line('Vous avez été affecté à l\'école : ' . $this->school)
            ->line('Filière : ' . $this->filiere)
            ->action('Voir mon dossier', url('/etudiant/dossiers'))
            ->line('Merci d’utiliser DOBAS !');
    }

    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage([
            'message' => 'Votre dossier a été validé et vous avez été affecté à ' . $this->school . ' en ' . $this->filiere . '.',
        ]);
    }

    public function toArray(object $notifiable): array
    {
        return [
            'message' => 'Votre dossier a été validé et vous avez été affecté à ' . $this->school . ' en ' . $this->filiere . '.',
        ];
    }
}
