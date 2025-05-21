import { Head } from "@inertiajs/react";
import StudentLayout from "@/Layouts/StudentLayout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard({ candidatures = [] }) {
  return (
    <>
      <Head title="Tableau de bord étudiant" />
      <StudentLayout>
        <h1 className="text-2xl font-bold mb-6">Bienvenue sur votre tableau de bord</h1>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Vos candidatures</CardTitle>
          </CardHeader>
          <CardContent>
            {candidatures.length > 0 ? (
              <ul className="space-y-2">
                {candidatures.map((item, index) => (
                  <li key={index} className="flex justify-between items-center border-b py-2">
                    <span>{item.bourse}</span>
                    <Badge variant={item.statut === 'acceptée' ? "success" : "outline"}>
                      {item.statut}
                    </Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Aucune candidature trouvée.</p>
            )}
          </CardContent>
        </Card>
      </StudentLayout>
    </>
  );
}
