import PublicLayout from "@/Layouts/PublicLayout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { UserPlus, FileText, CreditCard, Eye } from "lucide-react";
import { Link } from "@inertiajs/react";

import imgBourse from "@/assets/images/imgBourse6.jpg"

export default function Postuler() {
  const steps = [
    {
      icon: <UserPlus className="w-10 h-10 text-green-700 dark:text-yellow-400" />,
      title: "Créer un compte",
      desc: "Inscrivez-vous avec une adresse email valide pour accéder à l’espace étudiant."
    },
    {
      icon: <FileText className="w-10 h-10 text-green-700 dark:text-yellow-400" />,
      title: "Remplir le formulaire",
      desc: "Saisissez vos informations personnelles et académiques, puis importez vos pièces justificatives."
    },
    {
      icon: <CreditCard className="w-10 h-10 text-green-700 dark:text-yellow-400" />,
      title: "Payer les frais",
      desc: "Un paiement unique via MTN, Airtel ou carte valide votre candidature."
    },
    {
      icon: <Eye className="w-10 h-10 text-green-700 dark:text-yellow-400" />,
      title: "Suivre votre dossier",
      desc: "Accédez à votre espace personnel pour suivre l’avancement et recevoir les notifications."
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
      {/* Hero section */}
      <section className="relative h-[70vh] flex items-center justify-center bg-fixed bg-center bg-cover" style={{ backgroundImage: `url(${imgBourse})`}}>
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 text-center px-4 space-y-6">
          <motion.h1
            className="text-4xl md:text-5xl font-bold text-white"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Postuler à une Bourse
          </motion.h1>
          <p className="text-white text-lg max-w-xl mx-auto">
            Suivez les étapes simples ci-dessous pour démarrer votre candidature et accéder aux bourses proposées par la DOBAS.
          </p>
        </div>
      </section>

      <div className="py-20 px-4 md:px-20 space-y-24">
        {/* Étapes visuelles */}
        <motion.section
          className="max-w-6xl mx-auto grid md:grid-cols-4 gap-6"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          {steps.map((step, i) => (
            <div key={i} className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition flex flex-col items-center text-center">
              {step.icon}
              <h3 className="text-xl font-bold mt-4 mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </motion.section>

        {/* CTA final */}
        <motion.section
          className="max-w-4xl mx-auto text-center space-y-6"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-semibold">Vous êtes prêt ?</h2>
          <p className="text-lg">Créez un compte ou connectez-vous pour commencer dès maintenant votre candidature.</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link href="/register">
              <Button className="bg-green-700 hover:bg-green-800 hover:scale-105 transition-transform duration-200 text-white">Créer un compte</Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" className="hover:scale-105 transition-transform duration-200">Se connecter</Button>
            </Link>
          </div>
        </motion.section>
      </div>
    </div>
  );
}

Postuler.layout = page => <PublicLayout>{page}</PublicLayout>;
