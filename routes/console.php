<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Planification de la suppression automatique des dossiers rejetés depuis plus d'un mois
Artisan::command('purge-rejetes-schedule', function () {
    Artisan::call('dossiers:purge-rejetes');
})->purpose('Purge automatique des dossiers rejetés depuis plus d\'un mois')
  ->daily();
