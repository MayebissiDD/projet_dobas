import React from "react";
import PublicLayout from "@/Layouts/PublicLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, School, Calendar, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@inertiajs/react";

export default function BoursesList({ bourses }) {
  return (
    <PublicLayout>
      <div className="max-w-5xl mx-auto p-6 space-y-12">
        <h1 className="text-3xl font-bold mb-4 text-center text-green-700 dark:text-yellow-400">Bourses et aides scolaires</h1>
        <div className="mb-8 text-center text-zinc-700 dark:text-zinc-200 max-w-3xl mx-auto">
          <p>
            Retrouvez ici toutes les bourses locales, étrangères et aides scolaires accessibles via la DOBAS. Chaque fiche détaille les conditions, les pièces à fournir et le processus de candidature. Les informations sont mises à jour régulièrement selon les offres et les recommandations officielles.
          </p>
          <p className="mt-2">
            <strong>Types de bourses :</strong> bourses d’excellence, bourses sociales, aides à la mobilité, bourses étrangères, etc. Pour chaque bourse, vérifiez bien les critères d’éligibilité et préparez l’ensemble des documents demandés.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {bourses.length === 0 && <div className="text-center text-zinc-500 dark:text-zinc-300">Aucune bourse disponible actuellement.</div>}
          {bourses.map(bourse => (
            <Card key={bourse.id} className="bg-white dark:bg-zinc-800 border shadow hover:shadow-lg transition group">
              <CardHeader className="flex flex-row items-center gap-3">
                <Award className="w-8 h-8 text-green-700 dark:text-yellow-400 group-hover:scale-110 transition-transform" />
                <CardTitle className="text-xl font-semibold text-green-700 dark:text-yellow-400">{bourse.nom}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-2 text-zinc-700 dark:text-zinc-200">{bourse.description}</div>
                <div className="mb-1 font-bold flex items-center gap-2"><Users className="w-4 h-4" /> Montant : {bourse.montant ? bourse.montant + ' FCFA' : '-'}</div>
                <div className="mb-1 flex items-center gap-2"><Calendar className="w-4 h-4" /> Période : {bourse.date_debut} - {bourse.date_fin}</div>
                <div className="mb-1 flex items-center gap-2"><School className="w-4 h-4" /> Écoles éligibles : {bourse.ecoles_eligibles?.join(', ') || '-'}</div>
                <div className="mb-1 flex items-center gap-2"><span className="font-bold">Filières :</span> {bourse.filieres_eligibles?.join(', ') || '-'}</div>
                {/* Diplômes dynamiques */}
                {bourse.diplomes_eligibles && (
                  <div className="mb-1 flex items-center gap-2">
                    <span className="font-bold">Diplômes :</span> {bourse.diplomes_eligibles.join(', ')}
                  </div>
                )}
                {/* Pièces à fournir dynamiques */}
                {bourse.pieces_a_fournir && bourse.pieces_a_fournir.length > 0 && (
                  <div className="mb-1 flex items-center gap-2">
                    <span className="font-bold">Pièces à fournir :</span>
                    <ul className="list-disc ml-6">
                      {bourse.pieces_a_fournir.map((piece, idx) => (
                        <li key={idx}>{piece}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {/* Bloc paiement */}
                <div className="mt-4 flex items-center gap-2">
                  <span className="font-bold text-green-700 dark:text-yellow-400">Frais de dossier :</span>
                  <span>{bourse.frais_dossier ? bourse.frais_dossier + ' FCFA' : 'Inclus'}</span>
                </div>
                <div className="mt-6 flex justify-end">
                  <Link href={`/postuler?bourse=${bourse.id}`}>
                    <Button className="bg-green-700 hover:bg-green-800 text-white font-semibold px-5 py-2 rounded flex items-center gap-2 shadow">
                      Postuler <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PublicLayout>
  );
}
