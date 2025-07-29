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
import { Eye } from "lucide-react";

export default function DossierList({ dossiers = { data: [], current_page: 1, last_page: 1 }, bourses = [], filters = {} }) {
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
              <SelectItem value="en attente">En attente</SelectItem>
              <SelectItem value="accepté">Accepté</SelectItem>
              <SelectItem value="rejeté">Rejeté</SelectItem>
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
                <TableHead>Nom</TableHead>
                <TableHead>Bourse</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.isArray(dossiers.data) && dossiers.data.length > 0 ? (
                dossiers.data.map((dossier, idx) => (
                  <TableRow key={dossier.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <TableCell className="font-medium">{dossier.nom}</TableCell>
                    <TableCell>{dossier.bourse?.nom || "-"}</TableCell>
                    <TableCell>
                      <Badge
                        className="capitalize rounded-full text-xs px-3 py-1"
                        variant={
                          dossier.statut === "accepté"
                            ? "success"
                            : dossier.statut === "rejeté"
                              ? "destructive"
                              : "outline"
                        }
                      >
                        {dossier.statut}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/agent/dossiers/${dossier.id}`}>
                        <Button variant="secondary" size="sm" className="gap-1">
                          <Eye className="w-4 h-4" />
                          Voir
                        </Button>
                      </Link>
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
      </AgentLayout>
    </>
  );
}
