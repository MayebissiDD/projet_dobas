import { Link } from "@inertiajs/react";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import congo from "@/assets/images/congo.png";

export default function Footer() {
  return (
    <footer className="bg-[#00853E] text-white pt-10 pb-6 relative overflow-hidden">
      <style>
        {`
          @keyframes zoomInOut {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.15); }
          }
        `}
      </style>

      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-10 text-sm">

        {/* Bloc 1 : Présentation aligné à gauche */}
        <div className="flex flex-col items-start">
          <img
            src={congo}
            alt="Congo"
            className="w-14 h-14 mb-3 rounded-full shadow-lg"
            style={{
              animation: "zoomInOut 4s ease-in-out infinite"
            }}
          />
          <h2 className="text-2xl font-bold mb-1 tracking-wide">DOBAS</h2>
          <p className="text-gray-200 max-w-[220px]">
            Direction de l’Orientation, des Bourses et Aides Scolaires.
          </p>
        </div>

        {/* Bloc 2 : Liens de navigation */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Navigation</h3>
          <ul className="space-y-1">
            <li><Link href="/" className="hover:underline">Accueil</Link></li>
            <li><Link href="/bourses" className="hover:underline">Bourses</Link></li>
            <li><Link href="/postulerpage" className="hover:underline">Postuler</Link></li>
            <li><Link href="/contact" className="hover:underline">Contact</Link></li>
          </ul>
        </div>

        {/* Bloc 3 : Newsletter */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Newsletter</h3>
          <p className="text-gray-200 mb-2">Recevez nos dernières actualités</p>
          <form className="flex flex-col space-y-2">
            <Input placeholder="Votre email" className="text-black bg-white" />
            <Button type="submit" className="bg-yellow-400 text-black hover:bg-yellow-500 transition-colors">
              S'abonner
            </Button>
          </form>
        </div>

        {/* Bloc 4 : Contact & réseaux sociaux */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Contact</h3>
          <p className="flex items-center gap-2"><Mail size={16} /> <a href="mailto:contact@dobas.cg" className="underline">contact@dobas.cg</a></p>
          <p className="flex items-center gap-2"><Phone size={16} /> +242 06 440 70 66</p>
          <p className="flex items-center gap-2"><MapPin size={16} /> Brazzaville, Congo</p>

          <div className="flex gap-4 mt-4">
            {[
              { href: "https://facebook.com", icon: <Facebook size={20} /> },
              { href: "https://instagram.com", icon: <Instagram size={20} /> },
              { href: "https://twitter.com", icon: <Twitter size={20} /> },
            ].map(({ href, icon }, i) => (
              <a
                key={i}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-white rounded-full p-2 transition hover:bg-white hover:text-[#00853E]"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-gray-100 mt-10 border-t border-white/20 pt-4">
        &copy; {new Date().getFullYear()} DOBAS. Tous droits réservés.
      </div>
    </footer>
  );
}
