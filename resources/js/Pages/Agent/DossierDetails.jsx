import { Head, Link } from "@inertiajs/react"
import AgentLayout from "@/Layouts/AgentLayout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import AffectationEcoleForm from './AffectationEcoleForm';

export default function DossierDetails({ dossier, schools }) {
  return (
    <>
      <Head title="Détails du dossier" />
      <AgentLayout>
        <Card>
          <CardHeader>
            <CardTitle>Détails du dossier de {dossier.nom}</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Bourse :</strong> {dossier.bourse}</p>
            <p><strong>Email :</strong> {dossier.email}</p>
            <p><strong>Statut :</strong> <Badge>{dossier.statut}</Badge></p>

            <div className="mt-6">
              <h3 className="font-semibold mb-2">Choix de l'étudiant :</h3>
              {dossier.choix_ecoles && JSON.parse(dossier.choix_ecoles).map((choix, i) => (
                <div key={i} className="mb-2 p-2 border rounded">
                  <div><strong>École #{i+1} :</strong> {schools.find(s => s.id == choix.ecole)?.nom || 'Non renseigné'}</div>
                  <div><strong>Options :</strong> {(choix.options || []).join(', ')}</div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <h3 className="font-semibold mb-2">Affectation à un établissement</h3>
              <AffectationEcoleForm dossier={dossier} schools={schools} />
            </div>

            <div className="mt-4 space-x-2">
              <Button variant="success">Valider</Button>
              <Button variant="destructive">Rejeter</Button>
            </div>
          </CardContent>
        </Card>
        <Link href="/agent/dossiers">
          <Button variant="ghost" className="mt-4">← Retour</Button>
        </Link>
      </AgentLayout>
    </>
  )
}
