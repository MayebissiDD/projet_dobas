import PublicLayout from "@/Layouts/PublicLayout"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useState, useRef } from "react"
import { toast } from "sonner"
import { MapPin, Phone, Mail, Clock, Send, MessageSquare, Users, CheckCircle } from "lucide-react"

export default function Contact() {
  const [sending, setSending] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const formRef = useRef(null)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSending(true)
    try {
      // Simuler un envoi API
      await new Promise(res => setTimeout(res, 1200))
      toast.success("Message envoyé avec succès !")
      setForm({ name: '', email: '', subject: '', message: '' })
      formRef.current?.reset()
    } catch {
      toast.error("Erreur lors de l'envoi du message.")
    } finally {
      setSending(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  }

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-red-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 text-zinc-900 dark:text-white">
      
      {/* Hero Section avec animation de particules */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-600 via-yellow-500 to-red-500 py-20">
        <motion.div 
          className="absolute inset-0 opacity-10"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          style={{
            backgroundImage: "radial-gradient(circle, white 2px, transparent 2px)",
            backgroundSize: "50px 50px"
          }}
        />
        
        <motion.div
          className="max-w-6xl mx-auto px-4 text-center relative z-10"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 mb-6"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <MessageSquare className="h-5 w-5 text-white" />
            <span className="text-white font-medium">Contact DOBAS</span>
          </motion.div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Parlons de votre
            <motion.span 
              className="block bg-gradient-to-r from-yellow-300 to-yellow-100 bg-clip-text text-transparent"
              animate={{ 
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              avenir académique
            </motion.span>
          </h1>
          
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Notre équipe dédiée vous accompagne dans toutes vos démarches. Contactez-nous pour obtenir des informations sur les bourses, l'orientation ou l'assistance technique.
          </p>
        </motion.div>
      </div>

      {/* Stats Section */}
      <motion.section 
        className="max-w-6xl mx-auto px-4 -mt-16 relative z-20"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Users, number: "2,000+", label: "Étudiants aidés", color: "from-green-500 to-green-600" },
            { icon: CheckCircle, number: "98%", label: "Taux de satisfaction", color: "from-yellow-500 to-yellow-600" },
            { icon: Clock, number: "24h", label: "Délai de réponse", color: "from-red-500 to-red-600" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white dark:bg-zinc-800 rounded-2xl p-6 shadow-xl border border-white/20"
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${stat.color} mb-4`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">{stat.number}</h3>
              <p className="text-zinc-600 dark:text-zinc-300">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12">
          
          {/* Formulaire de contact amélioré */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-zinc-800 rounded-3xl p-8 shadow-2xl border border-white/20"
          >
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">
                Envoyez-nous un message
              </h2>
              <p className="text-zinc-600 dark:text-zinc-300">
                Remplissez ce formulaire et nous vous répondrons dans les plus brefs délais.
              </p>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                whileFocus={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <label htmlFor="name" className="block mb-2 font-semibold text-zinc-700 dark:text-zinc-300">
                  Nom complet
                </label>
                <Input 
                  id="name" 
                  name="name" 
                  placeholder="Jean Koussou" 
                  required 
                  value={form.name} 
                  onChange={handleChange}
                  className="h-12 border-2 border-zinc-200 dark:border-zinc-600 rounded-xl focus:border-green-500 dark:focus:border-green-400 transition-colors"
                />
              </motion.div>

              <motion.div
                whileFocus={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <label htmlFor="email" className="block mb-2 font-semibold text-zinc-700 dark:text-zinc-300">
                  Adresse email
                </label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  placeholder="exemple@dobas.cg" 
                  required 
                  value={form.email} 
                  onChange={handleChange}
                  className="h-12 border-2 border-zinc-200 dark:border-zinc-600 rounded-xl focus:border-yellow-500 dark:focus:border-yellow-400 transition-colors"
                />
              </motion.div>

              <motion.div
                whileFocus={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <label htmlFor="subject" className="block mb-2 font-semibold text-zinc-700 dark:text-zinc-300">
                  Objet
                </label>
                <Input 
                  id="subject" 
                  name="subject" 
                  placeholder="Demande d'information sur les bourses" 
                  value={form.subject} 
                  onChange={handleChange}
                  className="h-12 border-2 border-zinc-200 dark:border-zinc-600 rounded-xl focus:border-red-500 dark:focus:border-red-400 transition-colors"
                />
              </motion.div>

              <motion.div
                whileFocus={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <label htmlFor="message" className="block mb-2 font-semibold text-zinc-700 dark:text-zinc-300">
                  Message
                </label>
                <Textarea 
                  id="message" 
                  name="message" 
                  rows={6} 
                  placeholder="Décrivez votre demande en détail..." 
                  required 
                  value={form.message} 
                  onChange={handleChange}
                  className="border-2 border-zinc-200 dark:border-zinc-600 rounded-xl focus:border-green-500 dark:focus:border-green-400 transition-colors resize-none"
                />
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  type="submit" 
                  disabled={sending}
                  className="w-full h-14 bg-gradient-to-r from-green-600 via-yellow-500 to-red-500 hover:from-green-700 hover:via-yellow-600 hover:to-red-600 text-white font-bold text-lg rounded-xl shadow-lg transition-all duration-300 disabled:opacity-60"
                >
                  {sending ? (
                    <motion.div
                      className="flex items-center gap-3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <motion.div
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      Envoi en cours...
                    </motion.div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Send className="h-5 w-5" />
                      Envoyer le message
                    </div>
                  )}
                </Button>
              </motion.div>
            </form>
          </motion.div>

          {/* Informations de contact */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Coordonnées */}
            <div className="bg-white dark:bg-zinc-800 rounded-3xl p-8 shadow-2xl border border-white/20">
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">
                Nos coordonnées
              </h3>
              <div className="space-y-6">
                {[
                  { 
                    icon: Mail, 
                    label: "Email", 
                    value: "contact@dobas.cg", 
                    link: "mailto:contact@dobas.cg",
                    color: "bg-green-500"
                  },
                  { 
                    icon: Phone, 
                    label: "Téléphone", 
                    value: "+242 06 123 45 67", 
                    link: "tel:+24206123456",
                    color: "bg-yellow-500"
                  },
                  { 
                    icon: MapPin, 
                    label: "Adresse", 
                    value: "12 avenue de l'Université, Brazzaville, Congo",
                    color: "bg-red-500"
                  }
                ].map((contact, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start gap-4"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className={`p-3 ${contact.color} rounded-xl flex-shrink-0`}>
                      <contact.icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                        {contact.label}
                      </p>
                      {contact.link ? (
                        <a 
                          href={contact.link} 
                          className="text-zinc-900 dark:text-white hover:text-green-600 dark:hover:text-green-400 transition-colors"
                        >
                          {contact.value}
                        </a>
                      ) : (
                        <p className="text-zinc-900 dark:text-white">{contact.value}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Horaires d'ouverture */}
            <motion.div
              className="bg-gradient-to-br from-green-500 via-yellow-500 to-red-500 rounded-3xl p-8 text-white shadow-2xl"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <Clock className="h-6 w-6" />
                <h3 className="text-2xl font-bold">Horaires d'ouverture</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">Lundi - Vendredi</span>
                  <span>8h00 - 17h00</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Samedi</span>
                  <span>8h00 - 12h00</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Dimanche</span>
                  <span className="text-white/80">Fermé</span>
                </div>
              </div>
            </motion.div>

            {/* Carte interactive */}
            <motion.div
              className="overflow-hidden rounded-3xl shadow-2xl border border-white/20"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <iframe
                title="Localisation DOBAS"
                src="https://www.openstreetmap.org/export/embed.html?bbox=15.2663,-4.2634,15.2763,-4.2534&layer=mapnik"
                className="w-full h-64 border-0"
                loading="lazy"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>

    
    </div>
    </PublicLayout>
  )
}