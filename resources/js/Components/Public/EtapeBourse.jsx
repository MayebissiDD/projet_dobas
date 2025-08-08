import React, { useState, useEffect } from "react";
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
  // État pour stocker les filières de l'établissement sélectionné
  const [filieresDisponibles, setFilieresDisponibles] = useState([]);
  
  // État pour stocker les niveaux disponibles pour la filière sélectionnée
  const [niveauxDisponibles, setNiveauxDisponibles] = useState([]);
  
  // Effet pour mettre à jour les filières lorsque l'établissement change
  useEffect(() => {
    console.log("Mise à jour des filières pour l'établissement:", formData.etablissement);
    
    if (formData.etablissement) {
      // Trouver l'établissement sélectionné dans la liste
      const etablissementSelectionne = etablissements.find(
        etab => etab.nom === formData.etablissement
      );
      
      if (etablissementSelectionne && etablissementSelectionne.filieres) {
        console.log("Filières trouvées:", etablissementSelectionne.filieres);
        setFilieresDisponibles(etablissementSelectionne.filieres);
      } else {
        console.log("Aucune filière trouvée pour cet établissement");
        setFilieresDisponibles([]);
      }
    } else {
      setFilieresDisponibles([]);
    }
  }, [formData.etablissement, etablissements]);
  
  // Effet pour mettre à jour les niveaux lorsque la filière change
