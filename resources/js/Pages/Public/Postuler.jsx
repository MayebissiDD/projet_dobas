// ========================================
// 1. COMPOSANT PRINCIPAL - Postuler.jsx
// ========================================

import React, { useState, useEffect } from "react";
import PublicLayout from "@/Layouts/PublicLayout";
import { usePage } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle } from "lucide-react";

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
  const [paiementSuccess, setpaiementSuccess] = useState(false);

  // Données dynamiques pour les selects
  const [bourses, setBourses] = useState([]);
  const [etablissements, setEtablissements] = useState([]);

  // Detecter succès paiement via query param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "1") {
      setpaiementSuccess(true);
    }
  }, []);

  // Charger données dynamiques
  useEffect(() => {
    const loadData = async () => {
      try {
        const [boursesRes, etablissementsRes] = await Promise.all([
          fetch('/api/bourses'),
          fetch('/api/etablissements')
        ]);

        const boursesData = await boursesRes.json();
        const etablissementsData = await etablissementsRes.json();

        setBourses(boursesData.bourses || []);
        setEtablissements(etablissementsData.etablissements || []);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      }
    };

    loadData();
  }, []);

  // Dans Postuler.jsx

  // Sauvegarde progressive dans le localStorage (sans les fichiers)
  useEffect(() => {
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

    localStorage.setItem('postulerFormData', JSON.stringify(formDataToSave));
  }, [formData]);

  // Restaurer les données au chargement
  useEffect(() => {
    const saved = localStorage.getItem('postulerFormData');
    if (saved) {
      const savedData = JSON.parse(saved);
      setFormData({ ...savedData, nationalite: "Congolaise" });
      // Note: Les fichiers ne sont pas restaurés, l'utilisateur devra les sélectionner à nouveau
    }
  }, []);

  // Mise à jour des données du formulaire
  const updateFormData = (newData) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  // Navigation
  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setErrors({});
    setStep(step - 1);
  };

  // Dans Postuler.jsx, modifiez handleFinalSubmit

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    setErrors({});

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
    }

    if (formData.mode_paiement === 'depot_physique') {
      requiredFiles.push('preuve_paiement');
    }

    const missingFiles = requiredFiles.filter(field => !formData[field]);
    if (missingFiles.length > 0) {
      setErrors({
        form: `Veuillez télécharger les fichiers suivants: ${missingFiles.join(', ')}`
      });
      setIsSubmitting(false);
      return;
    }

    // Debug: Afficher les données avant envoi
    console.log("Données du formulaire avant envoi:", formData);
    console.log("Pays souhaité:", formData.pays_souhaite);
    console.log("Type de bourse:", formData.type_bourse);
    console.log("Cas social:", formData.cas_social);
    console.log("Moyenne:", formData.moyenne);

    try {
      const formDataToSend = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (value instanceof File) {
          formDataToSend.append(key, value);
        } else if (key === "cas_social") {
          formDataToSend.append(key, value ? 1 : 0); // 👈 transforme en 1 ou 0
        } else if (value !== null && value !== undefined && value !== "") {
          formDataToSend.append(key, value);
        }
      });

      const response = await fetch("/candidature/submit", {
        method: "POST",
        body: formDataToSend,
        headers: {
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        }
      });

      const data = await response.json();
      console.log("Réponse du serveur:", data);

      if (data.success) {
        // Préparer les données de paiement après avoir reçu le dossier_id
        const paiementData = new FormData();
        paiementData.append("dossier_id", data.dossier_id);
        paiementData.append("fullName", formData.nom);
        paiementData.append("email", formData.email);
        paiementData.append("telephone", formData.telephone);
        paiementData.append("montant", "7500");
        paiementData.append("mode", formData.mode_paiement);

        const paiementResponse = await fetch("/paiement/initiate", {
          method: "POST",
          body: paiementData,
          headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
          }
        });

        const paiementResult = await paiementResponse.json();
        if (paiementResult.success && paiementResult.link) {
          window.location.href = paiementResult.link;
        } else {
          setErrors({ form: "Erreur lors de l'initialisation du paiement" });
        }
      } else {
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
    return (
      <PublicLayout>
        <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-green-50 via-yellow-50 to-red-50">
          <Card className="max-w-xl p-8 text-center bg-white/95 shadow-xl rounded-lg">
            <h2 className="text-3xl font-bold text-green-700 mb-4">🎉 Candidature soumise !</h2>
            <p className="mb-6">Votre dossier a été reçu et sera traité dans les plus brefs délais.</p>
            <Button onClick={() => window.location.href = "/"}>Retour à l'accueil</Button>
          </Card>
        </div>
      </PublicLayout>
    );
  }

  // Rendu du composant d'étape approprié
  const renderStepComponent = () => {
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
        return <EtapeIdentification {...commonProps} />;
      case 2:
        return <EtapePieces {...commonProps} />;
      case 3:
        return <EtapeBourse {...commonProps} bourses={bourses} etablissements={etablissements} />;
      case 4:
        return <EtapePaiement {...commonProps} onSubmit={handleFinalSubmit} isSubmitting={isSubmitting} />;
      default:
        return null;
    }
  };

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-red-50 py-12">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 text-white">
              <CardTitle className="text-2xl text-center font-bold">
                Formulaire de Candidature - DOBAS
              </CardTitle>

              {/* Stepper */}
              <div className="flex justify-between items-center mt-6 mb-4">
                {["Identification", "Pièces", "Bourse", "Paiement"].map((label, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full ${step > idx + 1 ? 'bg-white text-green-600' :
                      step === idx + 1 ? 'bg-green-600 text-white scale-110 animate-pulse' :
                        'bg-white/30 text-white/60'
                      }`}>
                      {step > idx + 1 ? <CheckCircle className="h-6 w-6" /> : idx + 1}
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
                  className="absolute top-0 left-0 h-3 bg-gradient-to-r from-white via-white/80 to-white/60 rounded-full transition-all duration-700 ease-out"
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