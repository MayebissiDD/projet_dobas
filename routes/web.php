<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Models
use App\Models\User;
use App\Models\Bourse;

// Controllers généraux
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\NewPasswordController;

// Public controllers
use App\Http\Controllers\Public\ContactController;
use App\Http\Controllers\Public\PaiementController as PublicPaiementController;
use App\Http\Controllers\Public\DossierControllerEt as PublicDossierController;

// Admin
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\StatsController;
use App\Http\Controllers\Admin\EcoleController;
use App\Http\Controllers\Admin\BourseController;
use App\Http\Controllers\Admin\PaiementController as AdminPaiementController;
use App\Http\Controllers\Admin\ActivityLogController;

// Agent
use App\Http\Controllers\Agent\DashboardController;
use App\Http\Controllers\Agent\DossierListController as AgentDossierListController;
use App\Http\Controllers\Agent\DossierActionController as AgentDossierActionController;
use App\Http\Controllers\Agent\AgentNotificationController;

// Étudiant
use App\Http\Controllers\Etudiant\DossierController as EtudiantDossierController;
use App\Http\Controllers\Student\PaiementController as StudentPaiementController;
use App\Http\Controllers\Etudiant\Auth\LoginController as EtudiantAuthController;

// --------------------
// ROUTES PUBLIQUES
// --------------------

Route::get('/', fn() => Inertia::render('Public/Home'))->name('home');
Route::get('/apropos', fn() => Inertia::render('Public/Apropos'))->name('apropos');
Route::get('/bourses', [BourseController::class, 'publicList'])->name('public.bourses');
Route::get('/postuler', fn() => Inertia::render('Public/Postuler'))->name('postuler');
Route::get('/contact', fn() => Inertia::render('Public/Contact'))->name('contact');
Route::post('/contact', [ContactController::class, 'send'])->name('contact.send');
Route::post('/paiement/public', [PublicPaiementController::class, 'pay'])->name('public.paiement');

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

    Route::get('/dashboard', fn () => redirect()->route('agent.dashboard'))->name('dashboard');
});

// --------------------
// AUTH UNIVERSAL
// --------------------

Route::get('/login', [LoginController::class, 'showLoginForm'])->name('login');
Route::post('/login', [LoginController::class, 'login']);
Route::post('/logout', [LoginController::class, 'logout'])->name('logout');

// Mot de passe oublié
Route::get('/forgot-password', [PasswordResetLinkController::class, 'create'])
    ->middleware('guest')->name('password.request');

Route::post('/forgot-password', [PasswordResetLinkController::class, 'store'])
    ->middleware('guest')->name('password.email');

Route::get('/reset-password/{token}', [NewPasswordController::class, 'create'])
    ->middleware('guest')->name('password.reset');

Route::post('/reset-password', [NewPasswordController::class, 'store'])
    ->middleware('guest')->name('password.update');

// --------------------
// AUTH ÉTUDIANT
// --------------------

Route::prefix('etudiant')->name('etudiant.')->group(function () {
    Route::get('login', [EtudiantAuthController::class, 'showLoginForm'])->name('login');
    Route::post('login', [EtudiantAuthController::class, 'login'])->name('login.submit');
    Route::post('logout', [EtudiantAuthController::class, 'logout'])->name('logout');

    Route::middleware('auth:etudiant')->group(function () {
        Route::get('dashboard', fn () => view('etudiant.dashboard'))->name('dashboard');
    });
});

// --------------------
// ÉTUDIANT
// --------------------

Route::middleware(['auth:etudiant'])->prefix('etudiant')->group(function () {
    Route::get('/dashboard', fn() => Inertia::render('Student/Dashboard'))->name('etudiant.dashboard');
    Route::get('/statut', fn() => Inertia::render('Student/ApplicationStatus'))->name('etudiant.status');

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

    Route::get('/dossiers', [AgentDossierListController::class, 'index'])->name('agent.dossiers.index');
    Route::get('/dossiers/{id}', [AgentDossierActionController::class, 'show'])->name('agent.dossiers.show');
    Route::post('/dossiers/{id}/valider', [AgentDossierActionController::class, 'valider'])->name('agent.dossiers.valider');
    Route::post('/dossiers/{id}/rejeter', [AgentDossierActionController::class, 'rejeter'])->name('agent.dossiers.rejeter');
    Route::post('/dossiers/{id}/affecter', [AgentDossierActionController::class, 'affecter'])->name('agent.dossiers.affecter');

    Route::get('/notifications', [AgentNotificationController::class, 'index'])->name('agent.notifications');
    Route::post('/notifications/read-all', [AgentNotificationController::class, 'markAllAsRead'])->name('agent.notifications.readAll');
    Route::post('/notifications/{id}/read', [AgentNotificationController::class, 'markAsRead'])->name('agent.notifications.read');
});

// --------------------
// ADMIN
// --------------------

Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [StatsController::class, 'index'])->name('dashboard');

    // Utilisateurs
    Route::get('/utilisateurs', [UserController::class, 'index'])->name('utilisateurs');
    Route::post('/utilisateurs/{user}/role', [UserController::class, 'assignRole'])->name('utilisateurs.assignRole');

    // Dossiers
    Route::get('/dossiers', fn() => Inertia::render('Admin/Dossiers'))->name('dossiers');
    Route::get('/dossiers/{id}', [AgentDossierActionController::class, 'show'])->name('dossiers.show');
    Route::get('/dossiers/{id}/edit', [AgentDossierActionController::class, 'edit'])->name('dossiers.edit');

    // Bourses
    Route::resource('/bourses', BourseController::class)->except(['show']);

    // Écoles
    Route::resource('/ecoles', EcoleController::class)->except(['show']);

    // Rapports
    Route::get('/rapports', fn() => Inertia::render('Admin/Rapports'))->name('rapports');
    Route::get('/rapports/logs', [ActivityLogController::class, 'index'])->name('rapports.logs');
    Route::get('/rapports/logs/csv', [ActivityLogController::class, 'exportCsv'])->name('rapports.logs.csv');
    Route::get('/rapports/logs/pdf', [ActivityLogController::class, 'exportPdf'])->name('rapports.logs.pdf');

    // Notifications
    Route::get('/notifications', function () {
        $notifications = User::first()->notifications()->latest()->take(50)->get();
        return Inertia::render('Admin/Notifications', compact('notifications'));
    })->name('notifications');

    // Paiements
    Route::post('/paiements/recu', [AdminPaiementController::class, 'paiementRecu'])->name('paiements.recu');
    Route::get('/paiements', [AdminPaiementController::class, 'index'])->name('paiements.index');

    // Stats
    Route::get('/stats', [StatsController::class, 'index'])->name('stats.dashboard');
    Route::get('/stats/export-csv', [StatsController::class, 'exportCsv'])->name('stats.export.csv');
});

// --------------------
// API PUBLIQUES POUR FRONT
// --------------------

Route::get('/api/bourses', [BourseController::class, 'apiList']);
Route::get('/api/ecoles', [EcoleController::class, 'apiList']);
Route::get('/api/filieres', fn() => response()->json(['filieres' => \App\Models\Filiere::all()]));
Route::get('/api/pieces', fn() => response()->json(['pieces' => \App\Models\Piece::all()]));
