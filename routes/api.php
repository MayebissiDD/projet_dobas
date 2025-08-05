<?php

// Fichier routes/api.php minimaliste pour éviter les erreurs
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Route par défaut pour éviter les erreurs 404
Route::get('/', function () {
    return response()->json(['message' => 'API non implémentée']);
});
