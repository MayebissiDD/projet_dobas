import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, Pie, Line } from 'react-chartjs-2';
import 'chart.js/auto';

export default function DashboardStats({ stats, parEcole, parFiliere, parMois, bourses = [], selectedBourse = '' }) {
  const [filters, setFilters] = useState({ from: '', to: '', statut: '', school_id: '', bourse_id: selectedBourse || '' });

  function handleExportCsv() {
    const params = new URLSearchParams(filters).toString();
    window.open(`/admin/stats/export-csv?${params}`, '_blank');
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Statistiques générales</h1>
      <div className="flex gap-4 mb-6">
        <input type="date" value={filters.from} onChange={e => setFilters(f => ({ ...f, from: e.target.value }))} className="form-input" placeholder="Du" />
        <input type="date" value={filters.to} onChange={e => setFilters(f => ({ ...f, to: e.target.value }))} className="form-input" placeholder="Au" />
        <select value={filters.statut} onChange={e => setFilters(f => ({ ...f, statut: e.target.value }))} className="form-select">
          <option value="">Tous statuts</option>
          <option value="accepté">Accepté</option>
          <option value="validé">Validé</option>
          <option value="rejeté">Rejeté</option>
          <option value="en attente">En attente</option>
        </select>
        <select value={filters.bourse_id} onChange={e => setFilters(f => ({ ...f, bourse_id: e.target.value }))} className="form-select">
          <option value="">Toutes les bourses</option>
          {bourses.map(b => <option key={b.id} value={b.id}>{b.nom}</option>)}
        </select>
        <button className="btn btn-outline" onClick={handleExportCsv}>Exporter CSV</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card><CardHeader><CardTitle>Total candidatures</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold">{stats.total}</div></CardContent></Card>
        <Card><CardHeader><CardTitle>Acceptées</CardTitle></CardHeader><CardContent><div className="text-3xl text-green-600 font-bold">{stats.acceptes}</div></CardContent></Card>
        <Card><CardHeader><CardTitle>Validées</CardTitle></CardHeader><CardContent><div className="text-3xl text-blue-600 font-bold">{stats.valides}</div></CardContent></Card>
        <Card><CardHeader><CardTitle>Rejetées</CardTitle></CardHeader><CardContent><div className="text-3xl text-red-600 font-bold">{stats.rejetes}</div></CardContent></Card>
        <Card><CardHeader><CardTitle>En attente</CardTitle></CardHeader><CardContent><div className="text-3xl text-yellow-600 font-bold">{stats.en_attente}</div></CardContent></Card>
        <Card><CardHeader><CardTitle>Paiements reçus</CardTitle></CardHeader><CardContent><div className="text-3xl text-indigo-600 font-bold">{stats.paiements} FCFA</div></CardContent></Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader><CardTitle>Répartition par école</CardTitle></CardHeader>
          <CardContent>
            <Bar data={{
              labels: parEcole.map(e => e.nom),
              datasets: [{
                label: 'Affectations',
                data: parEcole.map(e => e.dossiers_count),
                backgroundColor: '#6366f1',
              }]
            }} />
            <div className="mt-4 text-sm text-gray-500">Taux de remplissage : {parEcole.map(e => `${e.nom}: ${e.taux_remplissage || 0}%`).join(' | ')}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Répartition par filière</CardTitle></CardHeader>
          <CardContent>
            <Pie data={{
              labels: parFiliere.map(f => f.filiere_affectee),
              datasets: [{
                data: parFiliere.map(f => f.total),
                backgroundColor: ['#6366f1', '#f59e42', '#10b981', '#ef4444', '#fbbf24', '#3b82f6'],
              }]
            }} />
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader><CardTitle>Évolution des candidatures</CardTitle></CardHeader>
        <CardContent>
          <Line data={{
            labels: parMois.map(m => m.mois),
            datasets: [{
              label: 'Candidatures',
              data: parMois.map(m => m.total),
              borderColor: '#6366f1',
              backgroundColor: 'rgba(99,102,241,0.2)',
              tension: 0.3,
            }]
          }} />
        </CardContent>
      </Card>
    </div>
  );
}
