import PublicLayout from "@/Layouts/PublicLayout";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, User, FileText, School, CreditCard } from "lucide-react";
import { usePage } from "@inertiajs/react";

export default function PostulerPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bourse, setBourse] = useState(null);

  // Récupérer l'ID de la bourse depuis l'URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const bourseId = params.get("bourse");
    if (bourseId) {
      fetch(`/api/bourses/${bourseId}`)
        .then(res => res.json())
        .then(data => setBourse(data.bourse));
    }
  }, []);

  // Validation simple pour la structure (à compléter avec la logique dynamique ensuite)
  const validateStep = (data, currentStep) => {
    const newErrors = {};
    if (currentStep === 1) {
      if (!data.nom) newErrors.nom = "Nom requis";
      if (!data.prenom) newErrors.prenom = "Prénom requis";
      if (!data.date_naissance) newErrors.date_naissance = "Date de naissance requise";
      if (!data.lieu_naissance) newErrors.lieu_naissance = "Lieu de naissance requis";
      if (!data.adresse) newErrors.adresse = "Adresse requise";
      if (!data.telephone) newErrors.telephone = "Téléphone requis";
      if (!data.email) newErrors.email = "Email requis";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (data) => {
    if (validateStep(data, step)) {
      setFormData((prev) => ({ ...prev, ...data }));
      setStep(step + 1);
    }
  };

  const handleBack = () => setStep(step - 1);

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-red-50 py-12">
        <div className="max-w-3xl mx-auto">
          <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 text-white">
              <CardTitle className="text-2xl text-center font-bold">
                Formulaire de Candidature {bourse ? `- ${bourse.nom}` : "- Bourse Post-Bac"}
              </CardTitle>
              <div className="flex justify-between items-center mt-6 mb-4">
                {["Infos", "Diplômes", "Choix", "Pièces", "Paiement"].map((label, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step > idx + 1 ? 'bg-white text-green-600' : step === idx + 1 ? 'bg-green-600 text-white scale-110 animate-pulse' : 'bg-white/30 text-white/60'}`}>
                      {step > idx + 1 ? <CheckCircle className="h-5 w-5" /> : idx + 1}
                    </div>
                    <span className={`text-xs mt-2 font-medium ${step >= idx + 1 ? 'text-white' : 'text-white/60'}`}>{label}</span>
                  </div>
                ))}
              </div>
              <div className="relative">
                <Progress value={(step / 5) * 100} className="h-2 bg-white/20" />
                <div className="absolute top-0 left-0 h-2 bg-gradient-to-r from-white via-white/80 to-white/60 rounded-full transition-all duration-700 ease-out" style={{ width: `${(step / 5) * 100}%` }}></div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              {step === 1 && (
                <div className="space-y-6 animate-fadeIn">
                  <h3 className="text-xl font-semibold text-green-700 mb-4">Informations personnelles</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Nom *</Label>
                      <Input placeholder="Ex: NGOMA" onChange={e => setFormData({ ...formData, nom: e.target.value })} />
                      {errors.nom && <p className="text-red-500 text-sm animate-pulse">{errors.nom}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label>Prénom *</Label>
                      <Input placeholder="Ex: Jean-Paul" onChange={e => setFormData({ ...formData, prenom: e.target.value })} />
                      {errors.prenom && <p className="text-red-500 text-sm animate-pulse">{errors.prenom}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label>Date de naissance *</Label>
                      <Input type="date" onChange={e => setFormData({ ...formData, date_naissance: e.target.value })} />
                      {errors.date_naissance && <p className="text-red-500 text-sm animate-pulse">{errors.date_naissance}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label>Lieu de naissance *</Label>
                      <Input placeholder="Ex: Brazzaville" onChange={e => setFormData({ ...formData, lieu_naissance: e.target.value })} />
                      {errors.lieu_naissance && <p className="text-red-500 text-sm animate-pulse">{errors.lieu_naissance}</p>}
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Adresse actuelle *</Label>
                      <Input placeholder="Ex: 12 avenue de l'Université, Brazzaville" onChange={e => setFormData({ ...formData, adresse: e.target.value })} />
                      {errors.adresse && <p className="text-red-500 text-sm animate-pulse">{errors.adresse}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label>Téléphone *</Label>
                      <Input placeholder="Ex: +242 06 123 45 67" onChange={e => setFormData({ ...formData, telephone: e.target.value })} />
                      {errors.telephone && <p className="text-red-500 text-sm animate-pulse">{errors.telephone}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label>Email *</Label>
                      <Input type="email" placeholder="exemple@dobas.cg" onChange={e => setFormData({ ...formData, email: e.target.value })} />
                      {errors.email && <p className="text-red-500 text-sm animate-pulse">{errors.email}</p>}
                    </div>
                  </div>
                  <Button onClick={() => handleNext(formData)} className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 transition-all duration-300 transform hover:scale-105 mt-6">
                    Continuer →
                  </Button>
                </div>
              )}
              {step === 2 && bourse && (
                <div className="space-y-6 animate-fadeIn">
                  <h3 className="text-xl font-semibold text-green-700 mb-4">Diplôme le plus élevé obtenu</h3>
                  <div className="space-y-2">
                    <Label>Diplôme *</Label>
                    <Select onValueChange={value => setFormData({ ...formData, diplome: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un diplôme" />
                      </SelectTrigger>
                      <SelectContent>
                        {bourse.diplomes_eligibles?.map((d, idx) => (
                          <SelectItem key={idx} value={d}>{d}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={() => handleNext(formData)} className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 transition-all duration-300 transform hover:scale-105 mt-6">
                    Continuer →
                  </Button>
                </div>
              )}
              {step === 3 && bourse && (
                <div className="space-y-6 animate-fadeIn">
                  <h3 className="text-xl font-semibold text-green-700 mb-4">Choix de l'école et de la filière</h3>
                  <div className="space-y-2">
                    <Label>École éligible *</Label>
                    <Select onValueChange={value => setFormData({ ...formData, ecole: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez une école" />
                      </SelectTrigger>
                      <SelectContent>
                        {bourse.ecoles_eligibles?.map((e, idx) => (
                          <SelectItem key={idx} value={e}>{e}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Filière éligible *</Label>
                    <Select onValueChange={value => setFormData({ ...formData, filiere: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez une filière" />
                      </SelectTrigger>
                      <SelectContent>
                        {bourse.filieres_eligibles?.map((f, idx) => (
                          <SelectItem key={idx} value={f}>{f}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={() => handleNext(formData)} className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 transition-all duration-300 transform hover:scale-105 mt-6">
                    Continuer →
                  </Button>
                </div>
              )}
              {step === 4 && bourse && (
                <div className="space-y-6 animate-fadeIn">
                  <h3 className="text-xl font-semibold text-green-700 mb-4">Pièces à fournir</h3>
                  <div className="space-y-4">
                    {bourse.pieces_a_fournir?.map((piece, idx) => (
                      <div key={idx} className="space-y-1">
                        <Label>{piece} *</Label>
                        <Input type="file" onChange={e => setFormData({ ...formData, [`piece_${idx}`]: e.target.files[0] })} />
                      </div>
                    ))}
                  </div>
                  <Button onClick={() => handleNext(formData)} className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 transition-all duration-300 transform hover:scale-105 mt-6">
                    Continuer →
                  </Button>
                </div>
              )}
              {step === 5 && bourse && (
                <div className="space-y-6 animate-fadeIn">
                  <h3 className="text-xl font-semibold text-green-700 mb-4">Paiement des frais de dossier</h3>
                  <div className="mb-4 text-lg font-bold text-green-700">Montant à régler : {bourse.frais_dossier ? bourse.frais_dossier + ' FCFA' : 'Inclus'}</div>
                  <div className="space-y-4">
                    <Label>Mode de paiement *</Label>
                    <Select onValueChange={value => setFormData({ ...formData, paiement_mode: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisissez un mode de paiement" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mobile_money">Mobile Money (MTN/Orange)</SelectItem>
                        <SelectItem value="stripe">Carte bancaire (Stripe)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    onClick={async () => {
                      setIsSubmitting(true);
                      setErrors({});
                      try {
                        const form = new FormData();
                        Object.entries(formData).forEach(([k, v]) => form.append(k, v));
                        form.append('bourse_id', bourse.id);
                        form.append('montant', bourse.frais_dossier || 0);
                        form.append('mode', formData.paiement_mode);
                        const res = await fetch('/paiement/public', { method: 'POST', body: form });
                        const data = await res.json();
                        if (data.success && data.link) {
                          window.location.href = data.link;
                        } else {
                          setErrors({ paiement: data.message || 'Erreur lors de la création du paiement.' });
                        }
                      } catch (e) {
                        setErrors({ paiement: 'Erreur réseau ou serveur.' });
                      } finally {
                        setIsSubmitting(false);
                      }
                    }}
                    className="w-full bg-gradient-to-r from-yellow-400 to-green-600 hover:from-yellow-500 hover:to-green-700 text-white font-semibold py-3 transition-all duration-300 transform hover:scale-105"
                    disabled={isSubmitting || !formData.paiement_mode}
                  >
                    {isSubmitting ? 'Redirection...' : 'Payer en ligne'}
                  </Button>
                  {errors.paiement && <div className="text-red-500 text-center mt-2 animate-pulse">{errors.paiement}</div>}
                  <div className="text-sm text-zinc-500 mt-2">Paiement en ligne sécurisé (Mobile Money, carte bancaire). Confirmation automatique après validation.</div>
                </div>
              )}
              {step > 5 && (
                <div className="text-center text-green-600 text-xl font-bold animate-fadeIn">
                  🎉 Votre candidature a bien été soumise et sera traitée après validation du paiement. Vous recevrez un email de confirmation.
                </div>
              )}
              {step > 1 && (
                <Button onClick={handleBack} variant="outline" className="mt-6">← Retour</Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PublicLayout>
  );
}