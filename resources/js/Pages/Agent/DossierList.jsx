import { Head, Link, router } from "@inertiajs/react";
import AgentLayout from "@/Layouts/AgentLayout";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select, SelectTrigger, SelectItem, SelectContent, SelectValue,
} from "@/components/ui/select";
import {
  Pagination, PaginationContent, PaginationItem, PaginationLink,
} from "@/components/ui/pagination";
import { Eye, Check, X, School } from "lucide-react";
import { useState } from "react";

export default function DossierList({ dossiers = { data: [], current_page: 1, last_page: 1 }, bourses = [], filters = {} }) {
  const [selectedDossier, setSelectedDossier] = useState(null);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const handleFilterChange = (value) => {
    const query = {
      ...filters,
      statut: value === "all" ? undefined : value,
    };
    router.get("/agent/dossiers", query, {
      preserveScroll: true,
      preserveState: true,
    });
  };

  const handleBourseChange = (value) => {
    const query = {
      ...filters,
      bourse_id: value === "all" ? undefined : value,
    };
    router.get("/agent/dossiers", query, {
      preserveScroll: true,
      preserveState: true,
    });
  };

  const validateDossier = (id) => {
    if (confirm("Êtes-vous sûr de vouloir valider ce dossier ?")) {
      router.post(`/agent/dossiers/${id}/valider`, {}, {
        preserveScroll: true,
        onSuccess: () => {
          // Action après succès
        }
      });
    }
  };

  const openRejectionModal = (dossier) => {
    setSelectedDossier(dossier);
    setShowRejectionModal(true);
  };

  const rejectDossier = () => {
    if (!rejectionReason.trim()) {
      alert("Veuillez saisir une raison de rejet");
      return;
    }

    router.post(`/agent/dossiers/${selectedDossier.id}/rejeter`, {
      motif: rejectionReason
    }, {
      preserveScroll: true,
      onSuccess: () => {
        setShowRejectionModal(false);
        setRejectionReason("");
        setSelectedDossier(null);
      }
    });
  };

  const pageLink = (page) => {
    const query = new URLSearchParams();
    query.append("page", page);
    if (filters.statut && filters.statut !== "all") query.append("statut", filters.statut);
    if (filters.bourse_id && filters.bourse_id !== "all") query.append("bourse_id", filters.bourse_id);
    return `?${query.toString()}`;
  };

  return (
    <>
      <Head title="Liste des dossiers" />
      <AgentLayout>
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-gray-800">🎓 Dossiers de Candidature</h1>
          <p className="text-gray-500 mt-1">Visualisez et filtrez les candidatures en un clic.</p>
        </div>

        <div className="bg-white border rounded-2xl shadow-sm p-6 mb-6 flex flex-wrap gap-4 justify-between items-center">
          <Select onValueChange={handleFilterChange} value={filters.statut || "all"}>
            <SelectTrigger className="w-[220px] rounded-xl border-gray-300">
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="en_attente">En attente</SelectItem>
              <SelectItem value="accepte">Accepté</SelectItem>
              <SelectItem value="rejete">Rejeté</SelectItem>
              <SelectItem value="incomplet">Incomplet</SelectItem>
            </SelectContent>
          </Select>

          <Select
            onValueChange={handleBourseChange}
            value={filters.bourse_id?.toString() || "all"}
          >
            <SelectTrigger className="w-[220px] rounded-xl border-gray-300">
              <SelectValue placeholder="Filtrer par bourse" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les bourses</SelectItem>
              {Array.isArray(bourses) && bourses.map((b) => (
                <SelectItem key={b.id} value={b.id.toString()}>
                  {b.nom}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead>Étudiant</TableHead>
                <TableHead>École souhaitée</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.isArray(dossiers.data) && dossiers.data.length > 0 ? (
                dossiers.data.map((dossier, idx) => (
                  <TableRow key={dossier.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <TableCell className="font-medium">{dossier.nom} {dossier.prenom}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <School className="h-4 w-4 mr-1 text-gray-500" />
                        {dossier.etablissement || dossier.ecole?.nom || "-"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className="capitalize rounded-full text-xs px-3 py-1"
                        variant={
                          dossier.statut === "accepte"
                            ? "default"
                            : dossier.statut === "rejete"
                              ? "destructive"
                              : dossier.statut === "incomplet"
                                ? "secondary"
                                : "outline"
                        }
                      >
                        {dossier.statut}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Link href={route('agent.dossiers.show', dossier.id)}>
                          <Button variant="secondary" size="sm" className="gap-1">
                            <Eye className="w-4 h-4" />
                            Voir
                          </Button>
                        </Link>

                        {dossier.statut === "en_attente" || dossier.statut === "incomplet" ? (
                          <>
                            <Button
                              variant="default"
                              size="sm"
                              className="gap-1"
                              onClick={() => validateDossier(dossier.id)}
                            >
                              <Check className="w-4 h-4" />
                              Valider
                            </Button>

                            <Button
                              variant="destructive"
                              size="sm"
                              className="gap-1"
                              onClick={() => openRejectionModal(dossier)}
                            >
                              <X className="w-4 h-4" />
                              Rejeter
                            </Button>
                          </>
                        ) : null}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan="4" className="text-center text-muted-foreground py-10">
                    Aucun dossier trouvé.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {dossiers.last_page > 1 && (
          <Pagination className="mt-8 justify-center">
            <PaginationContent>
              {Array.from({ length: dossiers.last_page }, (_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    isActive={dossiers.current_page === i + 1}
                    href={pageLink(i + 1)}
                    className="rounded-full"
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
            </PaginationContent>
          </Pagination>
        )}

        {/* Modal de rejet */}
        {showRejectionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-medium mb-4">Rejeter le dossier</h3>
              <p className="mb-4">Veuillez indiquer la raison du rejet du dossier de {selectedDossier?.nom} {selectedDossier?.prenom}:</p>
              <textarea
                className="w-full border rounded p-2 mb-4"
                rows="4"
                placeholder="Raison du rejet..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              ></textarea>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowRejectionModal(false);
                    setRejectionReason("");
                    setSelectedDossier(null);
                  }}
                >
                  Annuler
                </Button>
                <Button variant="destructive" onClick={rejectDossier}>
                  Confirmer le rejet
                </Button>
              </div>
            </div>
          </div>
        )}
      </AgentLayout>
    </>
  );
}