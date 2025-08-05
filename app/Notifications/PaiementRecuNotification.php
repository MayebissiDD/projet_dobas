<?php
namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PaiementRecuNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $paiement;

    public function __construct($paiement = null)
    {
        $this->paiement = $paiement;
    }

    public function via($notifiable)
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Paiement reçu - DOBAS')
            ->greeting('Cher(e) ' . $notifiable->nom)
            ->line('Nous avons bien reçu votre paiement pour les frais de dossier.')
            ->line('Montant : ' . ($this->paiement->montant ?? '7500') . ' FCFA')
            ->line('Votre candidature est maintenant en cours de traitement.')
            ->action('Consulter votre dossier', url('/etudiant/dossiers'))
            ->line('Merci de faire confiance à DOBAS !');
    }

    public function toArray($notifiable)
    {
        return [
            'paiement_id' => $this->paiement->id ?? null,
            'montant' => $this->paiement->montant ?? '7500',
            'message' => 'Paiement reçu avec succès',
        ];
    }
}