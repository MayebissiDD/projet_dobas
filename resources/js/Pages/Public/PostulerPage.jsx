// ========================================
// 1. COMPOSANT PRINCIPAL - PostulerPage.jsx
// ========================================

import React, { useState, useEffect } from "react";
import PublicLayout from "@/Layouts/PublicLayout";
import { usePage } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle } from "lucide-react";

// Import des composants d'étapes
import EtapeIdentification from "./components/EtapeIdentification";
import EtapePieces from "./components/EtapePieces";
import EtapeBourse from "./components/EtapeBourse";
import EtapePaiement from "./components/EtapePaiement";

export default function PostulerPage() {
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

  // Sauvegarde progressive dans le localStorage
  useEffect(() => {
    localStorage.setItem('postulerFormData', JSON.stringify(formData));
  }, [formData]);

  // Restaurer les données au chargement
  useEffect(() => {
    const saved = localStorage.getItem('postulerFormData');
    if (saved) {
      const savedData = JSON.parse(saved);
      setFormData({ ...savedData, nationalite: "Congolaise" });
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

  // Soumission finale
  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    setErrors({});

    try {
      const formDataToSend = new FormData();
      
      Object.entries(formData).forEach(([key, value]) => {
        if (value instanceof File) {
          formDataToSend.append(key, value);
        } else {
          formDataToSend.append(key, value ?? "");
        }
      });

      const response = await fetch("/api/dossiers/public", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();
      
      if (data.success) {
        if (formData.mode_paiement === "mobile_money" || formData.mode_paiement === "carte") {
          const paiementData = new FormData();
          paiementData.append("fullName", formData.nom);
          paiementData.append("email", formData.email);
          paiementData.append("telephone", formData.telephone);
          paiementData.append("montant", "7500");
          paiementData.append("mode", formData.mode_paiement);
          
          const paiementResponse = await fetch("/paiement/public", {
            method: "POST",
            body: paiementData,
          });
          
          const paiementResult = await paiementResponse.json();
          if (paiementResult.success && paiementResult.link) {
            window.location.href = paiementResult.link;
          }
        } else {
          setpaiementSuccess(true);
        }
      } else {
        setErrors(data.errors || { form: "Erreur lors de la soumission" });
      }
    } catch (error) {
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

    switch(step) {
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
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full ${
                      step > idx + 1 ? 'bg-white text-green-600' : 
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