import React, { useState, useEffect } from "react";
import PublicLayout from "@/Layouts/PublicLayout";
import { usePage } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { CheckCircle } from "lucide-react";

export default function PostulerPage() {
  const { url } = usePage();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bourse, setBourse] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Detecter succès paiement via query param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "1") {
      setPaymentSuccess(true);
    }
  }, []);

  // Récupérer info bourse si id dans url
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const bourseId = params.get("bourse");
    if (bourseId) {
      fetch(`/api/bourses/${bourseId}`)
        .then(res => res.json())
        .then(data => setBourse(data.bourse))
        .catch(() => setBourse(null));
    }
  }, []);

  // Validation basique de la première étape
  const validateStep = (data) => {
    const newErrors = {};
    if (!data.nom) newErrors.nom = "Nom requis";
    if (!data.prenom) newErrors.prenom = "Prénom requis";
    if (!data.date_naissance) newErrors.date_naissance = "Date de naissance requise";
    if (!data.lieu_naissance) newErrors.lieu_naissance = "Lieu de naissance requis";
    if (!data.adresse) newErrors.adresse = "Adresse requise";
    if (!data.telephone) newErrors.telephone = "Téléphone requis";
    if (!data.email) newErrors.email = "Email requis";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Aller à l'étape suivante
  const handleNext = () => {
    if (step === 1 && !validateStep(formData)) return;
    setErrors({});
    setStep(step + 1);
  };

  // Retour à l'étape précédente
  const handleBack = () => {
    setErrors({});
    setStep(step - 1);
  };

  // Gestion finale : créer candidature + paiement + redirection
  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    setErrors({});

    try {
      // 1. Créer la candidature en statut 'en_attente'
      const formCandidature = new FormData();
      Object.entries(formData).forEach(([k, v]) => {
        if (v instanceof File) {
          formCandidature.append(k, v);
        } else {
          formCandidature.append(k, v ?? "");
        }
      });
      formCandidature.append("bourse_id", bourse?.id ?? "");
      formCandidature.append("statut", "en_attente");

      const resCandidature = await fetch("/postuler", {
        method: "POST",
        body: formCandidature,
      });
      const dataCandidature = await resCandidature.json();

      if (!dataCandidature.success) {
        setErrors(dataCandidature.errors || { form: "Erreur lors de la création de la candidature." });
        setIsSubmitting(false);
        return;
      }

      const candidatureId = dataCandidature.candidature.id;

      // 2. Créer la commande de paiement liée à la candidature
      const formPaiement = new FormData();
      formPaiement.append("candidature_id", candidatureId);
      formPaiement.append("montant", bourse?.frais_dossier ?? 0);
      formPaiement.append("mode", formData.paiement_mode);

      const resPaiement = await fetch("/paiement/public", {
        method: "POST",
        body: formPaiement,
      });
      const dataPaiement = await resPaiement.json();

      if (dataPaiement.success && dataPaiement.link) {
        // Redirection vers Lygos (ou Stripe)
        window.location.href = dataPaiement.link;
      } else {
        setErrors({ paiement: dataPaiement.message || "Erreur lors de la création du paiement." });
      }
    } catch (e) {
      setErrors({ paiement: "Erreur réseau ou serveur." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (paymentSuccess) {
    return (
      <PublicLayout>
        <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-green-50 via-yellow-50 to-red-50">
          <Card className="max-w-xl p-8 text-center bg-white/95 shadow-xl rounded-lg">
            <h2 className="text-3xl font-bold text-green-700 mb-4">🎉 Paiement réussi !</h2>
            <p className="mb-6">Votre candidature a bien été prise en compte et sera traitée rapidement.</p>
            <Button onClick={() => window.location.href = "/"}>Retour à l'accueil</Button>
          </Card>
        </div>
      </PublicLayout>
    );
  }

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
              {/* Étape 1 : Infos */}
              {step === 1 && (
                <div className="space-y-6 animate-fadeIn">
                  <h3 className="text-xl font-semibold text-green-700 mb-4">Informations personnelles</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {["nom", "prenom", "date_naissance", "lieu_naissance", "adresse", "telephone", "email"].map((field) => (
                      <div key={field} className="space-y-2">
                        <Label>{field.replace(/_/g, " ").toUpperCase()} *</Label>
                        <Input
                          type={field === "email" ? "email" : field === "date_naissance" ? "date" : "text"}
                          onChange={e => setFormData({ ...formData, [field]: e.target.value })}
                        />
                        {errors[field] && <p className="text-red-500 text-sm animate-pulse">{errors[field]}</p>}
                      </div>
                    ))}
                  </div>
                  <Button onClick={handleNext} className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 mt-6">Continuer →</Button>
                </div>
              )}

              {/* Étape 2 : Diplômes */}
              {step === 2 && (
                <div className="space-y-6 animate-fadeIn">
                  <h3 className="text-xl font-semibold text-green-700 mb-4">Diplôme le plus élevé obtenu</h3>

                  {/* Diplôme */}
                  <div className="space-y-2">
                    <Label>Intitulé du diplôme *</Label>
                    <Select onValueChange={value => setFormData({ ...formData, diplome: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un diplôme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CEP">Certificat d'Études Primaires (CEP)</SelectItem>
                        <SelectItem value="BEPC">Brevet d'Études du Premier Cycle (BEPC)</SelectItem>
                        <SelectItem value="BAC">Baccalauréat (BAC)</SelectItem>
                        <SelectItem value="Licence">Licence</SelectItem>
                        <SelectItem value="Master">Master</SelectItem>
                        <SelectItem value="Doctorat">Doctorat</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Année d'obtention */}
                  <div className="space-y-2">
                    <Label>Année d'obtention *</Label>
                    <Select onValueChange={value => setFormData({ ...formData, annee_diplome: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez une année" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 25 }, (_, i) => {
                          const year = new Date().getFullYear() - i;
                          return <SelectItem key={year} value={String(year)}>{year}</SelectItem>;
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Établissement */}
                  {/* Établissement */}
                  <div className="space-y-2">
                    <Label>Établissement d'obtention *</Label>
                    <Select
                      onValueChange={(value) => {
                        setFormData({ ...formData, etablissement_diplome: value, autre_etablissement: "" });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un établissement" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Lycée de la Révolution">Lycée de la Révolution</SelectItem>
                        <SelectItem value="Lycée Chaminade">Lycée Chaminade</SelectItem>
                        <SelectItem value="Université Marien Ngouabi">Université Marien Ngouabi</SelectItem>
                        <SelectItem value="Université Catholique d'Afrique Centrale">Université Catholique d'Afrique Centrale</SelectItem>
                        <SelectItem value="Autre">Autre</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* Champ libre si "Autre" est sélectionné */}
                    {formData.etablissement_diplome === "Autre" && (
                      <div className="mt-2">
                        <Label>Nom de l'établissement *</Label>
                        <Input
                          type="text"
                          placeholder="Entrez le nom de l'établissement"
                          value={formData.autre_etablissement || ""}
                          onChange={(e) =>
                            setFormData({ ...formData, autre_etablissement: e.target.value })
                          }
                        />
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={handleNext}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 mt-6"
                  >
                    Continuer →
                  </Button>
                </div>
              )}


              {/* Étape 3 : Choix école & filière */}
              {step === 3 && bourse && (
                <div className="space-y-6 animate-fadeIn">
                  <h3 className="text-xl font-semibold text-green-700 mb-4">Choix de l'école et de la filière</h3>
                  <div className="space-y-4">
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
                  <div className="space-y-4">
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
                  <Button onClick={handleNext} className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 mt-6">Continuer →</Button>
                </div>
              )}

              {/* Étape 4 : Pièces */}
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
                  <Button onClick={handleNext} className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 mt-6">Continuer →</Button>
                </div>
              )}

              {/* Étape 5 : Paiement */}
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
                  {errors.paiement && <div className="text-red-500 text-center mt-2 animate-pulse">{errors.paiement}</div>}
                  <Button
                    onClick={handleFinalSubmit}
                    disabled={isSubmitting || !formData.paiement_mode}
                    className="w-full bg-gradient-to-r from-yellow-400 to-green-600 hover:from-yellow-500 hover:to-green-700 text-white font-semibold py-3 mt-4"
                  >
                    {isSubmitting ? "Redirection..." : "Payer en ligne"}
                  </Button>
                  <div className="text-sm text-zinc-500 mt-2">
                    Paiement en ligne sécurisé (Mobile Money, carte bancaire). Confirmation automatique après validation.
                  </div>
                </div>
              )}

              {step > 1 && step <= 5 && (
                <Button onClick={handleBack} variant="outline" className="mt-6">← Retour</Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PublicLayout>
  );
}
