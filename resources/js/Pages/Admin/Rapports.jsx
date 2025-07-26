import AdminLayout from '@/Layouts/AdminLayout';
import { router } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FileDown, PieChart as PieIcon, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export default function Rapports({ logs = [], filters = {} }) {
  const [from, setFrom] = useState(filters.from || '');
  const [to, setTo] = useState(filters.to || '');

  const handleGenerate = () => {
    if (from && to) {
      router.get(route('admin.rapports.logs'), { from, to }, { preserveScroll: true });
    }
  };

  // Préparation des données graphiques
  const pieData = useMemo(() => ([
    { name: 'Créations', value: logs.filter(l => l.action.includes('create')).length, color: '#16a34a' },
    { name: 'Suppressions', value: logs.filter(l => l.action.includes('delete')).length, color: '#eab308' },
    { name: 'Mises à jour', value: logs.filter(l => l.action.includes('update')).length, color: '#0ea5e9' },
    { name: 'Consultations', value: logs.filter(l => l.action.includes('view')).length, color: '#6366f1' },
  ]), [logs]);

  const barData = useMemo(() => {
    return logs.reduce((acc, log) => {
      const month = new Date(log.created_at).toLocaleString('fr-FR', { month: 'short', year: 'numeric' });
      const found = acc.find(b => b.name === month);
      if (found) found.actions++;
      else acc.push({ name: month, actions: 1 });
      return acc;
    }, []);
  }, [logs]);

  return (
    <div className="min-h-screen py-10 px-6 md:px-20 bg-gradient-to-br from-white via-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800 text-zinc-900 dark:text-white">
      
      {/* Titre principal */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">📑 Rapports d'activité</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Visualisation, exportation et suivi des opérations sur la plateforme.
        </p>
      </motion.div>

      {/* Filtres de dates */}
      <div className="flex flex-col md:flex-row gap-4 items-center mb-10">
        <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="w-full md:w-1/3" />
        <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="w-full md:w-1/3" />
        <Button onClick={handleGenerate} disabled={!from || !to} className="w-full md:w-auto bg-green-700 hover:bg-green-800">
          Générer un rapport
        </Button>
      </div>

      {/* Boutons d'export */}
      <div className="flex gap-4 mb-12">
        <Button
          as="a"
          href={route('admin.rapports.logs.csv', { from, to })}
          target="_blank"
          variant="outline"
          className="border-blue-600 text-blue-700 hover:bg-blue-600 hover:text-white"
        >
          Exporter CSV
        </Button>
        <Button
          as="a"
          href={route('admin.rapports.logs.pdf', { from, to })}
          target="_blank"
          variant="outline"
          className="border-red-600 text-red-700 hover:bg-red-600 hover:text-white"
        >
          Exporter PDF
        </Button>
      </div>

      {/* Graphiques */}
      <motion.div
        className="grid md:grid-cols-2 gap-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {/* Pie Chart */}
        <div className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-xl">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <PieIcon className="w-5 h-5 text-green-600" /> Répartition des actions
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#f3f4f6', borderRadius: '0.5rem' }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-xl">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" /> Actions par mois
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData} barSize={35}>
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: '#f3f4f6', borderRadius: '0.5rem' }} />
              <Legend />
              <Bar dataKey="actions" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Logs d'activité */}
      <div className="mt-16">
        <h2 className="text-xl font-semibold mb-4">📂 Logs d'activité</h2>
        <div className="overflow-x-auto bg-white dark:bg-zinc-800 rounded-xl shadow">
          <table className="min-w-full text-sm">
            <thead className="bg-zinc-100 dark:bg-zinc-700">
              <tr>
                <th className="px-4 py-2 text-left">#</th>
                <th className="px-4 py-2">Utilisateur</th>
                <th className="px-4 py-2">Action</th>
                <th className="px-4 py-2">Objet</th>
                <th className="px-4 py-2">Description</th>
                <th className="px-4 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center text-zinc-500 py-8">
                    Aucun log d'activité disponible.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr
                    key={log.id}
                    className="border-t dark:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition"
                  >
                    <td className="px-4 py-2">#{log.id}</td>
                    <td className="text-center">{log.user?.name || 'Système'}</td>
                    <td className="text-center">{log.action}</td>
                    <td className="text-center">{log.subject_type?.split('\\').pop() || '-'}</td>
                    <td className="text-center">{log.description}</td>
                    <td className="text-center">{new Date(log.created_at).toLocaleString('fr-FR')}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

Rapports.layout = (page) => <AdminLayout>{page}</AdminLayout>;
