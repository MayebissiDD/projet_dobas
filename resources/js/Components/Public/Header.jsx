import { Link } from "@inertiajs/react"

export default function Header() {
  return (
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">DOBAS</h1>
        <nav className="space-x-4">
          <Link href="/" className="hover:underline">Accueil</Link>
          <Link href="/apropos" className="hover:underline">A propos</Link>
          <Link href="/bourses" className="hover:underline">Bourses</Link>
          <Link href="/postuler" className="hover:underline">Postuler</Link>
          <Link href="/login" className="hover:underline">Connexion</Link>
        </nav>
      </div>
    </header>
  )
}
