<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Models
use App\Models\User;
use App\Models\Bourse;

// Controllers généraux
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Auth\{LoginController, PasswordResetLinkController, NewPasswordController};

// Public controllers
use App\Http\Controllers\Public\{ContactController, PostulerController, PaiementController as PublicPaiementController, DossierControllerEt as PublicDossierController};

// Admin
use App\Http\Controllers\Admin\{UserController, StatsController, EcoleController, BourseController, DossierController as AdminDossierController, PaiementController as AdminPaiementController, ActivityLogController};

// Agent
use App\Http\Controllers\Agent\{DashboardController, DossierListController as AgentDossierListController, DossierActionController as AgentDossierActionController, AgentNotificationController};

// Étudiant
use App\Http\Controllers\Etudiant\{DossierController as EtudiantDossierController, Auth\LoginController as EtudiantAuthController, ProfileController as EtudiantProfileController};
use App\Http\Controllers\Student\PaiementController as StudentPaiementController;

// --------------------
// ROUTES PUBLIQUES
// --------------------
Route::get('/', fn() => Inertia::render('Public/Home'))->name('home');
Route::get('/apropos', fn() => Inertia::render('Public/Apropos'))->name('apropos');
Route::get('/bourses', [BourseController::class, 'publicList'])->name('public.bourses');
Route::get('/postuler', fn() => Inertia::render('Public/Postuler'))->name('postuler');
Route::get('/contact', fn() => Inertia::render('Public/Contact'))->name('contact');
Route::post('/contact', [ContactController::class, 'send'])->name('contact.send');

Route::prefix('candidature')->name('candidature.')->group(function() {
    Route::get('/', [PostulerController::class, 'index'])->name('index');
    Route::post('/save-step', [PostulerController::class, 'saveStep'])->name('save-step');
    Route::post('/submit', [PostulerController::class, 'submitComplete'])->name('submit');
    Route::post('/upload', [PostulerController::class, 'uploadFile'])->name('upload');
    Route::get('/confirmation', [PostulerController::class, 'confirmation'])->name('confirmation');
    Route::post('/payment-success', [PostulerController::class, 'handlePaymentSuccess'])->name('payment.success');
});

Route::post('/api/dossiers/public', [PostulerController::class, 'submitComplete'])->name('public.dossiers.store');

Route::prefix('paiement')->name('paiement.')->group(function() {
    Route::post('/public', [PublicPaiementController::class, 'initiate'])->name('public.pay');
    Route::post('/initiate', [PublicPaiementController::class, 'initiate'])->name('initiate');
    Route::get('/status/{transactionId}', [PublicPaiementController::class, 'checkStatus'])->name('status');
    Route::get('/success', [PublicPaiementController::class, 'success'])->name('success');
    Route::get('/failure', [PublicPaiementController::class, 'failure'])->name('failure');
    Route::post('/lygos/callback', [PublicPaiementController::class, 'handleLygosCallback'])->name('lygos.callback');
    Route::post('/stripe/callback', [PublicPaiementController::class, 'handleStripeCallback'])->name('stripe.callback');
});

require __DIR__ . '/auth.php';

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('/dashboard', fn () => redirect()->route('agent.dashboard'))->name('dashboard');
});

