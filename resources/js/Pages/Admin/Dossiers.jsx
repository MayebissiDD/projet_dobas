import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Edit, Trash2, Download, Users, CheckCircle2, XCircle, Clock } from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Pagination } from '@/components/ui/pagination';
import { usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Dossiers({ dossiers }) {
  const { flash = {} } = usePage().props;
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedDossier, setSelectedDossier] = useState(null);

  // Extraction des dossiers dynamiques
  const dossierList = dossiers?.data || [];

  const filtered = dossierList.filter(d =>
    (!statusFilter || d.statut === statusFilter) &&
    (d.etudiant?.nom + ' ' + d.etudiant?.prenom).toLowerCase().includes(search.toLowerCase())
  );

  // Stats rapides
  const totalAcceptes = dossierList.filter(d => d.statut === 'accepté').length;
  const totalRejetes = dossierList.filter(d => d.statut === 'rejeté').length;
  const totalEnAttente = dossierList.filter(d => d.statut === 'en attente').length;

  // Statistiques pour les graphiques
  const chartData = [
    { name: 'Accepté', value: totalAcceptes, color: '#22c55e' },
    { name: 'Rejeté', value: totalRejetes, color: '#ef4444' },
    { name: 'En attente', value: totalEnAttente, color: '#facc15' },
  ];

  return (
    <div className="min-h-screen py-10 px-6 md:px-12 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
      {/* Messages flash */}
      {flash.success && (
        <div className="mb-4 p-3 rounded bg-green-100 text-green-800 border border-green-300">
          {flash.success}
        </div>
      )}
      {flash.error && (
        <div className="mb-4 p-3 rounded bg-red-100 text-red-800 border border-red-300">
          {flash.error}
        </div>
      )}

      {/* Titre */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Users className="w-7 h-7 text-blue-600" /> Gestion des Candidatures
        </h1>
        <p className="text-muted-foreground">Suivi des dossiers soumis sur la plateforme.</p>
      </motion.div>

      {/* Stats rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {[
          ['Acceptés', totalAcceptes, 'bg-green-100 text-green-700', CheckCircle2],
          ['Rejetés', totalRejetes, 'bg-red-100 text-red-700', XCircle],
          ['En attente', totalEnAttente, 'bg-yellow-100 text-yellow-700', Clock],
        ].map(([title, value, color, Icon], i) => (
          <Card key={i} className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{title}</CardTitle>
              <Icon className={`w-5 h-5 ${color.split(' ')[1]}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${color.split(' ')[1]}`}>{value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Graphiques */}
      <motion.div
        className="grid md:grid-cols-2 gap-8 mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader><CardTitle>Répartition des candidatures</CardTitle></CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Évolution mensuelle</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filtres */}
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

      {/* Tableau */}
      <div className="overflow-x-auto bg-white dark:bg-zinc-800 rounded-xl shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-zinc-100 dark:bg-zinc-700">
            <tr>
              <th className="px-4 py-2 text-left">Étudiant</th>
              <th className="px-4 py-2">Bourse</th>
              <th className="px-4 py-2">Statut</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center text-zinc-500 py-4">
                  Aucun dossier trouvé.
                </td>
              </tr>
            )}
            {filtered.map(d => (
              <tr key={d.id} className="border-t dark:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-700">
                <td className="px-4 py-2">{d.etudiant?.nom} {d.etudiant?.prenom}</td>
                <td className="text-center">{d.bourse?.nom}</td>
                <td className="text-center">
                  <span className={
                    d.statut === 'accepté' ? 'text-green-600 font-semibold' :
                    d.statut === 'rejeté' ? 'text-red-600 font-semibold' :
                    'text-yellow-500 font-semibold'
                  }>
                    {d.statut}
                  </span>
                </td>
                <td className="text-center">{d.date_soumission ? new Date(d.date_soumission).toLocaleDateString('fr-FR') : ''}</td>
                <td className="flex items-center justify-center gap-2 py-2">
                  {/* Détails */}
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
                      {selectedDossier && (
                        <div>
                          <p><strong>Étudiant:</strong> {selectedDossier.etudiant?.nom} {selectedDossier.etudiant?.prenom}</p>
                          <p><strong>Bourse:</strong> {selectedDossier.bourse?.nom}</p>
                          <p><strong>Statut:</strong> {selectedDossier.statut}</p>
                          <p><strong>Date de soumission:</strong> {selectedDossier.date_soumission ? new Date(selectedDossier.date_soumission).toLocaleDateString('fr-FR') : ''}</p>
                          <div className="mt-4">
                            <h4 className="font-semibold mb-2">Pièces et justificatifs</h4>
                            {selectedDossier.pieces && selectedDossier.pieces.length > 0 ? (
                              <ul className="list-disc ml-6">
                                {selectedDossier.pieces.map((piece) => (
                                  <li key={piece.id}>
                                    {piece.nom_piece} :
                                    {piece.url_fichier ? (
                                      <a href={piece.url_fichier} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline ml-2">Voir le fichier</a>
                                    ) : (
                                      <span className="text-zinc-400 ml-2">Aucun fichier</span>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <span className="text-zinc-400">Aucune pièce jointe</span>
                            )}
                          </div>
                        </div>
                      )}
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

      {/* Pagination */}
      <div className="mt-6">
        <Pagination totalPages={dossiers?.last_page || 1} currentPage={dossiers?.current_page || 1} onPageChange={() => {}} />
      </div>
    </div>
  );
}

Dossiers.layout = page => <AdminLayout>{page}</AdminLayout>;
