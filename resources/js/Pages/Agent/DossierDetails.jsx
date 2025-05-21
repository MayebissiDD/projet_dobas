import { Head, Link } from "@inertiajs/react"
import AgentLayout from "@/Layouts/AgentLayout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DossierDetails({ dossier }) {
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

            <div className="mt-4 space-x-2">
              <Button variant="success">Valider</Button>
              <Button variant="destructive">Rejeter</Button>
              <Button variant="outline">Affecter à un établissement</Button>
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
