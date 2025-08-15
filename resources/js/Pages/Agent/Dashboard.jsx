import React from 'react';
import AgentLayout from '@/Layouts/AgentLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, Activity, Users, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
export default function Dashboard({ dossiers, stats, recentActivities }) {
  // Fonction pour obtenir la couleur du statut
  const getStatusColor = (status) => {
    switch (status) {
      case 'en_attente': return 'text-blue-600 bg-blue-100';
      case 'en_cours': return 'text-yellow-600 bg-yellow-100';
      case 'accepte': return 'text-green-600 bg-green-100';
      case 'valide': return 'text-purple-600 bg-purple-100';
      case 'rejete': return 'text-red-600 bg-red-100';
      case 'incomplet': return 'text-orange-600 bg-orange-100';
      case 'reoriente': return 'text-indigo-600 bg-indigo-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Fonction pour formater la date
  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <AgentLayout>
      <div className="py-8 px-4 md:px-8">
        {/* Titre principal */}
        <h1 className="text-3xl font-bold mb-6 text-zinc-800 dark:text-white">
          Tableau de bord Agent
        </h1>
        
        {/* Cartes de statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Card className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800">
            <CardHeader className="pb-2"><CardTitle className="text-blue-700 dark:text-blue-300 flex items-center">
              <FileText className="w-5 h-5 mr-2" /> En attente
            </CardTitle></CardHeader>
            <CardContent><p className="text-4xl font-semibold">{stats.en_attente}</p></CardContent>
          </Card>
          
          <Card className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800">
            <CardHeader className="pb-2"><CardTitle className="text-yellow-700 dark:text-yellow-300 flex items-center">
              <Activity className="w-5 h-5 mr-2" /> En cours
            </CardTitle></CardHeader>
            <CardContent><p className="text-4xl font-semibold">{stats.en_cours}</p></CardContent>
          </Card>
          
          <Card className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800">
            <CardHeader className="pb-2"><CardTitle className="text-green-700 dark:text-green-300 flex items-center">
              <FileText className="w-5 h-5 mr-2" /> Acceptés
            </CardTitle></CardHeader>
            <CardContent><p className="text-4xl font-semibold">{stats.accepte}</p></CardContent>
          </Card>
          
          <Card className="bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800">
            <CardHeader className="pb-2"><CardTitle className="text-purple-700 dark:text-purple-300 flex items-center">
              <FileText className="w-5 h-5 mr-2" /> Validés
            </CardTitle></CardHeader>
            <CardContent><p className="text-4xl font-semibold">{stats.valide}</p></CardContent>
          </Card>
          
          <Card className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800">
            <CardHeader className="pb-2"><CardTitle className="text-red-700 dark:text-red-300 flex items-center">
              <FileText className="w-5 h-5 mr-2" /> Rejetés
            </CardTitle></CardHeader>
            <CardContent><p className="text-4xl font-semibold">{stats.rejete}</p></CardContent>
          </Card>
          
          <Card className="bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800">
            <CardHeader className="pb-2"><CardTitle className="text-orange-700 dark:text-orange-300 flex items-center">
              <FileText className="w-5 h-5 mr-2" /> Incomplets
            </CardTitle></CardHeader>
            <CardContent><p className="text-4xl font-semibold">{stats.incomplets}</p></CardContent>
          </Card>
          
          <Card className="bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800">
            <CardHeader className="pb-2"><CardTitle className="text-indigo-700 dark:text-indigo-300 flex items-center">
              <FileText className="w-5 h-5 mr-2" /> Réorientés
            </CardTitle></CardHeader>
            <CardContent><p className="text-4xl font-semibold">{stats.reoriente || 0}</p></CardContent>
          </Card>
          
          <Card className="bg-gray-50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-800">
            <CardHeader className="pb-2"><CardTitle className="text-gray-700 dark:text-gray-300 flex items-center">
              <Users className="w-5 h-5 mr-2" /> Total
            </CardTitle></CardHeader>
            <CardContent><p className="text-4xl font-semibold">{stats.total}</p></CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Table des derniers dossiers */}
          <div className="bg-white dark:bg-zinc-800 rounded-xl shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Derniers dossiers reçus</h2>
              <Link href={route('agent.dossiers.index')}>
                <Button variant="outline" size="sm">Voir tout</Button>
              </Link>
            </div>
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
                    <TableCell className="font-medium">
                      {d.etudiant?.nom} {d.etudiant?.prenom}
                    </TableCell>
                    <TableCell>{d.bourse?.nom || '—'}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(d.statut)}>
                        {d.statut}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(d.created_at)}</TableCell>
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
          
          {/* Activités récentes */}
          <div className="bg-white dark:bg-zinc-800 rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Activités récentes</h2>
            {recentActivities && recentActivities.length > 0 ? (
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start p-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
                    <div className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-full p-2 mr-3">
                      <Activity className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(activity.created_at).toLocaleString('fr-FR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-zinc-500 py-4">
                Aucune activité récente
              </p>
            )}
          </div>
        </div>
      </div>
    </AgentLayout>
  );
}