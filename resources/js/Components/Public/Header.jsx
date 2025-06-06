import { useState, useRef, useEffect } from "react";
import { Link } from "@inertiajs/react";
import { Menu, X, LogIn } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import congo from "@/assets/images/congo.png";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const handleLinkClick = () => setMenuOpen(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <header className="bg-green-700 text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">

        {/* Logo + titre */}
        <div className="flex items-center gap-3">
          <img
            src={congo}
            alt="Logo Congo"
            className="w-10 h-10 object-cover rounded-full shadow-lg"
            style={{
              animation: "zoomInOut 4s ease-in-out infinite"
            }}
          />
          <h1 className="text-2xl font-bold tracking-wide">DOBAS</h1>
        </div>

        {/* Liens du menu */}
        <nav className="hidden md:flex gap-6 text-sm font-medium items-center">
          <Link href="/" className="hover:text-yellow-400 transition-colors">Accueil</Link>
          <Link href="/apropos" className="hover:text-yellow-400 transition-colors">À propos</Link>
          <Link href="/bourses" className="hover:text-yellow-400 transition-colors">Bourses</Link>
          <Link href="/postuler" className="hover:text-yellow-400 transition-colors">Postuler</Link>
          <Link href="/contact" className="hover:text-yellow-400 transition-colors">Contact</Link>
        </nav>

        {/* Connexion */}
        <div className="hidden md:flex">
          <Link
            href="/login"
            className="bg-yellow-400 text-black px-3 py-1.5 rounded flex items-center gap-2 hover:bg-yellow-500 transition"
          >
            <LogIn className="w-4 h-4" />
            Connexion
          </Link>
        </div>

        {/* Bouton menu mobile */}
        <button ref={buttonRef} onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Menu mobile */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-green-700 px-4 overflow-hidden"
          >
            <div className="pb-4 space-y-2 text-sm font-medium">
              <Link href="/" onClick={handleLinkClick} className="block hover:text-yellow-400">Accueil</Link>
              <Link href="/apropos" onClick={handleLinkClick} className="block hover:text-yellow-400">À propos</Link>
              <Link href="/bourses" onClick={handleLinkClick} className="block hover:text-yellow-400">Bourses</Link>
              <Link href="/postuler" onClick={handleLinkClick} className="block hover:text-yellow-400">Postuler</Link>
              <Link href="/contact" onClick={handleLinkClick} className="block hover:text-yellow-400">Contact</Link>
              <Link
                href="/login"
                onClick={handleLinkClick}
                className="flex items-center gap-2 bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-500 w-fit"
              >
                <LogIn className="w-4 h-4" />
                Connexion
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>
        {`
          @keyframes zoomInOut {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.15); }
          }
        `}
      </style>
    </header>
  );
}
