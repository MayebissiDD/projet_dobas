import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Link, usePage } from '@inertiajs/inertia-react';

export default function BoursesCreate() {
  const { errors } = usePage().props;
  const [values, setValues] = useState({
    nom: '', description: '', montant: '', date_debut: '', date_fin: '', ecoles_eligibles: [], filieres_eligibles: [], statut: 'active'
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  }

  function handleArrayChange(e, key) {
    setValues({ ...values, [key]: e.target.value.split(',').map(v => v.trim()) });
  }

  function handleSubmit(e) {
    e.preventDefault();
    Inertia.post(route('admin.bourses.store'), values);
  }

  return (
    <div className="container mx-auto py-8 max-w-xl">
      <h1 className="text-2xl font-bold mb-6">Ajouter une bourse</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-4">
        <Input label="Nom *" name="nom" value={values.nom} onChange={handleChange} error={errors.nom} required />
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea name="description" value={values.description} onChange={handleChange} className="form-textarea mt-1 block w-full" rows={2} />
          {errors.description && <div className="text-red-500 text-xs mt-1">{errors.description}</div>}
        </div>
        <Input label="Montant (FCFA)" name="montant" value={values.montant} onChange={handleChange} error={errors.montant} type="number" />
        <Input label="Date début" name="date_debut" value={values.date_debut} onChange={handleChange} error={errors.date_debut} type="date" />
        <Input label="Date fin" name="date_fin" value={values.date_fin} onChange={handleChange} error={errors.date_fin} type="date" />
        <Input label="Écoles éligibles (IDs séparés par virgule)" name="ecoles_eligibles" value={values.ecoles_eligibles.join(',')} onChange={e => handleArrayChange(e, 'ecoles_eligibles')} error={errors.ecoles_eligibles} />
        <Input label="Filières éligibles (séparées par virgule)" name="filieres_eligibles" value={values.filieres_eligibles.join(',')} onChange={e => handleArrayChange(e, 'filieres_eligibles')} error={errors.filieres_eligibles} />
        <div>
          <label className="block text-sm font-medium text-gray-700">Statut</label>
          <select name="statut" value={values.statut} onChange={handleChange} className="form-select mt-1 block w-full">
            <option value="active">Active</option>
            <option value="archivee">Archivée</option>
          </select>
          {errors.statut && <div className="text-red-500 text-xs mt-1">{errors.statut}</div>}
        </div>
        <div className="flex justify-between mt-6">
          <Link href={route('admin.bourses.index')} className="btn btn-secondary">Annuler</Link>
          <button type="submit" className="btn btn-primary">Enregistrer</button>
        </div>
      </form>
    </div>
  );
}

function Input({ label, name, value, onChange, error, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input name={name} value={value} onChange={onChange} className="form-input mt-1 block w-full" {...props} />
      {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
    </div>
  );
}
