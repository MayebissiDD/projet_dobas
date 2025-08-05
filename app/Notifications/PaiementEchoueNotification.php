<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PaiementEchoueNotification extends Notification implements ShouldQueue
{
    use Queueable;
    
    protected $paiement;
    
    public function __construct($paiement)
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
            ->subject('Échec de votre paiement - DOBAS')
            ->greeting('Cher(e) ' . $notifiable->nom)
            ->line('Nous avons rencontré un problème lors du traitement de votre paiement.')
            ->line('Montant : ' . $this->paiement->montant . ' FCFA')
            ->line('Veuillez réessayer ultérieurement ou contacter notre support.')
            ->action('Réessayer le paiement', url('/etudiant/paiement/' . $this->paiement->id))
            ->line('Merci de votre compréhension.');
    }
    
    public function toArray($notifiable)
    {
        return [
            'paiement_id' => $this->paiement->id,
            'montant' => $this->paiement->montant,
            'message' => 'Échec du paiement',
        ];
    }
}