import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function Paiements({ paiements = [], filters = {} }) {
  const [statut, setStatut] = useState(filters.statut || '');
  const [methode, setMethode] = useState(filters.methode || '');

  const handleFilter = () => {
    window.location = `?statut=${statut}&methode=${methode}`;
  };

  return (
    <div className="min-h-screen py-10 px-6 md:px-20 bg-gradient-to-br from-white via-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800 text-zinc-900 dark:text-white">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          💳 Paiements reçus
        </h1>
        <p className="text-muted-foreground">Suivi et gestion de tous les paiements de la plateforme.</p>
      </motion.div>
      <div className="flex gap-4 mb-6">
        <Input placeholder="Statut" value={statut} onChange={e => setStatut(e.target.value)} className="w-40" />
        <Input placeholder="Méthode" value={methode} onChange={e => setMethode(e.target.value)} className="w-40" />
        <Button onClick={handleFilter}>Filtrer</Button>
      </div>
      <div className="overflow-x-auto bg-white dark:bg-zinc-800 rounded-xl shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-zinc-100 dark:bg-zinc-700">
            <tr>
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Étudiant</th>
              <th className="px-4 py-2">Dossier</th>
              <th className="px-4 py-2">Montant</th>
              <th className="px-4 py-2">Statut</th>
              <th className="px-4 py-2">Méthode</th>
              <th className="px-4 py-2">Référence</th>
              <th className="px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {paiements.data?.map((p) => (
              <tr key={p.id} className="border-t dark:border-zinc-600">
                <td className="px-4 py-2">#{p.id}</td>
                <td className="text-center">{p.etudiant?.nom || '-'}</td>
                <td className="text-center">{p.dossier?.id || '-'}</td>
                <td className="text-center">{p.montant} FCFA</td>
                <td className="text-center">{p.statut}</td>
                <td className="text-center">{p.methode}</td>
                <td className="text-center">{p.reference}</td>
                <td className="text-center">{p.paid_at ? new Date(p.paid_at).toLocaleString('fr-FR') : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

Paiements.layout = (page) => <AdminLayout>{page}</AdminLayout>;
