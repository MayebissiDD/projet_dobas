import { Link, useForm } from "@inertiajs/react"
import { cn } from "@/lib/utils"
import { LogOut } from "lucide-react"
import { usePage } from "@inertiajs/react"
import "@/styles/student.css"

export default function StudentLayout({ children }) {
  const { post } = useForm()
  const { url } = usePage()

  const handleLogout = (e) => {
    e.preventDefault()
    post("/logout")
  }

  return (
    <div className="flex min-h-screen bg-zinc-100 dark:bg-zinc-900">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-6 space-y-6">
        <h2 className="text-xl font-bold">Espace Étudiant</h2>
        <nav className="space-y-3">
          <Link href="/etudiant/dashboard" className={cn("block", url === '/etudiant/dashboard' && 'text-yellow-400')}>Dashboard</Link>
          <Link href="/etudiant/candidature" className={cn("block", url === '/etudiant/candidature' && 'text-yellow-400')}>Mes candidatures</Link>
          <Link href="/etudiant/paiements" className={cn("block", url === '/etudiant/paiements' && 'text-yellow-400')}>Paiements</Link>
          <Link href="/etudiant/messages" className={cn("block", url === '/etudiant/messages' && 'text-yellow-400')}>Messages</Link>
        </nav>
        <form onSubmit={handleLogout} className="pt-6">
          <button type="submit" className="flex items-center gap-2 text-sm bg-red-600 hover:bg-red-700 px-3 py-2 rounded">
            <LogOut className="w-4 h-4" /> Déconnexion
          </button>
        </form>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  )
}