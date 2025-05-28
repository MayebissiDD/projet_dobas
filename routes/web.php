<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Contrôleurs
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Public\ContactController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Agent\DossierController;

// --------------------
// ROUTES PUBLIQUES
// --------------------

Route::get('/', fn () => Inertia::render('Public/Home'))->name('home');
Route::get('/apropos', fn () => Inertia::render('Public/Apropos'))->name('apropos');
Route::get('/bourses', fn () => Inertia::render('Public/Bourses'))->name('bourses');
Route::get('/postuler', fn () => Inertia::render('Public/Postuler'))->name('postuler');
Route::get('/contact', fn () => Inertia::render('Public/Contact'))->name('contact');
Route::post('/contact', [ContactController::class, 'send'])->name('contact.send');

// --------------------
// AUTHENTIFICATION & PROFIL
// --------------------

require __DIR__.'/auth.php';

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// --------------------
// ÉTUDIANT
// --------------------

Route::middleware(['auth', 'role:etudiant'])->prefix('etudiant')->group(function () {
    Route::get('/dashboard', fn () => Inertia::render('Student/Dashboard'))->name('etudiant.dashboard');
    Route::get('/statut', fn () => Inertia::render('Student/ApplicationStatus'))->name('etudiant.status');
    Route::get('/dossiers', [DossierController::class, 'index'])->name('etudiant.dossiers.index');
    Route::get('/dossiers/{id}', [DossierController::class, 'show'])->name('etudiant.dossiers.show');
});

// --------------------
// AGENT
// --------------------

Route::middleware(['auth', 'role:agent'])->prefix('agent')->group(function () {
    Route::get('/dossiers', fn () => Inertia::render('Agent/DossierList'))->name('agent.dossiers.index');
    Route::get('/dossiers/{id}', fn ($id) => Inertia::render('Agent/DossierDetails', ['id' => $id]))->name('agent.dossiers.show');
    Route::get('/dossiers/{id}/edit', fn ($id) => Inertia::render('Agent/EditDossier', ['id' => $id]))->name('agent.dossiers.edit');
});

// --------------------
// ADMIN
// --------------------

Route::redirect('/admin/users/utilisateurs', '/admin/utilisateurs'); // Alias supplémentaire

Route::middleware(['auth', 'role:admin'])->prefix('admin')->group(function () {
    Route::get('/utilisateurs', fn () => Inertia::render('Admin/Users/Index'))->name('admin.utilisateurs.index');
    Route::post('/utilisateurs/{user}/role', [UserController::class, 'assignRole'])->name('utilisateurs.assignRole');
    Route::get('/dashboard', fn () => Inertia::render('Admin/Dashboard'))->name('admin.dashboard');
    Route::get('/dossiers', [DossierController::class, 'adminIndex'])->name('admin.dossiers.index');
    Route::get('/dossiers/{id}', [DossierController::class, 'adminShow'])->name('admin.dossiers.show');
    Route::get('/dossiers/{id}/edit', [DossierController::class, 'adminEdit'])->name('admin.dossiers.edit');
});
