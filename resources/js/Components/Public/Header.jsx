import { Link } from "@inertiajs/react"

export default function Header() {
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
          <Link href="/login" className="bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-500 transition-colors">
            Connexion
          </Link>
        </nav>
      </div>
    </header>
  )
}
