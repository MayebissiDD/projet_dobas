import AdminLayout from '@/Layouts/AdminLayout';
import { Inertia } from '@inertiajs/inertia';
import { Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Plus, Download, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function Bourses({ bourses }) {
  const { flash } = usePage().props;
  const [deletingId, setDeletingId] = useState(null);

  function handleDelete(id) {
    if (confirm('Voulez-vous vraiment supprimer cette bourse ?')) {
      setDeletingId(id);
      Inertia.delete(route('admin.bourses.destroy', id), {
        onFinish: () => setDeletingId(null),
      });
    }
  }

  return (
    <div className="min-h-screen py-10 px-6 md:px-20 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
      {/* En-tête */}
      <Header />

      {/* Message flash succès */}
      {flash?.success && (
        <div className="mb-6 rounded border border-green-400 bg-green-50 p-4 text-green-700">
          {flash.success}
        </div>
      )}

      {/* Table des bourses */}
      <BoursesTable bourses={bourses} onDelete={handleDelete} deletingId={deletingId} />

      {/* Footer avec info et export */}
      <Footer count={bourses.data.length} />
    </div>
  );
}

function Header() {
  return (
    <div className="mb-8 flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold mb-1">🎓 Gestion des Bourses</h1>
        <p className="text-muted-foreground">Liste des bourses proposées sur la plateforme.</p>
      </div>
      <Link href={route('admin.bourses.create')} className="inline-flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
        <Plus className="w-5 h-5" /> Ajouter une bourse
      </Link>
    </div>
  );
}

function BoursesTable({ bourses, onDelete, deletingId }) {
  if (!bourses.data.length) {
    return (
      <div className="py-12 text-center text-zinc-500 bg-white dark:bg-zinc-800 rounded-xl shadow">
        Aucune bourse disponible.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white dark:bg-zinc-800 rounded-xl shadow">
      <table className="min-w-full text-sm divide-y divide-gray-200 dark:divide-zinc-700">
        <thead className="bg-gray-50 dark:bg-zinc-700">
          <tr>
            {['Nom', 'Montant', 'Période', 'Statut', 'Actions'].map((heading) => (
              <th
                key={heading}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-zinc-300"
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-zinc-700">
          {bourses.data.map((bourse) => (
            <tr key={bourse.id} className="hover:bg-gray-100 dark:hover:bg-zinc-700">
              <td className="px-6 py-4 whitespace-nowrap font-semibold">{bourse.nom}</td>
              <td className="px-6 py-4 whitespace-nowrap">{bourse.montant ? `${bourse.montant} FCFA` : '-'}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {bourse.date_debut} - {bourse.date_fin}
              </td>
              <td className="px-6 py-4 whitespace-nowrap capitalize">{bourse.statut}</td>
              <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                <Link
                  href={route('admin.bourses.edit', bourse.id)}
                  className="inline-flex items-center gap-1 rounded bg-gray-300 px-3 py-1 text-gray-700 hover:bg-gray-400 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
                >
                  <Edit className="w-4 h-4" /> Éditer
                </Link>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onDelete(bourse.id)}
                  disabled={deletingId === bourse.id}
                  className="inline-flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" />
                  {deletingId === bourse.id ? 'Suppression...' : 'Supprimer'}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Footer({ count }) {
  return (
    <div className="mt-6 flex justify-between items-center">
      <p className="text-sm text-muted-foreground">{count} résultat{count > 1 ? 's' : ''} affiché{count > 1 ? 's' : ''}</p>
      <Button size="sm" variant="outline" className="gap-2">
        <Download className="w-4 h-4" /> Exporter la liste
      </Button>
    </div>
  );
}

Bourses.layout = (page) => <AdminLayout>{page}</AdminLayout>;
