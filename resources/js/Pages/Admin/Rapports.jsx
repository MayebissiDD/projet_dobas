import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileDown, PieChart as PieIcon, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell
} from 'recharts';

const rapportData = [
  { id: 1, periode: 'Jan 2024', date: '2024-02-01', filename: 'rapport_janvier.pdf' },
  { id: 2, periode: 'Fév 2024', date: '2024-03-01', filename: 'rapport_fevrier.pdf' },
  { id: 3, periode: 'Mars 2024', date: '2024-04-01', filename: 'rapport_mars.pdf' },
];

const pieData = [
  { name: 'Créations', value: 50, color: '#16a34a' },
  { name: 'Rejets', value: 30, color: '#dc2626' },
  { name: 'Suppressions', value: 20, color: '#eab308' },
];

const barData = [
  { name: 'Jan', candidatures: 35 },
  { name: 'Fév', candidatures: 42 },
  { name: 'Mars', candidatures: 48 },
  { name: 'Avr', candidatures: 53 },
];

export default function Rapports() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const handleGenerate = () => {
    if (from && to) {
      alert(`Rapport demandé du ${from} au ${to}`);
    }
  };

  return (
    <div className="min-h-screen py-10 px-6 md:px-20 bg-gradient-to-br from-white via-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800 text-zinc-900 dark:text-white">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <h1 className="text-4xl font-bold mb-1 flex items-center gap-2">📑 Rapports d'activité</h1>
        <p className="text-zinc-600 dark:text-zinc-400">Visualisation, exportation et suivi des opérations sur la plateforme.</p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-4 items-center mb-12">
        <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="w-full md:w-1/3" />
        <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="w-full md:w-1/3" />
        <Button onClick={handleGenerate} disabled={!from || !to} className="w-full md:w-auto bg-green-700 hover:bg-green-800">
          Générer un rapport
        </Button>
      </div>

      <motion.div className="grid md:grid-cols-2 gap-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
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

        <div className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-xl">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" /> Progression des candidatures
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData} barSize={35}>
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: '#f3f4f6', borderRadius: '0.5rem' }} />
              <Legend />
              <Bar dataKey="candidatures" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <div className="mt-16">
        <h2 className="text-xl font-semibold mb-4">📂 Rapports générés</h2>
        <div className="overflow-x-auto bg-white dark:bg-zinc-800 rounded-xl shadow">
          <table className="min-w-full text-sm">
            <thead className="bg-zinc-100 dark:bg-zinc-700">
              <tr>
                <th className="px-4 py-2 text-left">#</th>
                <th className="px-4 py-2">Période</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Téléchargement</th>
              </tr>
            </thead>
            <tbody>
              {rapportData.map((r) => (
                <tr key={r.id} className="border-t dark:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition">
                  <td className="px-4 py-2">#{r.id}</td>
                  <td className="text-center">{r.periode}</td>
                  <td className="text-center">{r.date}</td>
                  <td className="text-center">
                    <Button size="sm" variant="outline" className="flex items-center gap-1 text-green-700 border-green-600 hover:bg-green-600 hover:text-white">
                      <FileDown className="w-4 h-4" /> PDF
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

Rapports.layout = (page) => <AdminLayout>{page}</AdminLayout>;
