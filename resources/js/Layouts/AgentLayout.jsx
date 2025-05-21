import { Link } from "@inertiajs/react";

export default function AgentLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow p-4 flex justify-between">
        <h1 className="text-xl font-bold">Espace Agent DOBAS</h1>
        <nav>
          <Link href={route('agent.dossiers.index')} className="mr-4">Dossiers</Link>
          <Link href={route('logout')} method="post" as="button">Déconnexion</Link>
        </nav>
      </header>
      <main className="p-6">
        {children}
      </main>
    </div>
  );
}
