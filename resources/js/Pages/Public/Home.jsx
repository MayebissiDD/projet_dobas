import PublicLayout from "@/Layouts/PublicLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useEffect, useState, useRef } from "react"
import heroImage from "@/assets/images/image-1.jpg"
import {
  GraduationCap,
  Users,
  Award,
  BookOpen,
  TrendingUp,
  MapPin,
  Phone,
  Mail,
  Star,
  ArrowRight,
  CheckCircle,
  Globe,
  Calendar,
  Building
} from "lucide-react"

export default function Home() {
  const [sending, setSending] = useState(false)
  const [form, setForm] = useState({ nom: '', email: '', objet: '', message: '' })
  const [currentSlide, setCurrentSlide] = useState(0)
  const formRef = useRef(null)
  
  const heroSlides = [
    {
      title: "DOBAS - Plateforme nationale des bourses et aides scolaires",
      subtitle: "Accompagner chaque élève et étudiant vers la réussite, sans barrière financière.",
      gradient: "from-green-600 to-emerald-700"
    },
    {
      title: "Des opportunités pour tous les talents",
      subtitle: "Découvrez les bourses locales, étrangères et aides scolaires accessibles à tous.",
      gradient: "from-yellow-500 to-amber-600"
    },
    {
      title: "Un guichet unique pour votre avenir",
      subtitle: "Toutes les informations, démarches et accompagnements réunis sur une seule plateforme.",
      gradient: "from-red-500 to-rose-600"
    }
  ]

  const stats = [
    { icon: Award, number: "30+", label: "Bourses disponibles", color: "text-green-600" },
    { icon: Users, number: "20+", label: "Écoles partenaires", color: "text-yellow-600" },
    { icon: GraduationCap, number: "2000+", label: "Candidatures accompagnées", color: "text-red-600" },
    { icon: TrendingUp, number: "95%", label: "Taux de réussite", color: "text-emerald-600" }
  ]

  const services = [
    {
      icon: BookOpen,
      title: "Orientation et information",
      description: "Orienter les bacheliers dans le choix de leur formation, afin de garantir une insertion professionnelle.",
      color: "bg-green-50 text-green-700 border-green-200",
      iconColor: "text-green-600"
    },
    {
      icon: Award,
      title: "Accompagnement personnalisé",
      description: "Bénéficiez d'un suivi et de conseils à chaque étape de votre candidature.",
      color: "bg-yellow-50 text-yellow-700 border-yellow-200",
      iconColor: "text-yellow-600"
    },
    {
      icon: Globe,
      title: "Bourses locales & étrangères",
      description: "Accédez à des opportunités au Bénin et à l'international, pour tous les niveaux d'études.",
      color: "bg-red-50 text-red-700 border-red-200",
      iconColor: "text-red-600"
    },
  ]

  const testimonials = [
    {
      name: "Marie Ondongo",
      role: "Étudiante en Médecine",
      content: "Grâce à DOBAS, j'ai obtenu une bourse d'excellence qui me permet de poursuivre mon rêve.",
      avatar: "👩‍⚕️"
    },
    {
      name: "Jean Makosso",
      role: "Étudiant en Ingénierie",
      content: "La plateforme m'a aidé à trouver la bourse parfaite pour mes études d'ingénieur.",
      avatar: "👨‍💻"
    }
  ]

  useEffect(() => {
    document.title = "DOBAS | Accueil"
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSending(true)
    try {
      await new Promise(res => setTimeout(res, 1000))
      alert("Message envoyé avec succès !")
      setForm({ nom: '', email: '', objet: '', message: '' })
      formRef.current?.reset()
    } catch {
      alert("Erreur lors de l'envoi du message.")
    } finally {
      setSending(false)
    }
  }

  return (
    <PublicLayout>
      <div className="min-h-screen w-full bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
        {/* Hero Section avec animation */}
        <section className="relative h-screen overflow-hidden">
          {/* Dégradé coloré avec overlay - AMÉLIORÉ */}
          <div className="absolute inset-0 z-10 opacity-40">
            <div className={`absolute inset-0 z-10 bg-gradient-to-br ${heroSlides[currentSlide].gradient} bg-opacity-10 transition-all duration-2000`}>
              <div className="absolute inset-0 bg-black/20" />
            </div>
          </div>
          
          {/* Fond image héro */}
          <div className="absolute inset-0 z-0">
            <img
              src={heroImage}
              alt="Fond héro"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Formes géométriques animées */}
          <div className="absolute inset-0 z-20 overflow-hidden">
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-400/20 rounded-full animate-pulse" />
            <div className="absolute top-1/4 -left-8 w-16 h-16 bg-red-400/20 rounded-full animate-bounce" style={{ animationDelay: '1s' }} />
            <div className="absolute bottom-1/4 right-1/4 w-12 h-12 bg-green-400/20 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
            <div className="absolute bottom-10 left-10 w-20 h-20 bg-yellow-400/10 rotate-45 animate-spin" style={{ animationDuration: '8s' }} />
          </div>
          
          {/* Contenu texte et boutons - CENTRAGE AMÉLIORÉ */}
          <div className="relative z-30 h-full flex flex-col justify-center items-center text-center px-4 py-12">
            <div className="max-w-4xl w-full">
              <div key={currentSlide} className="animate-fade-in-up">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                  {heroSlides[currentSlide].title}
                </h1>
                <p className="text-lg md:text-xl text-white/90 mb-10 max-w-3xl mx-auto">
                  {heroSlides[currentSlide].subtitle}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <a href="/bourses">
                <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 group">
                  Découvrir les bourses
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                </a>
                <a href="/postuler">
                <Button variant="outline"  className="bg-yellow-600 hover:bg-yellow-700 border-yellow-500 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg transform hover:scale-105 transition-all duration-400 group">
                  Postuler maintenant
                </Button>
                </a>
              </div>
              
              {/* Indicateurs de slides */}
              <div className="flex justify-center space-x-2">
                {heroSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${currentSlide === index ? 'bg-white scale-125' : 'bg-white/50'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section Présentation DOBAS - AJOUTÉE */}
        <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-100">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Direction d'Orientation, de Bourses et d'Aides Scolaires</h2>
              <div className="w-24 h-1 bg-green-600 mx-auto mb-6"></div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <GraduationCap className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Notre Mission</h3>
                    <p className="text-gray-700">Accompagner les élèves des collèges et lycées techniques dans la poursuite de leurs études afin de favoriser leur insertion professionnelle.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-yellow-100 p-3 rounded-full">
                    <Building className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Notre Rattachement</h3>
                    <p className="text-gray-700">La DOBAS travaille sous l'autorité du ministère de l'Enseignement Technique et est dirigée par une Directrice.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-red-100 p-3 rounded-full">
                    <MapPin className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Notre Emplacement</h3>
                    <p className="text-gray-700">Nous sommes situés entre les deux lycées 1er mai, pour être au plus près des élèves et étudiants.</p>
                  </div>
                </div>
              </div>
              
              <Card className="shadow-xl border-0 overflow-hidden">
                <div className="bg-gradient-to-r from-green-600 to-emerald-700 p-1">
                  <CardContent className="p-8 bg-white">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">À propos de la DOBAS</h3>
                    <p className="text-gray-700 mb-4">
                      La Direction d'Orientation, de Bourses et d'Aides Scolaires (DOBAS) est une structure essentielle du système éducatif congolais.
                    </p>
                    <p className="text-gray-700 mb-4">
                      Nous intervenons à un moment crucial de la vie des élèves : la transition entre l'enseignement secondaire et les études supérieures ou l'insertion professionnelle.
                    </p>
                    <p className="text-gray-700">
                      Grâce à notre expertise et notre réseau de partenaires, nous offrons des solutions concrètes pour que chaque élève puisse réaliser son potentiel, quel que soit son contexte socio-économique.
                    </p>
                  </CardContent>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Section Statistiques */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="text-center group hover:transform hover:scale-105 transition-all duration-300"
                >
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4 group-hover:shadow-lg transition-all duration-300`}>
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2 counter-animation">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Section Services */}
        <section className="py-20 bg-gradient-to-br from-green-50 via-yellow-50 to-red-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Nos Services
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Découvrez comment DOBAS vous accompagne dans votre parcours éducatif
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <Card
                  key={index}
                  className={`${service.color} border-2 hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 group cursor-pointer`}
                >
                  <CardContent className="p-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white mb-6 group-hover:scale-110 transition-transform duration-300">
                      <service.icon className={`w-8 h-8 ${service.iconColor}`} />
                    </div>
                    <h3 className="text-xl font-bold mb-4">
                      {service.title}
                    </h3>
                    <p className="text-sm leading-relaxed">
                      {service.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* Section Témoignages */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Témoignages
              </h2>
              <p className="text-xl text-gray-600">
                Ce que disent nos bénéficiaires
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-6 italic">
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center">
                      <div className="text-3xl mr-4">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {testimonial.name}
                        </div>
                        <div className="text-gray-600 text-sm">
                          {testimonial.role}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* Section Contact */}
        <section className="py-20 bg-gradient-to-br from-green-600 to-emerald-700">
          <div className="max-w-4xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Informations de contact */}
              <div className="text-white">
                <h2 className="text-4xl font-bold mb-6">
                  Contactez-nous
                </h2>
                <p className="text-xl mb-8 text-green-100">
                  Nous sommes là pour vous accompagner dans votre parcours éducatif
                </p>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-white/20 p-3 rounded-full">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-semibold">Adresse</div>
                      <div className="text-green-100">Entre les deux lycées 1er mai</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="bg-white/20 p-3 rounded-full">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-semibold">Téléphone</div>
                      <div className="text-green-100">+242 06 440 70 66</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="bg-white/20 p-3 rounded-full">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-semibold">Email</div>
                      <div className="text-green-100">contact@dobas.cg</div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Formulaire */}
              <Card className="shadow-2xl">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    Envoyez-nous un message
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-2">
                        Nom complet *
                      </label>
                      <Input
                        id="nom"
                        name="nom"
                        placeholder="Jean Koussou"
                        required
                        value={form.nom}
                        onChange={handleChange}
                        className="transition-all duration-300 focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Adresse email *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="exemple@dobas.cg"
                        required
                        value={form.email}
                        onChange={handleChange}
                        className="transition-all duration-300 focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="objet" className="block text-sm font-medium text-gray-700 mb-2">
                        Objet
                      </label>
                      <Input
                        id="objet"
                        name="objet"
                        placeholder="Demande d'information sur les bourses"
                        value={form.objet}
                        onChange={handleChange}
                        className="transition-all duration-300 focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                        Message *
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Votre message ici..."
                        required
                        value={form.message}
                        onChange={handleChange}
                        className="transition-all duration-300 focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={handleSubmit}
                    disabled={sending}
                    className="w-full bg-green-600 hover:bg-green-700 text-white mt-5 px-6 py-3 text-lg font-semibold rounded-full shadow-md transition-all duration-300 flex items-center justify-center"
                  >
                    {sending ? (
                      <>
                        <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4zm16 0a8 8 0 01-8 8v-8h8z"></path>
                        </svg>
                        Envoi en cours...
                      </>
                    ) : (
                      "Envoyer le message"
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </PublicLayout>
  )
}