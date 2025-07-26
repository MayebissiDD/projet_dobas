import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

export default function EcolesCreate() {
  const { errors } = usePage().props;
  const [values, setValues] = useState({
    nom: '',
    logo: '',
    promoteur: '',
    contacts: '',
    filieres: '',
    capacite: '',
    adresse: '',
    autres: '',
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    Inertia.post(route('admin.ecoles.store'), values);
  }

  return (
    <div className="container mx-auto py-8 max-w-xl">
      <h1 className="text-2xl font-bold mb-6">Ajouter une école partenaire</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-6">
        <Input label="Nom *" name="nom" value={values.nom} onChange={handleChange} error={errors.nom} required />
        <Input label="Logo (URL)" name="logo" value={values.logo} onChange={handleChange} error={errors.logo} />
        <Input label="Promoteur" name="promoteur" value={values.promoteur} onChange={handleChange} error={errors.promoteur} />
        <Input label="Contacts" name="contacts" value={values.contacts} onChange={handleChange} error={errors.contacts} />
        <Input label="Filières (séparées par virgule)" name="filieres" value={values.filieres} onChange={handleChange} error={errors.filieres} />
        <Input label="Capacité d'accueil" name="capacite" value={values.capacite} onChange={handleChange} error={errors.capacite} type="number" />
        <Input label="Adresse" name="adresse" value={values.adresse} onChange={handleChange} error={errors.adresse} />
        <Textarea label="Autres informations" name="autres" value={values.autres} onChange={handleChange} error={errors.autres} rows={3} />
        <div className="flex justify-between mt-8">
          <Link href={route('admin.ecoles.index')} className="btn btn-secondary">
            Annuler
          </Link>
          <Button type="submit" variant="primary">
            Enregistrer
          </Button>
        </div>
      </form>
    </div>
  );
}

function Input({ label, name, value, onChange, error, type = 'text', ...props }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
        {label}
      </label>
      <input
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        className={`form-input mt-1 block w-full rounded-md border px-3 py-2
          dark:bg-zinc-700 dark:text-white dark:border-zinc-600
          ${error ? 'border-red-500' : 'border-gray-300'}
          focus:border-blue-500 focus:ring focus:ring-blue-200`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function Textarea({ label, name, value, onChange, error, rows = 3 }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-zinc-300">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        className={`form-textarea mt-1 block w-full rounded-md border px-3 py-2
          dark:bg-zinc-700 dark:text-white dark:border-zinc-600
          ${error ? 'border-red-500' : 'border-gray-300'}
          focus:border-blue-500 focus:ring focus:ring-blue-200`}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
