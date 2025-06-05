// Page d'accueil DOBAS - React + ShadCN + Tailwind + Framer Motion

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { motion } from "framer-motion"
import { useEffect } from "react"
import PublicLayout from "@/Layouts/PublicLayout"

import hero6 from "@/assets/images/hero6.jpg"
import hero2 from "@/assets/images/hero2.jpg"
import hero5 from "@/assets/images/hero5.jpg"
import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css'

export default function Home() {
  useEffect(() => {
    document.title = "DOBAS | Accueil"
  }, [])

  return (
    <div className="min-h-screen w-full bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
      {/* Hero Section */}
      <section className="relative h-[90vh]">
        <Carousel
          autoPlay
          infiniteLoop
          showThumbs={false}
          showStatus={false}
          interval={5000}
          transitionTime={1000}
          className="h-full"
        >
          {[hero6, hero2, hero5].map((img, idx) => (
            <div key={idx} className="relative h-[90vh]">
              <img
                src={`${img}`}
                alt={`Image ${idx + 1}`}
                className="h-full w-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-center space-y-6 z-10">
                <motion.h1
                  initial={{ opacity: 0, y: -30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1 }}
                  className="text-4xl md:text-6xl font-bold text-white"
                >
                  BOURSE DU CONGO BRAZZAVILLE
                </motion.h1>
                
                <p className="text-white max-w-2xl mx-auto">
                  Ce portail donne accès aux informations relatives aux aides et subventions accordées.
                </p>
                <Button className="bg-green-600 hover:bg-green-700 text-white text-lg">Apprenez plus</Button>
              </div>
            </div>
          ))}
        </Carousel>
      </section>

      {/* Présentation DOBAS */}
      <section className="py-20 px-6 md:px-20 bg-gray-50 dark:bg-zinc-800">
        <div className="max-w-5xl mx-auto text-center space-y-10">
          <h2 className="text-3xl font-bold text-zinc-800 dark:text-white">Présentation de la DOBAS</h2>
          <p className="text-zinc-600 dark:text-zinc-300 max-w-3xl mx-auto">
            La direction de l'orientation, des bourses et aides scolaires (DOBAS) a pour rôle de centraliser les offres de bourses, préparer les arrêtés d'attribution, et accompagner les élèves et étudiants.
          </p>
          <div className="grid md:grid-cols-2 gap-8 text-left">
            <Card className="shadow-lg hover:shadow-xl transition duration-300">
              <CardContent className="p-6 flex items-start space-x-4">
                <div className="bg-green-100 text-green-600 p-3 rounded-full">
                  📚
                </div>
                <div>
                  <h3 className="font-semibold text-xl text-zinc-800 dark:text-white">Service des bourses</h3>
                  <p className="text-zinc-600 dark:text-zinc-300">Gestion des demandes de bourses et aides scolaires.</p>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-lg hover:shadow-xl transition duration-300">
              <CardContent className="p-6 flex items-start space-x-4">
                <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
                  🎓
                </div>
                <div>
                  <h3 className="font-semibold text-xl text-zinc-800 dark:text-white">Service d'orientation</h3>
                  <p className="text-zinc-600 dark:text-zinc-300">Accueil, information et conseil pour les orientations post-bac.</p>
                </div>
              </CardContent>
            </Card>
          </div>
          <Button variant="default" className="bg-green-600 hover:bg-green-700 text-white mt-6">Plus de détails</Button>
        </div>
      </section>

      {/* Témoignages */}
      <section className="bg-white dark:bg-zinc-900 py-20 px-6 md:px-20">
        <div className="max-w-6xl mx-auto text-center space-y-10">
          <h2 className="text-3xl font-bold text-zinc-800 dark:text-white">Témoignages</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Williamson", quote: "Je suis bénéficiaire de la bourse locale destinée aux étudiants sortants des lycées techniques et commerciaux du Congo depuis 2020." },
              { name: "Kristina", quote: "Grâce à la DOBAS, j’ai pu poursuivre mes études à l’étranger avec un accompagnement personnalisé." },
              { name: "Willia", quote: "Un service transparent et humain. J’ai reçu mon aide dans les délais." }
            ].map((t, idx) => (
              <Card key={idx} className="bg-zinc-50 dark:bg-zinc-800 shadow-md hover:shadow-xl transition">
                <CardContent className="p-6 space-y-4 text-left">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center text-white font-bold">{t.name[0]}</div>
                    <div>
                      <h4 className="font-bold text-zinc-800 dark:text-white">{t.name}</h4>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">Étudiant(e)</p>
                    </div>
                  </div>
                  <p className="italic text-zinc-700 dark:text-zinc-300">“{t.quote}”</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-6 md:px-20 bg-gray-50 dark:bg-zinc-900">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-start">
    
         {/* Formulaire de contact */}
          <div>
            <h2 className="text-3xl font-bold text-zinc-800 dark:text-white mb-6">Nous contacter</h2>
            <p className="text-zinc-600 dark:text-zinc-300 mb-8">
              Une question ? Un besoin ? N’hésitez pas à nous écrire, nous vous répondrons dans les plus brefs délais.
            </p>
            <form className="space-y-6">
              <div>
                <label className="block mb-1 font-medium text-sm text-zinc-700 dark:text-zinc-200">Nom complet</label>
                <Input placeholder="Votre nom" className="bg-white dark:bg-zinc-800 shadow-sm" />
              </div>
              <div>
                <label className="block mb-1 font-medium text-sm text-zinc-700 dark:text-zinc-200">Email</label>
                <Input placeholder="Votre email" type="email" className="bg-white dark:bg-zinc-800 shadow-sm" />
              </div>
              <div>
                <label className="block mb-1 font-medium text-sm text-zinc-700 dark:text-zinc-200">Objet</label>
                <Input placeholder="Objet du message" className="bg-white dark:bg-zinc-800 shadow-sm" />
              </div>
              <div>
                <label className="block mb-1 font-medium text-sm text-zinc-700 dark:text-zinc-200">Message</label>
                <Textarea placeholder="Votre message..." className="bg-white dark:bg-zinc-800 shadow-sm" rows={5} />
              </div>
              <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white w-full md:w-auto">Envoyer</Button>
            </form>
          </div>

          {/* Carte Google Maps */}
          <div className="w-full h-full">
            <div className="rounded-lg overflow-hidden shadow-md border dark:border-zinc-700">
              <iframe
                title="Carte de localisation"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4147.668987779745!2d15.251339450709024!3d-4.276438555097069!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1a6a32f0b4e8c1b7%3A0xba5b45f1701d3902!2sCEFA%20M%C3%A9tiers%20du%20B%C3%A2timent%2C%20du%20froid%20et%20de%20la%20climatisation!5e0!3m2!1sfr!2scg!4v1749118299111!5m2!1sfr!2scg" 
                 loading="lazy" referrerpolicy="no-referrer-when-downgrade"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen=""
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
     </section>
    </div>
  )
}

Home.layout = page => <PublicLayout>{page}</PublicLayout>

