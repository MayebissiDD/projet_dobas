import React, { useState, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, Pie, Line } from 'react-chartjs-2';
import 'chart.js/auto';
import AdminLayout from '@/Layouts/AdminLayout';
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  DollarSign,
  Users,
  GraduationCap,
  School,
  Layers
} from 'lucide-react';

export default function DashboardStats({
  stats,
  parEcole,
  parFiliere,
  parMois,
  bourses = [],
  selectedBourse = '',
  totals = { users: 0, ecoles: 0, bourses: 0, filieres: 0 } // <- Nouveaux totaux
}) {
  const { url } = usePage();
  const [filters, setFilters] = useState({
    from: '',
    to: '',
    statut: '',
    school_id: '',
    bourse_id: selectedBourse || '',
  });

  useEffect(() => {
    const params = new URLSearchParams(
      Object.entries(filters).filter(([, v]) => v !== '')
    ).toString();
    router.get(`/admin/stats?${params}`, {}, { preserveState: true, replace: true });
  }, [filters]);

  const handleExportCsv = () => {
    const params = new URLSearchParams(filters).toString();
    window.open(`/admin/stats/export-csv?${params}`, '_blank');
  };

  DashboardStats.layout = (page) => <AdminLayout>{page}</AdminLayout>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-extrabold text-green-700 mb-6 flex items-center gap-2">
        <TrendingUp className="w-7 h-7 text-green-600" /> Statistiques Générales
      </h1>

      {/* Filtres */}
      <div className="flex flex-wrap gap-4 mb-6 bg-gray-50 p-4 rounded-lg shadow-sm border">
        {['from', 'to'].map((field, i) => (
          <div key={i} className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <input
              type="date"
              value={filters[field]}
              onChange={e => setFilters(f => ({ ...f, [field]: e.target.value }))}
              className="border rounded-md px-3 py-2 text-sm focus:ring focus:ring-green-300"
              placeholder={field === 'from' ? 'Du' : 'Au'}
            />
          </div>
        ))}

        <select
          value={filters.statut}
          onChange={e => setFilters(f => ({ ...f, statut: e.target.value }))}
          className="border rounded-md px-3 py-2 text-sm focus:ring focus:ring-green-300"
        >
          <option value="">Tous statuts</option>
          <option value="accepté">Accepté</option>
          <option value="validé">Validé</option>
          <option value="rejeté">Rejeté</option>
          <option value="en attente">En attente</option>
        </select>

        <select
          value={filters.bourse_id}
          onChange={e => setFilters(f => ({ ...f, bourse_id: e.target.value }))}
          className="border rounded-md px-3 py-2 text-sm focus:ring focus:ring-green-300"
        >
          <option value="">Toutes les bourses</option>
          {bourses.map(b => <option key={b.id} value={b.id}>{b.nom}</option>)}
        </select>

        <button
          className="bg-green-600 hover:bg-green-700 text-white rounded-md px-4 py-2 text-sm transition"
          onClick={handleExportCsv}
        >
          Exporter CSV
        </button>
      </div>

      {/* Nouveaux Totaux (Utilisateurs, Écoles, Bourses, Filières) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          ['Utilisateurs', totals.users, <Users className="w-6 h-6 text-green-700" />, 'bg-green-50'],
          ['Écoles Partenaires', totals.ecoles, <School className="w-6 h-6 text-blue-700" />, 'bg-blue-50'],
          ['Bourses Disponibles', totals.bourses, <GraduationCap className="w-6 h-6 text-indigo-700" />, 'bg-indigo-50'],
          ['Filières', totals.filieres, <Layers className="w-6 h-6 text-orange-700" />, 'bg-orange-50'],
        ].map(([title, value, Icon, bg], i) => (
          <Card key={i} className={`shadow-md ${bg}`}>
            <CardHeader className="flex items-center gap-2">
              {Icon} <CardTitle className="text-lg">{title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Statistiques Candidatures */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          ['Total candidatures', stats.total, <TrendingUp className="w-6 h-6 text-green-600" />, 'bg-green-50'],
          ['Acceptées', stats.acceptes, <CheckCircle2 className="w-6 h-6 text-green-700" />, 'bg-green-50'],
          ['Validées', stats.valides, <CheckCircle2 className="w-6 h-6 text-blue-700" />, 'bg-blue-50'],
          ['Rejetées', stats.rejetes, <XCircle className="w-6 h-6 text-red-700" />, 'bg-red-50'],
          ['En attente', stats.en_attente, <Clock className="w-6 h-6 text-yellow-700" />, 'bg-yellow-50'],
          ['Paiements reçus', `${stats.paiements} FCFA`, <DollarSign className="w-6 h-6 text-indigo-700" />, 'bg-indigo-50'],
        ].map(([title, value, Icon, bg], i) => (
          <Card key={i} className={`shadow-md ${bg}`}>
            <CardHeader className="flex items-center gap-2">
              {Icon} <CardTitle className="text-lg">{title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Card className="shadow-lg border border-green-100">
          <CardHeader><CardTitle>Répartition par école</CardTitle></CardHeader>
          <CardContent>
            <Bar data={{
              labels: parEcole.map(e => e.nom),
              datasets: [{ label: 'Affectations', data: parEcole.map(e => e.dossiers_count), backgroundColor: '#10b981' }]
            }} />
            <div className="mt-4 text-sm text-gray-500">
              {parEcole.map(e => `${e.nom}: ${e.taux_remplissage || 0}%`).join(' | ')}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-lg border border-green-100">
          <CardHeader><CardTitle>Répartition par filière</CardTitle></CardHeader>
          <CardContent>
            <Pie data={{
              labels: parFiliere.map(f => f.filiere),
              datasets: [{
                data: parFiliere.map(f => f.total),
                backgroundColor: ['#10b981', '#f59e42', '#3b82f6', '#ef4444', '#fbbf24', '#6366f1']
              }]
            }} />
          </CardContent>
        </Card>
      </div>

      {/* Évolution des candidatures */}
      <Card className="shadow-lg border border-green-100">
        <CardHeader><CardTitle>Évolution des candidatures</CardTitle></CardHeader>
        <CardContent>
          <Line data={{
            labels: parMois.map(m => m.mois),
            datasets: [{
              label: 'Candidatures',
              data: parMois.map(m => m.total),
              borderColor: '#10b981',
              backgroundColor: 'rgba(16,185,129,0.2)',
              tension: 0.3,
            }]
          }} />
        </CardContent>
      </Card>
    </div>
  );
}
