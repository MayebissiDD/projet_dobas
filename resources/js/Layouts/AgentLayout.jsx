import { Link, useForm } from "@inertiajs/react"
import { usePage } from "@inertiajs/react"
import { LogOut } from "lucide-react"

export default function AgentLayout({ children }) {
  const { post } = useForm()
  const handleLogout = (e) => {
    e.preventDefault()
    post("/logout")
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-zinc-900">
      <header className="bg-white dark:bg-zinc-800 shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Espace Agent DOBAS</h1>
        <nav className="flex gap-4">
          <Link href={route('agent.dossiers.index')} className="text-sm hover:text-green-600">Dossiers</Link>
          <form onSubmit={handleLogout}>
            <button type="submit" className="text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded">Déconnexion</button>
          </form>
        </nav>
      </header>
      <main className="p-6">
        {children}
      </main>
    </div>
  )
}
