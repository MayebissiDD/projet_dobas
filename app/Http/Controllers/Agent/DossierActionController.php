<?php
namespace App\Http\Controllers\Agent;

use App\Http\Controllers\Controller;
use App\Models\Dossier;
use App\Models\User;
use App\Models\Ecole;
use App\Models\Filiere;
use App\Models\HistoriqueStatutDossier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\DB;
use App\Notifications\DossierValideNotification;
use App\Notifications\DossierRejeteNotification;
use App\Notifications\DossierIncompletNotification;
use App\Notifications\DossierReorienteNotification;
use App\Services\MTNTindaService;

class DossierActionController extends Controller
{
    protected $mtnTindaService;
    
    public function __construct(MTNTindaService $mtnTindaService)
    {
        $this->middleware(['auth', 'role:agent']);
        $this->mtnTindaService = $mtnTindaService;
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
    
    public function valider($id)
    {
        $dossier = Dossier::findOrFail($id);
        Gate::authorize('update', $dossier);
        
        $ancienStatut = $dossier->statut;
        $dossier->statut = 'accepte';
        $dossier->save();
        
        // Enregistrer dans l'historique avec un motif plus court
        HistoriqueStatutDossier::create([
            'dossier_id' => $dossier->id,
            'ancien_statut' => $ancienStatut,
            'nouveau_statut' => 'accepte',
            'motif' => 'Validation du dossier',
            'modifie_par' => auth()->id()
        ]);
        
        // Notifier l'étudiant
        if ($dossier->etudiant) {
            $dossier->etudiant->notify(new DossierValideNotification(
                optional($dossier->ecole)->nom,
                $dossier->filiere_souhaitee
            ));
            
            // Envoyer un SMS de validation
            $this->envoyerSMSValidation($dossier);
        }
        
        // Notifier les admins
        $admins = User::role('admin')->get();
        foreach ($admins as $admin) {
            $admin->notify(new DossierValideNotification(
                optional($dossier->ecole)->nom,
                $dossier->filiere_souhaitee
            ));
        }
        
        \App\Services\ActivityLogger::log(
            'validate_dossier',
            Dossier::class,
            $dossier->id,
            "Dossier #{$dossier->id} validé par un agent."
        );
        
        return back()->with('success', 'Dossier validé et notifications envoyées.');
    }
    
    public function rejeter($id, Request $request)
    {
        $dossier = Dossier::findOrFail($id);
        $ancienStatut = $dossier->statut;
        
        // Vérifier que le statut est valide pour éviter l'erreur de troncature
        $dossier->statut = 'refuse'; // Assurez-vous que cette valeur est dans l'ENUM de la BD
        $dossier->raison_refus = $request->motif;
        $dossier->save();
        
        // Limiter la longueur du motif pour l'historique
        $motifHistorique = strlen($request->motif) > 100 
            ? substr($request->motif, 0, 97) . '...' 
            : $request->motif;
        
        // Enregistrer dans l'historique
        HistoriqueStatutDossier::create([
            'dossier_id' => $dossier->id,
            'ancien_statut' => $ancienStatut,
            'nouveau_statut' => 'rejete',
            'motif' => $motifHistorique,
            'modifie_par' => auth()->id()
        ]);
        
        // Notifier l'étudiant
        if ($dossier->etudiant) {
            $dossier->etudiant->notify(new DossierRejeteNotification($request->motif));
            
            // Envoyer un SMS de rejet
            $this->envoyerSMSRejet($dossier, $request->motif);
        }
        
        // Notifier les admins
        $admins = User::role('admin')->get();
        foreach ($admins as $admin) {
            $admin->notify(new DossierRejeteNotification($request->motif));
        }
        
        \App\Services\ActivityLogger::log(
            'reject_dossier',
            Dossier::class,
            $dossier->id,
            "Dossier #{$dossier->id} rejeté par un agent."
        );
        
        return back()->with('success', 'Dossier rejeté et notifications envoyées.');
    }
    
    public function marquerIncomplet($id, Request $request)
    {
        $dossier = Dossier::findOrFail($id);
        $ancienStatut = $dossier->statut;
        $dossier->statut = 'incomplet';
        $dossier->commentaire_agent = $request->commentaire;
        $dossier->save();
        
        // Limiter la longueur du commentaire pour l'historique
        $commentaireHistorique = strlen($request->commentaire) > 100 
            ? substr($request->commentaire, 0, 97) . '...' 
            : $request->commentaire;
        
        // Enregistrer dans l'historique
        HistoriqueStatutDossier::create([
            'dossier_id' => $dossier->id,
            'ancien_statut' => $ancienStatut,
            'nouveau_statut' => 'incomplet',
            'motif' => $commentaireHistorique,
            'modifie_par' => auth()->id()
        ]);
        
        // Notifier l'étudiant
        if ($dossier->etudiant) {
            // Utiliser une notification générique ou créer une notification spécifique
            $dossier->etudiant->notify(new \App\Notifications\DossierStatusNotification(
                $dossier,
                'incomplet',
                $request->commentaire
            ));
            
            // Envoyer un SMS pour dossier incomplet
            $this->envoyerSMSIncomplet($dossier, $request->commentaire);
        }
        
        // Notifier les admins
        $admins = User::role('admin')->get();
        foreach ($admins as $admin) {
            $admin->notify(new \App\Notifications\DossierStatusNotification(
                $dossier,
                'incomplet',
                $request->commentaire
            ));
        }
        
        \App\Services\ActivityLogger::log(
            'mark_incomplete_dossier',
            Dossier::class,
            $dossier->id,
            "Dossier #{$dossier->id} marqué comme incomplet par un agent."
        );
        
        return back()->with('success', 'Dossier marqué comme incomplet et notification envoyée.');
    }
    
    /**
     * Affecter un dossier à une école
     */
    public function affecter(Request $request, $id)
    {
        $dossier = Dossier::findOrFail($id);
        Gate::authorize('update', $dossier);
        
        $request->validate([
            'ecole_id' => 'required|exists:ecoles,id',
            'filiere_id' => 'required|exists:filieres,id',
        ]);
        
        $ecole = Ecole::findOrFail($request->ecole_id);
        
        // Vérifier la capacité de l'école
        $placesRestantes = $ecole->capacite - $ecole->dossiers()->count();
        if ($placesRestantes <= 0) {
            return back()->withErrors(['ecole_id' => "Plus de places disponibles dans cette école."]);
        }
        
        $ancienStatut = $dossier->statut;
        $dossier->ecole_id = $ecole->id;
        $dossier->filiere_souhaitee = $request->filiere;
        $dossier->statut = 'accepte';
        $dossier->save();
        
        // Créer un motif plus court pour l'historique
        $motif = "Affectation à {$ecole->nom}";
        if (strlen($motif) > 100) {
            $motif = substr($motif, 0, 97) . '...';
        }
        
        // Enregistrer dans l'historique
        HistoriqueStatutDossier::create([
            'dossier_id' => $dossier->id,
            'ancien_statut' => $ancienStatut,
            'nouveau_statut' => 'accepte',
            'motif' => $motif,
            'modifie_par' => auth()->id()
        ]);
        
        // Notifier l'étudiant
        if ($dossier->etudiant) {
            $dossier->etudiant->notify(new DossierValideNotification($ecole->nom, $request->filiere));
            
            // Envoyer un SMS d'affectation
            $this->envoyerSMSAffectation($dossier, $ecole->nom, $request->filiere);
        }
        
        // Notifier les admins
        $admins = User::role('admin')->get();
        foreach ($admins as $admin) {
            $admin->notify(new DossierValideNotification($ecole->nom, $request->filiere));
        }
        
        \App\Services\ActivityLogger::log(
            'affect_dossier',
            Dossier::class,
            $dossier->id,
            "Affectation du dossier #{$dossier->id} à l'école #{$ecole->id} ({$ecole->nom}) par un agent."
        );
        
        return back()->with('success', 'Dossier affecté à l\'école et notification envoyée.');
    }
    
    /**
     * Réorienter (refouler) un dossier vers une autre école/filière
     */
    public function reorienter(Request $request, $id)
    {
        $dossier = Dossier::findOrFail($id);
        Gate::authorize('update', $dossier);
        
        $request->validate([
            'ecole_id' => 'required|exists:ecoles,id',
            'filiere_id' => 'required|exists:filieres,id',
            'motif' => 'nullable|string|max:500',
        ]);
        
        // Vérifier que la filière appartient bien à l'école sélectionnée
        $filiere = Filiere::find($request->filiere_id);
        if ($filiere->ecole_id != $request->ecole_id) {
            return back()->withErrors([
                'filiere_id' => 'La filière sélectionnée n\'appartient pas à l\'école choisie'
            ]);
        }
        
        $ecole = Ecole::findOrFail($request->ecole_id);
        
        // Vérifier la capacité de l'école
        $placesRestantes = $ecole->capacite - $ecole->dossiers()->count();
        if ($placesRestantes <= 0) {
            return back()->withErrors(['ecole_id' => "Plus de places disponibles dans cette école."]);
        }
        
        // Sauvegarder l'ancien statut pour l'historique
        $ancienStatut = $dossier->statut;
        $ancienneEcole = $dossier->ecole ? $dossier->ecole->nom : 'Non définie';
        $ancienneFiliere = $dossier->filiere ? $dossier->filiere->nom : 'Non définie';
        
        // Mettre à jour le dossier
        $dossier->ecole_id = $request->ecole_id;
        $dossier->filiere_id = $request->filiere_id;
        $dossier->statut = 'reoriente'; // Assurez-vous que cette valeur est dans l'ENUM de la BD
        $dossier->save();
        
        // Créer un motif pour l'historique
        $motifHistorique = "Réorientation de {$ancienneEcole} ({$ancienneFiliere}) vers {$ecole->nom} ({$filiere->nom})";
        if ($request->motif) {
            $motifHistorique .= ". Motif: " . $request->motif;
        }
        
        // Limiter la longueur du motif pour l'historique
        if (strlen($motifHistorique) > 100) {
            $motifHistorique = substr($motifHistorique, 0, 97) . '...';
        }
        
        // Enregistrer dans l'historique
        HistoriqueStatutDossier::create([
            'dossier_id' => $dossier->id,
            'ancien_statut' => $ancienStatut,
            'nouveau_statut' => 'reoriente',
            'motif' => $motifHistorique,
            'modifie_par' => auth()->id()
        ]);
        
        // Notifier l'étudiant
        if ($dossier->etudiant) {
            $dossier->etudiant->notify(new DossierReorienteNotification(
                $ecole->nom,
                $filiere->nom,
                $request->motif
            ));
            
            // Envoyer un SMS de réorientation
            $this->envoyerSMSReorientation($dossier, $ecole->nom, $filiere->nom, $request->motif);
        }
        
        // Notifier les admins
        $admins = User::role('admin')->get();
        foreach ($admins as $admin) {
            $admin->notify(new DossierReorienteNotification(
                $ecole->nom,
                $filiere->nom,
                $request->motif
            ));
        }
        
        \App\Services\ActivityLogger::log(
            'reorient_dossier',
            Dossier::class,
            $dossier->id,
            "Réorientation du dossier #{$dossier->id} vers l'école #{$ecole->id} ({$ecole->nom}) par un agent."
        );
        
        return back()->with('success', 'Dossier réorienté avec succès et notifications envoyées.');
    }
    
    /**
     * Envoyer un SMS de validation
     */
    private function envoyerSMSValidation($dossier)
    {
        try {
            // Préparation du message SMS
            $message = "DOBAS: Votre dossier N°" . $dossier->numero_dossier . " a été validé avec succès.\n\n";
            $message .= "Félicitations! Votre candidature est acceptée.\n\n";
            $message .= "Cordialement,\nL'équipe DOBAS";
            
            // Formater le numéro de téléphone pour l'envoi de SMS
            $formattedPhone = $this->formatPhoneNumberForSMS($dossier->telephone);
            
            // Vérifier si le numéro est valide avant d'envoyer le SMS
            if (!empty($formattedPhone)) {
                // Envoyer le SMS via le service MTN Tinda
                $this->mtnTindaService->sendSMS(
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
            }
        } catch (\Exception $e) {
            \Log::error('Erreur lors de l\'envoi du SMS de validation', [
                'dossier_id' => $dossier->id,
                'telephone' => $dossier->telephone,
                'error' => $e->getMessage()
            ]);
        }
    }
    
    /**
     * Envoyer un SMS de rejet
     */
    private function envoyerSMSRejet($dossier, $motif)
    {
        try {
            // Préparation du message SMS
            $message = "DOBAS: Nous vous informons que votre dossier N°" . $dossier->numero_dossier . " a été rejeté.\n\n";
            $message .= "Motif: " . $motif . "\n\n";
            $message .= "Pour plus d'informations, veuillez contacter notre service.\n\n";
            $message .= "Cordialement,\nL'équipe DOBAS";
            
            // Formater le numéro de téléphone pour l'envoi de SMS
            $formattedPhone = $this->formatPhoneNumberForSMS($dossier->telephone);
            
            // Vérifier si le numéro est valide avant d'envoyer le SMS
            if (!empty($formattedPhone)) {
                // Envoyer le SMS via le service MTN Tinda
                $this->mtnTindaService->sendSMS(
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
            }
        } catch (\Exception $e) {
            \Log::error('Erreur lors de l\'envoi du SMS de rejet', [
                'dossier_id' => $dossier->id,
                'telephone' => $dossier->telephone,
                'error' => $e->getMessage()
            ]);
        }
    }
    
    /**
     * Envoyer un SMS pour dossier incomplet
     */
    private function envoyerSMSIncomplet($dossier, $commentaire)
    {
        try {
            // Préparation du message SMS
            $message = "DOBAS: Votre dossier N°" . $dossier->numero_dossier . " est incomplet.\n\n";
            $message .= "Commentaire: " . $commentaire . "\n\n";
            $message .= "Veuillez compléter votre dossier dès que possible.\n\n";
            $message .= "Cordialement,\nL'équipe DOBAS";
            
            // Formater le numéro de téléphone pour l'envoi de SMS
            $formattedPhone = $this->formatPhoneNumberForSMS($dossier->telephone);
            
            // Vérifier si le numéro est valide avant d'envoyer le SMS
            if (!empty($formattedPhone)) {
                // Envoyer le SMS via le service MTN Tinda
                $this->mtnTindaService->sendSMS(
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
            }
        } catch (\Exception $e) {
            \Log::error('Erreur lors de l\'envoi du SMS pour dossier incomplet', [
                'dossier_id' => $dossier->id,
                'telephone' => $dossier->telephone,
                'error' => $e->getMessage()
            ]);
        }
    }
    
    /**
     * Envoyer un SMS d'affectation
     */
    private function envoyerSMSAffectation($dossier, $ecoleNom, $filiere)
    {
        try {
            // Préparation du message SMS
            $message = "DOBAS: Votre dossier N°" . $dossier->numero_dossier . " a été traité avec succès.\n\n";
            $message .= "Vous avez été affecté à l'établissement: " . $ecoleNom . "\n";
            $message .= "Filière: " . $filiere . "\n\n";
            $message .= "Félicitations pour votre admission!\n\n";
            $message .= "Cordialement,\nL'équipe DOBAS";
            
            // Formater le numéro de téléphone pour l'envoi de SMS
            $formattedPhone = $this->formatPhoneNumberForSMS($dossier->telephone);
            
            // Vérifier si le numéro est valide avant d'envoyer le SMS
            if (!empty($formattedPhone)) {
                // Envoyer le SMS via le service MTN Tinda
                $this->mtnTindaService->sendSMS(
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
            }
        } catch (\Exception $e) {
            \Log::error('Erreur lors de l\'envoi du SMS d\'affectation', [
                'dossier_id' => $dossier->id,
                'telephone' => $dossier->telephone,
                'error' => $e->getMessage()
            ]);
        }
    }
    
    /**
     * Envoyer un SMS de réorientation
     */
    private function envoyerSMSReorientation($dossier, $ecoleNom, $filiereNom, $motif)
    {
        try {
            // Préparation du message SMS
            $message = "DOBAS: Votre dossier N°" . $dossier->numero_dossier . " a été réorienté.\n\n";
            $message .= "Nouvelle affectation: " . $ecoleNom . "\n";
            $message .= "Filière: " . $filiereNom . "\n\n";
            
            if (!empty($motif)) {
                $message .= "Motif: " . $motif . "\n\n";
            }
            
            $message .= "Cordialement,\nL'équipe DOBAS";
            
            // Formater le numéro de téléphone pour l'envoi de SMS
            $formattedPhone = $this->formatPhoneNumberForSMS($dossier->telephone);
            
            // Vérifier si le numéro est valide avant d'envoyer le SMS
            if (!empty($formattedPhone)) {
                // Envoyer le SMS via le service MTN Tinda
                $this->mtnTindaService->sendSMS(
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
            }
        } catch (\Exception $e) {
            \Log::error('Erreur lors de l\'envoi du SMS de réorientation', [
                'dossier_id' => $dossier->id,
                'telephone' => $dossier->telephone,
                'error' => $e->getMessage()
            ]);
        }
    }
}