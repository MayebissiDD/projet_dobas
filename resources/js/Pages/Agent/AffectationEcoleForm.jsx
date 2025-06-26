import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';

export default function AffectationEcoleForm({ dossier, schools }) {
  const [selected, setSelected] = useState({
    school_id: '',
    filiere: ''
  });
  const [error, setError] = useState('');

  function handleSchoolChange(e) {
    setSelected({ ...selected, school_id: e.target.value, filiere: '' });
  }

  function handleFiliereChange(e) {
    setSelected({ ...selected, filiere: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!selected.school_id || !selected.filiere) {
      setError('Veuillez sélectionner une école et une filière.');
      return;
    }
    Inertia.post(route('agent.dossiers.affecter', dossier.id), selected);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-6">
      <div>
        <label className="block font-medium mb-1">École d'affectation</label>
        <select value={selected.school_id} onChange={handleSchoolChange} className="form-select w-full">
          <option value="">Sélectionner une école</option>
          {schools.map(s => (
            <option key={s.id} value={s.id} disabled={s.placesRestantes <= 0}>
              {s.nom} (places restantes : {s.placesRestantes})
            </option>
          ))}
        </select>
      </div>
      {selected.school_id && (
        <div>
          <label className="block font-medium mb-1">Filière</label>
          <select value={selected.filiere} onChange={handleFiliereChange} className="form-select w-full">
            <option value="">Sélectionner une filière</option>
            {(schools.find(s => s.id == selected.school_id)?.filieres || '').split(',').map((f, i) => (
              <option key={i} value={f.trim()}>{f.trim()}</option>
            ))}
          </select>
        </div>
      )}
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <button type="submit" className="btn btn-primary">Affecter</button>
    </form>
  );
}
