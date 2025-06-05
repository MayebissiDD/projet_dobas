import { Link, useForm, usePage } from "@inertiajs/react"
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  School,
  Bell,
  FileText,
  FileBarChart,
  LogOut,
  Menu
} from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

export default function AdminLayout({ children }) {
  const { post } = useForm()
  const [menuOpen, setMenuOpen] = useState(false)
  const { url } = usePage()

  const handleLogout = (e) => {
    e.preventDefault()
    post("/logout")
  }

  return (
    <div className="min-h-screen flex bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
      {/* Sidebar */}
      <aside className={cn(
        "hidden md:flex md:flex-col fixed top-0 left-0 h-full w-64 bg-green-700 text-white px-6 py-8 z-40 space-y-6 overflow-y-auto",
        menuOpen ? 'block' : 'md:block')
      }>
        <h2 className="text-2xl font-bold tracking-wide mb-6">Admin DOBAS</h2>
        <nav className="flex flex-col gap-5 text-sm">
          <Link href="/admin/dashboard" className={cn("flex items-center gap-3", url.startsWith('/admin/dashboard') && 'text-yellow-300')}> <LayoutDashboard className="w-5 h-5" /> Dashboard </Link>
          <Link href="/admin/utilisateurs" className={cn("flex items-center gap-3", url.startsWith('/admin/users') && 'text-yellow-300')}> <Users className="w-5 h-5" /> Utilisateurs </Link>
          <Link href="/admin/dossiers" className={cn("flex items-center gap-3", url.startsWith('/admin/dossiers') && 'text-yellow-300')}> <FileText className="w-5 h-5" /> Dossiers </Link>
          <Link href="/admin/rapports" className={cn("flex items-center gap-3", url.startsWith('/admin/rapports') && 'text-yellow-300')}> <FileBarChart className="w-5 h-5" /> Rapports </Link>
          <Link href="/admin/bourses" className={cn("flex items-center gap-3", url.startsWith('/admin/bourses') && 'text-yellow-300')}> <GraduationCap className="w-5 h-5" /> Bourses </Link>
          <Link href="/admin/ecoles" className={cn("flex items-center gap-3", url.startsWith('/admin/ecoles') && 'text-yellow-300')}> <School className="w-5 h-5" /> Écoles Partenaires </Link>
          <Link href="/admin/notifications" className={cn("flex items-center gap-3", url.startsWith('/admin/notifications') && 'text-yellow-300')}> <Bell className="w-5 h-5" /> Notifications </Link>
        </nav>

        <form onSubmit={handleLogout} className="mt-auto pt-8">
          <button type="submit" className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm">
            <LogOut className="w-5 h-5" /> Déconnexion
          </button>
        </form>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between bg-green-700 text-white px-4 py-3 w-full">
        <h2 className="text-lg font-bold">Admin DOBAS</h2>
        <button onClick={() => setMenuOpen(!menuOpen)}>
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
