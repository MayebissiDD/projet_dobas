import { Head, Link } from "@inertiajs/react"
import PublicLayout from "@/Layouts/PublicLayout"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <PublicLayout>
      <Head title="Accueil - DOBAS" />
      <div className="text-center py-10">
        <h2 className="text-4xl font-bold mb-4">Bienvenue sur la plateforme DOBAS</h2>
        <p className="text-lg mb-6">Explorez les opportunités de bourses pour vos études.</p>
        <Button asChild>
          <Link href="/bourses">Voir les bourses disponibles</Link>
        </Button>
      </div>
    </PublicLayout>
  )
}
