// resources/js/Pages/Student/DossierShow.jsx
import { Head } from "@inertiajs/react";
import StudentLayout from "@/Layouts/StudentLayout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@inertiajs/react";
import { 
  FileText, 
  Download, 
  Eye, 
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  User,
  MapPin,
  BookOpen
} from "lucide-react";

export default function DossierShow({ dossier }) {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepte':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'refuse':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'en_cours':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'accepte':
        return 'Acceptée';
      case 'refuse':
        return 'Refusée';
      case 'en_cours':
        return 'En cours de traitement';
      default:
        return 'En attente';
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'accepte':
        return "success";
      case 'refuse':
        return "destructive";
      case 'en_cours':
        return "default";
      default:
        return "secondary";
    }
  };

  return (
    <>
      <Head title={`Dossier ${dossier.numero_dossier}`} />
      <StudentLayout>
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Dossier {dossier.numero_dossier}
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                  Soumis le {dossier.date_soumission}
                </p>
              </div>
              <div className="flex space-x-2">
                <Link href={route('etudiant.dossiers.index')}>
                  <Button variant="outline">Retour</Button>
                </Link>
                <Button 
                  onClick={() => window.location.href = route('etudiant.dossiers.downloadAll', dossier.id)}
                  className="flex items-center"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Télécharger toutes les pièces
                </Button>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Informations principales */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="mr-2 h-5 w-5" />
                      Informations sur la candidature
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Statut</h3>
                        <div className="mt-1 flex items-center">
                          {getStatusIcon(dossier.statut)}
                          <Badge variant={getStatusVariant(dossier.statut)} className="ml-2">
                            {getStatusText(dossier.statut)}
                          </Badge>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Statut du paiement</h3>
                        <div className="mt-1">
                          <Badge variant={dossier.statut_paiement === 'paye' ? "success" : "secondary"}>
                            {dossier.statut_paiement === 'paye' ? 'Payé' : 'Non payé'}
                          </Badge>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Bourse</h3>
                        <p className="mt-1 text-sm text-gray-900">
                          {dossier.bourse ? dossier.bourse.nom : 'Non spécifiée'}
                        </p>
                        {dossier.bourse && (
                          <p className="text-xs text-gray-500">
                            {dossier.bourse.montant} FCFA
                          </p>
                        )}
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Établissement</h3>
                        <p className="mt-1 text-sm text-gray-900">
                          {dossier.ecole ? dossier.ecole.nom : 'Non spécifiée'}
                        </p>
                        {dossier.ecole && (
                          <p className="text-xs text-gray-500">
                            {dossier.ecole.ville}, {dossier.ecole.pays}
                          </p>
                        )}
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Filière</h3>
                        <p className="mt-1 text-sm text-gray-900">
                          {dossier.filiere ? dossier.filiere.nom : 'Non spécifiée'}
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Date de soumission</h3>
                        <p className="mt-1 text-sm text-gray-900">
                          {dossier.date_soumission}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Pièces jointes */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="mr-2 h-5 w-5" />
                      Pièces jointes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {dossier.pieces.length > 0 ? (
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {dossier.pieces.map((piece) => (
                          <div key={piece.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <p className="font-medium">{piece.nom_piece}</p>
                              <p className="text-sm text-gray-500">{piece.nom_original}</p>
                              <p className="text-xs text-gray-400">
                                {(piece.taille / 1024).toFixed(2)} KB
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(piece.url, '_blank')}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.location.href = route('etudiant.dossiers.downloadPiece', [dossier.id, piece.id])}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <FileText className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune pièce jointe</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Ce dossier ne contient aucune pièce jointe.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Historique des statuts */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calendar className="mr-2 h-5 w-5" />
                      Historique des statuts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {dossier.historique.length > 0 ? (
                      <div className="flow-root">
                        <ul className="-mb-8">
                          {dossier.historique.map((historique, index) => (
                            <li key={historique.id}>
                              <div className="relative pb-8">
                                {index !== dossier.historique.length - 1 ? (
                                  <span
                                    className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                                    aria-hidden="true"
                                  />
                                ) : null}
                                <div className="relative flex space-x-3">
                                  <div>
                                    <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                                      <Calendar className="h-4 w-4 text-white" />
                                    </span>
                                  </div>
                                  <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                    <div>
                                      <p className="text-sm text-gray-900 font-medium">
                                        Changement de statut
                                      </p>
                                      <p className="text-sm text-gray-500">
                                        {historique.statut_precedent 
                                          ? `De "${historique.statut_precedent}" à "${historique.nouveau_statut}"`
                                          : `Initialisé à "${historique.nouveau_statut}"`}
                                      </p>
                                      {historique.commentaire && (
                                        <p className="text-sm text-gray-700 mt-1">
                                          {historique.commentaire}
                                        </p>
                                      )}
                                    </div>
                                    <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                      <p>{historique.date_changement}</p>
                                      {historique.modifie_par && (
                                        <p className="text-xs">Par {historique.modifie_par.name}</p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun historique</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Ce dossier n'a pas encore d'historique de changements.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Colonne de droite - Actions */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      asChild
                    >
                      <Link href={route('etudiant.dossiers.index')}>
                        <FileText className="mr-2 h-4 w-4" />
                        Voir tous mes dossiers
                      </Link>
                    </Button>
                    
                    {dossier.statut_paiement !== 'paye' && (
                      <Button 
                        className="w-full justify-start"
                        asChild
                      >
                        <Link href={route('etudiant.paiement.webview', { dossier: dossier.id })}>
                          <CreditCard className="mr-2 h-4 w-4" />
                          Payer les frais de dossier
                        </Link>
                      </Button>
                    )}
                    
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => window.location.href = route('etudiant.dossiers.downloadAll', dossier.id)}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Télécharger toutes les pièces
                    </Button>
                  </CardContent>
                </Card>

                {/* Informations complémentaires */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Informations complémentaires</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Contactez-nous</h3>
                      <p className="mt-1 text-sm text-gray-900">
                        Pour toute question concernant votre dossier, contactez notre support.
                      </p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Contacter le support
                      </Button>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Besoin d'aide?</h3>
                      <p className="mt-1 text-sm text-gray-900">
                        Consultez notre FAQ pour trouver des réponses à vos questions.
                      </p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Voir la FAQ
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </StudentLayout>
    </>
  );
}