<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\WebhookController;

// Models
use App\Models\User;
use App\Models\Bourse;

// Controllers généraux
use App\Http\Controllers\Auth\{
    LoginController,
    PasswordResetLinkController,
    NewPasswordController,
    UserProfileController,
    EtudiantPasswordResetController,
    PasswordController
};

// Public controllers
use App\Http\Controllers\Public\{
    ContactController,
    PostulerController,
    PaiementController as PublicPaiementController
};

// Admin
use App\Http\Controllers\Admin\{
    UserController,
    StatsController,
    EcoleController,
    BourseController,
    DossierController as AdminDossierController,
    PaiementController as AdminPaiementController,
    ActivityLogController,
    NotificationsController
};

// Agent
use App\Http\Controllers\Agent\{
    DashboardController as AgentDashboardController,
    DossierListController,
    DossierActionController as AgentDossierActionController,
    AgentNotificationController,
    PieceController
};

// Étudiant
use App\Http\Controllers\Student\EtudiantDossierController;
use App\Http\Controllers\Student\{
    EtudiantDashboardController,
    PaiementController as StudentPaiementController,
    NotificationController as StudentNotificationController,
    EtudiantProfileController
};

// --------------------
// WEBHOOKS (sans CSRF)
// --------------------
Route::post('/webhooks/lygos', [WebhookController::class, 'lygos'])->name('webhooks.lygos');
Route::post('/webhooks/stripe', [WebhookController::class, 'stripe'])->name('webhooks.stripe');

// --------------------
// ROUTES PUBLIQUES
// --------------------
Route::get('/', fn() => Inertia::render('Public/Home'))->name('home');
Route::get('/apropos', fn() => Inertia::render('Public/Apropos'))->name('apropos');
Route::get('/bourses', [BourseController::class, 'publicList'])->name('public.bourses');
Route::get('/postuler', fn() => Inertia::render('Public/Postuler'))->name('postuler');
Route::get('/contact', fn() => Inertia::render('Public/Contact'))->name('contact');
Route::post('/contact', [ContactController::class, 'send'])->name('contact.send');

// Routes de candidature
Route::prefix('candidature')->name('candidature.')->group(function () {
    Route::get('/', [PostulerController::class, 'index'])->name('index');
    Route::post('/submit', [PostulerController::class, 'submitComplete'])->name('submit');
    Route::get('/confirmation', [PostulerController::class, 'confirmation'])->name('confirmation');
    Route::post('/payment-success', [PostulerController::class, 'handlePaymentSuccess'])->name('payment.success');
});

// Routes de paiement publiques
Route::prefix('paiement')->name('paiement.')->group(function () {
    Route::post('/initiate', [PublicPaiementController::class, 'initiate'])->name('initiate');
    Route::get('/success', [PublicPaiementController::class, 'success'])->name('success');
    Route::get('/failure', [PublicPaiementController::class, 'failure'])->name('failure');
    Route::get('/status/{transactionId}', [PublicPaiementController::class, 'checkStatus'])->name('status');

    // Callbacks pour retours utilisateur
    Route::post('/lygos/callback', [PublicPaiementController::class, 'lygosCallback'])->name('lygos.callback');
    Route::get('/paiement/lygos/callback', [PublicPaiementController::class, 'lygosCallback'])->name('paiement.lygos.callback');
    Route::get('/lygos/return', [PublicPaiementController::class, 'lygosReturn'])->name('lygos.return');
    Route::get('/stripe/return', [PublicPaiementController::class, 'stripeReturn'])->name('stripe.return');
});

// API endpoints pour le front (sans authentification)
Route::prefix('api')->group(function () {
    Route::get('/bourses', [BourseController::class, 'apiList']);
    Route::get('/ecoles', [EcoleController::class, 'apiList']);
    Route::get('/etablissements', [EcoleController::class, 'apiEtablissements']);
    Route::get('/filieres', fn() => response()->json(['filieres' => \App\Models\Filiere::all()]));
    Route::get('/pieces', fn() => response()->json(['pieces' => \App\Models\Piece::all()]));

    // Données dynamiques
    Route::get('/bourses/actives', fn() => response()->json(['bourses' => \App\Models\Bourse::active()->get()]));
    Route::get('/etablissements/actifs', fn() => response()->json(['etablissements' => \App\Models\Etablissement::active()->get()]));
});

// --------------------
// ROUTES D'AUTHENTIFICATION
// --------------------
Route::middleware('guest:web,etudiant')->group(function () {
    // Connexion
    Route::get('login', [LoginController::class, 'showLoginForm'])->name('login');
    Route::post('login', [LoginController::class, 'login'])->name('login.store');

    // Mot de passe oublié
    Route::get('forgot-password', [EtudiantPasswordResetController::class, 'create'])->name('password.request');
    Route::post('forgot-password', [EtudiantPasswordResetController::class, 'store'])->name('password.email');
    Route::get('reset-password/{token}', [NewPasswordController::class, 'create'])->name('password.reset');
    Route::post('reset-password', [NewPasswordController::class, 'store'])->name('password.update');
});

