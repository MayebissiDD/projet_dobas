import { Link, useForm, usePage } from "@inertiajs/react";
import {
  LayoutDashboard,
  Users,
  FileText,
  Bell,
  LogOut,
  Menu,
  ChevronLeft,
  ChevronRight,
  User
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export default function AgentLayout({ children }) {
  const { post } = useForm();
  const { url, flash } = usePage().props || {};
  const [menuOpen, setMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [toast, setToast] = useState(null);

  // Affiche le toast si un message flash est présent
  useEffect(() => {
    if (flash) {
      if (flash.success) {
        setToast({ type: 'success', message: flash.success });
      } else if (flash.error) {
        setToast({ type: 'error', message: flash.error });
      }
      
      if (flash.success || flash.error) {
        const timer = setTimeout(() => setToast(null), 5000);
        return () => clearTimeout(timer);
      }
    }
  }, [flash]);

  const handleLogout = (e) => {
    e.preventDefault();
    post("/logout");
  };

  const navItems = [
    { href: "/agent/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/agent/dossiers", label: "Dossiers", icon: FileText },
    { href: "/agent/notifications", label: "Notifications", icon: Bell },
    { href: "/agent/profil", label: "Mon profil", icon: User },
  ];

  return (
    <div className="min-h-screen flex bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
      {/* Toast notification */}
      {toast && (
        <div
          className={`fixed top-6 left-1/2 z-50 transform -translate-x-1/2 px-6 py-3 rounded shadow-lg text-white text-center transition-all duration-300 ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}
          style={{ minWidth: 250, maxWidth: 400 }}
        >
          {toast.message}
          {toast.type === 'error' && (
            <div className="mt-2 text-xs opacity-80">Veuillez vérifier les champs ou réessayer.</div>
          )}
        </div>
      )}
      
      {/* Sidebar desktop */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full bg-green-700 text-white z-40 transition-all duration-300",
          collapsed ? "w-20" : "w-64",
          "hidden md:flex md:flex-col px-4 py-6"
        )}
      >
        <div className="flex items-center justify-between mb-8">
          {!collapsed && <h2 className="text-2xl font-bold tracking-wide">Agent DOBAS</h2>}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded hover:bg-green-600 transition"
          >
            {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>
        
        <nav className="flex flex-col gap-3 text-sm flex-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-green-600 transition",
                url?.startsWith(href) && "bg-green-800"
              )}
            >
              <Icon className="w-5 h-5" />
              {!collapsed && <span>{label}</span>}
            </Link>
          ))}
        </nav>
        
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
      
      {/* Mobile header */}
      <div className="md:hidden flex items-center justify-between bg-green-700 text-white px-4 py-3 w-full">
        <h2 className="text-lg font-bold">Agent DOBAS</h2>
        <button onClick={() => setMenuOpen(!menuOpen)}>
          <Menu className="w-6 h-6" />
        </button>
      </div>
      
      {/* Mobile overlay */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden" onClick={() => setMenuOpen(false)} />
      )}
      
      {/* Sidebar mobile */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-64 bg-green-700 text-white px-6 py-8 z-40 space-y-6 transition-transform duration-300 md:hidden",
          menuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <h2 className="text-2xl font-bold tracking-wide mb-6">Agent DOBAS</h2>
        <nav className="flex flex-col gap-5 text-sm">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-green-600 transition",
                url?.startsWith(href) && "bg-green-800"
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
      
      {/* Main content */}
      <main className={cn("flex-1 p-6 overflow-y-auto transition-all duration-300", collapsed ? "md:ml-20" : "md:ml-64")}>
        {children}
      </main>
    </div>
  );
}