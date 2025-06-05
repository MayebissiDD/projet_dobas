<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\User;
use Spatie\Permission\Models\Role;

// Contrôleurs
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Public\ContactController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Agent\DossierController;

// --------------------
// ROUTES PUBLIQUES
// --------------------

Route::get('/', fn() => Inertia::render('Public/Home'))->name('home');
Route::get('/apropos', fn() => Inertia::render('Public/Apropos'))->name('apropos');
Route::get('/bourses', fn() => Inertia::render('Public/Bourses'))->name('bourses');
Route::get('/postuler', fn() => Inertia::render('Public/Postuler'))->name('postuler');
Route::get('/contact', fn() => Inertia::render('Public/Contact'))->name('contact');
Route::post('/contact', [ContactController::class, 'send'])->name('contact.send');

// --------------------
// AUTHENTIFICATION & PROFIL
// --------------------

require __DIR__ . '/auth.php';

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// --------------------
// ÉTUDIANT
// --------------------

Route::middleware(['auth', 'role:etudiant'])->prefix('etudiant')->group(function () {
    Route::get('/dashboard', fn() => Inertia::render('Student/Dashboard'))->name('etudiant.dashboard');
    Route::get('/statut', fn() => Inertia::render('Student/ApplicationStatus'))->name('etudiant.status');
    Route::get('/dossiers', [DossierController::class, 'index'])->name('etudiant.dossiers.index');
    Route::get('/dossiers/{id}', [DossierController::class, 'show'])->name('etudiant.dossiers.show');
});

// --------------------
// AGENT
// --------------------

Route::middleware(['auth', 'role:agent'])->prefix('agent')->group(function () {
    Route::get('/dossiers', fn() => Inertia::render('Agent/DossierList'))->name('agent.dossiers.index');
    Route::get('/dossiers/{id}', fn($id) => Inertia::render('Agent/DossierDetails', ['id' => $id]))->name('agent.dossiers.show');
    Route::get('/dossiers/{id}/edit', fn($id) => Inertia::render('Agent/EditDossier', ['id' => $id]))->name('agent.dossiers.edit');
});

// --------------------
// ADMIN
// --------------------
Route::middleware(['auth', 'role:admin'])->prefix('admin')->group(function () {
    // Dashboard avec données
    Route::get('/dashboard', function () {
        $users = User::with('roles')->paginate(10);
        $roles = Role::all();

        return Inertia::render('Admin/Dashboard', [
            'users' => $users,
            'roles' => $roles,
        ]);
    })->name('admin.dashboard');

    // Utilisateurs
    Route::get('/utilisateurs', fn() => Inertia::render('Admin/Utilisateurs'))->name('admin.utilisateurs');
    Route::post('/utilisateurs/{user}/role', [UserController::class, 'assignRole'])->name('utilisateurs.assignRole');

    // Dossiers
    Route::get('/dossiers', fn() => Inertia::render('Admin/Dossiers'))->name('admin.dossiers');
    Route::get('/dossiers/{id}', [DossierController::class, 'adminShow'])->name('admin.dossiers.show');
    Route::get('/dossiers/{id}/edit', [DossierController::class, 'adminEdit'])->name('admin.dossiers.edit');

    // Rapports
    Route::get('/rapports', fn() => Inertia::render('Admin/Rapports'))->name('admin.rapports');

    // Bourses
    Route::get('/bourses', fn() => Inertia::render('Admin/Bourses'))->name('admin.bourses');

    // Écoles
    Route::get('/ecoles', fn() => Inertia::render('Admin/Ecoles'))->name('admin.ecoles');

    // Notifications
    Route::get('/notifications', fn() => Inertia::render('Admin/Notifications'))->name('admin.notifications');
});
