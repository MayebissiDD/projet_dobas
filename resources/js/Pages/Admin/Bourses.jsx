import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Eye, Edit, Trash2, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

const sampleBourses = [
  { id: 1, titre: 'Bourse Excellence France', type: 'Master', pays: 'France', statut: 'Publiée', deadline: '2024-08-15' },
  { id: 2, titre: 'Bourse Doctorale Canada', type: 'Doctorat', pays: 'Canada', statut: 'Fermée', deadline: '2024-04-01' },
  { id: 3, titre: 'Programme Erasmus+', type: 'Licence', pays: 'Belgique', statut: 'Publiée', deadline: '2024-10-10' },
];

export default function Bourses() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');

  const filtered = sampleBourses.filter(b =>
    (!filter || b.type === filter) &&
    b.titre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen py-10 px-6 md:px-20 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-1">🎓 Gestion des Bourses</h1>
            <p className="text-muted-foreground">Liste des bourses proposées sur la plateforme.</p>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" /> Ajouter une bourse
          </Button>
        </div>
      </motion.div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <Input
          placeholder="Rechercher une bourse..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3"
        />
        <select
          className="px-3 py-2 border rounded-md dark:bg-zinc-800"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">Tous les types</option>
          <option value="Licence">Licence</option>
          <option value="Master">Master</option>
          <option value="Doctorat">Doctorat</option>
        </select>
      </div>

      <div className="overflow-x-auto bg-white dark:bg-zinc-800 rounded-xl shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-zinc-100 dark:bg-zinc-700">
            <tr>
              <th className="px-4 py-2 text-left">Titre</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Pays</th>
              <th className="px-4 py-2">Deadline</th>
              <th className="px-4 py-2">Statut</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(b => (
              <tr key={b.id} className="border-t dark:border-zinc-600">
                <td className="px-4 py-2">{b.titre}</td>
                <td className="text-center">{b.type}</td>
                <td className="text-center">{b.pays}</td>
                <td className="text-center">{format(new Date(b.deadline), 'dd/MM/yyyy')}</td>
                <td className="text-center">
                  <span className={
                    b.statut === 'Publiée' ? 'text-green-600 font-medium' :
                    b.statut === 'Fermée' ? 'text-red-600 font-medium' : 'text-zinc-500'}>
                    {b.statut}
                  </span>
                </td>
                <td className="flex justify-center gap-2 py-2">
                  <Button size="sm" variant="outline"><Eye className="w-4 h-4" /></Button>
                  <Button size="sm" variant="outline"><Edit className="w-4 h-4" /></Button>
                  <Button size="sm" variant="destructive"><Trash2 className="w-4 h-4" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-6">
        <p className="text-sm text-muted-foreground">{filtered.length} résultats affichés</p>
        <Button size="sm" variant="outline" className="gap-2">
          <Download className="w-4 h-4" /> Exporter la liste
        </Button>
      </div>
    </div>
  );
}

Bourses.layout = page => <AdminLayout>{page}</AdminLayout>;
