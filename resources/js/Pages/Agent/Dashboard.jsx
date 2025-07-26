import React from 'react';
import AgentLayout from '@/Layouts/AgentLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';

export default function Dashboard({ dossiers, stats }) {
  return (
    <AgentLayout>
      <div className="py-8 px-4 md:px-8">
        {/* Titre principal */}
        <h1 className="text-3xl font-bold mb-6 text-zinc-800 dark:text-white">
          Tableau de bord Agent
        </h1>

        {/* Cartes de statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <Card className="bg-blue-50 dark:bg-blue-900/30">
            <CardHeader><CardTitle className="text-blue-700 dark:text-blue-300">En attente</CardTitle></CardHeader>
            <CardContent><p className="text-4xl font-semibold">{stats.en_attente}</p></CardContent>
          </Card>
          <Card className="bg-green-50 dark:bg-green-900/30">
            <CardHeader><CardTitle className="text-green-700 dark:text-green-300">Validés</CardTitle></CardHeader>
            <CardContent><p className="text-4xl font-semibold">{stats.valides}</p></CardContent>
          </Card>
          <Card className="bg-red-50 dark:bg-red-900/30">
            <CardHeader><CardTitle className="text-red-700 dark:text-red-300">Rejetés</CardTitle></CardHeader>
            <CardContent><p className="text-4xl font-semibold">{stats.rejetes}</p></CardContent>
          </Card>
          <Card className="bg-yellow-50 dark:bg-yellow-900/30">
            <CardHeader><CardTitle className="text-yellow-700 dark:text-yellow-300">Incomplets</CardTitle></CardHeader>
            <CardContent><p className="text-4xl font-semibold">{stats.incomplets}</p></CardContent>
          </Card>
        </div>

        {/* Table des derniers dossiers */}
        <div className="bg-white dark:bg-zinc-800 rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Derniers dossiers reçus</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Étudiant</TableHead>
                <TableHead>Bourse</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dossiers.length === 0 && (
                <TableRow>
                  <TableCell colSpan="5" className="text-center text-zinc-500">
                    Aucun dossier trouvé.
                  </TableCell>
                </TableRow>
              )}
              {dossiers.map((d) => (
                <TableRow key={d.id}>
                  <TableCell>{d.nom} {d.prenom}</TableCell>
                  <TableCell>{d.bourse?.nom || '—'}</TableCell>
                  <TableCell>
                    <span className={
                      d.statut === 'valide' ? 'text-green-600 font-semibold' :
                      d.statut === 'rejete' ? 'text-red-600 font-semibold' :
                      d.statut === 'incomplet' ? 'text-yellow-500 font-semibold' :
                      'text-blue-600 font-semibold'
                    }>
                      {d.statut}
                    </span>
                  </TableCell>
                  <TableCell>{d.date_soumission ? new Date(d.date_soumission).toLocaleDateString('fr-FR') : '—'}</TableCell>
                  <TableCell className="text-center">
                    <Link href={route('agent.dossiers.show', d.id)}>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AgentLayout>
  );
}
