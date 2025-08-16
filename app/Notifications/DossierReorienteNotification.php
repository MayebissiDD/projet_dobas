<?php
namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class DossierReorienteNotification extends Notification
{
    use Queueable;

    protected $ecole;
    protected $filiere;
    protected $motif;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct($ecole, $filiere, $motif = null)
    {
        $this->ecole = $ecole;
        $this->filiere = $filiere;
        $this->motif = $motif;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Réorientation de votre dossier de bourse')
            ->greeting('Bonjour ' . $notifiable->name . ',')
            ->line('Nous vous informons que votre dossier de bourse a été réorienté.')
            ->line('Nouvelle affectation: ' . $this->ecole)
            ->line('Filière: ' . $this->filiere)
            ->when($this->motif, function ($message) {
                $message->line('Motif: ' . $this->motif);
            })
            ->action('Consulter mon dossier', url('/etudiant/dossiers'))
            ->line('Merci de faire confiance à notre plateforme.')
            ->salutation('Cordialement, l\'équipe DOBAS');
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
            'ecole' => $this->ecole,
            'filiere' => $this->filiere,
            'motif' => $this->motif,
            'message' => 'Votre dossier a été réorienté vers ' . $this->ecole . ' (' . $this->filiere . ')',
        ];
    }
}