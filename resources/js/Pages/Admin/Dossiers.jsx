import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Eye, Edit, Trash2, Download } from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Pagination } from '@/components/ui/pagination';

const sampleDossiers = [
  { id: 1, etudiant: 'Jean M.', ecole: 'Université A', statut: 'accepté', date: '2024-01-12' },
  { id: 2, etudiant: 'Claire B.', ecole: 'Université B', statut: 'rejeté', date: '2024-02-18' },
  { id: 3, etudiant: 'Teddy N.', ecole: 'Université C', statut: 'en attente', date: '2024-03-05' },
];

const chartData = [
  { name: 'Accepté', value: 90, color: '#22c55e' },
  { name: 'Rejeté', value: 30, color: '#ef4444' },
  { name: 'En attente', value: 20, color: '#facc15' },
];

export default function Dossiers() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedDossier, setSelectedDossier] = useState(null);

  const filtered = sampleDossiers.filter(d =>
    (!statusFilter || d.statut === statusFilter) &&
    d.etudiant.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen py-10 px-6 md:px-20 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
      

       <motion.div
        className="grid md:grid-cols-2 gap-8 mt-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">📊 Répartition des candidatures</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">📈 Évolution mensuelle</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
      
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <h1 className="text-3xl font-bold mb-2">📋 Liste des candidatures</h1>
        <p className="text-muted-foreground">Suivi des dossiers soumis sur la plateforme.</p>
      </motion.div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <Input
          placeholder="Rechercher un étudiant..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3"
        />
        <select
          className="px-3 py-2 border rounded-md dark:bg-zinc-800"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Tous les statuts</option>
          <option value="accepté">Accepté</option>
          <option value="rejeté">Rejeté</option>
          <option value="en attente">En attente</option>
        </select>
      </div>

      <div className="overflow-x-auto bg-white dark:bg-zinc-800 rounded-xl shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-zinc-100 dark:bg-zinc-700">
            <tr>
              <th className="px-4 py-2 text-left">Étudiant</th>
              <th className="px-4 py-2">École</th>
              <th className="px-4 py-2">Statut</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(d => (
              <tr key={d.id} className="border-t dark:border-zinc-600">
                <td className="px-4 py-2">{d.etudiant}</td>
                <td className="text-center">{d.ecole}</td>
                <td className="text-center">
                  <span className={
                    d.statut === 'accepté' ? 'text-green-600 font-semibold' :
                    d.statut === 'rejeté' ? 'text-red-600 font-semibold' :
                    'text-yellow-500 font-semibold'
                  }>
                    {d.statut}
                  </span>
                </td>
                <td className="text-center">{d.date}</td>
                <td className="flex items-center justify-center gap-2 py-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline" onClick={() => setSelectedDossier(d)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Détails de la candidature</DialogTitle>
                      </DialogHeader>
                      <p><strong>Étudiant:</strong> {selectedDossier?.etudiant}</p>
                      <p><strong>École:</strong> {selectedDossier?.ecole}</p>
                      <p><strong>Statut:</strong> {selectedDossier?.statut}</p>
                      <p><strong>Date:</strong> {selectedDossier?.date}</p>
                      <Button className="mt-4" variant="secondary">
                        <Download className="w-4 h-4 mr-2" /> Télécharger le dossier
                      </Button>
                    </DialogContent>
                  </Dialog>
                  <Button size="sm" variant="outline"><Edit className="w-4 h-4" /></Button>
                  <Button size="sm" variant="destructive"><Trash2 className="w-4 h-4" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <Pagination totalPages={5} currentPage={1} onPageChange={() => {}} />
      </div>

     </div>
  );
}

Dossiers.layout = page => <AdminLayout>{page}</AdminLayout>;
