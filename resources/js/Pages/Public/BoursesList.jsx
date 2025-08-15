import React from "react";
import PublicLayout from "@/Layouts/PublicLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { 
  Download, 
  School, 
  Globe, 
  FileText, 
  BadgeCheck, 
  IdCard, 
  GraduationCap, 
  ClipboardCheck, 
  PiggyBank, 
  Globe2, 
  BarChart,
  ArrowRight,
  CheckCircle,
  Star,
  Users,
  Award,
  Calendar,
  MapPin
} from "lucide-react";

export default function BoursePage() {
  const fadeIn = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
    viewport: { once: true }
  };

  const staggerContainer = {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    transition: { staggerChildren: 0.1, duration: 0.6 },
    viewport: { once: true }
  };

  const staggerItem = {
    initial: { opacity: 0, x: -20 },
    whileInView: { opacity: 1, x: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900">
        
        {/* Hero Section Enhanced */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-blue-600/10 dark:from-green-400/5 dark:to-blue-400/5"></div>
          <div className="relative max-w-6xl mx-auto px-6 py-20 text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Star className="w-4 h-4" />
                Opportunités d'Excellence
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-700 to-blue-600 dark:from-green-400 dark:to-blue-400 bg-clip-text text-transparent">
                Bourses d'Études
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                Explorez un monde d'opportunités éducatives. Découvrez les bourses locales et internationales 
                qui transformeront votre avenir académique et professionnel.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all">
                  <ArrowRight className="mr-2 h-5 w-5" />
                  Explorer les bourses
                </Button>
                <Button size="lg" variant="outline" className="border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 px-8 py-3 rounded-full">
                  <Download className="mr-2 h-5 w-5" />
                  Guide complet
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-6 space-y-20 pb-20">
          
          {/* Statistics Section */}
          <motion.section {...fadeIn} className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Users, number: "2 000+", label: "Étudiants aidés" },
              { icon: Award, number: "03+", label: "Types Bourses" },
              { icon: Globe2, number: "45", label: "Pays partenaires" },
              { icon: GraduationCap, number: "95%", label: "Taux de réussite" }
            ].map((stat, index) => (
              <Card key={index} className="text-center p-6 bg-white/70 dark:bg-zinc-800/70 backdrop-blur border-0 shadow-lg hover:shadow-xl transition-all hover:scale-105">
                <stat.icon className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stat.number}</div>
                <div className="text-gray-600 dark:text-gray-300 text-sm">{stat.label}</div>
              </Card>
            ))}
          </motion.section>

          {/* Types de bourses Enhanced */}
          <section>
            <motion.div {...fadeIn}>
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                  Types de Bourses
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
                  Choisissez le programme qui correspond le mieux à vos ambitions académiques
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
                  <Card className="relative overflow-hidden bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-xl h-full">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                    <CardHeader className="relative z-10">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-white/20 rounded-full">
                          <School className="w-6 h-6" />
                        </div>
                        <CardTitle className="text-2xl font-bold">
                          Bourses Locales
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <p className="text-green-50 mb-6 leading-relaxed">
                        Programmes nationaux dédiés aux étudiants méritants et aux situations particulières. 
                        Couvrage complet des frais académiques locaux.
                      </p>
                      <div className="space-y-2">
                        {["Frais de scolarité", "Allocation mensuelle", "Matériel pédagogique"].map((item, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-sm">{item}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
                  <Card className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl h-full">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                    <CardHeader className="relative z-10">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-white/20 rounded-full">
                          <Globe className="w-6 h-6" />
                        </div>
                        <CardTitle className="text-2xl font-bold">
                          Bourses Etrangères
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <p className="text-blue-50 mb-6 leading-relaxed">
                        Opportunités mondiales offertes par universités et gouvernements étrangers. 
                        Votre passeport vers l'excellence internationale.
                      </p>
                      <div className="space-y-2">
                        {["Frais universitaires", "Hébergement", "Transport international"].map((item, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-sm">{item}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </motion.div>
          </section>

          {/* Constitution du dossier Enhanced */}
          <motion.section {...fadeIn}>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                Votre Dossier de Candidature
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Préparez un dossier complet pour maximiser vos chances de succès
              </p>
            </div>
            
            <div className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur border border-gray-200 dark:border-zinc-700 p-8 rounded-2xl shadow-xl">
              <motion.div {...staggerContainer}>
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {[
                    { icon: FileText, title: "Relevés de notes", desc: "Attestant la moyenne au BAC" },
                    { icon: BadgeCheck, title: "Lettre de motivation", desc: "Relevé de notes" },
                    { icon: IdCard, title: "Pièce d'identité", desc: "Document officiel en cours de validité" },
                    { icon: GraduationCap, title: "Attestation du BAC", desc: "Document légalisé" },
                    { icon: ClipboardCheck, title: "Formulaire DOBAS", desc: "Dossier officiel de demande de bourse" },
                    { icon: Calendar, title: "Planning", desc: "Dates limites et échéances importantes" }
                  ].map((item, index) => (
                    <motion.div key={index} {...staggerItem} className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-700/50 transition-colors">
                      <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                        <item.icon className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{item.title}</h4>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <div className="text-center">
                  <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full shadow-lg">
                    <Download className="mr-2 h-5 w-5" />
                    Télécharger le guide complet PDF
                  </Button>
                </div>
              </motion.div>
            </div>
          </motion.section>

          {/* Avantages Enhanced */}
          <motion.section {...fadeIn}>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                Pourquoi Choisir une Bourse ?
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg max-w-3xl mx-auto">
                Transformez votre parcours académique et ouvrez-vous un monde d'opportunités
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
              {[
                {
                  icon: GraduationCap,
                  title: "Excellence Académique",
                  desc: "Accédez aux meilleures formations et développez vos compétences dans un environnement d'excellence.",
                  color: "from-purple-500 to-purple-600"
                },
                {
                  icon: PiggyBank,
                  title: "Liberté Financière",
                  desc: "Concentrez-vous sur vos études sans contraintes financières grâce à un soutien complet.",
                  color: "from-orange-500 to-orange-600"
                },
                {
                  icon: Globe2,
                  title: "Ouverture Internationale",
                  desc: "Découvrez le monde, maîtrisez de nouvelles langues et construisez un réseau global.",
                  color: "from-teal-500 to-teal-600"
                },
                {
                  icon: BarChart,
                  title: "Carrière d'Exception",
                  desc: "Boostez votre employabilité avec des diplômes reconnus et des expériences uniques.",
                  color: "from-indigo-500 to-indigo-600"
                }
              ].map((advantage, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05, rotateY: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className={`relative overflow-hidden bg-gradient-to-br ${advantage.color} text-white border-0 shadow-xl h-full`}>
                    <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full"></div>
                    <CardContent className="p-6 relative z-10">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-white/20 rounded-full">
                          <advantage.icon className="w-8 h-8" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold mb-3">{advantage.title}</h3>
                          <p className="text-sm opacity-90 leading-relaxed">{advantage.desc}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* CTA Section Enhanced */}
          {/* <motion.section {...fadeIn} className="text-center bg-gradient-to-r from-green-600 to-blue-600 text-white p-12 rounded-2xl shadow-2xl">
            <h2 className="text-3xl font-bold mb-4">Prêt à Commencer Votre Parcours ?</h2>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Ne laissez pas passer cette opportunité unique. Votre avenir commence maintenant.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 rounded-full font-semibold shadow-lg">
                <MapPin className="mr-2 h-5 w-5" />
                Voir les bourses disponibles
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-3 rounded-full">
                Nous contacter
              </Button>
            </div>
          </motion.section> */}
          
        </div>
      </div>
    </PublicLayout>
  );
}