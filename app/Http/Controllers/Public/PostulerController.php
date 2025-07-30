<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Public\PaiementController;
use App\Models\Dossier;
use App\Models\Etudiant;
use App\Models\DossierPiece;
use App\Models\Bourse;
use App\Models\Etablissement;
use App\Notifications\BienvenuePostulerController;
use App\Notifications\NouvellePostulerController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class PostulerController extends Controller
{
    /**
     * Afficher le formulaire de PostulerController
     */
    public function index()
    {
        return inertia('Public/PostulerPage');
    }

    /**
     * Sauvegarder une étape du formulaire (optionnel - pour sauvegarde progressive)
     */
    public function saveStep(Request $request)
    {
        $step = $request->input('step');
        $data = $request->input('data');

        // Validation selon l'étape
        $this->validateStep($step, $data);

        // Sauvegarde en session temporaire
        session()->put("PostulerController_step_{$step}", $data);

        return response()->json(['success' => true]);
    }

    /**
     * Soumission complète du dossier de PostulerController
     */
    public function submitComplete(Request $request)
    {
        try {
            DB::beginTransaction();

            // 1. Validation complète
            $validatedData = $this->validateCompleteForm($request);

            // 2. Gestion des fichiers uploadés
            $filesData = $this->handleFileUploads($request);

            // 3. Créer le dossier de PostulerController
            $dossier = $this->createDossier($validatedData, $filesData);

            // 4. Traitement selon le mode de paiement
            if (in_array($validatedData['mode_paiement'], ['mobile_money', 'carte'])) {
                // Paiement en ligne - sera traité par PaiementController
                $paiementResponse = $this->initiatePaiementEnLigne($dossier, $validatedData);

                DB::commit();
                return response()->json([
                    'success' => true,
                    'requires_payment' => true,
                    'payment_url' => $paiementResponse['payment_url'],
                    'dossier_id' => $dossier->id
                ]);
            } else {
                // Paiement physique - finaliser directement
                $this->finalizePostulerController($dossier);

                DB::commit();
                return response()->json([
                    'success' => true,
                    'requires_payment' => false,
                    'message' => 'PostulerController soumise avec succès'
                ]);
            }
        } catch (ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la soumission: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Callback après paiement réussi
     */
    public function handlePaymentSuccess(Request $request)
    {
        $dossierId = $request->input('dossier_id');
        $transactionId = $request->input('transaction_id');

        try {
            DB::beginTransaction();

            $dossier = Dossier::findOrFail($dossierId);

            // Mettre à jour le statut de paiement
            $dossier->update([
                'statut_paiement' => 'paye',
                'transaction_id' => $transactionId,
                'date_paiement' => now()
            ]);

            // Finaliser la PostulerController
            $this->finalizePostulerController($dossier);

            DB::commit();

            return redirect()->route('PostulerController.confirmation', ['success' => 1]);
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->route('PostulerController.index')->with('error', 'Erreur lors de la finalisation');
        }
    }

    /**
     * Page de confirmation
     */
    public function confirmation()
    {
        return inertia('Public/ConfirmationPage');
    }

    /**
     * Upload de fichier individuel (AJAX)
     */
    public function uploadFile(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120', // 5MB max
            'field_name' => 'required|string'
        ]);

        try {
            $file = $request->file('file');
            $fieldName = $request->input('field_name');

            // Générer un nom unique
            $fileName = time() . '_' . $fieldName . '.' . $file->getClientOriginalExtension();

            // Stocker le fichier
            $path = $file->storeAs('PostulerControllers/temp', $fileName, 'public');

            return response()->json([
                'success' => true,
                'file_path' => $path,
                'file_name' => $file->getClientOriginalName()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'upload: ' . $e->getMessage()
            ], 500);
        }
    }

    // ========================
    // MÉTHODES PRIVÉES
    // ========================

    private function validateCompleteForm(Request $request)
    {
        return $request->validate([
            // Étape 1 - Identification
            'nom' => 'required|string|max:255',
            'date_naissance' => 'required|date|before:today',
            'lieu_naissance' => 'required|string|max:255',
            'telephone' => 'required|string|max:20',
            'email' => 'required|email|unique:etudiants,email',
            'sexe' => 'required|in:Masculin,Féminin',
            'adresse' => 'required|string|max:500',
            'niveau_etude' => 'required|in:Bac Technique,BET',
            'moyenne' => 'nullable|numeric|between:0,20',
            'cas_social' => 'boolean',

            // Étape 2 - Fichiers (gérés séparément)

            // Étape 3 - Bourse
            'type_bourse' => 'required|in:locale,étrangère,aide_scolaire',
            'etablissement' => 'required|string|max:255',
            'pays_souhaite' => 'nullable|string|max:255',
            'filiere_souhaitee' => 'nullable|string|max:255',

            // Étape 4 - Paiement
            'mode_paiement' => 'required|in:mobile_money,carte,depot_physique',
            'certification' => 'required|accepted'
        ]);
    }

    private function handleFileUploads(Request $request)
    {
        $requiredFiles = [
            'photo_identite',
            'casier_judiciaire',
            'certificat_nationalite',
            'attestation_bac',
            'certificat_medical',
            'acte_naissance'
        ];

        // Ajouter passeport si bourse étrangère
        if ($request->input('type_bourse') === 'étrangère') {
            $requiredFiles[] = 'passeport';
        }

        // Ajouter preuve de paiement si dépôt physique
        if ($request->input('mode_paiement') === 'depot_physique') {
            $requiredFiles[] = 'preuve_paiement';
        }

        $filesData = [];
        foreach ($requiredFiles as $fileField) {
            if ($request->hasFile($fileField)) {
                $file = $request->file($fileField);
                $fileName = time() . '_' . $fileField . '.' . $file->getClientOriginalExtension();
                $path = $file->storeAs('PostulerControllers/pieces', $fileName, 'public');

                $filesData[$fileField] = [
                    'nom_original' => $file->getClientOriginalName(),
                    'nom_stockage' => $fileName,
                    'chemin' => $path,
                    'taille' => $file->getSize(),
                    'type_mime' => $file->getMimeType()
                ];
            }
        }

        return $filesData;
    }

    private function createDossier($validatedData, $filesData)
    {
        // Créer le dossier principal
        $dossier = Dossier::create([
            'nom' => $validatedData['nom'],
            'email' => $validatedData['email'],
            'telephone' => $validatedData['telephone'],
            'date_naissance' => $validatedData['date_naissance'],
            'lieu_naissance' => $validatedData['lieu_naissance'],
            'sexe' => $validatedData['sexe'],
            'adresse' => $validatedData['adresse'],
            'niveau_etude' => $validatedData['niveau_etude'],
            'moyenne' => $validatedData['moyenne'],
            'cas_social' => $validatedData['cas_social'] ?? false,
            'type_bourse' => $validatedData['type_bourse'],
            'etablissement' => $validatedData['etablissement'],
            'pays_souhaite' => $validatedData['pays_souhaite'],
            'filiere_souhaitee' => $validatedData['filiere_souhaitee'],
            'mode_paiement' => $validatedData['mode_paiement'],
            'statut' => 'en_attente',
            'statut_paiement' => $validatedData['mode_paiement'] === 'depot_physique' ? 'en_attente' : 'non_paye',
            'numero_dossier' => 'DOBAS-' . date('Y') . '-' . str_pad(Dossier::count() + 1, 6, '0', STR_PAD_LEFT)
        ]);

        // Associer les pièces justificatives
        foreach ($filesData as $typepiece => $fileInfo) {
            DossierPiece::create([
                'dossier_id' => $dossier->id,
                'type_piece' => $typepiece,
                'nom_original' => $fileInfo['nom_original'],
                'nom_stockage' => $fileInfo['nom_stockage'],
                'chemin' => $fileInfo['chemin'],
                'taille' => $fileInfo['taille'],
                'type_mime' => $fileInfo['type_mime']
            ]);
        }

        return $dossier;
    }

    private function initiatePaiementEnLigne($dossier, $validatedData)
    {
        // Utiliser l'injection propre du controller
        $paiementController = app(PaiementController::class);

        // Créer une requête interne propre
        $paiementRequest = new Request([
            'dossier_id' => $dossier->id,
            'montant' => 7500,
            'mode' => $validatedData['mode_paiement'],
            'fullName' => $validatedData['nom'],
            'email' => $validatedData['email'],
            'telephone' => $validatedData['telephone']
        ]);

        // Appeler le controller de paiement
        $response = $paiementController->initiate($paiementRequest);

        // Vérifier le succès
        if (is_array($response) && isset($response['success']) && $response['success'] === true) {
            return $response;
        }

        // Si le controller retourne une réponse JSON
        if ($response instanceof \Illuminate\Http\JsonResponse) {
            $data = $response->getData(true);
            if (isset($data['success']) && $data['success'] === true) {
                return $data;
            } else {
                throw new \Exception($data['message'] ?? 'Échec de l\'initiation du paiement.');
            }
        }

        // Autre type de retour inattendu
        throw new \Exception('Réponse inattendue du module de paiement.');
    }


    private function finalizePostulerController($dossier)
    {
        // 1. Créer le compte étudiant
        $motDePasse = Str::random(10);

        $etudiant = Etudiant::create([
            'nom' => $dossier->nom,
            'email' => $dossier->email,
            'telephone' => $dossier->telephone,
            'password' => Hash::make($motDePasse),
            'dossier_id' => $dossier->id,
            'statut' => 'actif'
        ]);

        // Assigner le rôle étudiant (Spatie)
        $etudiant->assignRole('etudiant');

        // 2. Mettre à jour le statut du dossier
        $dossier->update([
            'statut' => 'soumis',
            'etudiant_id' => $etudiant->id,
            'date_soumission' => now()
        ]);

        // 3. Envoyer l'email de bienvenue à l'étudiant
        $etudiant->notify(new BienvenuePostulerController($motDePasse));

        // 4. Notifier les agents responsables
        $agents = \App\Models\User::role('agent')->get();
        Notification::send($agents, new NouvellePostulerController($dossier));
    }

    private function validateStep($step, $data)
    {
        // Validation spécifique par étape si nécessaire
        // Peut être utilisée pour la sauvegarde progressive
    }
}
