<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\Etudiant;
use App\Models\Paiement;
use Illuminate\Support\Facades\Notification;
use App\Notifications\PaiementRecuNotification;

class PaiementWorkflowTest extends TestCase
{
    use RefreshDatabase;

    public function test_etudiant_voit_son_paiement_valide()
    {
        Notification::fake();
        $etudiant = Etudiant::factory()->create();
        $paiement = Paiement::factory()->create([
            'etudiant_id' => $etudiant->id,
            'statut' => 'valide',
        ]);
        $etudiant->notify(new PaiementRecuNotification());
        $this->actingAs($etudiant, 'etudiant')
            ->get('/etudiant/paiements')
            ->assertStatus(200)
            ->assertSee('Paiement');
        Notification::assertSentTo($etudiant, PaiementRecuNotification::class);
    }
}
