<?php

// Fichier routes/api.php minimaliste pour éviter les erreurs
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MTNTindaController;

// Route par défaut pour éviter les erreurs 404
Route::get('/', function () {
    return response()->json(['message' => 'API non implémentée']);
});

Route::prefix('mtn-tinda')->group(function () {
    Route::post('/sms/send', [MTNTindaController::class, 'sendSMS']);
    Route::post('/sms/send-custom', [MTNTindaController::class, 'sendCustomSMS']);
    Route::post('/sms/status', [MTNTindaController::class, 'checkSMSStatus']);
});