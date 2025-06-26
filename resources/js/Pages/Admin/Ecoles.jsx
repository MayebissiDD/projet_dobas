import React from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Link, usePage } from '@inertiajs/inertia-react';
import AdminLayout from "@/Layouts/AdminLayout"

export default function Ecoles({ schools }) {
  const { flash } = usePage().props;

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Écoles partenaires</h1>
        <Link href={route('admin.ecoles.create')} className="btn btn-primary">Ajouter une école</Link>
      </div>
      {flash.success && <div className="alert alert-success mb-4">{flash.success}</div>}
      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Logo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Promoteur</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contacts</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Filières</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Capacité</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Adresse</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Autres</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {schools.data.map((school) => (
              <tr key={school.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {school.logo && <img src={school.logo} alt={school.nom} className="h-10 w-10 object-contain rounded" />}
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-semibold">{school.nom}</td>
                <td className="px-6 py-4 whitespace-nowrap">{school.promoteur}</td>
                <td className="px-6 py-4 whitespace-nowrap">{school.contacts}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <ul className="list-disc pl-4">
                    {(school.filieres || '').split(',').map((f, i) => f.trim() && <li key={i}>{f.trim()}</li>)}
                  </ul>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{school.capacite}</td>
                <td className="px-6 py-4 whitespace-nowrap">{school.adresse}</td>
                <td className="px-6 py-4 whitespace-nowrap">{school.autres}</td>
                <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                  <Link href={route('admin.ecoles.edit', school.id)} className="btn btn-sm btn-secondary">Éditer</Link>
                  <button onClick={() => handleDelete(school.id)} className="btn btn-sm btn-danger">Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="mt-4 flex justify-end">
        {/* Ajoutez ici la pagination si besoin */}
      </div>
    </div>
  );

  function handleDelete(id) {
    if (confirm('Supprimer cette école ?')) {
      Inertia.delete(route('admin.ecoles.destroy', id));
    }
  }
}

Ecoles.layout = page => <AdminLayout>{page}</AdminLayout>
