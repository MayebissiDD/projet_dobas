import PublicLayout from "@/Layouts/PublicLayout";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, User, FileText, School, CreditCard, GraduationCap, Award, Clock, Users } from "lucide-react";

export default function PostulerPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [animateStats, setAnimateStats] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Animation des statistiques au chargement
  useEffect(() => {
    const timer = setTimeout(() => setAnimateStats(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const validateStep = (data, currentStep) => {
    const newErrors = {};
    
    if (currentStep === 1) {
      if (!data.fullName) newErrors.fullName = "Nom complet requis";
      if (!data.email) newErrors.email = "Email requis";
      if (!data.telephone) newErrors.telephone = "Téléphone requis";
      if (!data.type_bourse) newErrors.type_bourse = "Type de bourse requis";
    }
    
    if (currentStep === 2) {
      if (!data.bac) newErrors.bac = "Copie du Bac requise";
      if (!data.releve) newErrors.releve = "Relevé de notes requis";
      if (!data.nationalite) newErrors.nationalite = "Certificat de nationalité requis";
      if (!data.identite) newErrors.identite = "Pièce d'identité requise";
      if (!data.motivation) newErrors.motivation = "Lettre de motivation requise";
    }
    
    if (currentStep === 3) {
      if (!data.filiere) newErrors.filiere = "Filière requise";
      if (!data.niveau) newErrors.niveau = "Niveau d'études requis";
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

  const onSubmit = async (paymentMethod) => {
    setIsSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");
    try {
      if (paymentMethod === "Mobile Money") {
        // Construction du formData pour l'API Lygos
        const data = new FormData();
        data.append('fullName', formData.fullName);
        data.append('email', formData.email);
        data.append('telephone', formData.telephone);
        data.append('type_bourse', formData.type_bourse);
        data.append('montant', 5000); // Montant fixe pour la démo
        // Ajout des fichiers si besoin
        if (formData.bac) data.append('bac', formData.bac);
        if (formData.releve) data.append('releve', formData.releve);
        if (formData.nationalite) data.append('nationalite', formData.nationalite);
        if (formData.identite) data.append('identite', formData.identite);
        if (formData.motivation) data.append('motivation', formData.motivation);
        if (formData.filiere) data.append('filiere', formData.filiere);
        if (formData.niveau) data.append('niveau', formData.niveau);

        const response = await fetch('/paiement/public', {
          method: 'POST',
          body: data,
        });
        const result = await response.json();
        if (result.link) {
          window.location.href = result.link;
          return;
        } else if (result.success) {
          setSuccessMessage('✅ Paiement validé via Lygos !');
          setStep(1);
          setFormData({});
        } else {
          setErrorMessage('❌ Le paiement a échoué. Veuillez réessayer.');
        }
      } else {
        // Simulation pour Stripe ou autre méthode
        await new Promise(resolve => setTimeout(resolve, 2000));
        setSuccessMessage(`✅ Candidature envoyée avec succès via ${paymentMethod}!`);
        setStep(1);
        setFormData({});
      }
    } catch (error) {
      setErrorMessage("❌ Échec de l'envoi. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { icon: <User className="h-5 w-5" />, label: "Identification", color: "bg-red-500" },
    { icon: <FileText className="h-5 w-5" />, label: "Documents", color: "bg-yellow-500" },
    { icon: <School className="h-5 w-5" />, label: "Formation", color: "bg-green-500" },
    { icon: <CreditCard className="h-5 w-5" />, label: "Paiement", color: "bg-red-600" },
  ];

  const stats = [
    { icon: <Users className="h-8 w-8" />, number: 2500, label: "Bénéficiaires", suffix: "+" },
    { icon: <Award className="h-8 w-8" />, number: 95, label: "Taux de réussite", suffix: "%" },
    { icon: <GraduationCap className="h-8 w-8" />, number: 150, label: "Formations", suffix: "+" },
    { icon: <Clock className="h-8 w-8" />, number: 48, label: "Traitement", suffix: "h" },
  ];

  const AnimatedNumber = ({ end, suffix = "", duration = 2000 }) => {
    const [count, setCount] = useState(0);
    
    useEffect(() => {
      if (!animateStats) return;
      
      let startTime;
      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        setCount(Math.floor(progress * end));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    }, [end, duration, animateStats]);
    
    return <span>{count}{suffix}</span>;
  };

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-red-50 relative overflow-hidden">
        {/* Arrière-plan animé */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div>
          <div className="absolute top-40 left-1/2 w-80 h-80 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-4000"></div>
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-8">
          <div className="w-full max-w-6xl">
            {/* En-tête avec logo et statistiques */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full mb-4 animate-bounce">
                <GraduationCap className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-yellow-600 to-red-600 bg-clip-text text-transparent mb-2">
                DOBAS CONGO
              </h1>
              <p className="text-lg text-gray-600 mb-6">Direction d'Orientation des Bourses et Aides Scolaires</p>
              
              {/* Statistiques animées */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <div className="flex items-center justify-center mb-2">
                      <div className={`p-2 rounded-full ${index % 3 === 0 ? 'bg-green-100 text-green-600' : index % 3 === 1 ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'}`}>
                        {stat.icon}
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-800">
                      <AnimatedNumber end={stat.number} suffix={stat.suffix} />
                    </div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 text-white">
                <CardTitle className="text-2xl text-center font-bold">
                  Formulaire de Candidature - Bourse Post-Bac
                </CardTitle>
                
                {/* Indicateur de progression animé */}
                <div className="flex justify-between items-center mt-6 mb-4">
                  {steps.map((item, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div className={`
                        flex items-center justify-center w-12 h-12 rounded-full transition-all duration-500 transform
                        ${step > index + 1 
                          ? 'bg-white text-green-600 scale-110' 
                          : step === index + 1 
                          ? `${item.color} text-white scale-125 animate-pulse` 
                          : 'bg-white/30 text-white/60'
                        }
                      `}>
                        {step > index + 1 ? <CheckCircle className="h-6 w-6" /> : item.icon}
                      </div>
                      <span className={`text-xs mt-2 font-medium transition-colors duration-300 ${step >= index + 1 ? 'text-white' : 'text-white/60'}`}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="relative">
                  <Progress value={(step / 4) * 100} className="h-3 bg-white/20" />
                  <div className="absolute top-0 left-0 h-3 bg-gradient-to-r from-white via-white/80 to-white/60 rounded-full transition-all duration-700 ease-out" 
                       style={{ width: `${(step / 4) * 100}%` }}></div>
                </div>
              </CardHeader>

              <CardContent className="p-8">
                {step === 1 && (
                  <div className="space-y-6 animate-fadeIn">
                    <h3 className="text-xl font-semibold text-green-700 mb-4">Informations Personnelles</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-green-700 font-medium">Nom complet *</Label>
                        <Input 
                          placeholder="Ex: Jean Dupont" 
                          className="border-green-200 focus:border-green-500 transition-colors duration-300"
                          onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                        />
                        {errors.fullName && <p className="text-red-500 text-sm animate-pulse">{errors.fullName}</p>}
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-green-700 font-medium">Email *</Label>
                        <Input 
                          type="email" 
                          placeholder="email@exemple.com"
                          className="border-green-200 focus:border-green-500 transition-colors duration-300"
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                        {errors.email && <p className="text-red-500 text-sm animate-pulse">{errors.email}</p>}
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-green-700 font-medium">Téléphone *</Label>
                        <Input 
                          placeholder="+242 06 000 0000"
                          className="border-green-200 focus:border-green-500 transition-colors duration-300"
                          onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                        />
                        {errors.telephone && <p className="text-red-500 text-sm animate-pulse">{errors.telephone}</p>}
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-green-700 font-medium">Type de bourse *</Label>
                        <Select onValueChange={(value) => setFormData({...formData, type_bourse: value})}>
                          <SelectTrigger className="border-green-200 focus:border-green-500">
                            <SelectValue placeholder="Choisir un type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="locale">🇨🇬 Bourse locale</SelectItem>
                            <SelectItem value="etrangere">🌍 Bourse étrangère</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.type_bourse && <p className="text-red-500 text-sm animate-pulse">{errors.type_bourse}</p>}
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => handleNext(formData)}
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 transition-all duration-300 transform hover:scale-105"
                    >
                      Continuer →
                    </Button>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6 animate-fadeIn">
                    <h3 className="text-xl font-semibold text-yellow-700 mb-4">Documents Requis</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-yellow-700 font-medium">Copie du Bac (PDF) *</Label>
                        <Input 
                          type="file" 
                          accept="application/pdf"
                          className="border-yellow-200 focus:border-yellow-500 transition-colors duration-300"
                          onChange={(e) => setFormData({...formData, bac: e.target.files[0]})}
                        />
                        {errors.bac && <p className="text-red-500 text-sm animate-pulse">{errors.bac}</p>}
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-yellow-700 font-medium">Relevé de notes *</Label>
                        <Input 
                          type="file" 
                          accept="application/pdf"
                          className="border-yellow-200 focus:border-yellow-500 transition-colors duration-300"
                          onChange={(e) => setFormData({...formData, releve: e.target.files[0]})}
                        />
                        {errors.releve && <p className="text-red-500 text-sm animate-pulse">{errors.releve}</p>}
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-yellow-700 font-medium">Certificat de nationalité *</Label>
                        <Input 
                          type="file" 
                          accept="application/pdf"
                          className="border-yellow-200 focus:border-yellow-500 transition-colors duration-300"
                          onChange={(e) => setFormData({...formData, nationalite: e.target.files[0]})}
                        />
                        {errors.nationalite && <p className="text-red-500 text-sm animate-pulse">{errors.nationalite}</p>}
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-yellow-700 font-medium">Pièce d'identité *</Label>
                        <Input 
                          type="file" 
                          accept="application/pdf"
                          className="border-yellow-200 focus:border-yellow-500 transition-colors duration-300"
                          onChange={(e) => setFormData({...formData, identite: e.target.files[0]})}
                        />
                        {errors.identite && <p className="text-red-500 text-sm animate-pulse">{errors.identite}</p>}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-yellow-700 font-medium">Lettre de motivation *</Label>
                      <Textarea 
                        placeholder="Expliquez vos motivations et vos objectifs académiques..."
                        className="border-yellow-200 focus:border-yellow-500 transition-colors duration-300 min-h-32"
                        onChange={(e) => setFormData({...formData, motivation: e.target.value})}
                      />
                      {errors.motivation && <p className="text-red-500 text-sm animate-pulse">{errors.motivation}</p>}
                    </div>
                    
                    <div className="flex justify-between">
                      <Button onClick={handleBack} variant="outline" className="border-yellow-500 text-yellow-700 hover:bg-yellow-50">
                        ← Retour
                      </Button>
                      <Button 
                        onClick={() => handleNext(formData)}
                        className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold transition-all duration-300 transform hover:scale-105"
                      >
                        Continuer →
                      </Button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6 animate-fadeIn">
                    <h3 className="text-xl font-semibold text-green-700 mb-4">Choix de Formation</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-green-700 font-medium">Filière / Formation visée *</Label>
                        <Input 
                          placeholder="Ex: Informatique de gestion"
                          className="border-green-200 focus:border-green-500 transition-colors duration-300"
                          onChange={(e) => setFormData({...formData, filiere: e.target.value})}
                        />
                        {errors.filiere && <p className="text-red-500 text-sm animate-pulse">{errors.filiere}</p>}
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-green-700 font-medium">Niveau d'études souhaité *</Label>
                        <Select onValueChange={(value) => setFormData({...formData, niveau: value})}>
                          <SelectTrigger className="border-green-200 focus:border-green-500">
                            <SelectValue placeholder="Sélectionner le niveau" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="L1">🎓 Licence 1</SelectItem>
                            <SelectItem value="L2">📚 Licence 2</SelectItem>
                            <SelectItem value="L3">📖 Licence 3</SelectItem>
                            <SelectItem value="M1">🎯 Master 1</SelectItem>
                            <SelectItem value="M2">🏆 Master 2</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.niveau && <p className="text-red-500 text-sm animate-pulse">{errors.niveau}</p>}
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <Button onClick={handleBack} variant="outline" className="border-green-500 text-green-700 hover:bg-green-50">
                        ← Retour
                      </Button>
                      <Button 
                        onClick={() => handleNext(formData)}
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold transition-all duration-300 transform hover:scale-105"
                      >
                        Continuer →
                      </Button>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-8 animate-fadeIn">
                    <div className="text-center">
                      <h3 className="text-2xl font-semibold text-red-700 mb-2">Finalisation de votre candidature</h3>
                      <p className="text-gray-600">Choisissez votre mode de paiement pour valider votre dossier</p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-red-50 via-yellow-50 to-green-50 p-6 rounded-xl border border-red-200">
                      <h4 className="font-semibold text-gray-800 mb-2">💰 Frais de candidature: 5,000 FCFA</h4>
                      <p className="text-sm text-gray-600">Ce montant couvre les frais de traitement de votre dossier</p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <Button 
                        onClick={() => onSubmit("Mobile Money")}
                        disabled={isSubmitting}
                        className="h-20 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                      >
                        {isSubmitting ? "Traitement..." : "📱 Payer avec MTN MoMo"}
                      </Button>
                      
                      <Button 
                        onClick={() => onSubmit("Carte bancaire Stripe")}
                        disabled={isSubmitting}
                        className="h-20 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                      >
                        {isSubmitting ? "Traitement..." : "💳 Payer par carte"}
                      </Button>
                    </div>
                    
                    <Button onClick={handleBack} variant="ghost" className="w-full text-gray-600 hover:text-gray-800">
                      ← Retour aux informations
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Message d'encouragement */}
            <div className="text-center mt-8 p-4 bg-white/80 backdrop-blur-sm rounded-xl">
              <p className="text-gray-600">🎓 <strong>Votre avenir commence ici!</strong> Nous sommes là pour vous accompagner dans vos projets d'études.</p>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}