import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Link, usePage } from '@inertiajs/inertia-react';

export default function EcolesCreate() {
  const { errors } = usePage().props;
  const [values, setValues] = useState({
    nom: '', logo: '', promoteur: '', contacts: '', filieres: '', capacite: '', adresse: '', autres: ''
  });

  function handleChange(e) {
    setValues({ ...values, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    Inertia.post(route('admin.ecoles.store'), values);
  }

  return (
    <div className="container mx-auto py-8 max-w-xl">
      <h1 className="text-2xl font-bold mb-6">Ajouter une école partenaire</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-4">
        <Input label="Nom *" name="nom" value={values.nom} onChange={handleChange} error={errors.nom} required />
        <Input label="Logo (URL)" name="logo" value={values.logo} onChange={handleChange} error={errors.logo} />
        <Input label="Promoteur" name="promoteur" value={values.promoteur} onChange={handleChange} error={errors.promoteur} />
        <Input label="Contacts" name="contacts" value={values.contacts} onChange={handleChange} error={errors.contacts} />
        <Input label="Filières (séparées par virgule)" name="filieres" value={values.filieres} onChange={handleChange} error={errors.filieres} />
        <Input label="Capacité d'accueil" name="capacite" value={values.capacite} onChange={handleChange} error={errors.capacite} type="number" />
        <Input label="Adresse" name="adresse" value={values.adresse} onChange={handleChange} error={errors.adresse} />
        <div>
          <label className="block text-sm font-medium text-gray-700">Autres informations</label>
          <textarea name="autres" value={values.autres} onChange={handleChange} className="form-textarea mt-1 block w-full" rows={2} />
          {errors.autres && <div className="text-red-500 text-xs mt-1">{errors.autres}</div>}
        </div>
        <div className="flex justify-between mt-6">
          <Link href={route('admin.ecoles.index')} className="btn btn-secondary">Annuler</Link>
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
