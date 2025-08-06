// ========================================
// 1. COMPOSANT PRINCIPAL - Postuler.jsx
// ========================================
import React, { useState, useEffect } from "react";
import PublicLayout from "@/Layouts/PublicLayout";
import { usePage } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
// Import des composants d'étapes
import EtapeIdentification from "../../Components/Public/EtapeIdentification";
import EtapePieces from "../../Components/Public/EtapePieces";
import EtapeBourse from "../../Components/Public/EtapeBourse";
import EtapePaiement from "../../Components/Public/EtapePaiement";

export default function Postuler() {
  const { url } = usePage();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    nationalite: "Congolaise"
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paiementSuccess, setPaiementSuccess] = useState(false);
  const [paiementError, setPaiementError] = useState(false);
  const [paiementMessage, setPaiementMessage] = useState("");
  
  // États pour la gestion du lien de paiement et des tentatives
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRY_ATTEMPTS = 3; // Limiter à 3 tentatives
  
  // Données dynamiques pour les selects
  const [bourses, setBourses] = useState([]);
  const [etablissements, setEtablissements] = useState([]);
  
  // Détecter le statut du paiement via query params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const success = params.get("success");
    const error = params.get("error");
    
    if (success === "1") {
      console.log("Paiement réussi détecté, affichage de la page de succès");
      setPaiementSuccess(true);
      // Réinitialiser complètement les états de paiement
      resetPaymentStates();
    } else if (error) {
      console.log("Erreur de paiement détectée:", error);
      setPaiementError(true);
      setPaiementMessage(error);
      
      // Récupérer le compteur de tentatives depuis le localStorage
      const savedRetryCount = localStorage.getItem('paymentRetryCount');
      if (savedRetryCount) {
        setRetryCount(parseInt(savedRetryCount));
      }
    }
  }, []);
  
  // Charger données dynamiques
  useEffect(() => {
    console.log("Chargement des données dynamiques (bourses et établissements)");
    
    const loadData = async () => {
      try {
        console.log("Récupération des données depuis les API");
        const [boursesRes, etablissementsRes] = await Promise.all([
          fetch('/api/bourses'),
          fetch('/api/etablissements')
        ]);
        
        console.log("Réponses reçues:", {
          boursesStatus: boursesRes.status,
          etablissementsStatus: etablissementsRes.status
        });
        
        const boursesData = await boursesRes.json();
        const etablissementsData = await etablissementsRes.json();
        
        console.log("Données décodées:", {
          boursesCount: boursesData.bourses?.length || 0,
          etablissementsCount: etablissementsData.etablissements?.length || 0
        });
        
        setBourses(boursesData.bourses || []);
        setEtablissements(etablissementsData.etablissements || []);
        
        console.log("Données chargées avec succès");
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      }
    };
    
    loadData();
  }, []);
  
  // Sauvegarde progressive dans le localStorage (sans les fichiers)
  useEffect(() => {
    console.log("Sauvegarde des données du formulaire dans localStorage");
    
    // Créer une copie de formData sans les fichiers
    const formDataToSave = { ...formData };
    // Liste des champs qui sont des fichiers
    const fileFields = [
      'photo_identite',
      'casier_judiciaire',
      'certificat_nationalite',
      'attestation_bac',
      'certificat_medical',
      'acte_naissance',
      'passeport',
      'preuve_paiement'
    ];
    // Supprimer les champs de type fichier de l'objet à sauvegarder
    fileFields.forEach(field => {
      delete formDataToSave[field];
    });
    
    console.log("Données sauvegardées (sans fichiers):", Object.keys(formDataToSave));
    localStorage.setItem('postulerFormData', JSON.stringify(formDataToSave));
  }, [formData]);
  
  // Restaurer les données au chargement
  useEffect(() => {
    console.log("Restauration des données depuis localStorage");
    
    const saved = localStorage.getItem('postulerFormData');
    if (saved) {
      const savedData = JSON.parse(saved);
      console.log("Données restaurées:", Object.keys(savedData));
      setFormData({ ...savedData, nationalite: "Congolaise" });
      // Note: Les fichiers ne sont pas restaurés, l'utilisateur devra les sélectionner à nouveau
      console.log("Les fichiers devront être sélectionnés à nouveau");
    } else {
      console.log("Aucune donnée sauvegardée trouvée");
    }
  }, []);
  
  // Mise à jour des données du formulaire
  const updateFormData = (newData) => {
    console.log("Mise à jour des données du formulaire:", Object.keys(newData));
    setFormData(prev => ({ ...prev, ...newData }));
  };
  
  // Fonction pour réinitialiser les états de paiement
  const resetPaymentStates = () => {
    console.log("Réinitialisation des états de paiement");
    // Supprimer le lien de paiement du localStorage
    localStorage.removeItem('paymentLink');
    localStorage.removeItem('paymentRetryCount');
    setRetryCount(0);
    setPaiementError(false);
    setPaiementSuccess(false);
    setPaiementMessage("");
  };
  
  // Navigation
  const handleBack = () => {
    console.log(`Retour à l'étape ${step - 1}`);
    setErrors({});
    // Réinitialiser les états de paiement lorsque l'utilisateur navigue
    resetPaymentStates();
    setStep(step - 1);
  };
  
  const handleNext = () => {
    console.log(`Passage à l'étape ${step + 1}`);
    // Réinitialiser les états de paiement lorsque l'utilisateur navigue
    resetPaymentStates();
    setStep(step + 1);
  };
  
  // Réessayer le paiement
  const handleRetryPayment = () => {
    console.log("Réessai du paiement");
    
    // Récupérer le lien de paiement depuis le localStorage
    const savedPaymentLink = localStorage.getItem('paymentLink');
    
    // Vérifier si on a atteint le nombre maximum de tentatives
    if (retryCount >= MAX_RETRY_ATTEMPTS) {
      console.log("Nombre maximum de tentatives atteint");
      setErrors({ 
        form: `Vous avez atteint le nombre maximum de tentatives (${MAX_RETRY_ATTEMPTS}). Veuillez contacter le support ou réessayer plus tard.` 
      });
      return;
    }
    
    // Vérifier si on a un lien de paiement valide
    if (!savedPaymentLink) {
      console.log("Aucun lien de paiement disponible");
      setErrors({ form: "Aucun lien de paiement disponible. Veuillez recommencer le processus de candidature." });
      return;
    }
    
    // Incrémenter le compteur de tentatives et le sauvegarder
    const newRetryCount = retryCount + 1;
    setRetryCount(newRetryCount);
    localStorage.setItem('paymentRetryCount', newRetryCount.toString());
    
    // Réinitialiser les états d'erreur
    setPaiementError(false);
    setPaiementSuccess(false);
    
    // Rediriger vers le même lien de paiement
    console.log("Redirection vers le lien de paiement existant:", savedPaymentLink);
    window.location.href = savedPaymentLink;
  };
  
  // Soumission finale du formulaire
