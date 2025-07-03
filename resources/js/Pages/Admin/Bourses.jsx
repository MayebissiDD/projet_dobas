import AdminLayout from '@/Layouts/AdminLayout';
import { Inertia } from '@inertiajs/inertia';
import { Link, usePage } from '@inertiajs/inertia-react';
import { Button } from '@/components/ui/button';
import { Plus, Download } from 'lucide-react';

export default function Bourses({ bourses }) {
  const { flash } = usePage().props;
  return (
    <div className="min-h-screen py-10 px-6 md:px-20 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-1">🎓 Gestion des Bourses</h1>
            <p className="text-muted-foreground">Liste des bourses proposées sur la plateforme.</p>
          </div>
          <Link href={route('admin.bourses.create')} className="btn btn-primary gap-2">
            <Plus className="w-4 h-4" /> Ajouter une bourse
          </Link>
        </div>
      </div>

      {flash.success && <div className="alert alert-success mb-4">{flash.success}</div>}

      <div className="overflow-x-auto bg-white dark:bg-zinc-800 rounded-xl shadow">
        <table className="min-w-full text-sm divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Période</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bourses.data.map((bourse) => (
              <tr key={bourse.id}>
                <td className="px-6 py-4 whitespace-nowrap font-semibold">{bourse.nom}</td>
                <td className="px-6 py-4 whitespace-nowrap">{bourse.montant ? bourse.montant + ' FCFA' : '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap">{bourse.date_debut} - {bourse.date_fin}</td>
                <td className="px-6 py-4 whitespace-nowrap">{bourse.statut}</td>
                <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                  <Link href={route('admin.bourses.edit', bourse.id)} className="btn btn-sm btn-secondary">Éditer</Link>
                  <button onClick={() => handleDelete(bourse.id)} className="btn btn-sm btn-danger">Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-6">
        <p className="text-sm text-muted-foreground">{bourses.data.length} résultats affichés</p>
        <Button size="sm" variant="outline" className="gap-2">
          <Download className="w-4 h-4" /> Exporter la liste
        </Button>
      </div>
    </div>
  );

  function handleDelete(id) {
    if (confirm('Supprimer cette bourse ?')) {
      Inertia.delete(route('admin.bourses.destroy', id));
    }
  }
}

Bourses.layout = page => <AdminLayout>{page}</AdminLayout>;

