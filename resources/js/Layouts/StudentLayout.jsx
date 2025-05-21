// resources/js/Layouts/StudentLayout.jsx
import { Link } from "@inertiajs/react";
import { cn } from "@/lib/utils"; // si tu as installé shadcn
import "@/styles/student.css"; // tu peux aussi créer un fichier de style propre

export default function StudentLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-4 space-y-4">
        <h2 className="text-xl font-bold">Espace Étudiant</h2>
        <nav className="space-y-2">
          <Link href="/etudiant/dashboard" className="block hover:text-blue-400">Dashboard</Link>
          <Link href="/etudiant/candidature" className="block hover:text-blue-400">Mes candidatures</Link>
          <Link href="/etudiant/paiements" className="block hover:text-blue-400">Paiements</Link>
          <Link href="/etudiant/messages" className="block hover:text-blue-400">Messages</Link>
        </nav>
      </aside>

      {/* Contenu */}
      <main className="flex-1 bg-gray-100 p-6">
        {children}
      </main>
    </div>
  );
}
