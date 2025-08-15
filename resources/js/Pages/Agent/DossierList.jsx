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
import { Input } from "@/components/ui/input";
import { Search, Eye, Filter } from "lucide-react";
import { useState } from "react";

export default function DossierList({ 
  dossiers = { data: [], current_page: 1, last_page: 1, total: 0 }, 
  bourses = [], 
  filters = {},
  stats = {}
}) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  
  const handleFilterChange = (value) => {
    const query = {
      ...filters,
      statut: value === "all" ? undefined : value,
      search: searchTerm || undefined,
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
      search: searchTerm || undefined,
    };
    router.get("/agent/dossiers", query, {
      preserveScroll: true,
      preserveState: true,
    });
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    const query = {
      ...filters,
      search: searchTerm,
    };
    router.get("/agent/dossiers", query, {
      preserveScroll: true,
      preserveState: true,
    });
  };
  
  const clearSearch = () => {
    setSearchTerm('');
    const query = {
      ...filters,
      search: undefined,
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
    if (searchTerm) query.append("search", searchTerm);
    return `?${query.toString()}`;
  };
  
  // Fonction pour obtenir la couleur du statut
  const getStatusColor = (status) => {
    switch (status) {
      case 'en_attente': return 'text-blue-600 bg-blue-100';
      case 'en_cours': return 'text-yellow-600 bg-yellow-100';
      case 'accepte': return 'text-green-600 bg-green-100';
      case 'valide': return 'text-purple-600 bg-purple-100';
      case 'rejete': return 'text-red-600 bg-red-100';
      case 'incomplet': return 'text-orange-600 bg-orange-100';
      case 'reoriente': return 'text-indigo-600 bg-indigo-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };
  
  // Fonction pour formater la date
  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  return (
    <>
      <Head title="Liste des dossiers" />
      <AgentLayout>
        <div className="space-y-6">
          {/* En-tête avec statistiques */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">🎓 Dossiers de Candidature</h1>
            <p className="text-gray-500 mt-1">Visualisez et filtrez les candidatures en un clic.</p>
          </div>
          
          {/* Cartes de statistiques */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-800 dark:text-blue-300">Total</p>
              <p className="text-2xl font-bold">{stats.total || 0}</p>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <p className="text-sm text-yellow-800 dark:text-yellow-300">En attente</p>
              <p className="text-2xl font-bold">{stats.en_attente || 0}</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-sm text-green-800 dark:text-green-300">Acceptés</p>
              <p className="text-2xl font-bold">{stats.accepte || 0}</p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-800 dark:text-red-300">Rejetés</p>
              <p className="text-2xl font-bold">{stats.rejete || 0}</p>
            </div>
          </div>
          
          {/* Filtres et recherche */}
          <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm p-6 flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="flex flex-wrap gap-4">
              <Select onValueChange={handleFilterChange} value={filters.statut || "all"}>
                <SelectTrigger className="w-[220px] rounded-xl border-gray-300">
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="en_attente">En attente</SelectItem>
                  <SelectItem value="en_cours">En cours</SelectItem>
                  <SelectItem value="accepte">Accepté</SelectItem>
                  <SelectItem value="valide">Validé</SelectItem>
                  <SelectItem value="rejete">Rejeté</SelectItem>
                  <SelectItem value="incomplet">Incomplet</SelectItem>
                  <SelectItem value="reoriente">Réorienté</SelectItem>
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
            
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Rechercher un dossier..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full md:w-64"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                )}
              </div>
              <Button type="submit" variant="outline">
                Rechercher
              </Button>
            </form>
          </div>
          
          {/* Tableau des dossiers */}
          <div className="rounded-xl border bg-white dark:bg-zinc-800 shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100 dark:bg-gray-700">
                  <TableHead>Étudiant</TableHead>
                  <TableHead>Bourse</TableHead>
                  <TableHead>Établissement</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.isArray(dossiers.data) && dossiers.data.length > 0 ? (
                  dossiers.data.map((dossier, idx) => (
                    <TableRow key={dossier.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50 dark:bg-gray-800/50"}>
                      <TableCell className="font-medium">
                        {dossier.etudiant?.nom} {dossier.etudiant?.prenom}
                      </TableCell>
                      <TableCell>{dossier.bourse?.nom || "-"}</TableCell>
                      <TableCell>{dossier.ecole?.nom || "-"}</TableCell>
                      <TableCell>
                        <Badge
                          className="capitalize rounded-full text-xs px-3 py-1"
                          variant={
                            dossier.statut === "accepte" || dossier.statut === "valide"
                              ? "success"
                              : dossier.statut === "rejete"
                                ? "destructive"
                                : "outline"
                          }
                        >
                          {dossier.statut}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(dossier.created_at)}</TableCell>
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
                    <TableCell colSpan="6" className="text-center text-muted-foreground py-10">
                      Aucun dossier trouvé.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination */}
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
        </div>
      </AgentLayout>
    </>
  );
}