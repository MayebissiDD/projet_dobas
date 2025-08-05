<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class DecisionCandidature extends Notification implements ShouldQueue
{
    use Queueable;

    protected $dossier;

    public function __construct($dossier)
    {
        $this->dossier = $dossier;
    }

    public function via($notifiable)
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable)
    {
        if ($this->dossier->statut === 'accepte') {
            return (new MailMessage)
                ->subject('Votre candidature a été acceptée - DOBAS')
                ->greeting('Bonjour ' . $notifiable->nom . ',')
                ->line('Nous avons le plaisir de vous informer que votre candidature a été acceptée.')
                ->line('École : ' . optional($this->dossier->ecole)->nom)
                ->line('Filière : ' . $this->dossier->filiere_souhaitee)
                ->action('Consulter votre dossier', url('/etudiant/dossiers/' . $this->dossier->id))
                ->line('Merci de faire confiance à DOBAS !');
        } else {
            return (new MailMessage)
                ->subject('Votre candidature a été refusée - DOBAS')
                ->greeting('Bonjour ' . $notifiable->nom . ',')
                ->line('Nous regrettons de vous informer que votre candidature a été refusée.')
                ->line('Motif : ' . $this->dossier->raison_refus)
                ->action('Consulter votre dossier', url('/etudiant/dossiers/' . $this->dossier->id))
                ->line('N\'hésitez pas à nous contacter pour plus d\'informations.');
        }
    }

    public function toArray($notifiable)
    {
        return [
            'dossier_id' => $this->dossier->id,
            'statut' => $this->dossier->statut,
            'message' => 'Une décision a été prise concernant votre candidature.'
        ];
    }
}