// ÉTUDIANT
Route::prefix('etudiant')->name('etudiant.')->group(function () {
    Route::get('login', [EtudiantAuthController::class, 'showLoginForm'])->name('login');
    Route::post('login', [EtudiantAuthController::class, 'login'])->name('login.submit');
    Route::post('logout', [EtudiantAuthController::class, 'logout'])->name('logout');

    Route::get('/forgot-password', [PasswordResetLinkController::class, 'create'])->middleware('guest')->name('password.request');
    Route::post('/forgot-password', [PasswordResetLinkController::class, 'store'])->middleware('guest')->name('password.email');
    Route::get('/reset-password/{token}', [NewPasswordController::class, 'create'])->middleware('guest')->name('password.reset');
    Route::post('/reset-password', [NewPasswordController::class, 'store'])->middleware('guest')->name('password.update');

    Route::middleware(['auth:etudiant'])->group(function () {
        Route::get('/dashboard', fn() => Inertia::render('Student/Dashboard'))->name('dashboard');
        Route::get('/statut', fn() => Inertia::render('Student/ApplicationStatus'))->name('status');

        Route::get('/dossiers', [EtudiantDossierController::class, 'index'])->name('dossiers.index');
        Route::get('/dossiers/create', [EtudiantDossierController::class, 'create'])->name('dossiers.create');
        Route::post('/dossiers', [EtudiantDossierController::class, 'store'])->name('dossiers.store');
        Route::get('/dossiers/{id}', [EtudiantDossierController::class, 'show'])->name('dossiers.show');

        Route::get('/paiements', [StudentPaiementController::class, 'index'])->name('paiements.index');
        Route::get('/paiement', [StudentPaiementController::class, 'webview'])->name('paiement.webview');
        Route::get('/paiement/lygos/callback', [StudentPaiementController::class, 'lygosCallback'])->name('paiement.lygos.callback');
        Route::get('/paiement/stripe/callback', [StudentPaiementController::class, 'stripeCallback'])->name('paiement.stripe.callback');
        Route::get('/paiement/lygos/status', [StudentPaiementController::class, 'lygosStatus'])->name('paiement.lygos.status');

        Route::get('/profil', [EtudiantProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/profil', [EtudiantProfileController::class, 'update'])->name('profile.update');
        Route::put('/profil/password', [EtudiantProfileController::class, 'updatePassword'])->name('profile.password');
    });
});

// AGENT
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

// ADMIN
Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [StatsController::class, 'index'])->name('dashboard');

    Route::get('/utilisateurs', [UserController::class, 'index'])->name('utilisateurs');
    Route::post('/utilisateurs/{user}/role', [UserController::class, 'assignRole'])->name('utilisateurs.assignRole');

    Route::resource('dossiers', AdminDossierController::class)->only(['index', 'show']);
    Route::get('/dossiers/{id}/edit', [AdminDossierController::class, 'edit'])->name('dossiers.edit');
    Route::post('/dossiers/{dossier}/status', [AdminDossierController::class, 'updateStatus'])->name('dossiers.update-status');
    Route::post('/dossiers/{dossier}/comment', [AdminDossierController::class, 'addComment'])->name('dossiers.add-comment');
    Route::post('/dossiers/{dossier}/notify', [AdminDossierController::class, 'sendNotification'])->name('dossiers.send-notification');
    Route::get('/dossiers/{dossier}/pieces/{piece}/download', [AdminDossierController::class, 'downloadPiece'])->name('dossiers.download-piece');
    Route::get('/dossiers/{dossier}/download-all', [AdminDossierController::class, 'downloadAllPieces'])->name('dossiers.download-all');

    Route::resource('/bourses', BourseController::class)->except(['show']);
    Route::resource('/ecoles', EcoleController::class)->except(['show']);

    Route::get('/rapports', fn() => Inertia::render('Admin/Rapports'))->name('rapports');
    Route::get('/rapports/logs', [ActivityLogController::class, 'index'])->name('rapports.logs');
    Route::get('/rapports/logs/csv', [ActivityLogController::class, 'exportCsv'])->name('rapports.logs.csv');
    Route::get('/rapports/logs/pdf', [ActivityLogController::class, 'exportPdf'])->name('rapports.logs.pdf');
    Route::post('/generate-report', [AdminDossierController::class, 'generateReport'])->name('generate-report');

    Route::get('/notifications', function () {
        $notifications = User::first()->notifications()->latest()->take(50)->get();
        return Inertia::render('Admin/Notifications', compact('notifications'));
    })->name('notifications');

    Route::post('/paiements/recu', [AdminPaiementController::class, 'paiementRecu'])->name('paiements.recu');
    Route::get('/paiements', [AdminPaiementController::class, 'index'])->name('paiements.index');

    Route::get('/stats', [StatsController::class, 'index'])->name('stats.dashboard');
    Route::get('/stats/export-csv', [StatsController::class, 'exportCsv'])->name('stats.export.csv');
});

// API PUBLIQUES POUR FRONT
Route::get('/api/bourses', [BourseController::class, 'apiList']);
Route::get('/api/ecoles', [EcoleController::class, 'apiList']);
Route::get('/api/filieres', fn() => response()->json(['filieres' => \App\Models\Filiere::all()]));
Route::get('/api/pieces', fn() => response()->json(['pieces' => \App\Models\Piece::all()]));

// API POUR DONNÉES DYNAMIQUES
Route::prefix('api')->group(function() {
    Route::get('/bourses', fn() => response()->json(['bourses' => \App\Models\Bourse::active()->get()]));
    Route::get('/etablissements', fn() => response()->json(['etablissements' => \App\Models\Etablissement::active()->get()]));
});
