import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';

export default function AffectationEcoleForm({ dossier, ecoles }) {
  const [selected, setSelected] = useState({
    ecole_id: '',
    filiere: ''
  });
  const [error, setError] = useState('');

  function handleEcoleChange(e) {
    setSelected({ ...selected, ecole_id: e.target.value, filiere: '' });
  }

  function handleFiliereChange(e) {
    setSelected({ ...selected, filiere: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!selected.ecole_id || !selected.filiere) {
      setError('Veuillez sélectionner une école et une filière.');
      return;
    }
    Inertia.post(route('agent.dossiers.affecter', dossier.id), selected);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-6">
      <div>
        <label className="block font-medium mb-1">École d'affectation</label>
        <select value={selected.ecole_id} onChange={handleEcoleChange} className="form-select w-full">
          <option value="">Sélectionner une école</option>
          {ecoles.map(e => (
            <option key={e.id} value={e.id} disabled={e.placesRestantes <= 0}>
              {e.nom} (places restantes : {e.placesRestantes})
            </option>
          ))}
        </select>
      </div>
      {selected.ecole_id && (
        <div>
          <label className="block font-medium mb-1">Filière</label>
          <select value={selected.filiere} onChange={handleFiliereChange} className="form-select w-full">
            <option value="">Sélectionner une filière</option>
            {(ecoles.find(e => e.id == selected.ecole_id)?.filieres || '').split(',').map((f, i) => (
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
