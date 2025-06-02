import PublicLayout from "@/Layouts/PublicLayout"
import { motion } from "framer-motion"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

import hero5 from "@/assets/images/hero6.jpg"

export default function Apropos() {
  return (
    <div className="min-h-screen py-16 px-4 md:px-20 text-zinc-800 dark:text-white bg-white dark:bg-zinc-900 space-y-24">
      
      {/* Mot du Directeur */}
      <motion.section
        className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10 items-start"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <img
          src={hero5}
          alt="Portrait du Directeur Général de la DOBAS"
          className="rounded-2xl w-60 h-auto shadow-xl border-4 border-green-700 object-cover"
        />
        <div className="flex-1 space-y-4">
          <h2 className="text-4xl font-extrabold mb-3 text-green-700 dark:text-yellow-400">Mot du Directeur Général</h2>
          <p className="leading-relaxed text-justify text-lg">
            Chers étudiants et partenaires,<br /><br />
            La Direction de l'Orientation, des Bourses et Aides Scolaires (DOBAS) œuvre chaque jour pour offrir aux jeunes congolais des opportunités concrètes de formation et d'accompagnement. Grâce à une stratégie inclusive et moderne, nous centralisons les bourses disponibles, soutenons les démarches administratives et accompagnons les candidats dans leur parcours post-baccalauréat.
            <br /><br />
            Ensemble, construisons l'avenir de notre nation à travers l'éducation.
            <br /><br />
            — Le Directeur Général de la DOBAS
          </p>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="bg-gradient-to-r from-green-700 to-green-800 text-white rounded-2xl p-8 md:p-12 shadow-xl max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="flex-1 space-y-4 text-center md:text-left">
          <h2 className="text-4xl font-bold leading-snug">Investir dans l’éducation,<br className="hidden md:block" /> c’est investir dans la nation</h2>
          <p className="text-lg opacity-90">
            Découvrez nos bourses et laissez-nous vous accompagner vers l’excellence académique.
          </p>
          <Button className="bg-yellow-400 hover:bg-yellow-500 text-black text-base px-6 py-3 rounded-xl">
            Voir les bourses <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <img
          src="https://via.placeholder.com/300x200?text=Éducation"
          alt="Illustration bourse"
          className="rounded-xl shadow-lg border"
        />
      </motion.section>

      {/* Missions stylisées */}
      <motion.section
        className="max-w-6xl mx-auto"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-bold mb-10 text-center text-green-700 dark:text-yellow-400">Nos Missions</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              title: "Centralisation",
              desc: "Regrouper toutes les bourses et aides disponibles au niveau national et international."
            },
            {
              title: "Accompagnement",
              desc: "Soutenir les démarches d’orientation post-bac des élèves et étudiants."
            },
            {
              title: "Équité",
              desc: "Garantir un traitement juste, transparent et mérité à tous les dossiers de candidature."
            },
            {
              title: "Partenariat",
              desc: "Collaborer avec des établissements reconnus pour offrir des parcours solides et adaptés."
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-zinc-100 dark:bg-zinc-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
              <h3 className="text-xl font-bold mb-2 text-green-700 dark:text-yellow-400">{item.title}</h3>
              <p className="text-base leading-relaxed text-zinc-700 dark:text-zinc-200">{item.desc}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Écoles partenaires */}
      <motion.section
        className="max-w-5xl mx-auto"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-green-700 dark:text-yellow-400">Nos Écoles Partenaires</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="bg-white dark:bg-zinc-800 border rounded-xl shadow-md p-4 text-center hover:scale-105 transition-transform">
              <img
                src={`https://via.placeholder.com/100x60?text=École+${i}`}
                alt={`École partenaire ${i}`}
                className="mx-auto mb-2"
              />
              <p className="text-sm font-medium">École {i}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* FAQ */}
      <motion.section
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-bold mb-8 text-center text-green-700 dark:text-yellow-400">Foire Aux Questions</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>Qui peut postuler à une bourse via la DOBAS ?</AccordionTrigger>
            <AccordionContent>
              Tout élève ou étudiant congolais remplissant les critères définis pour chaque bourse peut postuler en ligne.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Quelles pièces sont nécessaires ?</AccordionTrigger>
            <AccordionContent>
              Les pièces requises varient selon la bourse, mais incluent généralement : relevés de notes, pièce d'identité, lettre de motivation.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Comment suivre l'état de ma candidature ?</AccordionTrigger>
            <AccordionContent>
              Une fois connecté à votre espace candidat, vous verrez l’état en temps réel de votre dossier.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </motion.section>
    </div>
  )
}

Apropos.layout = page => <PublicLayout>{page}</PublicLayout>
