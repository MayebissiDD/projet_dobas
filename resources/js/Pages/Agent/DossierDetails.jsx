import { Head, Link, usePage, router } from "@inertiajs/react";
import AgentLayout from "@/Layouts/AgentLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AffectationEcoleForm from './AffectationEcoleForm';

export default function DossierDetails({ dossier, ecoles }) {
  const { flash } = usePage().props;

  const handleValider = () => {
    router.post(`/agent/dossiers/${dossier.id}/valider`, {}, { preserveScroll: true });
  };

  const handleRejeter = () => {
    const motif = prompt('Motif du rejet (optionnel) :');
    router.post(`/agent/dossiers/${dossier.id}/rejeter`, { motif }, { preserveScroll: true });
  };

  return (
    <>
      <Head title={`Dossier - ${dossier.nom}`} />
      <AgentLayout>
        <div className="space-y-4">
          {/* Flash messages */}
          {flash.success && (
            <div className="p-3 rounded bg-green-100 text-green-800 border border-green-300">
              {flash.success}
            </div>
          )}
          {flash.error && (
            <div className="p-3 rounded bg-red-100 text-red-800 border border-red-300">
              {flash.error}
            </div>
          )}

          {/* Détails du dossier */}
          <Card>
            <CardHeader>
              <CardTitle>Dossier de {dossier.nom} {dossier.prenom}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p><strong>Bourse :</strong> {dossier.bourse?.nom}</p>
              <p><strong>Email :</strong> {dossier.email}</p>
              <p><strong>Statut :</strong> <Badge>{dossier.statut}</Badge></p>

              {/* Pièces jointes */}
              <div>
                <h3 className="font-semibold mb-2">Pièces et justificatifs</h3>
                {dossier.pieces?.length > 0 ? (
                  <ul className="list-disc ml-6 space-y-1">
                    {dossier.pieces.map((piece) => (
                      <li key={piece.id}>
                        {piece.nom_piece} :
                        {piece.url_fichier ? (
                          <a href={piece.url_fichier} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline ml-2">
                            Voir le fichier
                          </a>
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

              {/* Choix de l'étudiant */}
              <div>
                <h3 className="font-semibold mb-2">Choix de l'étudiant :</h3>
                {dossier.choix_ecoles && JSON.parse(dossier.choix_ecoles).map((choix, i) => (
                  <div key={i} className="mb-2 p-2 border rounded bg-zinc-50 dark:bg-zinc-800">
                    <div><strong>École #{i + 1} :</strong> {ecoles.find(e => e.id == choix.ecole)?.nom || 'Non renseigné'}</div>
                    <div><strong>Options :</strong> {(choix.options || []).join(', ')}</div>
                  </div>
                ))}
              </div>

              {/* Affectation */}
              <div>
                <h3 className="font-semibold mb-2">Affectation à un établissement</h3>
                <AffectationEcoleForm dossier={dossier} ecoles={ecoles} />
              </div>

              {/* Boutons d'action */}
              <div className="flex gap-2">
                <Button variant="success" onClick={handleValider}>Valider</Button>
                <Button variant="destructive" onClick={handleRejeter}>Rejeter</Button>
              </div>
            </CardContent>
          </Card>

          {/* Retour */}
          <Link href={route('agent.dossiers.index')}>
            <Button variant="ghost" className="mt-4">← Retour</Button>
          </Link>
        </div>
      </AgentLayout>
    </>
  );
}
