<?php
namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function send(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:100',
            'email' => 'required|email',
            'message' => 'required|string|min:10',
        ]);

        // Envoi d’email
        Mail::send([], [], function ($message) use ($request) {
            $message->to('dasylyadibde@gmail.com') // ← à modifier par ton adresse
                ->subject('Message via le site DOBAS')
                ->setBody("
                    Nom: {$request->nom}\n
                    Email: {$request->email}\n
                    Message:\n{$request->message}
                ", 'text/plain');
        });

        return back()->with('success', 'Message envoyé avec succès !');
    }
}