// Soumission finale du formulaire
const handleFinalSubmit = async () => {
    console.log("Début de la soumission finale du formulaire");
    setIsSubmitting(true);
    setErrors({});
    
    // Réinitialiser les états de paiement pour une nouvelle soumission
    resetPaymentStates();
    
    // Vérifier que tous les fichiers requis sont présents
    const requiredFiles = [
        'photo_identite',
        'casier_judiciaire',
        'certificat_nationalite',
        'attestation_bac',
        'certificat_medical',
        'acte_naissance'
    ];
    
    if (formData.type_bourse === 'étrangère') {
        requiredFiles.push('passeport');
        console.log("Ajout du passeport aux fichiers requis (bourse étrangère)");
    }
    
    if (formData.mode_paiement === 'depot_physique') {
        requiredFiles.push('preuve_paiement');
        console.log("Ajout de la preuve de paiement aux fichiers requis (dépôt physique)");
    }
    
    console.log("Fichiers requis:", requiredFiles);
    
    const missingFiles = requiredFiles.filter(field => !formData[field]);
    
    if (missingFiles.length > 0) {
        console.error("Fichiers manquants:", missingFiles);
        setErrors({
            form: `Veuillez télécharger les fichiers suivants: ${missingFiles.join(', ')}`
        });
        setIsSubmitting(false);
        return;
    }
    
    console.log("Tous les fichiers requis sont présents");
    
    // Debug: Afficher les données avant envoi
    console.log("Données du formulaire avant envoi:", {
        ...formData,
        // Masquer les données sensibles pour le log
        email: formData.email ? formData.email.substring(0, 3) + "***" : null,
        telephone: formData.telephone ? formData.telephone.substring(0, 3) + "***" : null
    });
    
    console.log("Détails importants:", {
        pays_souhaite: formData.pays_souhaite,
        type_bourse: formData.type_bourse,
        cas_social: formData.cas_social,
        moyenne: formData.moyenne,
        mode_paiement: formData.mode_paiement
    });
    
    try {
        console.log("Préparation des données pour l'envoi");
        const formDataToSend = new FormData();
        
        Object.entries(formData).forEach(([key, value]) => {
            if (value instanceof File) {
                console.log(`Ajout du fichier: ${key} (${value.name}, ${value.size} octets)`);
                formDataToSend.append(key, value);
            } else if (key === "cas_social") {
                formDataToSend.append(key, value ? 1 : 0); // Transformation en 1 ou 0
                console.log(`Transformation cas_social: ${value} -> ${value ? 1 : 0}`);
            } else if (value !== null && value !== undefined && value !== "") {
                formDataToSend.append(key, value);
            }
        });
        
        console.log("Envoi des données au serveur");
        const response = await fetch("/candidature/submit", {
            method: "POST",
            body: formDataToSend,
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            }
        });
        
        console.log("Réponse du serveur reçue:", {
            status: response.status,
            statusText: response.statusText
        });
        
        const data = await response.json();
        console.log("Réponse du serveur (JSON):", data);
        
        if (data.success) {
            console.log("Candidature soumise avec succès");
            
            // Le backend a déjà initialisé le paiement et fourni l'URL
            if (data.requires_payment && data.link) {
                // Stocker le lien de paiement dans le localStorage pour les tentatives futures
                console.log("Stockage du lien de paiement dans localStorage:", data.link);
                localStorage.setItem('paymentLink', data.link);
                localStorage.setItem('paymentRetryCount', '0'); // Initialiser le compteur à 0
                
                console.log("Redirection vers la page de paiement:", data.link);
                window.location.href = data.link;
            } else {
                // Si aucun paiement n'est requis
                console.log("Aucun paiement requis, redirection vers la page de succès");
                setPaiementSuccess(true);
            }
        } else {
            console.error("Erreur lors de la soumission:", data);
            setErrors(data.errors || { form: "Erreur lors de la soumission" });
        }
    } catch (error) {
        console.error("Erreur lors de la soumission:", error);
        setErrors({ form: "Erreur réseau. Veuillez réessayer." });
    } finally {
        setIsSubmitting(false);
    }
};
  
  // Page de succès
  if (paiementSuccess) {
    console.log("Affichage de la page de succès");
    return (
      <PublicLayout>
        <div className="flex items-center justify-center min-h-screen p-6 bg-gradient-to-br from-green-50 via-yellow-50 to-red-50">
          <Card className="max-w-xl p-8 text-center rounded-lg shadow-xl bg-white/95">
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <h2 className="mb-4 text-3xl font-bold text-green-700">🎉 Candidature soumise !</h2>
            <p className="mb-6">Votre dossier a été reçu et sera traité dans les plus brefs délais.</p>
            <Button onClick={() => {
              console.log("Retour à l'accueil");
              // Réinitialiser complètement les états
              resetPaymentStates();
              window.location.href = "/";
            }}>Retour à l'accueil</Button>
          </Card>
        </div>
      </PublicLayout>
    );
  }
  
  // Page d'échec
  if (paiementError) {
    console.log("Affichage de la page d'échec");
    
    // Récupérer le lien de paiement depuis le localStorage
    const savedPaymentLink = localStorage.getItem('paymentLink');
    
    return (
      <PublicLayout>
        <div className="flex items-center justify-center min-h-screen p-6 bg-gradient-to-br from-green-50 via-yellow-50 to-red-50">
          <Card className="max-w-xl p-8 text-center rounded-lg shadow-xl bg-white/95">
            <div className="flex justify-center mb-4">
              <XCircle className="w-16 h-16 text-red-500" />
            </div>
            <h2 className="mb-4 text-3xl font-bold text-red-700">😔 Échec du paiement</h2>
            <p className="mb-4">{paiementMessage || "Une erreur est survenue lors du traitement de votre paiement."}</p>
            
            {/* Afficher le nombre de tentatives restantes */}
            <p className="mb-4 text-sm text-gray-600">
              Tentative {retryCount} sur {MAX_RETRY_ATTEMPTS}
            </p>
            
            {/* Afficher un message différent si on a atteint la limite */}
            {retryCount >= MAX_RETRY_ATTEMPTS ? (
              <p className="mb-6 font-medium text-red-600">
                Vous avez atteint le nombre maximum de tentatives. Veuillez contacter le support ou réessayer plus tard.
              </p>
            ) : (
              <p className="mb-6 text-sm text-gray-600">
                Vous pouvez réessayer le paiement. Le lien de paiement reste valide.
              </p>
            )}
            
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              {/* Désactiver le bouton si on a atteint la limite ou si le lien n'est pas disponible */}
              <Button 
                onClick={handleRetryPayment} 
                disabled={retryCount >= MAX_RETRY_ATTEMPTS || !savedPaymentLink}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
              >
                {retryCount >= MAX_RETRY_ATTEMPTS 
                  ? "Nombre maximum de tentatives atteint" 
                  : "Réessayer le paiement"}
              </Button>
              <Button onClick={() => {
                console.log("Retour à l'accueil");
                // Réinitialiser complètement les états
                resetPaymentStates();
                window.location.href = "/";
              }} variant="outline">
                Retour à l'accueil
              </Button>
            </div>
          </Card>
        </div>
      </PublicLayout>
    );
  }
  
  // Rendu du composant d'étape approprié
  const renderStepComponent = () => {
    console.log(`Rendu du composant pour l'étape ${step}`);
    
    const commonProps = {
      formData,
      updateFormData,
      errors,
      setErrors,
      onNext: handleNext,
      onBack: handleBack
    };
    
    switch (step) {
      case 1:
        console.log("Affichage de l'étape d'identification");
        return <EtapeIdentification {...commonProps} />;
      case 2:
        console.log("Affichage de l'étape des pièces");
        return <EtapePieces {...commonProps} />;
      case 3:
        console.log("Affichage de l'étape de bourse");
        return <EtapeBourse {...commonProps} bourses={bourses} etablissements={etablissements} />;
      case 4:
        console.log("Affichage de l'étape de paiement");
        return <EtapePaiement {...commonProps} onSubmit={handleFinalSubmit} isSubmitting={isSubmitting} />;
      default:
        console.error(`Étape inconnue: ${step}`);
        return null;
    }
  };
  
  return (
    <PublicLayout>
      <div className="min-h-screen py-12 bg-gradient-to-br from-green-50 via-yellow-50 to-red-50">
        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
            <CardHeader className="text-white bg-gradient-to-r from-green-500 via-yellow-500 to-red-500">
              <CardTitle className="text-2xl font-bold text-center">
                Formulaire de Candidature - DOBAS
              </CardTitle>
              {/* Stepper */}
              <div className="flex items-center justify-between mt-6 mb-4">
                {["Identification", "Pièces", "Bourse", "Paiement"].map((label, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full ${step > idx + 1 ? 'bg-white text-green-600' :
                      step === idx + 1 ? 'bg-green-600 text-white scale-110 animate-pulse' :
                        'bg-white/30 text-white/60'
                      }`}>
                      {step > idx + 1 ? <CheckCircle className="w-6 h-6" /> : idx + 1}
                    </div>
                    <span className={`text-sm mt-2 font-medium ${step >= idx + 1 ? 'text-white' : 'text-white/60'}`}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>
              {/* Progress Bar */}
              <div className="relative">
                <Progress value={(step / 4) * 100} className="h-3 bg-white/20" />
                <div
                  className="absolute top-0 left-0 h-3 transition-all duration-700 ease-out rounded-full bg-gradient-to-r from-white via-white/80 to-white/60"
                  style={{ width: `${(step / 4) * 100}%` }}
                ></div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              {renderStepComponent()}
            </CardContent>
          </Card>
        </div>
      </div>
    </PublicLayout>
  );
}