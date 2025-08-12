// resources/js/Pages/Student/Dashboard.jsx
import { Head } from "@inertiajs/react";
import StudentLayout from "@/Layouts/StudentLayout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@inertiajs/react";
import { 
  FileText, 
  Bell, 
  CreditCard, 
  CheckCircle, 
  Clock, 
  XCircle, 
  AlertCircle,
  Eye
} from "lucide-react";

export default function Dashboard({ 
  dossiers = [], 
  stats = {}, 
  paiements = [], 
  notifications = [],
  unreadNotifications = 0 
}) {
  return (
    <>
      <Head title="Tableau de bord étudiant" />
      <StudentLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
            <p className="mt-1 text-sm text-gray-600">
              Bienvenue sur votre espace de suivi des candidatures
            </p>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="rounded-full bg-blue-100 p-3">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="rounded-full bg-yellow-100 p-3">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">En attente</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.en_attente}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="rounded-full bg-purple-100 p-3">
                    <AlertCircle className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">En cours</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.en_cours}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="rounded-full bg-green-100 p-3">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Acceptés</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.acceptes}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="rounded-full bg-red-100 p-3">
                    <XCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Refusés</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.refuses}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Dernières candidatures */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium">Mes candidatures</CardTitle>
                <Link href="/etudiant/dossiers">
                  <Button variant="outline" size="sm">Voir tout</Button>
                </Link>
              </CardHeader>
              <CardContent>
                {dossiers.length > 0 ? (
                  <div className="space-y-4">
                    {dossiers.map((dossier) => (
                      <div key={dossier.id} className="flex items-center justify-between border-b pb-3">
                        <div>
                          <p className="font-medium">{dossier.bourse}</p>
                          <p className="text-sm text-gray-500">{dossier.ecole} - {dossier.filiere}</p>
                          <p className="text-xs text-gray-400">N° {dossier.numero_dossier} • {dossier.date_soumission}</p>
                        </div>
                        <div className="flex flex-col items-end">
                          <Badge 
                            variant={
                              dossier.statut === 'accepte' ? "success" : 
                              dossier.statut === 'refuse' ? "destructive" : 
                              dossier.statut === 'en_cours' ? "default" : "secondary"
                            }
                          >
                            {dossier.statut === 'accepte' ? 'Acceptée' : 
                             dossier.statut === 'refuse' ? 'Refusée' : 
                             dossier.statut === 'en_cours' ? 'En cours' : 'En attente'}
                          </Badge>
                          <Badge 
                            variant={dossier.statut_paiement === 'paye' ? "success" : "outline"}
                            className="mt-1"
                          >
                            {dossier.statut_paiement === 'paye' ? 'Payé' : 'Non payé'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune candidature</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Vous n'avez pas encore soumis de candidature.
                    </p>
                    <div className="mt-6">
                      <Link href="/postuler">
                        <Button>Postuler maintenant</Button>
                      </Link>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Dernières notifications */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  Notifications
                  {unreadNotifications > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </CardTitle>
                <Link href="/etudiant/notifications">
                  <Button variant="outline" size="sm">Voir tout</Button>
                </Link>
              </CardHeader>
              <CardContent>
                {notifications.length > 0 ? (
                  <div className="space-y-4">
                    {notifications.map((notification) => (
                      <div 
                        key={notification.id} 
                        className={`p-3 rounded-lg border ${notification.read_at ? 'bg-white' : 'bg-blue-50 border-blue-200'}`}
                      >
                        <div className="flex justify-between">
                          <p className={`font-medium ${notification.read_at ? 'text-gray-900' : 'text-blue-700'}`}>
                            {notification.message}
                          </p>
                          {!notification.read_at && (
                            <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{notification.created_at}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Bell className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune notification</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Vous n'avez aucune notification pour le moment.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Derniers paiements */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <CreditCard className="mr-2 h-5 w-5" />
                Mes paiements
              </CardTitle>
              <Link href="/etudiant/paiements">
                <Button variant="outline" size="sm">Voir tout</Button>
              </Link>
            </CardHeader>
            <CardContent>
              {paiements.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Référence
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Montant
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Méthode
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Statut
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {paiements.map((paiement) => (
                        <tr key={paiement.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {paiement.reference}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {paiement.montant} FCFA
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {paiement.methode}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge 
                              variant={paiement.statut === 'effectué' ? "success" : "secondary"}
                            >
                              {paiement.statut}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {paiement.date_paiement}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-6">
                  <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun paiement</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Vous n'avez effectué aucun paiement pour le moment.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </StudentLayout>
    </>
  );
}