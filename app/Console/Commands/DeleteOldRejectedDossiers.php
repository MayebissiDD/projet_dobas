<?php
namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Dossier;
use Carbon\Carbon;

class DeleteOldRejectedDossiers extends Command
{
    protected $signature = 'dossiers:purge-rejetes';
    protected $description = 'Supprime les dossiers rejetés depuis plus d\'un mois';

    public function handle()
    {
        $count = Dossier::where('statut', 'rejeté')
            ->where('updated_at', '<', Carbon::now()->subMonth())
            ->delete();
        $this->info("$count dossiers rejetés supprimés.");
    }
}
