// Page d'accueil DOBAS - React + ShadCN + Tailwind + Framer Motion

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { motion } from "framer-motion"
import { useEffect } from "react"
import PublicLayout from "@/Layouts/PublicLayout"

export default function Home() {
  useEffect(() => {
    document.title = "DOBAS | Accueil"
  }, [])

  return (
    <div className="min-h-screen w-full bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center bg-fixed bg-center bg-cover" style={{ backgroundImage: 'url("https://cdn.pixabay.com/photo/2020/08/10/13/27/africa-5477216_1280.jpg")' }}>
        <div className="bg-black/60 w-full h-full absolute top-0 left-0 z-0" />
        <div className="z-10 text-center space-y-6 px-4">
          <motion.h1 initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="text-4xl md:text-6xl font-bold text-white">
            BOURSE DU CONGO BRAZZAVILLE
          </motion.h1>
          <p className="text-white max-w-2xl mx-auto">
            Ce portail donne accès aux informations relatives aux aides et subventions accordées.
          </p>
          <Button className="bg-green-600 hover:bg-green-700 text-white text-lg">Apprenez plus</Button>
        </div>
      </section>

      {/* Présentation DOBAS */}
      <section className="py-20 px-6 md:px-20 bg-white dark:bg-zinc-900">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <h2 className="text-3xl font-bold">Présentation de la DOBAS</h2>
          <p>
            La direction de l'orientation, des bourses et aides scolaires (DOBAS) a pour rôle de centraliser les offres de bourses, préparer les arrêtés d'attribution, et accompagner les élèves et étudiants.
          </p>
          <div className="grid md:grid-cols-2 gap-6 text-left">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-xl">Service des bourses</h3>
                <p>Gestion des demandes de bourses et aides scolaires.</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-xl">Service d'orientation</h3>
                <p>Accueil, information et conseil pour les orientations post-bac.</p>
              </CardContent>
            </Card>
          </div>
          <Button variant="outline">Plus de détails</Button>
        </div>
      </section>

      {/* Témoignages */}
      <section className="bg-gray-100 dark:bg-zinc-800 py-16 px-6 md:px-20">
        <div className="max-w-6xl mx-auto text-center space-y-10">
          <h2 className="text-3xl font-bold">Témoignages</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {["Williamson", "Kristina", "Willia"].map((name, idx) => (
              <Card key={idx}>
                <CardContent className="p-6 space-y-2">
                  <p className="italic">“Je suis bénéficiaire de la bourse locale destinée aux étudiants sortants des lycées techniques et commerciaux du Congo depuis 2020.”</p>
                  <h4 className="font-bold">{name}</h4>
                  <p className="text-sm text-muted-foreground">Étudiant</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-6 md:px-20 bg-white dark:bg-zinc-900">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-3xl font-bold mb-6">Nous contacter</h2>
            <form className="space-y-4">
              <Input placeholder="Votre nom" />
              <Input placeholder="Votre email" />
              <Input placeholder="Objet" />
              <Textarea placeholder="Votre message..." />
              <Button type="submit" className="bg-green-600 text-white">Envoyer</Button>
            </form>
          </div>
          <div>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3977.0170472679645!2d15.248475074135747!3d-4.279266046247044!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1a6a3393657e1cb1%3A0xdf6b60366a6ab876!2sCongo%20Brazzaville!5e0!3m2!1sfr!2scg!4v1680543005583!5m2!1sfr!2scg"
              width="100%"
              height="350"
              allowFullScreen=""
              loading="lazy"
              className="rounded-md shadow-md border"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>



    </div>
  )
}

Home.layout = page => <PublicLayout>{page}</PublicLayout>