useEffect(() => {
    console.log("Mise à jour des niveaux pour la filière:", formData.filiere_souhaitee);
    
    if (formData.filiere_souhaitee && filieresDisponibles.length > 0) {
        // Trouver la filière sélectionnée dans la liste
        const filiereSelectionnee = filieresDisponibles.find(
            filiere => filiere.nom === formData.filiere_souhaitee
        );
        
        if (filiereSelectionnee && filiereSelectionnee.niveau) {
            console.log("Niveaux trouvés pour la filière:", filiereSelectionnee.niveau);
            
            // Traiter les niveaux en fonction de leur format
            let niveaux = [];
            
            if (Array.isArray(filiereSelectionnee.niveau)) {
                // Format: ["BTS", "CAP"]
                niveaux = [...filiereSelectionnee.niveau]; // Copie directe du tableau
            } else if (typeof filiereSelectionnee.niveau === 'object' && filiereSelectionnee.niveau.type) {
                // Format: { "type": "licence", "from": 1, "to": 3 }
                const type = filiereSelectionnee.niveau.type;
                const from = parseInt(filiereSelectionnee.niveau.from);
                const to = parseInt(filiereSelectionnee.niveau.to);
                
                for (let i = from; i <= to; i++) {
                    niveaux.push(`${type.charAt(0).toUpperCase() + type.slice(1)} ${i}`);
                }
            }
            
            console.log("Niveaux traités:", niveaux);
            setNiveauxDisponibles(niveaux);
            
            // Réinitialiser le niveau si l'actuel n'est pas dans la nouvelle liste
            if (formData.niveau_vise && !niveaux.includes(formData.niveau_vise)) {
                console.log("Réinitialisation du niveau car l'actuel n'est pas disponible");
                updateFormData({ niveau_vise: "" });
            }
        } else {
            console.log("Aucun niveau trouvé pour cette filière");
            setNiveauxDisponibles([]);
        }
    } else {
        setNiveauxDisponibles([]);
    }
}, [formData.filiere_souhaitee, filieresDisponibles, updateFormData, formData.niveau_vise]);
  // Validation de l'étape
  const validateStep = () => {
    const newErrors = {};
    
    if (!formData.type_bourse) newErrors.type_bourse = "Type de bourse requis";
    if (!formData.etablissement) newErrors.etablissement = "Établissement demandé requis";
    if (!formData.filiere_souhaitee) newErrors.filiere_souhaitee = "Filière souhaitée requise";
    if (niveauxDisponibles.length > 0 && !formData.niveau_vise) {
      newErrors.niveau_vise = "Niveau d'études requis";
    }
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
    console.log("Tentative de passage à l'étape suivante");
    console.log("Formulaire actuel:", {
      type_bourse: formData.type_bourse,
      etablissement: formData.etablissement,
      filiere_souhaitee: formData.filiere_souhaitee,
      niveau_vise: formData.niveau_vise,
      pays_souhaite: formData.pays_souhaite
    });
    
    if (validateStep()) {
      console.log("Validation réussie, passage à l'étape suivante");
      onNext();
    } else {
      console.log("Échec de la validation", errors);
    }
  };
  
  return (
    <div className="space-y-6 animate-fadeIn">
      <h3 className="mb-6 text-xl font-semibold text-green-700">3. Choix de la bourse</h3>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Type de bourse *</Label>
          <Select 
            value={formData.type_bourse || ""}
            onValueChange={value => {
              console.log("Changement du type de bourse:", value);
              updateFormData({ 
                type_bourse: value,
                etablissement: "", // Réinitialiser l'établissement
                filiere_souhaitee: "", // Réinitialiser la filière
                niveau_vise: "" // Réinitialiser le niveau
              });
            }}
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
          {errors.type_bourse && <p className="text-sm text-red-500 animate-pulse">{errors.type_bourse}</p>}
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
            {errors.pays_souhaite && <p className="text-sm text-red-500 animate-pulse">{errors.pays_souhaite}</p>}
          </div>
        )}
        
        <div className="space-y-2">
          <Label>Établissement demandé *</Label>
          <Select 
            value={formData.etablissement || ""}
            onValueChange={value => {
              console.log("Changement de l'établissement:", value);
              updateFormData({ 
                etablissement: value,
                filiere_souhaitee: "", // Réinitialiser la filière
                niveau_vise: "" // Réinitialiser le niveau
              });
            }}
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
          {errors.etablissement && <p className="text-sm text-red-500 animate-pulse">{errors.etablissement}</p>}
        </div>
        
        <div className="space-y-2">
          <Label>Filière souhaitée *</Label>
          {filieresDisponibles.length > 0 ? (
            <Select 
              value={formData.filiere_souhaitee || ""}
              onValueChange={value => {
                console.log("Changement de la filière:", value);
                updateFormData({ 
                  filiere_souhaitee: value,
                  niveau_vise: "" // Réinitialiser le niveau
                });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez la filière souhaitée" />
              </SelectTrigger>
              <SelectContent>
                {filieresDisponibles.map((filiere, idx) => (
                  <SelectItem key={idx} value={filiere.nom}>
                    {filiere.nom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input 
              type="text" 
              placeholder="Ex: Génie Civil, Informatique, Médecine, Droit..."
              value={formData.filiere_souhaitee || ""}
              onChange={e => updateFormData({ filiere_souhaitee: e.target.value })} 
            />
          )}
          <p className="text-xs text-gray-500">
            {filieresDisponibles.length > 0 
              ? "Sélectionnez une filière parmi celles proposées par l'établissement"
              : "Précisez la filière ou le domaine d'études souhaité"
            }
          </p>
          {errors.filiere_souhaitee && <p className="text-sm text-red-500 animate-pulse">{errors.filiere_souhaitee}</p>}
        </div>
        
        <div className="space-y-2">
          <Label>Niveau d'études visé {niveauxDisponibles.length > 0 && "*"}</Label>
          {niveauxDisponibles.length > 0 ? (
            <Select 
              value={formData.niveau_vise || ""}
              onValueChange={value => {
                console.log("Changement du niveau:", value);
                updateFormData({ niveau_vise: value });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez le niveau d'études visé" />
              </SelectTrigger>
              <SelectContent>
                {niveauxDisponibles.map((niveau, idx) => (
                  <SelectItem key={idx} value={niveau}>
                    {niveau}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
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
          )}
          {errors.niveau_vise && <p className="text-sm text-red-500 animate-pulse">{errors.niveau_vise}</p>}
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
          className="flex-1 py-3 font-semibold text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
        >
          Continuer → Paiement
        </Button>
      </div>
    </div>
  );
}