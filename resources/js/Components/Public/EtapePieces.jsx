// ========================================
// COMPOSANT ÉTAPE 2 - EtapePieces.jsx
// ========================================

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";

export default function EtapePieces({ 
  formData, 
  updateFormData, 
  errors, 
  setErrors, 
  onNext, 
  onBack 
}) {
  
  // Validation des pièces justificatives
  const validatePieces = () => {
    const newErrors = {};
    
    if (!formData.casier_judiciaire) newErrors.casier_judiciaire = "Casier judiciaire requis";
    if (!formData.certificat_nationalite) newErrors.certificat_nationalite = "Certificat de nationalité requis";
    if (!formData.attestation_bac) newErrors.attestation_bac = "Attestation de réussite au BAC requise";
    if (!formData.certificat_medical) newErrors.certificat_medical = "Certificat médical requis";
    if (!formData.acte_naissance) newErrors.acte_naissance = "Acte de naissance requis";
    
    // Validation conditionnelle du passeport pour bourse étrangère
    if (formData.type_bourse === "étrangère" && !formData.passeport) {
      newErrors.passeport = "Passeport requis pour bourse étrangère";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Gestion des fichiers avec validation
  const handleFileUpload = (field, file) => {
    if (!file) return;
    
    // Vérification taille (max 5Mo)
    if (file.size > 5 * 1024 * 1024) {
      setErrors({ ...errors, [field]: "Fichier trop volumineux (max 5Mo)" });
      return;
    }
    
    // Vérification format
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      setErrors({ ...errors, [field]: "Format non supporté (PDF, JPG, PNG uniquement)" });
      return;
    }
    
    updateFormData({ [field]: file });
    
    // Supprimer l'erreur pour ce champ s'il y en avait une
    const newErrors = { ...errors };
    delete newErrors[field];
    setErrors(newErrors);
  };

  // Navigation vers l'étape suivante
  const handleNext = () => {
    if (validatePieces()) {
      onNext();
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <h3 className="text-xl font-semibold text-green-700 mb-6">2. Pièces justificatives</h3>
      
      {/* Message d'information */}
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <div className="flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-blue-600" />
          <p className="text-blue-800 text-sm">
            Toutes les pièces doivent dater de moins de 3 mois (sauf acte de naissance)
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Casier judiciaire */}
        <div className="space-y-2">
          <Label>Casier judiciaire *</Label>
          <Input 
            type="file" 
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={e => handleFileUpload('casier_judiciaire', e.target.files[0])}
          />
          <p className="text-xs text-gray-500">PDF ou image, moins de 3 mois</p>
          {formData.casier_judiciaire && (
            <p className="text-green-600 text-sm">✓ Fichier sélectionné: {formData.casier_judiciaire.name}</p>
          )}
          {errors.casier_judiciaire && (
            <p className="text-red-500 text-sm animate-pulse">{errors.casier_judiciaire}</p>
          )}
        </div>

        {/* Certificat de nationalité */}
        <div className="space-y-2">
          <Label>Certificat de nationalité *</Label>
          <Input 
            type="file" 
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={e => handleFileUpload('certificat_nationalite', e.target.files[0])}
          />
          <p className="text-xs text-gray-500">PDF ou image, moins de 3 mois</p>
          {formData.certificat_nationalite && (
            <p className="text-green-600 text-sm">✓ Fichier sélectionné: {formData.certificat_nationalite.name}</p>
          )}
          {errors.certificat_nationalite && (
            <p className="text-red-500 text-sm animate-pulse">{errors.certificat_nationalite}</p>
          )}
        </div>

        {/* Attestation de réussite au BAC */}
        <div className="space-y-2">
          <Label>Attestation de réussite au BAC *</Label>
          <Input 
            type="file" 
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={e => handleFileUpload('attestation_bac', e.target.files[0])}
          />
          <p className="text-xs text-gray-500">PDF ou image de votre attestation de réussite</p>
          {formData.attestation_bac && (
            <p className="text-green-600 text-sm">✓ Fichier sélectionné: {formData.attestation_bac.name}</p>
          )}
          {errors.attestation_bac && (
            <p className="text-red-500 text-sm animate-pulse">{errors.attestation_bac}</p>
          )}
        </div>

        {/* Certificat médical */}
        <div className="space-y-2">
          <Label>Certificat médical *</Label>
          <Input 
            type="file" 
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={e => handleFileUpload('certificat_medical', e.target.files[0])}
          />
          <p className="text-xs text-gray-500">Délivré par un médecin du METP, moins de 3 mois</p>
          {formData.certificat_medical && (
            <p className="text-green-600 text-sm">✓ Fichier sélectionné: {formData.certificat_medical.name}</p>
          )}
          {errors.certificat_medical && (
            <p className="text-red-500 text-sm animate-pulse">{errors.certificat_medical}</p>
          )}
        </div>

        {/* Acte de naissance */}
        <div className="space-y-2">
          <Label>Acte de naissance *</Label>
          <Input 
            type="file" 
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={e => handleFileUpload('acte_naissance', e.target.files[0])}
          />
          <p className="text-xs text-gray-500">Photocopie couleur de votre acte de naissance</p>
          {formData.acte_naissance && (
            <p className="text-green-600 text-sm">✓ Fichier sélectionné: {formData.acte_naissance.name}</p>
          )}
          {errors.acte_naissance && (
            <p className="text-red-500 text-sm animate-pulse">{errors.acte_naissance}</p>
          )}
        </div>

        {/* Passeport (conditionnel pour bourse étrangère) */}
        {formData.type_bourse === "étrangère" && (
          <div className="space-y-2">
            <Label>Passeport valide *</Label>
            <Input 
              type="file" 
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={e => handleFileUpload('passeport', e.target.files[0])}
            />
            <p className="text-xs text-gray-500">Passeport en cours de validité (requis pour bourse étrangère)</p>
            {formData.passeport && (
              <p className="text-green-600 text-sm">✓ Fichier sélectionné: {formData.passeport.name}</p>
            )}
            {errors.passeport && (
              <p className="text-red-500 text-sm animate-pulse">{errors.passeport}</p>
            )}
          </div>
        )}
      </div>

      {/* Boutons de navigation */}
      <div className="flex space-x-4 mt-8">
        <Button 
          onClick={onBack} 
          variant="outline" 
          className="flex-1"
        >
          ← Retour
        </Button>
        <Button 
          onClick={handleNext} 
          className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3"
        >
          Continuer → Choix de bourse
        </Button>
      </div>
    </div>
  );
}