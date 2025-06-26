import { Head, Link } from '@inertiajs/react'
import AgentLayout from '@/Layouts/AgentLayout'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, 
  Trigger, SelectItem, SelectContent, SelectValue } from '@/components/ui/select'
import {
  Pagination, PaginationContent, PaginationItem, PaginationLink,
} from '@/components/ui/pagination'
import { router } from '@inertiajs/react'

export default function DossierList({ dossiers, bourses = [], filters = {} }) {
  const handleFilterChange = (value) => {
    router.get('/agent/dossiers', { ...filters, statut: value }, { preserveScroll: true, preserveState: true, })
  }
  const handleBourseChange = (value) => {
    router.get('/agent/dossiers', { ...filters, bourse_id: value }, { preserveScroll: true, preserveState: true, })
  }

  return (
    <>
      <Head title="Liste des dossiers" />
      <AgentLayout>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Liste des dossiers de candidature</h1>
          <div className="flex gap-4">
            <Select onValueChange={handleFilterChange} defaultValue={filters.statut || ''}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tous</SelectItem>
                <SelectItem value="en attente">En attente</SelectItem>
                <SelectItem value="accepté">Accepté</SelectItem>
                <SelectItem value="rejeté">Rejeté</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={handleBourseChange} defaultValue={filters.bourse_id || ''}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filtrer par bourse" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Toutes les bourses</SelectItem>
                {bourses.map(b => (
                  <SelectItem key={b.id} value={b.id}>{b.nom}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-xl border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Bourse</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dossiers.data.length > 0 ? (
                dossiers.data.map((dossier) => (
                  <TableRow key={dossier.id}>
                    <TableCell>{dossier.nom}</TableCell>
                    <TableCell>{dossier.bourse ? dossier.bourse.nom : '-'}</TableCell>
                    <TableCell>
                      <Badge variant={
                        dossier.statut === 'accepté' ? 'success'
                          : dossier.statut === 'rejeté' ? 'destructive'
                          : 'outline'
                      }>
                        {dossier.statut}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/agent/dossiers/${dossier.id}`}>
                        <Button variant="outline" size="sm">Voir</Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan="4" className="text-center text-muted-foreground py-8">
                    Aucun dossier trouvé.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {dossiers.last_page > 1 && (
          <Pagination className="mt-6">
            <PaginationContent>
              {Array.from({ length: dossiers.last_page }, (_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    isActive={dossiers.current_page === i + 1}
                    href={`?page=${i + 1}${filters.statut ? `&statut=${filters.statut}` : ''}`}
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
  )
}
