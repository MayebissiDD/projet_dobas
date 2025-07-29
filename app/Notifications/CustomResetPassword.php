<?php
namespace App\Notifications;

use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Notifications\Messages\MailMessage;

class CustomResetPassword extends ResetPassword
{
    public function toMail($notifiable)
    {
        $resetUrl = url(route('password.reset', [
            'token' => $this->token,
            'email' => $notifiable->getEmailForPasswordReset(),
        ], false));

        return (new MailMessage)
            ->subject('Réinitialisation de votre mot de passe')
            ->line('Vous avez demandé la réinitialisation de votre mot de passe.')
            ->action('Réinitialiser le mot de passe', $resetUrl)
            ->line('Si vous n’avez pas demandé de réinitialisation, ignorez cet e-mail.');
    }
}
