import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Link, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Plus } from 'lucide-react';

export default function Ecoles({ ecoles }) {
  const { flash = {} } = usePage().props;
  const [deletingId, setDeletingId] = useState(null);

  function handleDelete(id) {
    if (confirm('Supprimer cette école ?')) {
      setDeletingId(id);
      Inertia.delete(route('admin.ecoles.destroy', id), {
        onFinish: () => setDeletingId(null),
      });
    }
  }

  return (
    <div className="min-h-screen py-10 px-6 md:px-20 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
      <Header />
      {flash.success && (
        <div className="mb-6 rounded border border-green-400 bg-green-50 p-4 text-green-700">
          {flash.success}
        </div>
      )}
      <EcolesTable ecoles={ecoles} onDelete={handleDelete} deletingId={deletingId} />
    </div>
  );
}

function Header() {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold">Écoles partenaires</h1>
      <Link
        href={route('admin.ecoles.create')}
        className="inline-flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        <Plus className="w-5 h-5" /> Ajouter une école
      </Link>
    </div>
  );
}

function EcolesTable({ ecoles, onDelete, deletingId }) {
  if (!ecoles?.data?.length) {
    return (
      <div className="py-12 text-center text-zinc-500 bg-white dark:bg-zinc-800 rounded-xl shadow">
        Aucune école disponible.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white dark:bg-zinc-800 rounded-xl shadow">
      <table className="min-w-full text-sm divide-y divide-gray-200 dark:divide-zinc-700">
        <thead className="bg-gray-50 dark:bg-zinc-700">
          <tr>
            {[
              'Logo',
              'Nom',
              'Promoteur',
              'Contacts',
              'Filières',
              'Capacité',
              'Adresse',
              'Autres',
              'Actions',
            ].map((header) => (
              <th
                key={header}
                className="px-6 py-3 text-left font-semibold text-gray-500 uppercase dark:text-zinc-300"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-zinc-700">
          {ecoles.data.map((ecole) => (
            <tr key={ecole.id} className="hover:bg-gray-100 dark:hover:bg-zinc-700">
              <td className="px-6 py-4">
                {ecole.logo ? (
                  <img
                    src={ecole.logo}
                    alt={ecole.nom}
                    className="h-10 w-10 object-contain rounded"
                    loading="lazy"
                  />
                ) : (
                  <div className="h-10 w-10 bg-gray-200 dark:bg-zinc-600 rounded flex items-center justify-center text-xs text-gray-400">
                    N/A
                  </div>
                )}
              </td>
              <td className="px-6 py-4 font-semibold">{ecole.nom}</td>
              <td className="px-6 py-4">{ecole.promoteur}</td>
              <td className="px-6 py-4">{ecole.contacts}</td>
              <td className="px-6 py-4 max-w-xs">
                <ul className="list-disc pl-5 space-y-0.5 max-h-24 overflow-auto">
                  {(ecole.filieres || '')
                    .split(',')
                    .map((f) => f.trim())
                    .filter(Boolean)
                    .map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                </ul>
              </td>
              <td className="px-6 py-4">{ecole.capacite}</td>
              <td className="px-6 py-4 max-w-xs truncate">{ecole.adresse}</td>
              <td className="px-6 py-4 max-w-xs truncate">{ecole.autres}</td>
              <td className="px-6 py-4 flex gap-2 whitespace-nowrap">
                <Link
                  href={route('admin.ecoles.edit', ecole.id)}
                  className="inline-flex items-center gap-1 rounded bg-gray-300 px-3 py-1 text-gray-700 hover:bg-gray-400 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
                >
                  <Edit className="w-4 h-4" /> Éditer
                </Link>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onDelete(ecole.id)}
                  disabled={deletingId === ecole.id}
                  className="inline-flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" />
                  {deletingId === ecole.id ? 'Suppression...' : 'Supprimer'}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

Ecoles.layout = (page) => <AdminLayout>{page}</AdminLayout>;
