// ========================================
// 2. COMPOSANT ÉTAPE 1 - EtapeIdentification.jsx
// ========================================
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { villesCongo } from "@/utils/congoData";

export default function EtapeIdentification({
  formData,
  updateFormData,
  errors,
  setErrors,
  onNext
}) {
  // Validation de l'étape
  const validateStep = () => {
    const newErrors = {};
    if (!formData.nom) newErrors.nom = "Nom requis";
    if (!formData.prenom) newErrors.prenom = "Prénom requis";
    // Validation date_naissance : requise et < aujourd'hui
    if (!formData.date_naissance) {
      newErrors.date_naissance = "Date de naissance requise";
    } else {
      const today = new Date();
      const inputDate = new Date(formData.date_naissance);
      // On ignore l'heure pour la comparaison
      today.setHours(0,0,0,0);
      inputDate.setHours(0,0,0,0);
      if (isNaN(inputDate.getTime())) {
        newErrors.date_naissance = "Date de naissance invalide";
      } else if (inputDate >= today) {
        newErrors.date_naissance = "La date de naissance doit être antérieure à aujourd'hui.";
      }
    }
    if (!formData.lieu_naissance) newErrors.lieu_naissance = "Lieu de naissance requis";
    if (!formData.telephone) newErrors.telephone = "Téléphone requis";
    if (!formData.email) newErrors.email = "Email requis";
    if (!formData.sexe) newErrors.sexe = "Sexe requis";
    if (!formData.adresse) newErrors.adresse = "Adresse actuelle requise";
    if (!formData.niveau_etude) newErrors.niveau_etude = "Niveau d'étude requis";
    if (!formData.moyenne && !formData.cas_social) newErrors.moyenne = "Moyenne requise ou cochez 'cas social'";
    if (!formData.photo_identite) newErrors.photo_identite = "Photo d'identité requise";
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
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      setErrors({ ...errors, [field]: "Format non supporté (JPG, PNG uniquement)" });
      return;
    }
    updateFormData({ [field]: file });
    setErrors({ ...errors, [field]: undefined });
  };
  
  const handleNext = () => {
    if (validateStep()) {
      onNext();
    }
  };
  
  return (
    <div className="space-y-6 animate-fadeIn">
      <h3 className="mb-6 text-xl font-semibold text-green-700">1. Identification du candidat</h3>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Nom *</Label>
          <Input
            type="text"
            placeholder="Ex: MBEMBA"
            value={formData.nom || ""}
            onChange={e => updateFormData({ nom: e.target.value })}
          />
          {errors.nom && <p className="text-sm text-red-500 animate-pulse">{errors.nom}</p>}
        </div>
        <div className="space-y-2">
          <Label>Prénom *</Label>
          <Input
            type="text"
            placeholder="Ex: Jean"
            value={formData.prenom || ""}
            onChange={e => updateFormData({ prenom: e.target.value })}
          />
          {errors.prenom && <p className="text-sm text-red-500 animate-pulse">{errors.prenom}</p>}
        </div>
        <div className="space-y-2">
          <Label>Date de naissance *</Label>
          <Input
            type="date"
            value={formData.date_naissance || ""}
            max={new Date().toISOString().split('T')[0]}
            onChange={e => updateFormData({ date_naissance: e.target.value })}
          />
          {errors.date_naissance && <p className="text-sm text-red-500 animate-pulse">{errors.date_naissance}</p>}
        </div>
        <div className="space-y-2">
          <Label>Lieu de naissance *</Label>
          <Select onValueChange={value => updateFormData({ lieu_naissance: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez votre ville de naissance" />
            </SelectTrigger>
            <SelectContent>
              {villesCongo.map((ville, idx) => (
                <SelectItem key={idx} value={ville}>{ville}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.lieu_naissance && <p className="text-sm text-red-500 animate-pulse">{errors.lieu_naissance}</p>}
        </div>
        <div className="space-y-2">
          <Label>Nationalité</Label>
          <Input value="Congolaise" disabled className="bg-gray-100" />
        </div>
        <div className="space-y-2">
          <Label>Téléphone *</Label>
          <Input
            type="tel"
            placeholder="Ex: +242 06 123 45 67"
            value={formData.telephone || ""}
            onChange={e => updateFormData({ telephone: e.target.value })}
          />
          {errors.telephone && <p className="text-sm text-red-500 animate-pulse">{errors.telephone}</p>}
        </div>
        <div className="space-y-2">
          <Label>Email *</Label>
          <Input
            type="email"
            placeholder="Ex: jean.mbemba@email.com"
            value={formData.email || ""}
            onChange={e => updateFormData({ email: e.target.value })}
          />
          {errors.email && <p className="text-sm text-red-500 animate-pulse">{errors.email}</p>}
        </div>
        <div className="space-y-2">
          <Label>Sexe *</Label>
          <Select onValueChange={value => updateFormData({ sexe: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez votre sexe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Masculin">Masculin</SelectItem>
              <SelectItem value="Féminin">Féminin</SelectItem>
            </SelectContent>
          </Select>
          {errors.sexe && <p className="text-sm text-red-500 animate-pulse">{errors.sexe}</p>}
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Adresse actuelle *</Label>
          <Input
            type="text"
            placeholder="Ex: Quartier Mpila, Rue 123, Brazzaville"
            value={formData.adresse || ""}
            onChange={e => updateFormData({ adresse: e.target.value })}
          />
          {errors.adresse && <p className="text-sm text-red-500 animate-pulse">{errors.adresse}</p>}
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Niveau d'étude *</Label>
          <Select onValueChange={value => updateFormData({ niveau_etude: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez votre niveau" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Bac Technique">Bac Technique</SelectItem>
              <SelectItem value="BET">BET (Brevet d'Études Techniques)</SelectItem>
            </SelectContent>
          </Select>
          {errors.niveau_etude && <p className="text-sm text-red-500 animate-pulse">{errors.niveau_etude}</p>}
        </div>
        <div className="space-y-2">
          <Label>Moyenne obtenue</Label>
          <Input
            type="number"
            step="0.01"
            placeholder="Ex: 12.50"
            value={formData.moyenne || ""}
            onChange={e => updateFormData({ moyenne: e.target.value, cas_social: false })}
            disabled={formData.cas_social}
          />
          <div className="flex items-center mt-2 space-x-2">
            <input
              type="checkbox"
              id="cas_social"
              checked={formData.cas_social || false}
              onChange={e => updateFormData({
                cas_social: e.target.checked,
                moyenne: e.target.checked ? "" : formData.moyenne
              })}
            />
            <Label htmlFor="cas_social" className="text-sm">Cas social (pas de moyenne)</Label>
          </div>
          {errors.moyenne && <p className="text-sm text-red-500 animate-pulse">{errors.moyenne}</p>}
        </div>
      </div>
      <div className="space-y-2">
        <Label>Photo d'identité *</Label>
        <Input
          type="file"
          accept=".jpg,.jpeg,.png"
          onChange={e => handleFileUpload('photo_identite', e.target.files[0])}
        />
        <p className="text-xs text-gray-500">Photo récente, format JPG/PNG, max 5Mo</p>
        {errors.photo_identite && <p className="text-sm text-red-500 animate-pulse">{errors.photo_identite}</p>}
      </div>
      <Button
        onClick={handleNext}
        className="w-full py-3 mt-6 font-semibold text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
      >
        Continuer → Pièces justificatives
      </Button>
    </div>
  );
}