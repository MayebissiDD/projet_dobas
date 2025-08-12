// resources/js/Pages/Student/Paiements.jsx
import { Head } from "@inertiajs/react";
import StudentLayout from "@/Layouts/StudentLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@inertiajs/react";
import { 
  CreditCard, 
  RefreshCw, 
  CheckCircle, 
  Clock, 
  XCircle,
  FileText
} from "lucide-react";

export default function Paiements({ paiements }) {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'effectué':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'échoué':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'effectué':
        return "success";
      case 'échoué':
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <>
      <Head title="Mes paiements" />
      <StudentLayout>
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Mes paiements</h1>
                <p className="mt-1 text-sm text-gray-600">
                  Historique de vos paiements de candidature
                </p>
              </div>
              <Button variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Actualiser
              </Button>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="mr-2 h-5 w-5" />
                  Historique des paiements
                </CardTitle>
              </CardHeader>
              <CardContent>
                {paiements.data.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Référence
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Dossier
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
                        {paiements.data.map((paiement) => (
                          <tr key={paiement.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {paiement.reference}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <Link 
                                href={route('etudiant.dossiers.show', paiement.dossier.id)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                {paiement.dossier.numero_dossier}
                              </Link>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {paiement.montant} FCFA
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {paiement.methode}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                {getStatusIcon(paiement.statut)}
                                <Badge variant={getStatusVariant(paiement.statut)} className="ml-2">
                                  {paiement.statut}
                                </Badge>
                              </div>
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
                  <div className="text-center py-12">
                    <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun paiement</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Vous n'avez effectué aucun paiement pour le moment.
                    </p>
                    <div className="mt-6">
                      <Link href={route('etudiant.dossiers.index')}>
                        <Button>
                          <FileText className="mr-2 h-4 w-4" />
                          Voir mes dossiers
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </StudentLayout>
    </>
  );
}