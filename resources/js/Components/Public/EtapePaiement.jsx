// ========================================
// COMPOSANT ÉTAPE 4 - EtapePaiement.jsx
// ========================================

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard, Smartphone, Building2, AlertCircle, CheckCircle2 } from "lucide-react";

export default function EtapePaiement({ 
  formData, 
  updateFormData, 
  errors, 
  setErrors, 
  onBack,
  onSubmit,
  isSubmitting 
}) {

  // Validation de l'étape
  const validateStep = () => {
    const newErrors = {};
    
    if (!formData.mode_paiement) newErrors.mode_paiement = "Mode de paiement requis";
    if (formData.mode_paiement === "depot_physique" && !formData.preuve_paiement) {
      newErrors.preuve_paiement = "Preuve de paiement requise pour dépôt physique";
    }
    if (!formData.certification) newErrors.certification = "Vous devez certifier l'exactitude des informations";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Gestion des fichiers
  const handleFileUpload = (field, file) => {
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      setErrors({ ...errors, [field]: "Fichier trop volumineux (max 5Mo)" });
      return;
    }
    
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      setErrors({ ...errors, [field]: "Format non supporté (PDF, JPG, PNG uniquement)" });
      return;
    }
    
    updateFormData({ [field]: file });
    setErrors({ ...errors, [field]: undefined });
  };

  const handleSubmit = () => {
    if (validateStep()) {
      onSubmit();
    }
  };

  // Options de paiement avec icônes
  const paymentOptions = [
    {
      value: "mobile_money",
      label: "Mobile Money (MTN/Orange)",
      icon: <Smartphone className="h-5 w-5" />,
      description: "Paiement via MTN Money ou Orange Money"
    },
    {
      value: "carte",
      label: "Carte bancaire",
      icon: <CreditCard className="h-5 w-5" />,
      description: "Paiement sécurisé par carte bancaire"
    },
    {
      value: "depot_physique",
      label: "Dépôt physique",
      icon: <Building2 className="h-5 w-5" />,
      description: "Dépôt en banque ou au guichet DOBAS"
    }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <h3 className="text-xl font-semibold text-green-700 mb-6">4. Paiement des frais de dossier</h3>
      
      {/* Montant */}
      <div className="bg-gradient-to-r from-yellow-50 to-green-50 p-6 rounded-lg border border-yellow-200">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-bold text-yellow-800 mb-1">Montant à régler</h4>
            <p className="text-sm text-yellow-700">Frais de traitement du dossier de candidature</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-green-700">7 500</p>
            <p className="text-sm font-medium text-green-600">FCFA</p>
          </div>
        </div>
      </div>

      {/* Mode de paiement */}
      <div className="space-y-4">
        <Label className="text-base font-semibold">Mode de paiement *</Label>
        
        <div className="grid gap-4">
          {paymentOptions.map((option) => (
            <div
              key={option.value}
              className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all hover:border-green-300 ${
                formData.mode_paiement === option.value
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
              onClick={() => updateFormData({ mode_paiement: option.value })}
            >
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="mode_paiement"
                  value={option.value}
                  checked={formData.mode_paiement === option.value}
                  onChange={() => updateFormData({ mode_paiement: option.value })}
                  className="text-green-600"
                />
                <div className="flex items-center space-x-2 flex-1">
                  {option.icon}
                  <div>
                    <p className="font-medium text-gray-900">{option.label}</p>
                    <p className="text-sm text-gray-600">{option.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {errors.mode_paiement && <p className="text-red-500 text-sm animate-pulse">{errors.mode_paiement}</p>}
      </div>

      {/* Upload preuve si dépôt physique */}
      {formData.mode_paiement === "depot_physique" && (
        <div className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-blue-600" />
            <Label className="font-medium text-blue-800">Preuve de paiement *</Label>
          </div>
          <Input 
            type="file" 
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={e => handleFileUpload('preuve_paiement', e.target.files[0])}
            className="bg-white"
          />
          <p className="text-xs text-blue-700">
            Joignez le reçu de versement ou bordereau de dépôt (PDF, JPG, PNG - max 5Mo)
          </p>
          {errors.preuve_paiement && <p className="text-red-500 text-sm animate-pulse">{errors.preuve_paiement}</p>}
        </div>
      )}

      {/* Informations de paiement par mode */}
      {formData.mode_paiement && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h5 className="font-medium text-gray-800 mb-2">Informations de paiement</h5>
          
          {formData.mode_paiement === "mobile_money" && (
            <div className="text-sm text-gray-600 space-y-1">
              <p>• Vous serez redirigé vers votre plateforme de paiement mobile</p>
              <p>• Suivez les instructions à l'écran pour finaliser le paiement</p>
              <p>• Confirmation automatique après validation</p>
            </div>
          )}
          
          {formData.mode_paiement === "carte" && (
            <div className="text-sm text-gray-600 space-y-1">
              <p>• Paiement sécurisé par carte bancaire via Stripe</p>
              <p>• Toutes les cartes Visa et Mastercard sont acceptées</p>
              <p>• Transaction cryptée et sécurisée</p>
            </div>
          )}
          
          {formData.mode_paiement === "depot_physique" && (
            <div className="text-sm text-gray-600 space-y-1">
              <p>• <strong>Compte DOBAS :</strong> [Numéro de compte à fournir]</p>
              <p>• <strong>Banque :</strong> [Nom de la banque]</p>
              <p>• <strong>Référence :</strong> Mentionner "DOBAS - [Votre nom]"</p>
              <p>• Votre dossier sera traité après vérification du paiement</p>
            </div>
          )}
        </div>
      )}

      {/* Certification */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div className="flex items-start space-x-3">
          <input 
            type="checkbox" 
            id="certification"
            checked={formData.certification || false}
            onChange={e => updateFormData({ certification: e.target.checked })}
            className="mt-1 text-green-600 focus:ring-green-500"
          />
          <div className="flex-1">
            <Label htmlFor="certification" className="text-sm cursor-pointer leading-relaxed">
              <CheckCircle2 className={`inline h-4 w-4 mr-1 ${formData.certification ? 'text-green-600' : 'text-gray-400'}`} />
              Je certifie sur l'honneur que toutes les informations fournies dans ce formulaire sont exactes et complètes. 
              Je comprends que toute déclaration fausse ou omission pourra entraîner le rejet définitif de ma candidature.
            </Label>
          </div>
        </div>
        {errors.certification && <p className="text-red-500 text-sm animate-pulse mt-2">{errors.certification}</p>}
      </div>

      {/* Erreurs générales */}
      {errors.form && (
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <p className="text-red-700 text-sm font-medium">{errors.form}</p>
          </div>
        </div>
      )}

      {/* Récapitulatif */}
      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <h5 className="font-medium text-green-800 mb-2">Récapitulatif de votre candidature</h5>
        <div className="text-sm text-green-700 space-y-1">
          <p>• <strong>Candidat :</strong> {formData.nom || "Non renseigné"}</p>
          <p>• <strong>Type de bourse :</strong> {formData.type_bourse || "Non renseigné"}</p>
          <p>• <strong>Établissement :</strong> {formData.etablissement || "Non renseigné"}</p>
          <p>• <strong>Email :</strong> {formData.email || "Non renseigné"}</p>
          <p>• <strong>Téléphone :</strong> {formData.telephone || "Non renseigné"}</p>
        </div>
      </div>

      {/* Boutons d'action */}
      <div className="flex space-x-4 pt-4">
        <Button onClick={onBack} variant="outline" className="flex-1" disabled={isSubmitting}>
          ← Retour
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={isSubmitting || !formData.certification}
          className="flex-1 bg-gradient-to-r from-yellow-400 to-green-600 hover:from-yellow-500 hover:to-green-700 text-white font-semibold py-3 text-lg"
        >
          {isSubmitting ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              <span>Traitement en cours...</span>
            </div>
          ) : (
            <>
              {formData.mode_paiement === "depot_physique" ? "Soumettre la candidature" : "Procéder au paiement"}
              <span className="ml-2">→</span>
            </>
          )}
        </Button>
      </div>

      {/* Note finale */}
      <div className="text-center text-xs text-gray-500 mt-4 space-y-1">
        <p>En soumettant cette candidature, vous acceptez les conditions générales de la DOBAS.</p>
        <p>Vous recevrez un email de confirmation après validation de votre paiement.</p>
      </div>
    </div>
  );
}