// Routes accessibles aux utilisateurs connectés
Route::middleware('auth:web,etudiant')->group(function () {
    Route::post('/logout', [LoginController::class, 'logout'])->name('logout');

    // Profil commun
    Route::get('/profile', [UserProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [UserProfileController::class, 'update'])->name('profile.update');
    Route::put('/password', [PasswordController::class, 'update'])->name('password.update');
});

// --------------------
// ROUTES ÉTUDIANT
// --------------------
Route::prefix('etudiant')->name('etudiant.')->middleware('auth:etudiant')->group(function () {
    // Dashboard
    Route::get('/dashboard', [EtudiantDashboardController::class, 'index'])->name('dashboard');
    Route::get('/statut', fn() => Inertia::render('Student/ApplicationStatus'))->name('status');

    // Dossiers
    Route::get('/dossiers', [\App\Http\Controllers\Student\EtudiantDossierController::class, 'index'])->name('dossiers.index');
    Route::get('/dossiers/create', [\App\Http\Controllers\Student\EtudiantDossierController::class, 'create'])->name('dossiers.create');
    Route::post('/dossiers', [\App\Http\Controllers\Student\EtudiantDossierController::class, 'store'])->name('dossiers.store');
    Route::get('/dossiers/{id}', [\App\Http\Controllers\Student\EtudiantDossierController::class, 'show'])->name('dossiers.show');
    Route::get('/dossiers/{dossier}/pieces/{piece}/download', [\App\Http\Controllers\Student\EtudiantDossierController::class, 'downloadPiece'])->name('dossiers.download-piece');
    Route::get('/dossiers/{dossier}/download-all', [\App\Http\Controllers\Student\EtudiantDossierController::class, 'downloadAllPieces'])->name('dossiers.download-all');

    // Paiements
    Route::get('/paiements', [\App\Http\Controllers\Student\PaiementController::class, 'index'])->name('paiements.index');
    Route::get('/paiement', [\App\Http\Controllers\Student\PaiementController::class, 'webview'])->name('paiement.webview');
    Route::get('/paiement/lygos/status', [\App\Http\Controllers\Student\PaiementController::class, 'lygosStatus'])->name('paiement.lygos.status');

    // Notifications
    Route::get('/notifications', [\App\Http\Controllers\Student\NotificationController::class, 'index'])->name('notifications.index');
    Route::post('/notifications/{id}/read', [\App\Http\Controllers\Student\NotificationController::class, 'markAsRead'])->name('notifications.read');
    Route::post('/notifications/read-all', [\App\Http\Controllers\Student\NotificationController::class, 'markAllAsRead'])->name('notifications.read-all');

    // Profil
    Route::get('/profil', [EtudiantProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profil', [EtudiantProfileController::class, 'update'])->name('profile.update');
    Route::put('/profil/password', [EtudiantProfileController::class, 'updatePassword'])->name('profile.password');
});

// --------------------
// ROUTES AGENT
// --------------------
Route::prefix('agent')->name('agent.')->middleware(['auth:web', 'role:agent'])->group(function () {
    // Dashboard
    Route::get('/dashboard', [AgentDashboardController::class, 'dashboard'])->name('dashboard');
    
    // Dossiers
    Route::get('/dossiers', [DossierListController::class, 'index'])->name('dossiers.index');
    Route::get('/dossiers/{id}', [DossierListController::class, 'show'])->name('dossiers.show'); // Correction ici
    Route::get('/api/dossiers', [DossierListController::class, 'apiList'])->name('dossiers.api'); // Ajout de cette route
    
    // Actions sur les dossiers
    Route::post('/dossiers/{id}/valider', [AgentDossierActionController::class, 'valider'])->name('dossiers.valider');
    Route::post('/dossiers/{id}/rejeter', [AgentDossierActionController::class, 'rejeter'])->name('dossiers.rejeter');
    Route::post('/dossiers/{id}/affecter', [AgentDossierActionController::class, 'affecter'])->name('dossiers.affecter');
    Route::post('/dossiers/{id}/incomplet', [AgentDossierActionController::class, 'marquerIncomplet'])->name('dossiers.incomplet');
    
    // Pièces jointes
    Route::get('/dossiers/{dossierId}/pieces/{pieceId}/download', [PieceController::class, 'download'])->name('dossiers.pieces.download');
    
    // Notifications
    Route::get('/notifications', [AgentNotificationController::class, 'index'])->name('notifications.index');
    Route::post('/notifications/read-all', [AgentNotificationController::class, 'markAllAsRead'])->name('notifications.read-all');
    Route::post('/notifications/{id}/read', [AgentNotificationController::class, 'markAsRead'])->name('notifications.read');
    Route::get('/agent/notifications', [AgentNotificationController::class, 'index'])->name('agent.notifications');
    Route::post('/agent/notifications/markAllAsRead', [AgentNotificationController::class, 'markAllAsRead'])->name('agent.notifications.markAllAsRead');
    Route::post('/agent/notifications/markAsRead', [AgentNotificationController::class, 'markAsRead'])->name('agent.notifications.markAsRead');
    Route::delete('/agent/notifications/{id}', [AgentNotificationController::class, 'destroy'])->name('agent.notifications.destroy');
    // Profil
    Route::get('/profil', [\App\Http\Controllers\Auth\UserProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profil', [\App\Http\Controllers\Auth\UserProfileController::class, 'update'])->name('profile.update');
    Route::put('/profil/password', [\App\Http\Controllers\Auth\PasswordController::class, 'update'])->name('profile.password');
});
// --------------------
// ROUTES ADMIN
// --------------------
Route::prefix('admin')->name('admin.')->middleware(['auth:web', 'role:admin'])->group(function () {
    // Dashboard
    Route::get('/dashboard', [StatsController::class, 'index'])->name('dashboard');

    // Utilisateurs
    Route::get('/utilisateurs', [UserController::class, 'index'])->name('utilisateurs');
    Route::post('/utilisateurs/{user}/role', [UserController::class, 'assignRole'])->name('utilisateurs.assignRole');

    // Dossiers
    Route::get('/dossiers', [AdminDossierController::class, 'index'])->name('dossiers.index');
    Route::get('/dossiers/{id}', [AdminDossierController::class, 'show'])->name('dossiers.show');
    Route::post('/dossiers/{dossier}/status', [AdminDossierController::class, 'updateStatus'])->name('dossiers.update-status');
    Route::post('/dossiers/batch-validate', [AdminDossierController::class, 'batchValidate'])->name('dossiers.batch-validate');
    Route::get('/dossiers/print-list', [AdminDossierController::class, 'printList'])->name('dossiers.print-list');
    Route::post('/dossiers/{dossier}/comment', [AdminDossierController::class, 'addComment'])->name('dossiers.add-comment');
    Route::post('/dossiers/{dossier}/notify', [AdminDossierController::class, 'sendNotification'])->name('dossiers.send-notification');
    Route::get('/dossiers/{dossier}/pieces/{piece}/download', [AdminDossierController::class, 'downloadPiece'])->name('dossiers.download-piece');
    Route::get('/dossiers/{dossier}/download-all', [AdminDossierController::class, 'downloadAllPieces'])->name('dossiers.download-all');

    // Bourses et Écoles
    Route::resource('/bourses', BourseController::class)->except(['show']);
    Route::resource('/ecoles', EcoleController::class)->except(['show']);

    // Paiements
    Route::get('/paiements', [AdminPaiementController::class, 'index'])->name('paiements.index');
    Route::post('/paiements/recu', [AdminPaiementController::class, 'paiementRecu'])->name('paiements.recu');

    // Rapports
    Route::get('/rapports', fn() => Inertia::render('Admin/Rapports'))->name('rapports');
    Route::get('/rapports/logs', [ActivityLogController::class, 'index'])->name('rapports.logs');
    Route::get('/rapports/logs/csv', [ActivityLogController::class, 'exportCsv'])->name('rapports.logs.csv');
    Route::get('/rapports/logs/pdf', [ActivityLogController::class, 'exportPdf'])->name('rapports.logs.pdf');

    // Notifications
    Route::get('/notifications', [NotificationsController::class, 'index'])->name('notifications');

    // Statistiques
    Route::get('/stats', [StatsController::class, 'index'])->name('stats.dashboard');
    Route::get('/stats/export-csv', [StatsController::class, 'exportCsv'])->name('stats.export.csv');

    // Rapports personnalisés
    Route::post('/generate-report', [AdminDossierController::class, 'generateReport'])->name('generate-report');

    // Profil
    Route::get('/profil', [\App\Http\Controllers\Auth\UserProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profil', [\App\Http\Controllers\Auth\UserProfileController::class, 'update'])->name('profile.update');
    Route::put('/profil/password', [\App\Http\Controllers\Auth\PasswordController::class, 'update'])->name('profile.password');
});

// Routes de retour pour les paiements
Route::get('/paiement/stripe/return', [PublicPaiementController::class, 'stripeReturn'])->name('paiement.stripe.return');
Route::get('/paiement/stripe/cancel', [PublicPaiementController::class, 'stripeCancel'])->name('paiement.stripe.cancel');
Route::get('/paiement/lygos/return', [PublicPaiementController::class, 'lygosReturn'])->name('paiement.lygos.return');
Route::get('/paiement/lygos/cancel', [PublicPaiementController::class, 'lygosCancel'])->name('paiement.lygos.cancel');
// --------------------
// Fallback route
// --------------------
Route::fallback(function () {
    return Inertia::render('Errors/404');
});
