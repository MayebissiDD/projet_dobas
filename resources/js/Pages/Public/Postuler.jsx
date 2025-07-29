import React, { useState, useEffect } from "react";
import PublicLayout from "@/Layouts/PublicLayout";
import { usePage } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Upload, AlertCircle } from "lucide-react";
import { villesCongo, niveaux } from "@/utils/congoData";

export default function PostulerPage() {
  const { url } = usePage();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    nationalite: "Congolaise" // Pré-remplie
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bourses, setBourses] = useState([]);
  const [etablissements, setEtablissements] = useState([]);
  const [paiementSuccess, setpaiementSuccess] = useState(false);

  // Detecter succès paiement via query param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "1") {
      setpaiementSuccess(true);
    }
  }, []);

  // Charger données dynamiques
  useEffect(() => {
    fetch('/api/bourses')
      .then(res => res.json())
      .then(data => setBourses(data.bourses || []));
    fetch('/api/etablissements')
      .then(res => res.json())
      .then(data => setEtablissements(data.etablissements || []));
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
      setFormData({ ...savedData, nationalite: "Congolaise" }); // Forcer nationalité
    }
  }, []);

  // Validation par étape
  const validateStep = (stepNumber) => {
    const newErrors = {};
    
    switch(stepNumber) {
      case 1:
        if (!formData.nom) newErrors.nom = "Nom complet requis";
        if (!formData.date_naissance) newErrors.date_naissance = "Date de naissance requise";
        if (!formData.lieu_naissance) newErrors.lieu_naissance = "Lieu de naissance requis";
        if (!formData.telephone) newErrors.telephone = "Téléphone requis";
        if (!formData.email) newErrors.email = "Email requis";
        if (!formData.sexe) newErrors.sexe = "Sexe requis";
        if (!formData.adresse) newErrors.adresse = "Adresse actuelle requise";
        if (!formData.niveau_etude) newErrors.niveau_etude = "Niveau d'étude requis";
        if (!formData.moyenne && !formData.cas_social) newErrors.moyenne = "Moyenne requise ou cochez 'cas social'";
        if (!formData.photo_identite) newErrors.photo_identite = "Photo d'identité requise";
        break;
      
      case 2:
        if (!formData.casier_judiciaire) newErrors.casier_judiciaire = "Casier judiciaire requis";
        if (!formData.certificat_nationalite) newErrors.certificat_nationalite = "Certificat de nationalité requis";
        if (!formData.attestation_bac) newErrors.attestation_bac = "Attestation de réussite au BAC requise";
        if (!formData.certificat_medical) newErrors.certificat_medical = "Certificat médical requis";
        if (!formData.acte_naissance) newErrors.acte_naissance = "Acte de naissance requis";
        if (formData.type_bourse === "étrangère" && !formData.passeport) {
          newErrors.passeport = "Passeport requis pour bourse étrangère";
        }
        break;
      
      case 3:
        if (!formData.type_bourse) newErrors.type_bourse = "Type de bourse requis";
        if (!formData.etablissement) newErrors.etablissement = "Établissement demandé requis";
        if (formData.type_bourse === "étrangère" && !formData.pays_souhaite) {
          newErrors.pays_souhaite = "Pays souhaité requis pour bourse étrangère";
        }
        break;
      
      case 4:
        if (!formData.mode_paiement) newErrors.mode_paiement = "Mode de paiement requis";
        if (!formData.certification) newErrors.certification = "Vous devez certifier l'exactitude des informations";
        break;
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
    
    setFormData({ ...formData, [field]: file });
    setErrors({ ...errors, [field]: undefined });
  };

  // Navigation
  const handleNext = () => {
    if (!validateStep(step)) return;
    setStep(step + 1);
  };

  const handleBack = () => {
    setErrors({});
    setStep(step - 1);
  };

  // Soumission finale
  const handleFinalSubmit = async () => {
    if (!validateStep(4)) return;
    
    setIsSubmitting(true);
    setErrors({});

    try {
      const formDataToSend = new FormData();
      
      // Ajouter tous les champs
      Object.entries(formData).forEach(([key, value]) => {
        if (value instanceof File) {
          formDataToSend.append(key, value);
        } else {
          formDataToSend.append(key, value ?? "");
        }
      });

      // Envoi du dossier
      const response = await fetch("/api/dossiers/public", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();
      
      if (data.success) {
        // Redirection vers paiement ou confirmation
        if (formData.mode_paiement === "mobile_money" || formData.mode_paiement === "carte") {
          // Initier paiement en ligne
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
          // Paiement physique - rediriger vers page de confirmation
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

  // Filtrage établissements selon type de bourse
  const getEtablissementsFiltered = () => {
    if (!formData.type_bourse) return [];
    return etablissements.filter(etab => {
      if (formData.type_bourse === "locale") return etab.type === "local";
      if (formData.type_bourse === "étrangère") return etab.type === "etranger";
      return etab.type === "aide_scolaire";
    });
  };

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

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-red-50 py-12">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 text-white">
              <CardTitle className="text-2xl text-center font-bold">
                Formulaire de Candidature - DOBAS
              </CardTitle>
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
              <div className="relative">
                <Progress value={(step / 4) * 100} className="h-3 bg-white/20" />
                <div 
                  className="absolute top-0 left-0 h-3 bg-gradient-to-r from-white via-white/80 to-white/60 rounded-full transition-all duration-700 ease-out" 
                  style={{ width: `${(step / 4) * 100}%` }}
                ></div>
              </div>
            </CardHeader>

            <CardContent className="p-8">
              {/* Étape 1 : Identification du candidat */}
              {step === 1 && (
                <div className="space-y-6 animate-fadeIn">
                  <h3 className="text-xl font-semibold text-green-700 mb-6">1. Identification du candidat</h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Nom complet *</Label>
                      <Input 
                        type="text" 
                        placeholder="Ex: Jean MBEMBA"
                        value={formData.nom || ""}
                        onChange={e => setFormData({ ...formData, nom: e.target.value })} 
                      />
                      {errors.nom && <p className="text-red-500 text-sm animate-pulse">{errors.nom}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label>Date de naissance *</Label>
                      <Input 
                        type="date" 
                        value={formData.date_naissance || ""}
                        onChange={e => setFormData({ ...formData, date_naissance: e.target.value })} 
                      />
                      {errors.date_naissance && <p className="text-red-500 text-sm animate-pulse">{errors.date_naissance}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label>Lieu de naissance *</Label>
                      <Select onValueChange={value => setFormData({ ...formData, lieu_naissance: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez votre ville de naissance" />
                        </SelectTrigger>
                        <SelectContent>
                          {villesCongo.map((ville, idx) => (
                            <SelectItem key={idx} value={ville}>{ville}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.lieu_naissance && <p className="text-red-500 text-sm animate-pulse">{errors.lieu_naissance}</p>}
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
                        onChange={e => setFormData({ ...formData, telephone: e.target.value })} 
                      />
                      {errors.telephone && <p className="text-red-500 text-sm animate-pulse">{errors.telephone}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label>Email *</Label>
                      <Input 
                        type="email" 
                        placeholder="Ex: jean.mbemba@email.com"
                        value={formData.email || ""}
                        onChange={e => setFormData({ ...formData, email: e.target.value })} 
                      />
                      {errors.email && <p className="text-red-500 text-sm animate-pulse">{errors.email}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label>Sexe *</Label>
                      <Select onValueChange={value => setFormData({ ...formData, sexe: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez votre sexe" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Masculin">Masculin</SelectItem>
                          <SelectItem value="Féminin">Féminin</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.sexe && <p className="text-red-500 text-sm animate-pulse">{errors.sexe}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label>Adresse actuelle *</Label>
                      <Input 
                        type="text" 
                        placeholder="Ex: Quartier Mpila, Rue 123, Brazzaville"
                        value={formData.adresse || ""}
                        onChange={e => setFormData({ ...formData, adresse: e.target.value })} 
                      />
                      {errors.adresse && <p className="text-red-500 text-sm animate-pulse">{errors.adresse}</p>}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Niveau d'étude *</Label>
                      <Select onValueChange={value => setFormData({ ...formData, niveau_etude: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez votre niveau" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Bac Technique">Bac Technique</SelectItem>
                          <SelectItem value="BET">BET (Brevet d'Études Techniques)</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.niveau_etude && <p className="text-red-500 text-sm animate-pulse">{errors.niveau_etude}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label>Moyenne obtenue</Label>
                      <Input 
                        type="number" 
                        step="0.01"
                        placeholder="Ex: 12.50"
                        value={formData.moyenne || ""}
                        onChange={e => setFormData({ ...formData, moyenne: e.target.value, cas_social: false })} 
                        disabled={formData.cas_social}
                      />
                      <div className="flex items-center space-x-2 mt-2">
                        <input 
                          type="checkbox" 
                          id="cas_social"
                          checked={formData.cas_social || false}
                          onChange={e => setFormData({ 
                            ...formData, 
                            cas_social: e.target.checked,
                            moyenne: e.target.checked ? "" : formData.moyenne
                          })} 
                        />
                        <Label htmlFor="cas_social" className="text-sm">Cas social (pas de moyenne)</Label>
                      </div>
                      {errors.moyenne && <p className="text-red-500 text-sm animate-pulse">{errors.moyenne}</p>}
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
                    {errors.photo_identite && <p className="text-red-500 text-sm animate-pulse">{errors.photo_identite}</p>}
                  </div>

                  <Button 
                    onClick={handleNext} 
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 mt-6"
                  >
                    Continuer → Pièces justificatives
                  </Button>
                </div>
              )}

              {/* Étape 2 : Pièces justificatives */}
              {step === 2 && (
                <div className="space-y-6 animate-fadeIn">
                  <h3 className="text-xl font-semibold text-green-700 mb-6">2. Pièces justificatives</h3>
                  <div className="bg-blue-50 p-4 rounded-lg mb-6">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-5 w-5 text-blue-600" />
                      <p className="text-blue-800 text-sm">
                        Toutes les pièces doivent dater de moins de 3 mois (sauf acte de naissance)
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Casier judiciaire *</Label>
                      <Input 
                        type="file" 
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={e => handleFileUpload('casier_judiciaire', e.target.files[0])}
                      />
                      <p className="text-xs text-gray-500">PDF ou image, moins de 3 mois</p>
                      {errors.casier_judiciaire && <p className="text-red-500 text-sm animate-pulse">{errors.casier_judiciaire}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label>Certificat de nationalité *</Label>
                      <Input 
                        type="file" 
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={e => handleFileUpload('certificat_nationalite', e.target.files[0])}
                      />
                      <p className="text-xs text-gray-500">PDF ou image, moins de 3 mois</p>
                      {errors.certificat_nationalite && <p className="text-red-500 text-sm animate-pulse">{errors.certificat_nationalite}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label>Attestation de réussite au BAC *</Label>
                      <Input 
                        type="file" 
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={e => handleFileUpload('attestation_bac', e.target.files[0])}
                      />
                      <p className="text-xs text-gray-500">PDF ou image de votre attestation de réussite</p>
                      {errors.attestation_bac && <p className="text-red-500 text-sm animate-pulse">{errors.attestation_bac}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label>Certificat médical *</Label>
                      <Input 
                        type="file" 
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={e => handleFileUpload('certificat_medical', e.target.files[0])}
                      />
                      <p className="text-xs text-gray-500">Délivré par un médecin du METP, moins de 3 mois</p>
                      {errors.certificat_medical && <p className="text-red-500 text-sm animate-pulse">{errors.certificat_medical}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label>Acte de naissance *</Label>
                      <Input 
                        type="file" 
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={e => handleFileUpload('acte_naissance', e.target.files[0])}
                      />
                      <p className="text-xs text-gray-500">Photocopie couleur de votre acte de naissance</p>
                      {errors.acte_naissance && <p className="text-red-500 text-sm animate-pulse">{errors.acte_naissance}</p>}
                    </div>

                    {formData.type_bourse === "étrangère" && (
                      <div className="space-y-2">
                        <Label>Passeport valide *</Label>
                        <Input 
                          type="file" 
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={e => handleFileUpload('passeport', e.target.files[0])}
                        />
                        <p className="text-xs text-gray-500">Passeport en cours de validité (requis pour bourse étrangère)</p>
                        {errors.passeport && <p className="text-red-500 text-sm animate-pulse">{errors.passeport}</p>}
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-4">
                    <Button onClick={handleBack} variant="outline" className="flex-1">
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
              )}

              {/* Étape 3 : Choix de la bourse */}
              {step === 3 && (
                <div className="space-y-6 animate-fadeIn">
                  <h3 className="text-xl font-semibold text-green-700 mb-6">3. Choix de la bourse</h3>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Type de bourse *</Label>
                      <Select onValueChange={value => setFormData({ ...formData, type_bourse: value })}>
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
                        <Select onValueChange={value => setFormData({ ...formData, pays_souhaite: value })}>
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
                            <SelectItem value="Autre">Autre</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.pays_souhaite && <p className="text-red-500 text-sm animate-pulse">{errors.pays_souhaite}</p>}
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label>Établissement demandé *</Label>
                      <Select onValueChange={value => setFormData({ ...formData, etablissement: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez l'établissement souhaité" />
                        </SelectTrigger>
                        <SelectContent>
                          {getEtablissementsFiltered().map((etab, idx) => (
                            <SelectItem key={idx} value={etab.nom}>
                              {etab.nom} - {etab.localisation}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.etablissement && <p className="text-red-500 text-sm animate-pulse">{errors.etablissement}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label>Filière souhaitée</Label>
                      <Input 
                        type="text" 
                        placeholder="Ex: Génie Civil, Informatique, Médecine..."
                        value={formData.filiere_souhaitee || ""}
                        onChange={e => setFormData({ ...formData, filiere_souhaitee: e.target.value })} 
                      />
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <Button onClick={handleBack} variant="outline" className="flex-1">
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
              )}

              {/* Étape 4 : Paiement */}
              {step === 4 && (
                <div className="space-y-6 animate-fadeIn">
                  <h3 className="text-xl font-semibold text-green-700 mb-6">4. Paiement des frais de dossier</h3>
                  
                  <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                    <h4 className="text-lg font-bold text-yellow-800 mb-2">Montant à régler</h4>
                    <p className="text-2xl font-bold text-yellow-900">7 500 FCFA</p>
                    <p className="text-sm text-yellow-700 mt-2">Frais de traitement du dossier de candidature</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Mode de paiement *</Label>
                      <Select onValueChange={value => setFormData({ ...formData, mode_paiement: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choisissez votre mode de paiement" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mobile_money">Mobile Money (MTN/Orange)</SelectItem>
                          <SelectItem value="carte">Carte bancaire</SelectItem>
                          <SelectItem value="depot_physique">Dépôt physique (Banque/Guichet)</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.mode_paiement && <p className="text-red-500 text-sm animate-pulse">{errors.mode_paiement}</p>}
                    </div>

                    {formData.mode_paiement === "depot_physique" && (
                      <div className="space-y-2">
                        <Label>Preuve de paiement *</Label>
                        <Input 
                          type="file" 
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={e => handleFileUpload('preuve_paiement', e.target.files[0])}
                        />
                        <p className="text-xs text-gray-500">Reçu de versement ou bordereau de dépôt</p>
                        {errors.preuve_paiement && <p className="text-red-500 text-sm animate-pulse">{errors.preuve_paiement}</p>}
                      </div>
                    )}
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <input 
                        type="checkbox" 
                        id="certification"
                        checked={formData.certification || false}
                        onChange={e => setFormData({ ...formData, certification: e.target.checked })}
                        className="mt-1"
                      />
                      <Label htmlFor="certification" className="text-sm cursor-pointer">
                        Je certifie sur l'honneur que toutes les informations fournies dans ce formulaire sont exactes et complètes. 
                        Je comprends que toute déclaration fausse ou omission pourra entraîner le rejet de ma candidature.
                      </Label>
                    </div>
                    {errors.certification && <p className="text-red-500 text-sm animate-pulse mt-2">{errors.certification}</p>}
                  </div>

                  {errors.form && (
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                      <p className="text-red-700 text-sm">{errors.form}</p>
                    </div>
                  )}

                  <div className="flex space-x-4">
                    <Button onClick={handleBack} variant="outline" className="flex-1">
                      ← Retour
                    </Button>
                    <Button 
                      onClick={handleFinalSubmit}
                      disabled={isSubmitting || !formData.certification}
                      className="flex-1 bg-gradient-to-r from-yellow-400 to-green-600 hover:from-yellow-500 hover:to-green-700 text-white font-semibold py-3"
                    >
                      {isSubmitting ? "Traitement en cours..." : 
                       formData.mode_paiement === "depot_physique" ? "Soumettre la candidature" : 
                       "Procéder au paiement"}
                    </Button>
                  </div>

                  <div className="text-center text-sm text-gray-600 mt-4">
                    {formData.mode_paiement === "mobile_money" && (
                      <p>Vous serez redirigé vers votre plateforme de paiement mobile</p>
                    )}
                    {formData.mode_paiement === "carte" && (
                      <p>Paiement sécurisé par carte bancaire</p>
                    )}
                    {formData.mode_paiement === "depot_physique" && (
                      <p>Votre dossier sera traité après vérification du paiement</p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PublicLayout>
  );
}