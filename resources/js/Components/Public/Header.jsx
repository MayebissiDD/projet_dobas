import { useState, useRef, useEffect } from "react";
import { Link } from "@inertiajs/react";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const handleLinkClick = () => setMenuOpen(false);

  // Fermer le menu si clic en dehors
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
        <h1 className="text-2xl font-bold tracking-wide">DOBAS</h1>
        <nav className="space-x-4 text-sm md:text-base font-medium">
          <Link href="/" className="hover:text-yellow-400 transition-colors">Accueil</Link>
          <Link href="/apropos" className="hover:text-yellow-400 transition-colors">À propos</Link>
          <Link href="/bourses" className="hover:text-yellow-400 transition-colors">Bourses</Link>
          <Link href="/postuler" className="hover:text-yellow-400 transition-colors">Postuler</Link>
          <Link href="/contact" className="hover:text-yellow-400 transition-colors">Contact</Link>
          {/* <Link href="/login" className="bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-500 transition-colors">
            Connexion
          </Link> */}
        </nav>
      </div>

      {/* Menu mobile animé */}
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
              <Link href="/" onClick={handleLinkClick} className="block hover:text-yellow-400 transition-colors">Accueil</Link>
              <Link href="/apropos" onClick={handleLinkClick} className="block hover:text-yellow-400 transition-colors">À propos</Link>
              <Link href="/bourses" onClick={handleLinkClick} className="block hover:text-yellow-400 transition-colors">Bourses</Link>
              <Link href="/postuler" onClick={handleLinkClick} className="block hover:text-yellow-400 transition-colors">Postuler</Link>
              <Link href="/contact" onClick={handleLinkClick} className="block hover:text-yellow-400 transition-colors">Contact</Link>
              <Link
                href="/login"
                onClick={handleLinkClick}
                className="block bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-500 transition-colors w-fit"
              >
                Connexion
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
