import { Link, useForm, usePage } from "@inertiajs/react";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  School,
  Bell,
  FileText,
  FileBarChart,
  LogOut,
  Menu,
  ChevronLeft,
  ChevronRight,
  User
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function AdminLayout({ children }) {
  const { post } = useForm();
  const { url } = usePage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = (e) => {
    e.preventDefault();
    post("/logout");
  };

    const navItems = [
        { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/admin/utilisateurs", label: "Utilisateurs", icon: Users },
        { href: "/admin/dossiers", label: "Dossiers", icon: FileText },
        { href: "/admin/rapports", label: "Rapports", icon: FileBarChart },
        { href: "/admin/bourses", label: "Bourses", icon: GraduationCap },
        { href: "/admin/ecoles", label: "Écoles Partenaires", icon: School },
        { href: "/admin/notifications", label: "Notifications", icon: Bell },
        { href: "/admin/profil", label: "Mon profil", icon: User },
    ];

  return (
    <div className="min-h-screen flex bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full bg-green-700 text-white z-40 transition-all duration-300",
          collapsed ? "w-20" : "w-64",
          "hidden md:flex md:flex-col px-4 py-6"
        )}
      >
        {/* Logo / Title */}
        <div className="flex items-center justify-between mb-8">
          {!collapsed && <h2 className="text-2xl font-bold tracking-wide">Admin DOBAS</h2>}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded hover:bg-green-600 transition"
          >
            {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-3 text-sm flex-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-green-600 transition",
                url.startsWith(href) && "bg-green-800"
              )}
            >
              <Icon className="w-5 h-5" />
              {!collapsed && <span>{label}</span>}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <form onSubmit={handleLogout} className="mt-auto pt-4">
          <button
            type="submit"
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition"
          >
            <LogOut className="w-5 h-5" />
            {!collapsed && <span>Déconnexion</span>}
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

      {/* Mobile Sidebar Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden" onClick={() => setMenuOpen(false)} />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-64 bg-green-700 text-white px-6 py-8 z-40 space-y-6 transition-transform duration-300 md:hidden",
          menuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <h2 className="text-2xl font-bold tracking-wide mb-6">Admin DOBAS</h2>
        <nav className="flex flex-col gap-5 text-sm">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-green-600 transition",
                url.startsWith(href) && "bg-green-800"
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
        <form onSubmit={handleLogout} className="mt-auto pt-8">
          <button type="submit" className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm">
            <LogOut className="w-5 h-5" /> Déconnexion
          </button>
        </form>
      </aside>

      {/* Main Content */}
      <main className={cn("flex-1 p-6 overflow-y-auto transition-all duration-300", collapsed ? "md:ml-20" : "md:ml-64")}>
        {children}
      </main>
    </div>
  );
}
