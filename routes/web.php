<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Modèles
use App\Models\User;
use App\Models\Bourse;

// Contrôleurs publics
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Public\ContactController;
use App\Http\Controllers\Public\PaiementController as PublicPaiementController;
use App\Http\Controllers\Public\DossierControllerEt as PublicDossierController;

// Contrôleurs admin
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\StatsController;
use App\Http\Controllers\Admin\EcoleController;
use App\Http\Controllers\Admin\BourseController;
use App\Http\Controllers\Admin\PaiementController as AdminPaiementController;
use App\Http\Controllers\Admin\ActivityLogController;

// Contrôleurs agent
use App\Http\Controllers\Agent\DossierController as AgentDossierController;
use App\Http\Controllers\Agent\DashboardController;

// Contrôleurs étudiant
use App\Http\Controllers\Etudiant\DossierController as EtudiantDossierController;
use App\Http\Controllers\Student\PaiementController as StudentPaiementController;

// --------------------
// ROUTES PUBLIQUES
// --------------------

Route::get('/', fn () => Inertia::render('Public/Home'))->name('home');
Route::get('/apropos', fn () => Inertia::render('Public/Apropos'))->name('apropos');
Route::get('/bourses', [BourseController::class, 'publicList'])->name('public.bourses');
Route::get('/postuler', fn () => Inertia::render('Public/Postuler'))->name('postuler');
Route::get('/contact', fn () => Inertia::render('Public/Contact'))->name('contact');
Route::post('/contact', [ContactController::class, 'send'])->name('contact.send');
Route::post('/paiement/public', [PublicPaiementController::class, 'pay'])->name('public.paiement');

// API publique
Route::get('/api/bourses/{id}', [BourseController::class, 'apiShow']);
Route::post('/api/dossiers/public', [PublicDossierController::class, 'store'])->name('public.dossiers.store');

// --------------------
// AUTHENTIFICATION & PROFIL
// --------------------

require __DIR__ . '/auth.php';

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/dashboard', function () {
        return redirect()->route('agent.dashboard');
    })->name('dashboard');
});

// --------------------
// ÉTUDIANT
// --------------------

Route::middleware(['auth:etudiant'])->prefix('etudiant')->group(function () {
    Route::get('/dashboard', fn () => Inertia::render('Student/Dashboard'))->name('etudiant.dashboard');
    Route::get('/statut', fn () => Inertia::render('Student/ApplicationStatus'))->name('etudiant.status');

    Route::get('/dossiers', [EtudiantDossierController::class, 'index'])->name('etudiant.dossiers.index');
    Route::get('/dossiers/create', [EtudiantDossierController::class, 'create'])->name('etudiant.dossiers.create');
    Route::post('/dossiers', [EtudiantDossierController::class, 'store'])->name('etudiant.dossiers.store');
    Route::get('/dossiers/{id}', [EtudiantDossierController::class, 'show'])->name('etudiant.dossiers.show');

    Route::get('/paiements', [StudentPaiementController::class, 'index'])->name('etudiant.paiements.index');
    Route::get('/paiement', [StudentPaiementController::class, 'webview'])->name('etudiant.paiement.webview');
    Route::get('/paiement/lygos/callback', [StudentPaiementController::class, 'lygosCallback'])->name('etudiant.paiement.lygos.callback');
    Route::get('/paiement/stripe/callback', [StudentPaiementController::class, 'stripeCallback'])->name('etudiant.paiement.stripe.callback');
    Route::get('/paiement/lygos/status', [StudentPaiementController::class, 'lygosStatus'])->name('etudiant.paiement.lygos.status');
});

// --------------------
// AGENT
// --------------------

