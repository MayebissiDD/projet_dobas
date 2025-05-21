<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Agent\DossierController;
use App\Http\Controllers\Agent\AgentDossierController;
use App\Http\Controllers\Student\StudentDossierController;
use App\Http\Controllers\Student\StudentController;
use App\Http\Controllers\Student\StudentBourseController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';


Route::get('/', fn () => Inertia::render('Public/Home'));
Route::get('/bourses', fn () => Inertia::render('Public/BourseList'));
Route::get('/postuler', fn () => Inertia::render('Public/PostulerForm'));


Route::middleware(['auth', 'role:etudiant'])->group(function () {
    Route::get('/etudiant/dashboard', function () {
        return Inertia::render('Student/Dashboard');
    });
});

Route::middleware(['auth', 'role:agent'])->prefix('agent')->group(function () {
    Route::get('/dossiers', [DossierController::class, 'index']);
    Route::get('/dossiers/{id}', [DossierController::class, 'show']);
});


Route::middleware(['auth', 'role:agent'])->group(function () {
    Route::get('/agent/dossiers', [DossierController::class, 'index'])->name('agent.dossiers.index');
    Route::get('/agent/dossiers/{id}', [DossierController::class, 'show'])->name('agent.dossiers.show');
});
