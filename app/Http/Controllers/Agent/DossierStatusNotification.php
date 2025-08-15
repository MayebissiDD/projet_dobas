<?php
namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class DossierStatusNotification extends Notification
{
    use Queueable;

    protected $dossier;
    protected $type;
    protected $message;

    public function __construct($dossier, $type, $message = '')
    {
        $this->dossier = $dossier;
        $this->type = $type; // 'valide', 'rejete', 'incomplet'
        $this->message = $message;
    }

    public function via($notifiable)
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable)
    {
        $mailMessage = new MailMessage();
        
        switch ($this->type) {
            case 'valide':
                $mailMessage->subject('Votre dossier de candidature a été validé')
                    ->greeting('Bonjour ' . $notifiable->name . ',')
                    ->line('Nous vous informons que votre dossier de candidature a été validé.')
                    ->line('École: ' . optional($this->dossier->ecole)->nom)
                    ->line('Filière: ' . $this->dossier->filiere_souhaitee)
                    ->action('Voir mon dossier', url('/etudiant/dossiers'))
                    ->line('Merci de votre patience.');
                break;
                
            case 'rejete':
                $mailMessage->subject('Votre dossier de candidature a été rejeté')
                    ->greeting('Bonjour ' . $notifiable->name . ',')
                    ->line('Nous vous informons que votre dossier de candidature a été rejeté.')
                    ->line('Motif: ' . $this->message)
                    ->action('Voir mon dossier', url('/etudiant/dossiers'))
                    ->line('Merci de votre compréhension.');
                break;
                
            case 'incomplet':
                $mailMessage->subject('Votre dossier de candidature est incomplet')
                    ->greeting('Bonjour ' . $notifiable->name . ',')
                    ->line('Nous vous informons que votre dossier de candidature a été marqué comme incomplet.')
                    ->line('Motif: ' . $this->message)
                    ->line('Veuillez compléter votre dossier en fournissant les informations manquantes.')
                    ->action('Voir mon dossier', url('/etudiant/dossiers'))
                    ->line('Merci de votre compréhension.');
                break;
        }
        
        return $mailMessage;
    }

    public function toArray($notifiable)
    {
        return [
            'dossier_id' => $this->dossier->id,
            'type' => $this->type,
            'message' => $this->message,
        ];
    }
}