import React from "react";
import PublicLayout from "@/Layouts/PublicLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download } from "lucide-react";

export default function BoursePage() {
  return (
    <PublicLayout>
      <div className="max-w-5xl mx-auto p-6 space-y-12">
        {/* Hero Section */}
        <section className="text-center">
          <h1 className="text-4xl font-bold mb-2">Tout savoir sur les bourses disponibles</h1>
          <p className="text-lg text-gray-600">
            Découvrez les opportunités locales et internationales, leurs avantages et les conditions de candidature.
          </p>
        </section>

        {/* Types de bourses */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Types de bourses disponibles</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Bourses locales</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Ces bourses sont offertes par des institutions nationales pour aider les étudiants méritants ou en difficulté.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Bourses étrangères</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Programmes proposés par des gouvernements ou universités étrangères pour accueillir des étudiants internationaux.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Constitution du dossier */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Constitution du dossier de candidature</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Relevés de notes</li>
            <li>Lettre de motivation</li>
            <li>Pièce d’identité valide</li>
            <li>Certificat de scolarité</li>
            <li>Formulaire de demande (à télécharger ci-dessous)</li>
          </ul>
          <div className="mt-4">
            <Button variant="default">
              <Download className="mr-2 h-4 w-4" /> Télécharger le guide PDF
            </Button>
          </div>
        </section>

        {/* Avantages des bourses */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Pourquoi postuler à une bourse ?</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">🎓 Accès facilité aux études supérieures</h3>
                <p>Réduisez les barrières financières pour poursuivre vos études.</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">💸 Allègement des coûts</h3>
                <p>Profitez d’un soutien financier pour couvrir vos frais de scolarité et de vie.</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">🌐 Ouverture à l’international</h3>
                <p>Étudiez à l’étranger et découvrez de nouvelles cultures.</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">📈 Meilleures opportunités</h3>
                <p>Bénéficiez d’un réseau élargi et de meilleures perspectives professionnelles.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Appel à action final */}
        <section className="text-center mt-8">
          <Button size="lg" className="text-lg px-6 py-3">
            Voir les bourses disponibles
          </Button>
        </section>
      </div>
    </PublicLayout>
  );
}
