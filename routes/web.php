<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\User;
use Spatie\Permission\Models\Role;
use App\Models\Bourse;

// Contrôleurs
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Public\ContactController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Agent\DossierController;
use App\Http\Controllers\Admin\ActivityLogController;
use App\Http\Controllers\Admin\PaiementController;
use App\Http\Controllers\Student\PaiementController as StudentPaiementController;
use App\Http\Controllers\Admin\PaiementController as AdminPaiementController;
use App\Http\Controllers\Admin\EcoleController;
use App\Http\Controllers\Admin\StatsController;
use App\Http\Controllers\Admin\BourseController;
use App\Http\Controllers\Public\PaiementController as PublicPaiementController;

// --------------------
// ROUTES PUBLIQUES
// --------------------

Route::get('/', fn() => Inertia::render('Public/Home'))->name('home');
Route::get('/apropos', fn() => Inertia::render('Public/Apropos'))->name('apropos');
Route::get('/bourses', [\App\Http\Controllers\Admin\BourseController::class, 'publicList'])->name('public.bourses');
Route::get('/postuler', fn() => Inertia::render('Public/Postuler'))->name('postuler');
Route::get('/contact', fn() => Inertia::render('Public/Contact'))->name('contact');
Route::post('/contact', [ContactController::class, 'send'])->name('contact.send');
Route::post('/paiement/public', [PublicPaiementController::class, 'pay'])->name('public.paiement');

// API publique pour récupérer une bourse par ID (pour le formulaire Postuler)
Route::get('/api/bourses/{id}', [BourseController::class, 'apiShow']);

// API publique pour soumission finale d'un dossier public après paiement validé
Route::post('/api/dossiers/public', [\App\Http\Controllers\Agent\DossierController::class, 'publicStore']);

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

Route::middleware(['auth:etudiant'])->prefix('etudiant')->group(function () {
    Route::get('/dashboard', fn() => Inertia::render('Student/Dashboard'))->name('etudiant.dashboard');
    Route::get('/statut', fn() => Inertia::render('Student/ApplicationStatus'))->name('etudiant.status');
    Route::get('/dossiers', [DossierController::class, 'index'])->name('etudiant.dossiers.index');
    Route::get('/dossiers/{id}', [DossierController::class, 'show'])->name('etudiant.dossiers.show');
    Route::post('/dossiers', [DossierController::class, 'store'])->name('etudiant.dossiers.store');
    Route::get('/paiements', [StudentPaiementController::class, 'index'])->name('etudiant.paiements.index');
    Route::get('/paiement', [StudentPaiementController::class, 'webview'])->name('etudiant.paiement.webview');
    Route::get('/paiement/lygos/callback', [StudentPaiementController::class, 'lygosCallback'])->name('etudiant.paiement.lygos.callback');
    Route::get('/paiement/stripe/callback', [StudentPaiementController::class, 'stripeCallback'])->name('etudiant.paiement.stripe.callback');
    Route::get('/dossiers/create', [DossierController::class, 'create'])->name('etudiant.dossiers.create');
    Route::get('/paiement/lygos/status', [StudentPaiementController::class, 'lygosStatus'])->name('etudiant.paiement.lygos.status');
});

// --------------------
// AGENT
// --------------------

Route::middleware(['auth', 'role:agent'])->prefix('agent')->group(function () {
    Route::get('/dossiers', fn() => Inertia::render('Agent/DossierList'))->name('agent.dossiers.index');
    Route::get('/dossiers/{id}', fn($id) => Inertia::render('Agent/DossierDetails', ['id' => $id]))->name('agent.dossiers.show');
    Route::get('/dossiers/{id}/edit', fn($id) => Inertia::render('Agent/EditDossier', ['id' => $id]))->name('agent.dossiers.edit');
    Route::post('/dossiers/{id}/valider', [DossierController::class, 'valider'])->name('agent.dossiers.valider');
    Route::post('/dossiers/{id}/rejeter', [DossierController::class, 'rejeter'])->name('agent.dossiers.rejeter');
    Route::post('/dossiers/{id}/affecter', [DossierController::class, 'affecter'])->name('agent.dossiers.affecter');
});

// --------------------
// ADMIN
// --------------------

Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    // Dashboard avec données
    Route::get('/dashboard', function () {
        $users = User::with('roles')->paginate(10);
        $roles = Role::all();

        return Inertia::render('Admin/Dashboard', [
            'users' => $users,
            'roles' => $roles,
        ]);
    })->name('dashboard');

    // Utilisateurs
    Route::get('/utilisateurs', [UserController::class, 'index'])->name('utilisateurs');
    Route::post('/utilisateurs/{user}/role', [UserController::class, 'assignRole'])->name('utilisateurs.assignRole');

    // Dossiers
    Route::get('/dossiers', fn() => Inertia::render('Admin/Dossiers'))->name('dossiers');
    Route::get('/dossiers/{id}', [DossierController::class, 'adminShow'])->name('dossiers.show');
    Route::get('/dossiers/{id}/edit', [DossierController::class, 'adminEdit'])->name('dossiers.edit');

    // Rapports
    Route::get('/rapports', fn() => Inertia::render('Admin/Rapports'))->name('rapports');
    Route::get('/rapports/logs', [ActivityLogController::class, 'index'])->name('rapports.logs');
    Route::get('/rapports/logs/csv', [ActivityLogController::class, 'exportCsv'])->name('rapports.logs.csv');
    Route::get('/rapports/logs/pdf', [ActivityLogController::class, 'exportPdf'])->name('rapports.logs.pdf');

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

    // Notifications
    Route::get('/notifications', fn() => Inertia::render('Admin/Notifications'))->name('notifications');
    //API publique pour récupérer une bourse par ID
    Route::get('/api/bourses/{id}', function ($id) {
        $bourse = \App\Models\Bourse::findOrFail($id);
        return response()->json(['bourse' => $bourse]);
    });
    // Paiements
    Route::post('/paiements/recu', [PaiementController::class, 'paiementRecu'])->name('paiements.recu');
    Route::get('/paiements', [AdminPaiementController::class, 'index'])->name('paiements.index');
    // Routes paiement public Lygos (initiation + callbacks)
    Route::post('/paiement/public', [PublicPaiementController::class, 'pay'])->name('public.paiement');
    Route::get('/paiement/success', [PublicPaiementController::class, 'success'])->name('public.paiement.success');
    Route::get('/paiement/failure', [PublicPaiementController::class, 'failure'])->name('public.paiement.failure');

    // Statistiques
    Route::get('/stats', [StatsController::class, 'dashboard'])->name('stats.dashboard');
    Route::get('/stats/export-csv', [StatsController::class, 'exportCsv'])->name('stats.export.csv');
});

// --------------------
// API PUBLIQUES POUR LE FRONT DYNAMIQUE
// --------------------

// Liste paginée/filtrée de toutes les bourses actives
Route::get('/api/bourses', [BourseController::class, 'apiList']);
// Liste de toutes les écoles avec filières
Route::get('/api/ecoles', [EcoleController::class, 'apiList']);
// Liste de toutes les filières
Route::get('/api/filieres', function() {
    return response()->json(['filieres' => \App\Models\Filiere::all()]);
});
// Liste de toutes les pièces à fournir
Route::get('/api/pieces', function() {
    return response()->json(['pieces' => \App\Models\Piece::all()]);
});