Route::middleware(['auth', 'role:agent'])->prefix('agent')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'dashboard'])->name('agent.dashboard');

    Route::get('/dossiers', fn () => Inertia::render('Agent/DossierList'))->name('agent.dossiers.index');
    Route::get('/dossiers/{id}', fn ($id) => Inertia::render('Agent/DossierDetails', ['id' => $id]))->name('agent.dossiers.show');
    Route::get('/dossiers/{id}/edit', fn ($id) => Inertia::render('Agent/EditDossier', ['id' => $id]))->name('agent.dossiers.edit');

    Route::post('/dossiers/{id}/valider', [AgentDossierController::class, 'valider'])->name('agent.dossiers.valider');
    Route::post('/dossiers/{id}/rejeter', [AgentDossierController::class, 'rejeter'])->name('agent.dossiers.rejeter');
    Route::post('/dossiers/{id}/affecter', [AgentDossierController::class, 'affecter'])->name('agent.dossiers.affecter');
    Route::get('/notifications', fn () => Inertia::render('Agent/Notifications'))->name('agent.notifications');

});

// --------------------
// ADMIN
// --------------------

Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    // Dashboard (stats)
    Route::get('/dashboard', [StatsController::class, 'index'])->name('dashboard');

    // Utilisateurs
    Route::get('/utilisateurs', [UserController::class, 'index'])->name('utilisateurs');
    Route::post('/utilisateurs/{user}/role', [UserController::class, 'assignRole'])->name('utilisateurs.assignRole');

    // Dossiers
    Route::get('/dossiers', fn () => Inertia::render('Admin/Dossiers'))->name('dossiers');
    Route::get('/dossiers/{id}', [AgentDossierController::class, 'show'])->name('dossiers.show');
    Route::get('/dossiers/{id}/edit', [AgentDossierController::class, 'edit'])->name('dossiers.edit');

    // Bourses
    Route::get('/bourses', [BourseController::class, 'index'])->name('bourses.index');
    Route::get('/bourses/create', [BourseController::class, 'create'])->name('bourses.create');
    Route::post('/bourses', [BourseController::class, 'store'])->name('bourses.store');
    Route::get('/bourses/{id}/edit', [BourseController::class, 'edit'])->name('bourses.edit');
    Route::put('/bourses/{id}', [BourseController::class, 'update'])->name('bourses.update');
    Route::delete('/bourses/{id}', [BourseController::class, 'destroy'])->name('bourses.destroy');

    // Écoles
    Route::get('/ecoles', [EcoleController::class, 'index'])->name('ecoles.index');
    Route::get('/ecoles/create', [EcoleController::class, 'create'])->name('ecoles.create');
    Route::post('/ecoles', [EcoleController::class, 'store'])->name('ecoles.store');
    Route::get('/ecoles/{id}/edit', [EcoleController::class, 'edit'])->name('ecoles.edit');
    Route::put('/ecoles/{id}', [EcoleController::class, 'update'])->name('ecoles.update');
    Route::delete('/ecoles/{id}', [EcoleController::class, 'destroy'])->name('ecoles.destroy');

    // Rapports
    Route::get('/rapports', fn () => Inertia::render('Admin/Rapports'))->name('rapports');
    Route::get('/rapports/logs', [ActivityLogController::class, 'index'])->name('rapports.logs');
    Route::get('/rapports/logs/csv', [ActivityLogController::class, 'exportCsv'])->name('rapports.logs.csv');
    Route::get('/rapports/logs/pdf', [ActivityLogController::class, 'exportPdf'])->name('rapports.logs.pdf');

    // Notifications (à adapter)
    Route::get('/notifications', function () {
        $notifications = \App\Models\User::first()->notifications()->latest()->take(50)->get();
        return Inertia::render('Admin/Notifications', compact('notifications'));
    })->name('notifications');

    // Paiements
    Route::post('/paiements/recu', [AdminPaiementController::class, 'paiementRecu'])->name('paiements.recu');
    Route::get('/paiements', [AdminPaiementController::class, 'index'])->name('paiements.index');

    // Statistiques
    Route::get('/stats', [StatsController::class, 'index'])->name('stats.dashboard');
    Route::get('/stats/export-csv', [StatsController::class, 'exportCsv'])->name('stats.export.csv');
});

// --------------------
// API PUBLIQUES POUR LE FRONT
// --------------------

Route::get('/api/bourses', [BourseController::class, 'apiList']);
Route::get('/api/ecoles', [EcoleController::class, 'apiList']);
Route::get('/api/filieres', fn () => response()->json(['filieres' => \App\Models\Filiere::all()]));
Route::get('/api/pieces', fn () => response()->json(['pieces' => \App\Models\Piece::all()]));
