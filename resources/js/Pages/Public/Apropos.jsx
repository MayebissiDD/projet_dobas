import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import escatLogo from '@/assets/images/logoPartenaire/escat.png';
import esgaeLogo from '@/assets/images/logoPartenaire/esgae.png';
import ihemLogo from '@/assets/images/logoPartenaire/ihem-isti.png';
import eadLogo from '@/assets/images/logoPartenaire/ead.png';
import ecesLogo from '@/assets/images/logoPartenaire/eces.png';
import deuxiLogo from '@/assets/images/logoPartenaire/2i.png';
import hero1 from '@/assets/images/hero1.jpg';
import dg from '@/assets/images/dg.jpg';
// imports moved to top
import {
  ArrowRight,
  GraduationCap,
  Users,
  Award,
  Target,
  BookOpen,
  Globe,
  Heart,
  ChevronDown,
  Phone,
  Mail,
  MapPin,
  Calendar,
  TrendingUp,
  Handshake
} from "lucide-react";
import PublicLayout from "@/Layouts/PublicLayout";

export default function Apropos() {
  const [openFaq, setOpenFaq] = useState(null);
  const [animateStats, setAnimateStats] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimateStats(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const AnimatedNumber = ({ end, suffix = "", duration = 2000 }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (!animateStats) return;

      let startTime;
      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        setCount(Math.floor(progress * end));

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }, [end, duration, animateStats]);

    return <span>{count}{suffix}</span>;
  };

  // Statistiques harmonisées (à ajuster dynamiquement si besoin)
  const stats = [
    { icon: <Users className="h-8 w-8" />, number: 2000, label: "Candidatures accompagnées", suffix: "+" },
    { icon: <Award className="h-8 w-8" />, number: 95, label: "Taux de réussite", suffix: "%" },
    { icon: <Globe className="h-8 w-8" />, number: 20, label: "Écoles partenaires", suffix: "+" },
    { icon: <GraduationCap className="h-8 w-8" />, number: 30, label: "Bourses disponibles", suffix: "+" },

  ];

  const values = [
    {
      icon: <Target className="w-12 h-12" />,
      title: "Excellence",
      description: "Nous visons l'excellence dans l'accompagnement de chaque étudiant vers la réussite académique."
    },
    {
      icon: <Heart className="w-12 h-12" />,
      title: "Engagement",
      description: "Notre engagement envers l'éducation congolaise guide chacune de nos actions quotidiennes."
    },
    {
      icon: <Handshake className="w-12 h-12" />,
      title: "Partenariat",
      description: "Nous cultivons des partenariats durables avec les meilleures institutions éducatives."
    },
    {
      icon: <TrendingUp className="w-12 h-12" />,
      title: "Innovation",
      description: "Nous modernisons constamment nos processus pour offrir la meilleure expérience."
    }
  ];

  const faqItems = [
    {
      question: "Comment puis-je postuler à une bourse DOBAS ?",
      answer: "La candidature se fait entièrement en ligne. Visitez notre page dédiée aux bourses, sélectionnez celle qui correspond à votre profil académique, puis complétez le formulaire de candidature avec tous les documents requis (bulletins, attestations, lettre de motivation, etc.). Un accusé de réception vous sera envoyé sous 48h."
    },
    {
      question: "Quels sont les critères d'admission pour les bourses ?",
      answer: "Les critères varient selon le type de bourse : niveau d'études (Bac+1 à Bac+5), filière d'études, établissement d'origine, moyenne académique minimale (généralement 12/20), situation socio-économique de la famille, et parfois des critères spécifiques comme l'excellence sportive ou artistique."
    },
    {
      question: "Comment suivre l'évolution de ma candidature ?",
      answer: "Connectez-vous à votre espace personnel sur notre plateforme avec vos identifiants. Vous y trouverez un tableau de bord détaillé avec le statut de votre dossier, les étapes franchies, les documents manquants éventuels, et vous recevrez des notifications par email à chaque mise à jour."
    },
    {
      question: "Quel est le délai de traitement des dossiers ?",
      answer: "Après réception complète de votre dossier, le délai de traitement est de 2 à 4 semaines selon la complexité et le type de bourse. Les dossiers d'excellence sont traités en priorité. Une commission d'évaluation se réunit chaque mardi pour examiner les nouvelles candidatures."
    },
    {
      question: "Y a-t-il des frais à payer pour candidater ?",
      answer: "Oui, des frais de traitement de 5 000 FCFA sont requis pour couvrir les coûts administratifs, l'évaluation du dossier et le suivi personnalisé. Le paiement s'effectue en ligne via MTN Mobile Money ou carte bancaire. Ces frais ne sont pas remboursables."
    },
    {
      question: "Quels documents dois-je fournir obligatoirement ?",
      answer: "Documents requis : photocopie légalisée du baccalauréat, bulletins des 3 dernières années, attestation d'inscription ou de préinscription, lettre de motivation manuscrite, CV détaillé, 2 photos d'identité récentes, attestation de ressources des parents, et certificat médical de moins de 3 mois."
    },
    {
      question: "Puis-je candidater à plusieurs bourses simultanément ?",
      answer: "Oui, vous pouvez postuler à maximum 3 bourses différentes pour augmenter vos chances de succès. Cependant, vous devrez payer les frais de traitement pour chaque candidature et adapter votre lettre de motivation à chaque bourse spécifique."
    },
    {
      question: "Que se passe-t-il si ma candidature est acceptée ?",
      answer: "En cas d'acceptation, vous recevrez un email de félicitations avec les détails de votre bourse : montant, durée, modalités de versement, obligations à respecter. Vous devrez signer un contrat d'engagement et fournir un RIB pour les virements. Un suivi pédagogique sera mis en place."
    }
  ];

  // ...existing code...

  const partnerLogos = [
    escatLogo,
    esgaeLogo,
    ihemLogo,
    eadLogo,
    ecesLogo,
    deuxiLogo,
    // Ajouter d'autres logos ici si besoin
  ];

  return (
    <PublicLayout>
      <div className="min-h-screen bg-white dark:bg-zinc-900">
        {/* Hero Section */}
        <section className="relative overflow-hidden text-white bg-gradient-to-r from-green-600 via-yellow-500 to-red-500">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 px-4 py-24 mx-auto max-w-7xl">
            <div className="space-y-6 text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 mb-6 rounded-full bg-white/20 animate-bounce">
                <GraduationCap className="w-12 h-12" />
              </div>
              <h1 className="mb-6 text-5xl font-bold md:text-6xl">
                DOBAS CONGO
              </h1>
              <p className="max-w-3xl mx-auto text-xl font-light md:text-2xl">
                Direction d'Orientation des Bourses et Aides Scolaires
              </p>
              <p className="max-w-2xl mx-auto text-lg opacity-90">
                Votre partenaire de confiance pour l'accès à l'enseignement supérieur et l'excellence académique
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white">
          <div className="px-4 mx-auto max-w-7xl">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className={`
                    inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4 transition-all duration-300 group-hover:scale-110 shadow-lg
                    ${index % 4 === 0 ? 'bg-gradient-to-br from-green-400 to-green-600 text-white' :
                      index % 4 === 1 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white' :
                        index % 4 === 2 ? 'bg-gradient-to-br from-red-400 to-red-600 text-white' : 'bg-gradient-to-br from-blue-400 to-blue-600 text-white'}
                  `}>
                    {stat.icon}
                  </div>
                  <div className="mb-2 text-4xl font-bold text-transparent text-gray-800 bg-gradient-to-r from-green-600 to-yellow-600 bg-clip-text">
                    <AnimatedNumber end={stat.number} suffix={stat.suffix} />
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mot du Directeur */}
        <section className="py-20 bg-gradient-to-r from-green-50 to-yellow-50">
          <div className="px-4 mx-auto max-w-7xl">
            <div className="grid items-center gap-12 md:grid-cols-2">
              <div className="space-y-6">
                <h2 className="mb-6 text-4xl font-bold text-green-700">
                  Mot du Directeur Général
                </h2>
                <div className="space-y-4 prose prose-lg text-gray-700">
                  <p className="text-lg leading-relaxed">
                    <strong>Chers élèves, étudiants et partenaires,</strong>
                  </p>
                  <p className="text-lg leading-relaxed">
                    La Direction de l’Orientation, des Bourses et Aides Scolaires (DOBAS) s’engage chaque jour à garantir l’égalité des chances et à soutenir l’excellence pour tous les jeunes du Bénin.
                  </p>
                  <p className="text-lg leading-relaxed">
                    Notre mission est de centraliser l’information, simplifier les démarches et accompagner chaque candidat dans la construction de son avenir, en partenariat avec les établissements et les familles.
                  </p>

                  <p className="text-lg leading-relaxed font-semibold text-green-700">
                    Ensemble, faisons de l’éducation un levier de développement et d’épanouissement pour notre nation.

                  </p>
                  <p className="text-lg italic leading-relaxed">
                    — Le Directeur Général de la DOBAS
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="relative w-22 z-10">
                  <img
                    src={dg}
                    alt="Directeur Général de la DOBAS"

                    className="rounded-3xl shadow-2xl border-8 border-white w-full object-contain bg-white transform hover:scale-105 transition-all duration-300"

                  />
                </div>
                <div className="absolute w-full h-full -top-6 -right-6 bg-gradient-to-br from-green-300/30 to-yellow-300/30 rounded-3xl -z-10 blur-sm"></div>
                <div className="absolute w-full h-full -top-3 -right-3 bg-gradient-to-br from-green-400/20 to-yellow-400/20 rounded-3xl -z-10"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Nos Valeurs */}
        <section className="py-20 bg-white">
          <div className="px-4 mx-auto max-w-7xl">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-4xl font-bold text-green-700">Nos Valeurs</h2>
              <p className="max-w-2xl mx-auto text-lg text-gray-600">
                Les principes qui guident notre mission d'accompagnement des étudiants congolais
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {values.map((value, index) => (
                <Card key={index} className="overflow-hidden transition-all duration-300 border-0 shadow-xl hover:shadow-2xl hover:-translate-y-2 bg-gradient-to-br from-white to-gray-50 rounded-2xl">
                  <CardContent className="relative p-8 text-center">
                    <div className={`
                      inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6 shadow-lg transform hover:scale-110 transition-all duration-300
                      ${index % 4 === 0 ? 'bg-gradient-to-br from-green-400 to-green-600 text-white' :
                        index % 4 === 1 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white' :
                          index % 4 === 2 ? 'bg-gradient-to-br from-red-400 to-red-600 text-white' : 'bg-gradient-to-br from-blue-400 to-blue-600 text-white'}
                    `}>
                      {value.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">{value.title}</h3>
                    <p className="text-gray-600 text-lg leading-relaxed">{value.description}</p>
                    <div className={`absolute top-0 left-0 w-full h-1 ${index % 4 === 0 ? 'bg-gradient-to-r from-green-400 to-green-600' :
                      index % 4 === 1 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                        index % 4 === 2 ? 'bg-gradient-to-r from-red-400 to-red-600' : 'bg-gradient-to-r from-blue-400 to-blue-600'
                      }`}></div>

                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 text-white bg-gradient-to-r from-green-600 to-red-600">
          <div className="px-4 mx-auto max-w-7xl">
            <div className="grid items-center gap-12 md:grid-cols-2">
              <div className="space-y-6">
                <h2 className="text-4xl font-bold leading-tight">
                  Investir dans l'éducation,<br />
                  c'est investir dans la nation
                </h2>
                <p className="text-xl opacity-90">
                  Découvrez nos bourses et programmes d'accompagnement. Laissez-nous vous guider vers l'excellence académique et professionnelle.
                </p>
                <div className="flex flex-col sm:flex-row gap-6">
                  <a href="/bourses">
                    <Button className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-black text-lg px-10 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 transform font-semibold">
                      Découvrir les bourses <ArrowRight className="inline w-5 h-5 ml-2" />
                    </Button>
                  </a>
                  <a href="/contact">
                    <Button variant="outline" className="border-2 border-white text-green-600 hover:bg-white hover:text-green-600 text-lg px-10 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform font-semibold">
                      Nous contacter
                    </Button>
                  </a>

                </div>
              </div>
              <div className="relative">
                <img
                  src={hero1}
                  alt="Étudiants DOBAS"
                  className="rounded-3xl shadow-2xl border-8 border-white w-full object-contain bg-white transform hover:scale-105 transition-all duration-300"

                />
                <div className="absolute w-full h-full -bottom-6 -left-6 bg-gradient-to-br from-yellow-300/30 to-red-300/30 rounded-3xl -z-10 blur-sm"></div>
                <div className="absolute w-full h-full -bottom-3 -left-3 bg-gradient-to-br from-yellow-400/20 to-red-400/20 rounded-3xl -z-10"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Partenaires */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-green-700 mb-4">Nos Partenaires</h2>

              <p className="text-lg text-gray-600">
                Institutions de confiance qui nous accompagnent dans notre mission
              </p>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-8">
              {partnerLogos.map((logo, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center h-28 w-44 m-2 transition-transform duration-300 hover:scale-110"
                  style={{ background: 'none', boxShadow: 'none' }}
                >
                  <img
                    src={logo}
                    alt={`Partenaire ${index + 1}`}
                    className="max-h-20 w-auto object-contain mx-auto"
                    style={{ transition: 'transform 0.3s', }}

                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl px-4 mx-auto">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-4xl font-bold text-green-700">Questions Fréquentes</h2>
              <p className="text-lg text-gray-600">
                Trouvez rapidement les réponses à vos questions les plus courantes
              </p>
            </div>
            <div className="space-y-6">
              {faqItems.map((item, index) => (
                <Card key={index} className="overflow-hidden transition-all duration-300 border-0 shadow-lg hover:shadow-xl rounded-2xl">
                  <CardContent className="p-0">
                    <button
                      onClick={() => setOpenFaq(openFaq === index ? null : index)}
                      className="flex items-center justify-between w-full px-8 py-6 text-left transition-all duration-300 hover:bg-gradient-to-r hover:from-green-50 hover:to-yellow-50 group"
                    >
                      <span className="text-lg font-bold text-gray-800 transition-colors duration-300 group-hover:text-green-700">{item.question}</span>
                      <div className={`p-2 rounded-full transition-all duration-300 ${openFaq === index ? 'bg-green-100 rotate-180' : 'bg-gray-100 group-hover:bg-green-100'}`}>
                        <ChevronDown className={`w-5 h-5 transition-all duration-300 ${openFaq === index ? 'text-green-600' : 'text-gray-500 group-hover:text-green-600'}`} />
                      </div>
                    </button>
                    {openFaq === index && (
                      <div className="px-8 pb-6 text-lg leading-relaxed text-gray-700 border-t border-gray-100 bg-gradient-to-r from-green-50/30 to-yellow-50/30 animate-fadeIn">
                        <div className="pt-4">
                          {item.answer}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
}