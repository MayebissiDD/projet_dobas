import React, { useState } from "react";
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
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, User, FileText, School, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import PublicLayout from "@/Layouts/PublicLayout";

export default function PostulerPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({});

  const handleNext = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep(step + 1);
  };

  const handleBack = () => setStep(step - 1);

  const onSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/postuler", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Erreur serveur");
      toast.success("Candidature envoyée avec succès !");
      reset();
      setStep(1);
      setFormData({});
    } catch (error) {
      toast.error("Échec de l'envoi. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { icon: <User className="h-5 w-5 mr-1" />, label: "Identification" },
    { icon: <FileText className="h-5 w-5 mr-1" />, label: "Pièces" },
    { icon: <School className="h-5 w-5 mr-1" />, label: "Formation" },
    { icon: <CreditCard className="h-5 w-5 mr-1" />, label: "Paiement" },
  ];

  return (
    <PublicLayout>
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="w-full max-w-4xl">
          <Card className="shadow-2xl border-2 border-[#00853E]">
            <CardHeader>
              <CardTitle className="text-2xl mb-4 text-[#00853E] text-center">
                Formulaire de candidature - Bourse post-bac
              </CardTitle>
              <div className="flex justify-between items-center mb-4">
                {steps.map((item, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex items-center gap-1 px-2 py-1 rounded-full transition-all",
                      step > index + 1 && "bg-green-100 text-green-600",
                      step === index + 1 && "bg-yellow-200 text-yellow-800"
                    )}
                  >
                    {step > index + 1 ? <CheckCircle className="h-5 w-5" /> : item.icon}
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
              <Progress value={(step / 4) * 100} className="mb-2 bg-gray-200" />
            </CardHeader>

            <CardContent>
              {step === 1 && (
                <form onSubmit={handleSubmit(handleNext)} className="space-y-4">
                  <div>
                    <Label>Nom complet</Label>
                    <Input placeholder="John Doe" {...register("fullName", { required: true })} />
                    {errors.fullName && <p className="text-red-500 text-sm">Champ requis</p>}
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input type="email" placeholder="email@example.com" {...register("email", { required: true })} />
                    {errors.email && <p className="text-red-500 text-sm">Champ requis</p>}
                  </div>
                  <div>
                    <Label>Téléphone</Label>
                    <Input placeholder="+242 06 000 0000" {...register("telephone", { required: true })} />
                    {errors.telephone && <p className="text-red-500 text-sm">Champ requis</p>}
                  </div>
                  <div>
                    <Label>Type de bourse</Label>
                    <Select {...register("type_bourse", { required: true })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir un type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="locale">Bourse locale</SelectItem>
                        <SelectItem value="etrangere">Bourse étrangère</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.type_bourse && <p className="text-red-500 text-sm">Champ requis</p>}
                  </div>
                  <Button type="submit" className="w-full bg-[#D72638] text-white hover:bg-red-600">
                    Continuer
                  </Button>
                </form>
              )}

              {step === 2 && (
                <form onSubmit={handleSubmit(handleNext)} className="space-y-4">
                  <div>
                    <Label>Copie du Bac (PDF)</Label>
                    <Input type="file" accept="application/pdf" {...register("bac", { required: true })} />
                    {errors.bac && <p className="text-red-500 text-sm">Fichier requis</p>}
                  </div>
                  <div>
                    <Label>Relevé de notes</Label>
                    <Input type="file" accept="application/pdf" {...register("releve", { required: true })} />
                    {errors.releve && <p className="text-red-500 text-sm">Fichier requis</p>}
                  </div>
                  <div>
                    <Label>Certificat de nationalité</Label>
                    <Input type="file" accept="application/pdf" {...register("nationalite", { required: true })} />
                    {errors.nationalite && <p className="text-red-500 text-sm">Fichier requis</p>}
                  </div>
                  <div>
                    <Label>Pièce d'identité</Label>
                    <Input type="file" accept="application/pdf" {...register("identite", { required: true })} />
                    {errors.identite && <p className="text-red-500 text-sm">Fichier requis</p>}
                  </div>
                  <div>
                    <Label>Lettre de motivation</Label>
                    <Textarea {...register("motivation", { required: true })} />
                    {errors.motivation && <p className="text-red-500 text-sm">Champ requis</p>}
                  </div>
                  <div className="flex justify-between">
                    <Button type="button" onClick={handleBack}>Retour</Button>
                    <Button type="submit">Continuer</Button>
                  </div>
                </form>
              )}

              {step === 3 && (
                <form onSubmit={handleSubmit(handleNext)} className="space-y-4">
                  <div>
                    <Label>Filière / Formation visée</Label>
                    <Input placeholder="Ex : Informatique de gestion" {...register("filiere", { required: true })} />
                    {errors.filiere && <p className="text-red-500 text-sm">Champ requis</p>}
                  </div>
                  <div>
                    <Label>Niveau d'études souhaité</Label>
                    <Select {...register("niveau")}> 
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner le niveau" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="L1">Licence 1</SelectItem>
                        <SelectItem value="L2">Licence 2</SelectItem>
                        <SelectItem value="L3">Licence 3</SelectItem>
                        <SelectItem value="M1">Master 1</SelectItem>
                        <SelectItem value="M2">Master 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-between">
                    <Button type="button" onClick={handleBack}>Retour</Button>
                    <Button type="submit">Continuer</Button>
                  </div>
                </form>
              )}

              {step === 4 && (
                <div className="space-y-6">
                  <p className="text-lg font-medium text-center">Paiement de la candidature</p>
                  <div className="flex gap-4">
                    <Button className="w-full bg-[#FFD700] text-black hover:bg-yellow-400" disabled={isSubmitting} onClick={onSubmit}>
                      Payer avec MTN MoMo
                    </Button>
                    <Button className="w-full bg-[#00853E] text-white hover:bg-green-700" variant="outline" disabled={isSubmitting} onClick={onSubmit}>
                      Payer avec carte (Stripe)
                    </Button>
                  </div>
                  <Button variant="ghost" onClick={handleBack}>Retour</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PublicLayout>
  );
}
