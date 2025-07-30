// ========================================
// COMPOSANT ÉTAPE 3 - EtapeBourse.jsx
// ========================================

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function EtapeBourse({ 
  formData, 
  updateFormData, 
  errors, 
  setErrors, 
  onNext, 
  onBack,
  bourses,
  etablissements 
}) {

  // Validation de l'étape
  const validateStep = () => {
    const newErrors = {};
    
    if (!formData.type_bourse) newErrors.type_bourse = "Type de bourse requis";
    if (!formData.etablissement) newErrors.etablissement = "Établissement demandé requis";
    if (formData.type_bourse === "étrangère" && !formData.pays_souhaite) {
      newErrors.pays_souhaite = "Pays souhaité requis pour bourse étrangère";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Filtrage établissements selon type de bourse
  const getEtablissementsFiltered = () => {
    if (!formData.type_bourse) return [];
    return etablissements.filter(etab => {
      if (formData.type_bourse === "locale") return etab.type === "local";
      if (formData.type_bourse === "étrangère") return etab.type === "etranger";
      return etab.type === "aide_scolaire";
    });
  };

  const handleNext = () => {
    if (validateStep()) {
      onNext();
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <h3 className="text-xl font-semibold text-green-700 mb-6">3. Choix de la bourse</h3>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Type de bourse *</Label>
          <Select 
            value={formData.type_bourse || ""}
            onValueChange={value => updateFormData({ type_bourse: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez le type de bourse souhaité" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="locale">Bourse locale</SelectItem>
              <SelectItem value="étrangère">Bourse étrangère</SelectItem>
              <SelectItem value="aide_scolaire">Aide scolaire</SelectItem>
            </SelectContent>
          </Select>
          {errors.type_bourse && <p className="text-red-500 text-sm animate-pulse">{errors.type_bourse}</p>}
        </div>

        {formData.type_bourse === "étrangère" && (
          <div className="space-y-2">
            <Label>Pays souhaité *</Label>
            <Select 
              value={formData.pays_souhaite || ""}
              onValueChange={value => updateFormData({ pays_souhaite: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez le pays de destination" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="France">France</SelectItem>
                <SelectItem value="Maroc">Maroc</SelectItem>
                <SelectItem value="Tunisie">Tunisie</SelectItem>
                <SelectItem value="Sénégal">Sénégal</SelectItem>
                <SelectItem value="Côte d'Ivoire">Côte d'Ivoire</SelectItem>
                <SelectItem value="Cameroun">Cameroun</SelectItem>
                <SelectItem value="Gabon">Gabon</SelectItem>
                <SelectItem value="Autre">Autre</SelectItem>
              </SelectContent>
            </Select>
            {errors.pays_souhaite && <p className="text-red-500 text-sm animate-pulse">{errors.pays_souhaite}</p>}
          </div>
        )}

        <div className="space-y-2">
          <Label>Établissement demandé *</Label>
          <Select 
            value={formData.etablissement || ""}
            onValueChange={value => updateFormData({ etablissement: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez l'établissement souhaité" />
            </SelectTrigger>
            <SelectContent>
              {getEtablissementsFiltered().map((etab, idx) => (
                <SelectItem key={idx} value={etab.nom}>
                  {etab.nom} - {etab.localisation}
                </SelectItem>
              ))}
              {/* Options par défaut si pas de données dynamiques */}
              {getEtablissementsFiltered().length === 0 && formData.type_bourse && (
                <>
                  {formData.type_bourse === "locale" && (
                    <>
                      <SelectItem value="Université Marien Ngouabi">Université Marien Ngouabi - Brazzaville</SelectItem>
                      <SelectItem value="École Normale Supérieure">École Normale Supérieure - Brazzaville</SelectItem>
                      <SelectItem value="Institut Supérieur de Technologie">Institut Supérieur de Technologie - Brazzaville</SelectItem>
                    </>
                  )}
                  {formData.type_bourse === "étrangère" && (
                    <>
                      <SelectItem value="Université Paris-Sorbonne">Université Paris-Sorbonne - France</SelectItem>
                      <SelectItem value="Université Mohammed V">Université Mohammed V - Maroc</SelectItem>
                      <SelectItem value="Université de Tunis">Université de Tunis - Tunisie</SelectItem>
                    </>
                  )}
                  {formData.type_bourse === "aide_scolaire" && (
                    <>
                      <SelectItem value="Lycée technique de Brazzaville">Lycée technique de Brazzaville</SelectItem>
                      <SelectItem value="Lycée de la Révolution">Lycée de la Révolution</SelectItem>
                      <SelectItem value="Lycée Chaminade">Lycée Chaminade</SelectItem>
                    </>
                  )}
                </>
              )}
            </SelectContent>
          </Select>
          {errors.etablissement && <p className="text-red-500 text-sm animate-pulse">{errors.etablissement}</p>}
        </div>

        <div className="space-y-2">
          <Label>Filière souhaitée</Label>
          <Input 
            type="text" 
            placeholder="Ex: Génie Civil, Informatique, Médecine, Droit..."
            value={formData.filiere_souhaitee || ""}
            onChange={e => updateFormData({ filiere_souhaitee: e.target.value })} 
          />
          <p className="text-xs text-gray-500">Précisez la filière ou le domaine d'études souhaité</p>
        </div>

        <div className="space-y-2">
          <Label>Niveau d'études visé</Label>
          <Select 
            value={formData.niveau_vise || ""}
            onValueChange={value => updateFormData({ niveau_vise: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez le niveau d'études visé" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Licence 1">Licence 1ère année</SelectItem>
              <SelectItem value="Licence 2">Licence 2ème année</SelectItem>
              <SelectItem value="Licence 3">Licence 3ème année</SelectItem>
              <SelectItem value="Master 1">Master 1ère année</SelectItem>
              <SelectItem value="Master 2">Master 2ème année</SelectItem>
              <SelectItem value="Formation technique">Formation technique/professionnelle</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Champ conditionnel pour "Autre" pays */}
        {formData.pays_souhaite === "Autre" && (
          <div className="space-y-2">
            <Label>Précisez le pays *</Label>
            <Input 
              type="text" 
              placeholder="Nom du pays de destination"
              value={formData.autre_pays || ""}
              onChange={e => updateFormData({ autre_pays: e.target.value })} 
            />
          </div>
        )}

        {/* Motivation (optionnel) */}
        <div className="space-y-2">
          <Label>Motivation (optionnel)</Label>
          <textarea 
            className="w-full p-3 border border-gray-300 rounded-md resize-none"
            rows="3"
            placeholder="Expliquez brièvement pourquoi vous souhaitez cette bourse..."
            value={formData.motivation || ""}
            onChange={e => updateFormData({ motivation: e.target.value })}
          />
          <p className="text-xs text-gray-500">Maximum 300 caractères</p>
        </div>
      </div>

      <div className="flex space-x-4">
        <Button onClick={onBack} variant="outline" className="flex-1">
          ← Retour
        </Button>
        <Button 
          onClick={handleNext} 
          className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3"
        >
          Continuer → Paiement
        </Button>
      </div>
    </div>
  );
}