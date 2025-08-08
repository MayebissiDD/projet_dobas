<?php
namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Public\PaiementController;
use App\Models\Dossier;
use App\Models\Etudiant;
use App\Models\DossierPiece;
use App\Models\Bourse;
use App\Models\Piece;
use App\Models\Ecole;
use App\Models\Filiere;
use App\Notifications\BienvenuePostulerController;
use App\Notifications\NouvelleCandidatureNotification;
use App\Notifications\NouvellePostulerController;
use App\Services\MTNTindaService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class PostulerController extends Controller
{
    protected $mtnTindaService;

    public function __construct(MTNTindaService $mtnTindaService)
    {
        $this->mtnTindaService = $mtnTindaService;
    }

    /**
     * Afficher le formulaire de candidature
     */
    public function index()
    {
        // Récupérer les paramètres de la requête
        $success = request()->query('success');
        $error = request()->query('error');
        $paymentStatus = request()->query('payment_status');
        
        return inertia('Public/Postuler', [
            'success' => $success,
            'error' => $error,
            'payment_status' => $paymentStatus
        ]);
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
                
                // Retourner une réponse cohérente avec celle du PaiementController
                return response()->json([
                    'success' => true,
                    'requires_payment' => true,
                    'link' => $paiementResponse['payment_url'] ?? null,  // Utiliser 'link' comme dans PaiementController
                    'transaction_id' => $paiementResponse['transaction_id'] ?? null,
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
            
            Log::warning('Erreur de validation lors de la soumission', [
                'errors' => $e->errors(),
                'request_data' => $this->maskSensitiveDataArray($request->all())
            ]);
            
            return response()->json([
                'success' => false,
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            
            Log::error('Erreur lors de la soumission de candidature', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'request_data' => $this->maskSensitiveDataArray($request->all())
            ]);
            
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
            
            Log::error('Erreur lors de la finalisation après paiement', [
                'dossier_id' => $dossierId,
                'transaction_id' => $transactionId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return redirect()->route('candidature.index')->with('error', 'Erreur lors de la finalisation');
        }
    }
    
    /**
     * Page de confirmation
     */
    public function confirmation()
    {
        // Récupérer les paramètres de la requête
        $success = request()->query('success');
        $error = request()->query('error');
        $paymentStatus = request()->query('payment_status');
        
        // Rediriger vers la page d'index avec les paramètres de statut
        return redirect()->route('candidature.index', [
            'success' => $success,
            'error' => $error,
            'payment_status' => $paymentStatus ?? 'success'
        ]);
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
            'prenom' => 'required|string|max:255',
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
        
        $validatedData = $request->validate($rules);
        
        return $validatedData;
    }
    
    /**
     * Création du dossier de candidature
     */
    private function createDossier($validatedData, $filesData, Request $request)
    {
        // Créer le dossier principal avec les informations de l'étudiant
        $dossierData = [
            'etudiant_id' => null, // Sera mis à jour après création de l'étudiant
            'bourse_id' => $validatedData['bourse_id'] ?? null,
            'ecole_id' => $validatedData['ecole_id'] ?? null,
            'filiere_id' => $validatedData['filiere_id'] ?? null,
            'statut' => 'en_attente',
            'statut_paiement' => $validatedData['mode_paiement'] === 'depot_physique' ? 'en_attente' : 'non_paye',
            'numero_dossier' => 'DOBAS-' . date('Y') . '-' . str_pad(Dossier::count() + 1, 6, '0', STR_PAD_LEFT),
            'type_bourse' => $validatedData['type_bourse'],
            'etablissement' => $validatedData['etablissement'],
            'pays_souhaite' => $request->input('pays_souhaite', null),
            'filiere_souhaitee' => $request->input('filiere_souhaitee', null),
            'mode_paiement' => $validatedData['mode_paiement'],
            'cas_social' => $validatedData['cas_social'] ?? false,
            'moyenne' => $validatedData['cas_social'] ? null : ($validatedData['moyenne'] ?? null),
            'niveau_etude' => $validatedData['niveau_etude'],
            // Informations de l'étudiant
            'nom' => $validatedData['nom'],
            'prenom' => $validatedData['prenom'] ?? '',
            'email' => $validatedData['email'],
            'telephone' => $validatedData['telephone'],
            'date_naissance' => $validatedData['date_naissance'],
            'lieu_naissance' => $validatedData['lieu_naissance'],
            'sexe' => $validatedData['sexe'],
            'adresse' => $validatedData['adresse'],
            'photo_identite' => isset($filesData['photo_identite']) ? $filesData['photo_identite']['chemin'] : null,
        ];
        
        $dossier = Dossier::create($dossierData);
        
        // Associer les pièces justificatives
        foreach ($filesData as $typePiece => $fileInfo) {
            if ($typePiece !== 'photo_identite') { // La photo est déjà stockée directement
                // Récupérer ou créer la pièce correspondant au code
                $piece = Piece::firstOrCreate(
                    ['code' => $typePiece],
                    [
                        'nom' => ucwords(str_replace('_', ' ', $typePiece)),
                        'description' => 'Pièce jointe: ' . $typePiece,
                        'obligatoire' => true,
                        'type' => 'document'
                    ]
                );
                
                // Créer l'association entre le dossier et la pièce
                DossierPiece::create([
                    'dossier_id' => $dossier->id,
                    'piece_id' => $piece->id,
                    'nom_original' => $fileInfo['nom_original'],
                    'nom_stockage' => $fileInfo['nom_stockage'],
                    'fichier' => $fileInfo['chemin'], // Utiliser 'fichier' au lieu de 'chemin'
                    'taille' => $fileInfo['taille'],
                    'type_mime' => $fileInfo['type_mime'],
                ]);
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
        } else {
            Log::warning('Photo d\'identité manquante');
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
            } else {
                Log::warning('Fichier requis manquant', ['field' => $fileField]);
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
            'montant' => 200,
            'mode' => $validatedData['mode_paiement'],
            'fullName' => trim($validatedData['nom'] . ' ' . $validatedData['prenom']),
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
                // Correction: utiliser 'link' si 'payment_url' n'existe pas
                $paymentUrl = $data['payment_url'] ?? ($data['link'] ?? null);
                
                // S'assurer que la réponse contient bien l'URL de paiement
                return [
                    'success' => true,
                    'payment_url' => $paymentUrl,
                    'transaction_id' => $data['transaction_id'] ?? null
                ];
            } else {
                Log::error('Échec de l\'initiation du paiement', [
                    'message' => $data['message'] ?? 'Message non fourni',
                    'response' => $data
                ]);
                throw new \Exception($data['message'] ?? 'Échec de l\'initiation du paiement.');
            }
        }
        
        // Autre type de retour inattendu
        Log::error('Réponse inattendue du module de paiement', [
            'response_type' => gettype($response),
            'response' => method_exists($response, 'getContent') ? $response->getContent() : $response
        ]);
        
        throw new \Exception('Réponse inattendue du module de paiement.');
    }
    
    /**
     * Formater le numéro de téléphone pour l'envoi de SMS
     *
     * @param string $telephone
     * @return string
     */
    private function formatPhoneNumberForSMS($telephone)
    {
        if (empty($telephone)) {
            return '';
        }
        
        // Supprimer tous les caractères non numériques
        $telephone = preg_replace('/[^0-9]/', '', $telephone);
        
        // Si le numéro commence par +242, retirer le +
        if (strpos($telephone, '242') === 0) {
            return $telephone;
        }
        
        // Si le numéro commence par 00242, retirer les 00
        if (strpos($telephone, '00242') === 0) {
            return substr($telephone, 2);
        }
        
        // Si le numéro commence par 05, 06 ou 04, ajouter 242 au début
        if (strpos($telephone, '05') === 0 || strpos($telephone, '06') === 0 || strpos($telephone, '04') === 0) {
            return '242' . $telephone;
        }
        
        // Pour tout autre format, retourner le numéro tel quel
        return $telephone;
    }
    
    private function finalizeCandidature($dossier)
    {
        // 1. Créer le compte étudiant avec les informations du dossier
        $motDePasse = Str::random(10);
        
        $etudiant = Etudiant::create([
            'nom' => $dossier->nom,
            'prenom' => $dossier->prenom ?? '',
            'email' => $dossier->email,
            'telephone' => $dossier->telephone,
            'password' => Hash::make($motDePasse),
            'date_naissance' => $dossier->date_naissance,
            'lieu_naissance' => $dossier->lieu_naissance,
            'sexe' => $dossier->sexe,
            'adresse' => $dossier->adresse,
            'niveau_etude' => $dossier->niveau_etude,
            'moyenne' => $dossier->cas_social ? null : $dossier->moyenne,
            'cas_social' => $dossier->cas_social,
            'photo_identite' => $dossier->photo_identite,
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
        try {
            Log::info('Tentative d\'envoi de l\'email de bienvenue', [
                'etudiant_id' => $etudiant->id,
                'email' => $this->maskEmail($etudiant->email),
                'nom' => $this->maskName($etudiant->nom . ' ' . $etudiant->prenom),
                'dossier_id' => $dossier->id,
                'notification_class' => BienvenuePostulerController::class,
                'implements_should_queue' => in_array(ShouldQueue::class, class_implements(BienvenuePostulerController::class))
            ]);
            
            $notification = new BienvenuePostulerController($motDePasse);
            $etudiant->notify($notification);
            
            Log::info('Email de bienvenue envoyé avec succès', [
                'etudiant_id' => $etudiant->id,
                'email' => $this->maskEmail($etudiant->email),
                'notification_id' => $notification->id ?? null,
                'queue_connection' => config('queue.default'),
                'queue_name' => config('queue.connections.' . config('queue.default') . '.queue', 'default')
            ]);
        } catch (\Exception $e) {
            Log::error('Erreur lors de l\'envoi de l\'email de bienvenue', [
                'etudiant_id' => $etudiant->id,
                'email' => $this->maskEmail($etudiant->email),
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);
        }
        
        // 4. Notifier les agents responsables
        try {
            $agents = \App\Models\User::role('agent')->get();
            $agentsCount = $agents->count();
            
            Log::info('Tentative d\'envoi des notifications aux agents', [
                'dossier_id' => $dossier->id,
                'agents_count' => $agentsCount,
                'notification_class' => NouvelleCandidatureNotification::class,
                'implements_should_queue' => in_array(ShouldQueue::class, class_implements(NouvelleCandidatureNotification::class))
            ]);
            
            Notification::send($agents, new NouvelleCandidatureNotification($dossier));
            
            Log::info('Notifications aux agents envoyées avec succès', [
                'dossier_id' => $dossier->id,
                'agents_notified' => $agentsCount,
                'queue_connection' => config('queue.default'),
                'queue_name' => config('queue.connections.' . config('queue.default') . '.queue', 'default')
            ]);
        } catch (\Exception $e) {
            Log::error('Erreur lors de l\'envoi des notifications aux agents', [
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString(),
                'dossier_id' => $dossier->id
            ]);
        }
        
        // 5. Envoyer un SMS de bienvenue à l'étudiant
        try {
            // Préparation du message SMS
            $message = "Bienvenue au service de la DOBAS,\n\n";
            $message .= "Nous vous remercions pour votre candidature. Votre dossier (N°" . $dossier->numero_dossier . ") ";
            $message .= "sera traité avec attention et vous recevrez notre retour dans les plus brefs délais.\n\n";
            $message .= "Cordialement,\nL'équipe DOBAS";
            
            // Formater le numéro de téléphone pour l'envoi de SMS
            $formattedPhone = $this->formatPhoneNumberForSMS($dossier->telephone);
            
            // Vérifier si le numéro est valide avant d'envoyer le SMS
            if (!empty($formattedPhone)) {
                Log::info('Tentative d\'envoi du SMS de bienvenue', [
                    'etudiant_id' => $etudiant->id,
                    'dossier_id' => $dossier->id,
                    'telephone_original' => $this->maskSensitiveString($dossier->telephone),
                    'telephone_formate' => $this->maskSensitiveString($formattedPhone),
                    'message_length' => strlen($message),
                    'sms_service' => 'MTN Tinda'
                ]);
                
                // Envoyer le SMS via le service MTN Tinda
                $smsResponse = $this->mtnTindaService->sendSMS(
                    $message,
                    $formattedPhone, // Numéro de téléphone formaté de l'étudiant
                    null, // Utiliser le sender par défaut configuré
                    null, // Email (optionnel)
                    null, // Message mail (optionnel)
                    null, // Objet mail (optionnel)
                    null, // Date d'envoi (optionnel)
                    null, // ID externe (optionnel)
                    null  // URL de callback (optionnel)
                );
                
                // Journaliser la réponse du service SMS
                Log::info('SMS de bienvenue envoyé avec succès', [
                    'etudiant_id' => $etudiant->id,
                    'dossier_id' => $dossier->id,
                    'telephone_original' => $this->maskSensitiveString($dossier->telephone),
                    'telephone_formate' => $this->maskSensitiveString($formattedPhone),
                    'response' => $smsResponse
                ]);
            } else {
                Log::warning('Numéro de téléphone invalide, SMS non envoyé', [
                    'etudiant_id' => $etudiant->id,
                    'dossier_id' => $dossier->id,
                    'telephone' => $dossier->telephone
                ]);
            }
            
        } catch (\Exception $e) {
            Log::error('Erreur lors de l\'envoi du SMS de bienvenue', [
                'etudiant_id' => $etudiant->id,
                'dossier_id' => $dossier->id,
                'telephone' => $this->maskSensitiveString($dossier->telephone),
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);
        }
    }
    
    /**
     * Masque les données sensibles (tableaux) pour les logs
     */
    private function maskSensitiveDataArray($data)
    {
        if (!is_array($data)) return $data;
        
        $masked = [];
        foreach ($data as $key => $value) {
            if (is_array($value)) {
                $masked[$key] = $this->maskSensitiveDataArray($value);
            } else {
                if (in_array($key, ['password', 'mot_de_passe', 'token', 'api_key'])) {
                    $masked[$key] = str_repeat('*', strlen($value));
                } elseif (strpos($key, 'email') !== false) {
                    $masked[$key] = $this->maskEmail($value);
                } elseif (strpos($key, 'telephone') !== false || strpos($key, 'phone') !== false) {
                    $masked[$key] = $this->maskSensitiveString($value);
                } else {
                    $masked[$key] = $value;
                }
            }
        }
        
        return $masked;
    }
    
    /**
     * Masque les données sensibles (chaînes) pour les logs
     */
    private function maskSensitiveString($data)
    {
        if (empty($data)) return $data;
        
        // Masquer le numéro de téléphone (garder les 2 premiers et 2 derniers caractères)
        if (strlen($data) > 4) {
            return substr($data, 0, 2) . str_repeat('*', strlen($data) - 4) . substr($data, -2);
        }
        
        return str_repeat('*', strlen($data));
    }
    
    /**
     * Masque le nom pour les logs
     */
    private function maskName($name)
    {
        if (empty($name)) return $name;
        
        $parts = explode(' ', $name);
        $masked = [];
        
        foreach ($parts as $part) {
            if (strlen($part) > 2) {
                $masked[] = substr($part, 0, 1) . str_repeat('*', strlen($part) - 1);
            } else {
                $masked[] = $part;
            }
        }
        
        return implode(' ', $masked);
    }
    
    /**
     * Masque l'email pour les logs
     */
    private function maskEmail($email)
    {
        if (empty($email) || !strpos($email, '@')) return $email;
        
        list($name, $domain) = explode('@', $email);
        $name = substr($name, 0, 2) . str_repeat('*', strlen($name) - 2);
        
        return $name . '@' . $domain;
    }
}