// resources/js/Pages/Student/Dossiers/Index.jsx
import { Head } from "@inertiajs/react";
import StudentLayout from "@/Layouts/StudentLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@inertiajs/react";
import { 
  FileText, 
  Plus, 
  Eye, 
  Download,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle
} from "lucide-react";

export default function Dossiers({ dossiers }) {
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
      <Head title="Mes candidatures" />
      <StudentLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mes candidatures</h1>
              <p className="mt-1 text-sm text-gray-600">
                Suivez l'état de vos candidatures aux bourses
              </p>
            </div>
            <Link href="/postuler">
              <Button className="flex items-center">
                <Plus className="mr-2 h-4 w-4" />
                Nouvelle candidature
              </Button>
            </Link>
          </div>

          {dossiers.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {dossiers.map((dossier) => (
                <Card key={dossier.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="mb-4 md:mb-0">
                        <div className="flex items-center">
                          {getStatusIcon(dossier.statut)}
                          <h3 className="ml-2 text-lg font-semibold text-gray-900">
                            {dossier.bourse}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {dossier.ecole} - {dossier.filiere}
                        </p>
                        <div className="flex items-center mt-2 text-sm text-gray-500">
                          <span className="font-medium">N° {dossier.numero_dossier}</span>
                          <span className="mx-2">•</span>
                          <span>Soumis le {dossier.date_soumission}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col md:items-end space-y-2">
                        <div className="flex space-x-2">
                          <Badge variant={getStatusVariant(dossier.statut)}>
                            {getStatusText(dossier.statut)}
                          </Badge>
                          <Badge variant={dossier.statut_paiement === 'paye' ? "success" : "outline"}>
                            {dossier.statut_paiement === 'paye' ? 'Payé' : 'Non payé'}
                          </Badge>
                        </div>
                        
                        <div className="flex space-x-2 mt-2">
                          <Link href={`/etudiant/dossiers/${dossier.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="mr-1 h-4 w-4" />
                              Détails
                            </Button>
                          </Link>
                          
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.location.href = `/etudiant/dossiers/${dossier.id}/download-all`}
                          >
                            <Download className="mr-1 h-4 w-4" />
                            Télécharger
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune candidature</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Vous n'avez pas encore soumis de candidature.
                </p>
                <div className="mt-6">
                  <Link href="/postuler">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Postuler maintenant
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </StudentLayout>
    </>
  );
}