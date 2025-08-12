// resources/js/Layouts/StudentLayout.jsx
import { Link, useForm } from "@inertiajs/react";
import { cn } from "@/lib/utils";
import { LogOut, Bell, FileText, CreditCard, User, Home } from "lucide-react";
import { usePage } from "@inertiajs/react";
import "@/styles/student.css";

export default function StudentLayout({ children }) {
  const { post } = useForm();
  const { url, props } = usePage();
  const unreadNotifications = props.unreadNotifications || 0;
  
  const handleLogout = (e) => {
    e.preventDefault();
    post("/logout");
  };

  const navigation = [
    { name: "Dashboard", href: "/etudiant/dashboard", icon: Home },
    { name: "Mes candidatures", href: "/etudiant/dossiers", icon: FileText },
    { name: "Paiements", href: "/etudiant/paiements", icon: CreditCard },
    { name: "Notifications", href: "/etudiant/notifications", icon: Bell, count: unreadNotifications },
    { name: "Mon profil", href: "/etudiant/profil", icon: User },
  ];

  return (
    <div className="flex min-h-screen bg-zinc-100 dark:bg-zinc-900">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-6 space-y-6">
        <h2 className="text-xl font-bold">Espace Étudiant</h2>
        <nav className="space-y-3">
          {navigation.map((item) => (
            <Link 
              key={item.name}
              href={item.href} 
              className={cn(
                "flex items-center space-x-2 p-2 rounded-md hover:bg-gray-800 transition-colors",
                url.startsWith(item.href) && 'bg-gray-800 text-yellow-400'
              )}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
              {item.count > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {item.count}
                </span>
              )}
            </Link>
          ))}
        </nav>
        <form onSubmit={handleLogout} className="pt-6 border-t border-gray-700">
          <button type="submit" className="flex items-center gap-2 text-sm bg-red-600 hover:bg-red-700 px-3 py-2 rounded w-full">
            <LogOut className="w-4 h-4" /> Déconnexion
          </button>
        </form>
      </aside>
      
      {/* Content */}
      <main className="flex-1 p-6 overflow-auto">
        {children}
      </main>
    </div>
  );
}