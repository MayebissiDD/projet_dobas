<?php
namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Dossier;
use App\Models\DossierPiece;
use App\Models\HistoriqueStatutDossier;
use App\Models\Bourse;
use App\Models\Ecole;
use App\Models\Filiere;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use ZipArchive;

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
            ->get()
            ->map(function ($dossier) {
                return [
                    'id' => $dossier->id,
                    'numero_dossier' => $dossier->numero_dossier,
                    'bourse' => $dossier->bourse->nom ?? 'Non spécifiée',
                    'ecole' => $dossier->ecole->nom ?? 'Non spécifiée',
                    'filiere' => $dossier->filiere->nom ?? 'Non spécifiée',
                    'statut' => $dossier->statut,
                    'statut_paiement' => $dossier->statut_paiement,
                    'date_soumission' => $dossier->date_soumission ? $dossier->date_soumission->format('d/m/Y') : null,
                    'created_at' => $dossier->created_at->format('d/m/Y'),
                ];
            });
        
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
                'pieces.piece',
                'historique.modifiePar'
            ])
            ->findOrFail($id);
        
        // Formater les données pour la vue
        $dossierData = [
            'id' => $dossier->id,
            'numero_dossier' => $dossier->numero_dossier,
            'statut' => $dossier->statut,
            'statut_paiement' => $dossier->statut_paiement,
            'date_soumission' => $dossier->date_soumission ? $dossier->date_soumission->format('d/m/Y H:i') : null,
            'bourse' => $dossier->bourse ? [
                'id' => $dossier->bourse->id,
                'nom' => $dossier->bourse->nom,
                'description' => $dossier->bourse->description,
                'montant' => $dossier->bourse->montant,
            ] : null,
            'ecole' => $dossier->ecole ? [
                'id' => $dossier->ecole->id,
                'nom' => $dossier->ecole->nom,
                'pays' => $dossier->ecole->pays,
                'ville' => $dossier->ecole->ville,
            ] : null,
            'filiere' => $dossier->filiere ? [
                'id' => $dossier->filiere->id,
                'nom' => $dossier->filiere->nom,
                'description' => $dossier->filiere->description,
            ] : null,
            'pieces' => $dossier->pieces->map(function ($piece) {
                return [
                    'id' => $piece->id,
                    'nom_piece' => $piece->piece->nom,
                    'nom_original' => $piece->nom_original,
                    'taille' => $piece->taille,
                    'type_mime' => $piece->type_mime,
                    'url' => Storage::url($piece->fichier),
                ];
            }),
            'historique' => $dossier->historique->map(function ($historique) {
                return [
                    'id' => $historique->id,
                    'statut_precedent' => $historique->statut_precedent,
                    'nouveau_statut' => $historique->nouveau_statut,
                    'commentaire' => $historique->commentaire,
                    'date_changement' => $historique->created_at->format('d/m/Y H:i'),
                    'modifie_par' => $historique->modifiePar ? [
                        'id' => $historique->modifiePar->id,
                        'name' => $historique->modifiePar->name,
                    ] : null,
                ];
            }),
        ];
        
        return Inertia::render('Etudiant/Dossiers/Show', [
            'dossier' => $dossierData
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
            
        if (!Storage::disk('public')->exists($piece->fichier)) {
            abort(404, 'Fichier introuvable');
        }
        
        return response()->download(
            storage_path('app/public/' . $piece->fichier),
            $piece->nom_original
        );
    }

    /**
     * Télécharger toutes les pièces du dossier (ZIP)
     */
    public function downloadAllPieces($dossierId)
    {
        $etudiant = Auth::guard('etudiant')->user();
        $dossier = Dossier::where('etudiant_id', $etudiant->id)
            ->with('pieces.piece')
            ->findOrFail($dossierId);
        
        $zip = new ZipArchive();
        $zipFileName = "dossier_{$dossier->numero_dossier}.zip";
        $zipPath = storage_path("app/temp/{$zipFileName}");
        
        // Créer le dossier temp s'il n'existe pas
        if (!file_exists(dirname($zipPath))) {
            mkdir(dirname($zipPath), 0755, true);
        }
        
        if ($zip->open($zipPath, ZipArchive::CREATE) === TRUE) {
            foreach ($dossier->pieces as $piece) {
                $filePath = storage_path("app/public/{$piece->fichier}");
                if (file_exists($filePath)) {
                    $zip->addFile($filePath, $piece->piece->nom . '_' . $piece->nom_original);
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
        $bourses = Bourse::where('statut', 'active')
            ->whereDate('date_debut', '<=', now())
            ->whereDate('date_fin', '>=', now())
            ->get(['id', 'nom', 'description', 'montant', 'type_bourse']);
            
        $ecoles = Ecole::all(['id', 'nom', 'pays', 'ville']);
        
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
        
        try {
            DB::beginTransaction();
            
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
                
                // Récupérer ou créer la pièce correspondant au code
                $piece = Piece::firstOrCreate(
                    ['code' => $type],
                    [
                        'nom' => ucwords(str_replace('_', ' ', $type)),
                        'description' => 'Pièce jointe: ' . $type,
                        'obligatoire' => true,
                        'type' => 'document'
                    ]
                );
                
                DossierPiece::create([
                    'dossier_id' => $dossier->id,
                    'piece_id' => $piece->id,
                    'nom_original' => $file->getClientOriginalName(),
                    'nom_stockage' => $fileName,
                    'fichier' => $path,
                    'taille' => $file->getSize(),
                    'type_mime' => $file->getMimeType()
                ]);
            }
            
            DB::commit();
            
            return redirect()->route('etudiant.dossiers.show', $dossier->id)
                ->with('success', 'Votre candidature a été soumise avec succès.');
                
        } catch (\Exception $e) {
            DB::rollBack();
            
            return back()->with('error', 'Une erreur est survenue lors de la soumission de votre candidature: ' . $e->getMessage());
        }
    }
}