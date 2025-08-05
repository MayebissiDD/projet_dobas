<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Public\PaiementController;
use App\Models\Dossier;
use App\Models\Etudiant;
use App\Models\DossierPiece;
use App\Models\Bourse;
use App\Models\Ecole;
use App\Models\Filiere;
use App\Notifications\BienvenuePostulerController;
use App\Notifications\NouvelleCandidatureNotification;
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
     * Afficher le formulaire de candidature
     */
    public function index()
    {
        return inertia('Public/Postuler');
    }

    /**
     * Soumission complète du dossier de candidature
     */
    public function submitComplete(Request $request)
    {
        try {
            DB::beginTransaction();
            // 1. Validation complète
            $validatedData = $this->validateCompleteForm($request);
            // 2. Gestion des fichiers uploadés
            $filesData = $this->handleFileUploads($request);
            // 3. Créer le dossier de candidature
            $dossier = $this->createDossier($validatedData, $filesData, $request);
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
                $this->finalizeCandidature($dossier);
                DB::commit();
                return response()->json([
                    'success' => true,
                    'requires_payment' => false,
                    'message' => 'Candidature soumise avec succès'
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
            // Finaliser la candidature
            $this->finalizeCandidature($dossier);
            DB::commit();
            return redirect()->route('candidature.confirmation', ['success' => 1]);
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->route('candidature.index')->with('error', 'Erreur lors de la finalisation');
        }
    }

    /**
     * Page de confirmation
     */
    public function confirmation()
    {
        return inertia('Public/ConfirmationPage');
    }

    // ========================
    // MÉTHODES PRIVÉES
    // ========================

    /**
     * Validation complète du formulaire
     */
    private function validateCompleteForm(Request $request)
    {
        $rules = [
            // Étape 1 - Identification
            'nom' => 'required|string|max:255',
            'date_naissance' => 'required|date|before:today',
            'lieu_naissance' => 'required|string|max:255',
            'telephone' => 'required|string|max:20',
            'email' => 'required|email|unique:etudiants,email',
            'sexe' => 'required|in:Masculin,Féminin',
            'adresse' => 'required|string|max:500',
            'niveau_etude' => 'required|in:Bac Technique,BET',
            'moyenne' => $request->cas_social ? ['nullable'] : ['required', 'numeric', 'between:0,20'],
            'cas_social' => ['boolean'],
            'photo_identite' => 'required|file|mimes:jpeg,jpg,png|max:5120',

            // Étape 2 - Fichiers
            'casier_judiciaire' => 'required|file|mimes:pdf,jpeg,jpg,png|max:5120',
            'certificat_nationalite' => 'required|file|mimes:pdf,jpeg,jpg,png|max:5120',
            'attestation_bac' => 'required|file|mimes:pdf,jpeg,jpg,png|max:5120',
            'certificat_medical' => 'required|file|mimes:pdf,jpeg,jpg,png|max:5120',
            'acte_naissance' => 'required|file|mimes:pdf,jpeg,jpg,png|max:5120',

            // Étape 3 - Bourse
            'type_bourse' => 'required|in:locale,étrangère,aide_scolaire',
            'etablissement' => 'required|string|max:255',
            'pays_souhaite' => 'required_if:type_bourse,étrangère|nullable|string|max:255',
            'filiere_souhaitee' => 'nullable|string|max:255',

            // Étape 4 - Paiement
            'mode_paiement' => 'required|in:mobile_money,carte,depot_physique',
            'certification' => 'required|accepted'
        ];

        // Ajouter la validation du passeport si bourse étrangère
        if ($request->input('type_bourse') === 'étrangère') {
            $rules['passeport'] = 'required|file|mimes:pdf,jpeg,jpg,png|max:5120';
        }

        // Ajouter la validation de la preuve de paiement si dépôt physique
        if ($request->input('mode_paiement') === 'depot_physique') {
            $rules['preuve_paiement'] = 'required|file|mimes:pdf,jpeg,jpg,png|max:5120';
        }

        return $request->validate($rules);
    }

    /**
     * Création du dossier de candidature
     */
    private function createDossier($validatedData, $filesData, Request $request)
    {
        // Créer le dossier principal avec les informations de l'étudiant
        $dossier = Dossier::create([
            'etudiant_id' => null, // Sera mis à jour après création de l'étudiant
            'bourse_id' => $validatedData['bourse_id'] ?? null,
            'ecole_id' => $validatedData['ecole_id'] ?? null,
            'filiere_id' => $validatedData['filiere_id'] ?? null,
            'statut' => 'en_attente',
            'statut_paiement' => $validatedData['mode_paiement'] === 'depot_physique' ? 'en_attente' : 'non_paye',
            'numero_dossier' => 'DOBAS-' . date('Y') . '-' . str_pad(Dossier::count() + 1, 6, '0', STR_PAD_LEFT),
            'type_bourse' => $validatedData['type_bourse'],
            'etablissement' => $validatedData['etablissement'],
            'pays_souhaite' => $request->input('pays_souhaite', null), // Utiliser input() avec valeur par défaut
            'filiere_souhaitee' => $request->input('filiere_souhaitee', null), // Utiliser input() avec valeur par défaut
            'mode_paiement' => $validatedData['mode_paiement'],
            'cas_social' => $validatedData['cas_social'] ?? false,
            'moyenne' => $validatedData['cas_social'] ? null : ($validatedData['moyenne'] ?? null), // Null si cas_social
            'niveau_etude' => $validatedData['niveau_etude'],
            // Informations de l'étudiant
            'nom' => $validatedData['nom'],
            'email' => $validatedData['email'],
            'telephone' => $validatedData['telephone'],
            'date_naissance' => $validatedData['date_naissance'],
            'lieu_naissance' => $validatedData['lieu_naissance'],
            'sexe' => $validatedData['sexe'],
            'adresse' => $validatedData['adresse'],
            'photo_identite' => isset($filesData['photo_identite']) ? $filesData['photo_identite']['chemin'] : null,
        ]);



        // Associer les pièces justificatives
        foreach ($filesData as $typePiece => $fileInfo) {
            if ($typePiece !== 'photo_identite') { // La photo est déjà stockée directement
                $piece = \App\Models\Piece::where('code', $typePiece)->first();

                if ($piece) {
                    DossierPiece::create([
                        'dossier_id' => $dossier->id,
                        'piece_id' => $piece->id,
                        'nom_original' => $fileInfo['nom_original'],
                        'nom_stockage' => $fileInfo['nom_stockage'],
                        'chemin' => $fileInfo['chemin'],
                        'taille' => $fileInfo['taille'],
                        'type_mime' => $fileInfo['type_mime'],
                    ]);
                }
            }
        }

        return $dossier;
    }

    private function handleFileUploads(Request $request)
    {
        $requiredFiles = [
            'casier_judiciaire',
            'certificat_nationalite',
            'attestation_bac',
            'certificat_medical',
            'acte_naissance'
        ];

        // Utiliser input() avec une valeur par défaut au lieu d'accès direct
        $typeBourse = $request->input('type_bourse');
        $modePaiement = $request->input('mode_paiement');

        // Ajouter passeport si bourse étrangère
        if ($typeBourse === 'étrangère') {
            $requiredFiles[] = 'passeport';
        }

        // Ajouter preuve de paiement si dépôt physique
        if ($modePaiement === 'depot_physique') {
            $requiredFiles[] = 'preuve_paiement';
        }

        $filesData = [];

        // Traiter la photo d'identité séparément
        if ($request->hasFile('photo_identite')) {
            $file = $request->file('photo_identite');
            $fileName = time() . '_photo_identite.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('candidatures/photos', $fileName, 'public');
            $filesData['photo_identite'] = [
                'nom_original' => $file->getClientOriginalName(),
                'nom_stockage' => $fileName,
                'chemin' => $path,
                'taille' => $file->getSize(),
                'type_mime' => $file->getMimeType()
            ];
        }

        // Traiter les autres fichiers
        foreach ($requiredFiles as $fileField) {
            if ($request->hasFile($fileField)) {
                $file = $request->file($fileField);
                $fileName = time() . '_' . $fileField . '.' . $file->getClientOriginalExtension();
                $path = $file->storeAs('candidatures/pieces', $fileName, 'public');
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

    private function initiatePaiementEnLigne($dossier, $validatedData)
    {
        // Utiliser l'injection propre du controller
        $paiementController = app(PaiementController::class);

        // Utiliser input() avec des valeurs par défaut
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

    private function finalizeCandidature($dossier)
    {
        // 1. Créer le compte étudiant avec les informations du dossier
        $motDePasse = Str::random(10);
        $etudiant = Etudiant::create([
            'nom' => $dossier->nom,
            'email' => $dossier->email,
            'telephone' => $dossier->telephone,
            'password' => Hash::make($motDePasse),
            'date_naissance' => $dossier->date_naissance,
            'lieu_naissance' => $dossier->lieu_naissance,
            'sexe' => $dossier->sexe,
            'adresse' => $dossier->adresse,
            'niveau_etude' => $dossier->niveau_etude,
            'moyenne' => $dossier->cas_social ? null : $dossier->moyenne, // Null si cas_social
            'cas_social' => $dossier->cas_social,
            'photo' => $dossier->photo_identite, // Si vous stockez la photo dans le dossier
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
        Notification::send($agents, new NouvelleCandidatureNotification($dossier));
    }
}
