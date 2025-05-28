import { Link, useForm } from "@inertiajs/react"
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  School,
  Bell,
  FileText,
  LogOut,
} from "lucide-react"

export default function AdminLayout({ children }) {
  const { post } = useForm()

  const handleLogout = (e) => {
    e.preventDefault()
    post("/logout")
  }

  return (
    <div className="min-h-screen flex bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-green-700 text-white flex flex-col px-6 py-8 space-y-6">
        <h2 className="text-2xl font-bold tracking-wide">Admin DOBAS</h2>
        <nav className="flex flex-col gap-4 text-sm">
          <Link href="/admin/dashboard" className="flex items-center gap-2 hover:text-yellow-300 transition">
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </Link>
          <Link href="/admin/utilisateurs" className="flex items-center gap-2 hover:text-yellow-300 transition">
            <Users className="w-5 h-5" /> Utilisateurs
          </Link>
          <Link href="/admin/dossiers" className="flex items-center gap-2 hover:text-yellow-300 transition">
            <FileText className="w-5 h-5" /> Dossiers
          </Link>
          <Link href="/admin/bourses" className="flex items-center gap-2 hover:text-yellow-300 transition">
            <GraduationCap className="w-5 h-5" /> Bourses
          </Link>
          <Link href="/admin/ecoles" className="flex items-center gap-2 hover:text-yellow-300 transition">
            <School className="w-5 h-5" /> Écoles Partenaires
          </Link>
          <Link href="/admin/notifications" className="flex items-center gap-2 hover:text-yellow-300 transition">
            <Bell className="w-5 h-5" /> Notifications
          </Link>
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 mt-auto bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm transition"
        >
          <LogOut className="w-5 h-5" /> Déconnexion
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">{children}</main>
    </div>
  )
}
