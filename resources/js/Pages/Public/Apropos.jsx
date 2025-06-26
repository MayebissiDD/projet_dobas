import PublicLayout from "@/Layouts/PublicLayout"
import { motion } from "framer-motion"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useRef } from "react"

import dg from "@/assets/images/dg.jpg"
import bourse from "@/assets/images/bs-1.jpg"
import logo1 from "@/assets/images/logoPartenaire/escat.png"
import logo2 from "@/assets/images/logoPartenaire/esgae.png"
import logo3 from "@/assets/images/logoPartenaire/ihem-isti.jpg"
import logo4 from "@/assets/images/logoPartenaire/ead.png"
import logo5 from "@/assets/images/logoPartenaire/eces.png"
import logo6 from "@/assets/images/logoPartenaire/2i.jpg"
import logo7 from "@/assets/images/logoPartenaire/escat.png"
import logo8 from "@/assets/images/logoPartenaire/escat.png"

const partenaires = [logo1, logo2, logo3, logo4, logo5, logo6, logo7, logo8]

export default function Apropos() {
  const ctaRef = useRef(null)
  return (
    <PublicLayout>
      <div className="min-h-screen py-16 px-4 md:px-20 text-zinc-800 dark:text-white bg-white dark:bg-zinc-900 space-y-24">
        {/* Mot du Directeur */}
        <motion.section
          className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10 items-start"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          aria-labelledby="mot-directeur"
        >
          <img
            src={dg}
            alt="Portrait du Directeur Général de la DOBAS"
            className="rounded-2xl w-60 h-auto shadow-xl border-4 border-yellow-400 object-cover"
          />
          <div className="flex-1 space-y-4">
            <h2 id="mot-directeur" className="text-4xl font-extrabold mb-3 text-green-700 dark:text-yellow-400">Mot du Directeur Général</h2>
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
          ref={ctaRef}
          className="bg-gradient-to-r from-green-700 to-green-800 text-white rounded-2xl p-8 md:p-12 shadow-xl max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          aria-label="Appel à l'action"
        >
          <div className="flex-1 space-y-4 text-center md:text-left">
            <h2 className="text-4xl font-bold leading-snug">Investir dans l’éducation,<br className="hidden md:block" /> c’est investir dans la nation</h2>
            <p className="text-lg opacity-90">
              Découvrez nos bourses et laissez-nous vous accompagner vers l’excellence académique.
            </p>
            <Button className="bg-yellow-400 hover:bg-yellow-500 text-black text-base px-6 py-3 rounded-xl shadow-lg transition-transform focus:ring-2 focus:ring-yellow-300" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
              Découvrir les bourses <ArrowRight className="inline w-5 h-5 ml-2" />
            </Button>
          </div>
          <motion.img
            src={bourse}
            alt="Bourse DOBAS"
            className="rounded-2xl w-64 h-44 object-cover shadow-lg border-4 border-white"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
          />
        </motion.section>

        {/* Partenaires */}
        <motion.section
          className="max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          viewport={{ once: true }}
          aria-label="Partenaires"
        >
          <h2 className="text-3xl font-bold mb-8 text-center text-green-700 dark:text-yellow-400">Nos partenaires</h2>
          <div className="flex flex-wrap justify-center gap-8">
            {partenaires.map((logo, idx) => (
              <motion.img
                key={idx}
                src={logo}
                alt={`Logo partenaire ${idx + 1}`}
                className="h-20 w-auto rounded-xl shadow-md bg-white p-2 dark:bg-zinc-800 hover:scale-105 transition-transform"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                viewport={{ once: true }}
              />
            ))}
          </div>
        </motion.section>

        {/* FAQ */}
        <motion.section
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          viewport={{ once: true }}
          aria-label="FAQ"
        >
          <h2 className="text-3xl font-bold mb-8 text-center text-green-700 dark:text-yellow-400">Questions fréquentes</h2>
          <Accordion type="single" collapsible className="rounded-xl bg-white dark:bg-zinc-800 shadow-md">
            <AccordionItem value="q1">
              <AccordionTrigger>Comment postuler à une bourse ?</AccordionTrigger>
              <AccordionContent>
                Rendez-vous sur la page <span className="font-semibold text-green-700 dark:text-yellow-400">Bourses</span>, choisissez une bourse et cliquez sur "Postuler". Suivez les étapes indiquées.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>Quels sont les critères d’éligibilité ?</AccordionTrigger>
              <AccordionContent>
                Les critères varient selon la bourse : niveau d’études, filière, établissement, etc. Consultez le détail de chaque bourse.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>Puis-je suivre l’état de ma candidature ?</AccordionTrigger>
              <AccordionContent>
                Oui, connectez-vous à votre espace étudiant pour suivre l’avancement de votre dossier et recevoir des notifications.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </motion.section>
      </div>
    </PublicLayout>
  )
}

Apropos.layout = page => <PublicLayout>{page}</PublicLayout>
