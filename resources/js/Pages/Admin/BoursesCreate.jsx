import AdminLayout from '@/Layouts/AdminLayout';
import { Inertia } from '@inertiajs/inertia';
import { useState } from 'react';
import { usePage, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

import { Input, Textarea } from './FormComponents'; // ou copier directement les composants ci-dessus

export default function BoursesCreate() {
  const { errors } = usePage().props;
  const [values, setValues] = useState({
    nom: '',
    description: '',
    montant: '',
    date_debut: '',
    date_fin: '',
    ecoles_eligibles: [],
    filieres_eligibles: [],
    statut: 'active',
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  function handleArrayChange(e, key) {
    const arr = e.target.value.split(',').map((v) => v.trim());
    setValues((prev) => ({ ...prev, [key]: arr }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    Inertia.post(route('admin.bourses.store'), values);
  }

  return (
    <div className="container mx-auto py-8 max-w-xl">
      <h1 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-white">Ajouter une bourse</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-zinc-800 shadow rounded-lg p-6 space-y-6"
        noValidate
      >
        <Input
          label="Nom *"
          name="nom"
          value={values.nom}
          onChange={handleChange}
          error={errors.nom}
          required
        />

        <Textarea
          label="Description"
          name="description"
          value={values.description}
          onChange={handleChange}
          error={errors.description}
          rows={3}
        />

        <Input
          label="Montant (FCFA)"
          name="montant"
          type="number"
          value={values.montant}
          onChange={handleChange}
          error={errors.montant}
        />

        <Input
          label="Date début"
          name="date_debut"
          type="date"
          value={values.date_debut}
          onChange={handleChange}
          error={errors.date_debut}
        />

        <Input
          label="Date fin"
          name="date_fin"
          type="date"
          value={values.date_fin}
          onChange={handleChange}
          error={errors.date_fin}
        />

        <Input
          label="Écoles éligibles (IDs séparés par virgule)"
          name="ecoles_eligibles"
          value={values.ecoles_eligibles.join(', ')}
          onChange={(e) => handleArrayChange(e, 'ecoles_eligibles')}
          error={errors.ecoles_eligibles}
        />

        <Input
          label="Filières éligibles (séparées par virgule)"
          name="filieres_eligibles"
          value={values.filieres_eligibles.join(', ')}
          onChange={(e) => handleArrayChange(e, 'filieres_eligibles')}
          error={errors.filieres_eligibles}
        />

        <div>
          <label
            htmlFor="statut"
            className="block text-sm font-medium text-gray-700 dark:text-zinc-300"
          >
            Statut
          </label>
          <select
            id="statut"
            name="statut"
            value={values.statut}
            onChange={handleChange}
            className="form-select mt-1 block w-full rounded-md border px-3 py-2
              dark:bg-zinc-700 dark:text-white dark:border-zinc-600
              focus:border-blue-500 focus:ring focus:ring-blue-200"
          >
            <option value="active">Active</option>
            <option value="archivee">Archivée</option>
          </select>
          {errors.statut && <p className="mt-1 text-xs text-red-500">{errors.statut}</p>}
        </div>

        <div className="flex justify-between mt-6">
          <Link
            href={route('admin.bourses.index')}
            className="inline-block rounded border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-700"
          >
            Annuler
          </Link>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
            Enregistrer
          </Button>
        </div>
      </form>
    </div>
  );
}

BoursesCreate.layout = (page) => <AdminLayout>{page}</AdminLayout>;
