import React from "react";
import PublicLayout from "@/Layouts/PublicLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Download } from "lucide-react";

import { motion } from "framer-motion"
import { Download, School, Globe, FileText, BadgeCheck, IdCard, GraduationCap, ClipboardCheck, PiggyBank, Globe2, BarChart  } from "lucide-react"

export default function BoursePage() {
  return (
    <PublicLayout>
      <div className="max-w-5xl mx-auto p-6 space-y-12">
        {/* Hero Section */}
        <section className="text-center">
          <h1 className="text-4xl font-bold mb-2">Tout savoir sur les bourses disponibles</h1>
          <p className="text-lg text-gray-600">
            Découvrez les opportunités locales et internationales, leurs avantages et les conditions de candidature.
          </p>
        </section>

        {/* Types de bourses */}
          <section className="max-w-6xl mx-auto space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-6 text-center text-green-700 dark:text-yellow-400">
                Types de Bourses Disponibles
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="bg-white dark:bg-zinc-800 border shadow hover:shadow-md transition">
                  <CardHeader className="flex items-center gap-3">
                    <School className="text-green-700 dark:text-yellow-400 w-6 h-6" />
                    <CardTitle className="text-xl font-semibold text-green-700 dark:text-yellow-400">
                      Bourses Locales
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-base text-zinc-700 dark:text-zinc-200 leading-relaxed">
                      Offertes par des institutions nationales pour soutenir les étudiants méritants ou en situation de précarité.
                      Elles couvrent généralement les frais de scolarité et/ou de vie au niveau local.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white dark:bg-zinc-800 border shadow hover:shadow-md transition">
                  <CardHeader className="flex items-center gap-3">
                    <Globe className="text-green-700 dark:text-yellow-400 w-6 h-6" />
                    <CardTitle className="text-xl font-semibold text-green-700 dark:text-yellow-400">
                      Bourses Étrangères
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-base text-zinc-700 dark:text-zinc-200 leading-relaxed">
                      Financements proposés par des gouvernements ou universités à l’international.
                      Elles permettent aux étudiants congolais de poursuivre leurs études à l’étranger dans des établissements partenaires.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
 
        {/* Constitution du dossier */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-6 text-center text-green-700 dark:text-yellow-400">
            Constitution du Dossier de Candidature
          </h2>
          <div className="bg-white dark:bg-zinc-800 border p-6 rounded-xl shadow space-y-6">
            <p className="text-base text-zinc-700 dark:text-zinc-200 leading-relaxed">
              Pour postuler à une bourse via la DOBAS, vous devrez réunir les documents suivants :
            </p>
            <ul className="space-y-3 text-zinc-800 dark:text-zinc-100">
              <li className="flex items-center gap-2"><FileText className="w-5 h-5 text-green-600" /> Relevés de notes</li>
              <li className="flex items-center gap-2"><BadgeCheck className="w-5 h-5 text-green-600" /> Lettre de motivation</li>
              <li className="flex items-center gap-2"><IdCard className="w-5 h-5 text-green-600" /> Pièce d’identité valide</li>
              <li className="flex items-center gap-2"><GraduationCap className="w-5 h-5 text-green-600" /> Certificat de scolarité</li>
              <li className="flex items-center gap-2"><ClipboardCheck className="w-5 h-5 text-green-600" /> Formulaire de demande (ci-dessous)</li>
            </ul>
            <div className="pt-4">
              <Button className="bg-green-700 hover:bg-green-800 text-white">
                <Download className="mr-2 h-4 w-4" />
                Télécharger le guide PDF
              </Button>
            </div>
          </div>
        </motion.div>
       </section>

        {/* Avantages des bourses */}
        <section className="max-w-6xl mx-auto my-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-8 text-center text-green-700 dark:text-yellow-400">
              Pourquoi Postuler à une Bourse ?
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="bg-white dark:bg-zinc-800 border shadow hover:shadow-md hover:bg-red-300 transition">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="bg-yellow-100 text-green-600 p-3 rounded-full">
                   <GraduationCap className="w-8 h-8 text-green-700 dark:text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 mb-1">
                      Accès facilité aux études supérieures
                    </h3>
                    <p className="text-zinc-600 dark:text-zinc-300">
                      Réduisez les barrières financières pour poursuivre vos études dans les meilleures conditions.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-zinc-800 border shadow hover:shadow-md hover:bg-red-300 transition">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="bg-yellow-200 text-green-600 p-3 rounded-full">
                   <PiggyBank className="w-8 h-8 text-green-700 dark:text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 mb-1">
                      Allègement des coûts
                    </h3>
                    <p className="text-zinc-600 dark:text-zinc-300">
                      Profitez d’un soutien financier pour couvrir les frais de scolarité, d’hébergement et de transport.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-zinc-800 border shadow hover:shadow-md hover:bg-red-300 transition">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="bg-yellow-200 text-green-600 p-3 rounded-full">
                   <Globe2 className="w-8 h-8 text-green-700 dark:text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 mb-1">
                      Ouverture à l’international
                    </h3>
                    <p className="text-zinc-600 dark:text-zinc-300">
                      Étudiez à l’étranger et découvrez de nouvelles cultures, langues et opportunités académiques.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-zinc-800 border shadow hover:shadow-md hover:bg-red-300 transition">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="bg-yellow-100 text-green-600 p-3 rounded-full">
                    <BarChart className="w-8 h-8 text-green-700 dark:text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 mb-1">
                      Meilleures opportunités professionnelles
                    </h3>
                    <p className="text-zinc-600 dark:text-zinc-300">
                      Bénéficiez d’un réseau élargi, de stages internationaux et de débouchés attractifs après les études.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </section>

        {/* Appel à action final */}
        <section className="text-center mt-8">
          <Button size="lg" className="text-lg px-6 py-3 bg-green-700 hover:bg-green-800">
            Voir les bourses disponibles
          </Button>
        </section>
      </div>
    </PublicLayout>
  );
}
