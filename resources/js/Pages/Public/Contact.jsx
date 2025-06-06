import PublicLayout from "@/Layouts/PublicLayout"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export default function Contact() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white py-20 px-4 md:px-20">
      <motion.div
        className="max-w-6xl mx-auto space-y-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* En-tête */}
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Contactez la DOBAS</h1>
          <p className="text-lg max-w-2xl mx-auto">
            Pour toute information, assistance ou question liée à votre candidature, notre équipe est à votre écoute. Merci de remplir le formulaire ci-dessous ou de nous joindre directement via les coordonnées officielles.
          </p>
        </div>

        {/* Bloc principal */}
        <div className="grid md:grid-cols-2 gap-12">
          {/* Formulaire de contact */}
          <form className="space-y-6 bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md">
            <div>
              <label htmlFor="name" className="block mb-1 font-medium">Nom complet</label>
              <Input id="name" placeholder="Jean Koussou" required />
            </div>

            <div>
              <label htmlFor="email" className="block mb-1 font-medium">Adresse email</label>
              <Input id="email" type="email" placeholder="exemple@dobas.cg" required />
            </div>

            <div>
              <label htmlFor="subject" className="block mb-1 font-medium">Objet</label>
              <Input id="subject" placeholder="Demande d'information sur les bourses" />
            </div>

            <div>
              <label htmlFor="message" className="block mb-1 font-medium">Message</label>
              <Textarea id="message" rows={6} placeholder="Votre message ici..." required />
            </div>

            <Button type="submit" className="bg-green-700 hover:bg-green-800 text-white w-full">
              Envoyer le message
            </Button>
          </form>

          {/* Coordonnées et carte */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Coordonnées officielles</h2>
              <p className="mb-2">
                <strong>Email :</strong>{" "}
                <a href="mailto:contact@dobas.cg" className="underline">contact@dobas.cg</a>
              </p>
              <p className="mb-2">
                <strong>Téléphone :</strong> +242 06 123 4567
              </p>
              <p>
                <strong>Adresse :</strong> Ministère de l'Enseignement Supérieur,<br />
                Brazzaville, République du Congo
              </p>
            </div>

            <div className="rounded-lg overflow-hidden shadow-md border">
              <iframe
                title="Carte de localisation"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3977.0170472679645!2d15.248475074135747!3d-4.279266046247044!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1a6a3393657e1cb1%3A0xdf6b60366a6ab876!2sCongo%20Brazzaville!5e0!3m2!1sfr!2scg!4v1680543005583!5m2!1sfr!2scg"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen=""
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

Contact.layout = page => <PublicLayout>{page}</PublicLayout>
