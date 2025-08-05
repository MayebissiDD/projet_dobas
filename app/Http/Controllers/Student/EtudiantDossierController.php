<?php
namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Dossier;
use App\Models\DossierPiece;
use App\Models\HistoriqueStatutDossier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class EtudiantDossierController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:etudiant');
    }

    /**
     * Liste des dossiers de l'étudiant
     */
    public function index()
    {
        $etudiant = Auth::guard('etudiant')->user();

        $dossiers = Dossier::where('etudiant_id', $etudiant->id)
            ->with(['bourse', 'ecole', 'filiere'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Etudiant/Dossiers/Index', [
            'dossiers' => $dossiers
        ]);
    }

    /**
     * Détails d'un dossier
     */
    public function show($id)
    {
        $etudiant = Auth::guard('etudiant')->user();

        $dossier = Dossier::where('etudiant_id', $etudiant->id)
            ->with([
                'bourse',
                'ecole',
                'filiere',
                'pieces',
                'historique.modifiePar'
            ])
            ->findOrFail($id);

        return Inertia::render('Etudiant/Dossiers/Show', [
            'dossier' => $dossier,
            'pieces' => $dossier->pieces->groupBy('type_piece')
        ]);
    }

    /**
     * Télécharger une pièce du dossier
     */
    public function downloadPiece($dossierId, $pieceId)
    {
        $etudiant = Auth::guard('etudiant')->user();

        $dossier = Dossier::where('etudiant_id', $etudiant->id)
            ->findOrFail($dossierId);

        $piece = DossierPiece::where('dossier_id', $dossierId)
            ->where('id', $pieceId)
            ->firstOrFail();

        if (!Storage::disk('public')->exists($piece->chemin)) {
            abort(404, 'Fichier introuvable');
        }

        return response()->download(
            storage_path('app/public/' . $piece->chemin),
            $piece->nom_original
        );
        // return Storage::disk('public')->download(
        //     $piece->chemin,
        //     $piece->nom_original
        // );
    }

    /**
     * Télécharger toutes les pièces du dossier (ZIP)
     */
    public function downloadAllPieces($dossierId)
    {
        $etudiant = Auth::guard('etudiant')->user();

        $dossier = Dossier::where('etudiant_id', $etudiant->id)
            ->with('pieces')
            ->findOrFail($dossierId);

        $zip = new \ZipArchive();
        $zipFileName = "dossier_{$dossier->numero_dossier}.zip";
        $zipPath = storage_path("app/temp/{$zipFileName}");

        // Créer le dossier temp s'il n'existe pas
        if (!file_exists(dirname($zipPath))) {
            mkdir(dirname($zipPath), 0755, true);
        }

        if ($zip->open($zipPath, \ZipArchive::CREATE) === TRUE) {
            foreach ($dossier->pieces as $piece) {
                $filePath = storage_path("app/public/{$piece->chemin}");
                if (file_exists($filePath)) {
                    $zip->addFile($filePath, $piece->type_piece . '_' . $piece->nom_original);
                }
            }
            $zip->close();

            return response()->download($zipPath)->deleteFileAfterSend(true);
        } else {
            abort(500, 'Impossible de créer l\'archive ZIP');
        }
    }

    /**
     * Créer un nouveau dossier de candidature
     */
    public function create()
    {
        $bourses = \App\Models\Bourse::where('statut', 'active')
            ->whereDate('date_debut', '<=', now())
            ->whereDate('date_fin', '>=', now())
            ->get();

        $ecoles = \App\Models\Ecole::all();

        return Inertia::render('Etudiant/Dossiers/Create', [
            'bourses' => $bourses,
            'ecoles' => $ecoles
        ]);
    }

    /**
     * Enregistrer un nouveau dossier de candidature
     */
    public function store(Request $request)
    {
        $etudiant = Auth::guard('etudiant')->user();

        $request->validate([
            'bourse_id' => 'required|exists:bourses,id',
            'ecole_id' => 'required|exists:ecoles,id',
            'filiere_id' => 'required|exists:filieres,id',
            'pieces' => 'required|array',
            'pieces.*' => 'file|mimes:pdf,jpg,jpeg,png|max:5120'
        ]);

        // Créer le dossier
        $dossier = Dossier::create([
            'etudiant_id' => $etudiant->id,
            'bourse_id' => $request->bourse_id,
            'ecole_id' => $request->ecole_id,
            'filiere_id' => $request->filiere_id,
            'statut' => 'en_attente',
            'statut_paiement' => 'non_paye',
            'numero_dossier' => 'DOBAS-' . date('Y') . '-' . str_pad(Dossier::count() + 1, 6, '0', STR_PAD_LEFT)
        ]);

        // Gérer les pièces jointes
        foreach ($request->file('pieces') as $type => $file) {
            $fileName = time() . '_' . $type . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('dossiers/pieces', $fileName, 'public');

            DossierPiece::create([
                'dossier_id' => $dossier->id,
                'type_piece' => $type,
                'nom_original' => $file->getClientOriginalName(),
                'nom_stockage' => $fileName,
                'chemin' => $path,
                'taille' => $file->getSize(),
                'type_mime' => $file->getMimeType()
            ]);
        }

        return redirect()->route('etudiant.dossiers.show', $dossier->id)
            ->with('success', 'Votre candidature a été soumise avec succès.');
    }
}
