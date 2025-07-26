<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Etudiant;
use App\Notifications\PaiementRecuNotification;
use Illuminate\Support\Facades\Notification;
use Illuminate\Foundation\Testing\RefreshDatabase;

class PaiementNotificationTest extends TestCase
{
    use RefreshDatabase;

    public function test_etudiant_recoit_notification_paiement_valide()
    {
        Notification::fake();
        $etudiant = Etudiant::factory()->create();
        $etudiant->notify(new PaiementRecuNotification());
        Notification::assertSentTo($etudiant, PaiementRecuNotification::class);
    }
}
