import AgentLayout from '@/Layouts/AgentLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function Dashboard({ dossiers }) {
  return (
    <AgentLayout>
      <h1 className="text-3xl font-bold mb-6">Tableau de bord agent</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Dossiers en attente</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold">{dossiers.filter(d => d.statut === 'en attente').length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Dossiers acceptés</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold">{dossiers.filter(d => d.statut === 'accepté').length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Dossiers rejetés</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold">{dossiers.filter(d => d.statut === 'rejeté').length}</p>
          </CardContent>
        </Card>
      </div>
    </AgentLayout>
  );
}
