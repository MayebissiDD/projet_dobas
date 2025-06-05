import AdminLayout from "@/Layouts/AdminLayout"
import { useState } from "react"
import { Plus, Eye, Edit, Trash2, Download } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ModalAddEcole from "@/Components/Admin/ModalAddEcole";

const sampleEcoles = [
  { id: 1, nom: "Université de Paris", pays: "France", type: "Université", partenariats: 12 },
  { id: 2, nom: "Institut Polytechnique de Dakar", pays: "Sénégal", type: "École d'ingénieur", partenariats: 8 },
  { id: 3, nom: "Université Libre de Bruxelles", pays: "Belgique", type: "Université", partenariats: 5 }
]

export default function Ecoles() {
  const [search, setSearch] = useState("")

  const filtered = sampleEcoles.filter(ec =>
    ec.nom.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen py-10 px-6 md:px-20 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold">🏫 Écoles partenaires</h1>
          <p className="text-muted-foreground">Liste des établissements liés à la DOBAS.</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Ajouter une école
        </Button>
      </motion.div>

      <ModalAddEcole
        trigger={
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> Ajouter une école
          </Button>
        }
      />


      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <Input
          placeholder="Rechercher une école..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3"
        />
        <Button variant="outline" className="flex gap-2">
          <Download className="w-4 h-4" /> Exporter
        </Button>
      </div>

      <div className="overflow-x-auto bg-white dark:bg-zinc-800 rounded-xl shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-zinc-100 dark:bg-zinc-700">
            <tr>
              <th className="px-4 py-2 text-left">Nom</th>
              <th className="px-4 py-2 text-center">Pays</th>
              <th className="px-4 py-2 text-center">Type</th>
              <th className="px-4 py-2 text-center">Partenariats</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((ecole) => (
              <tr key={ecole.id} className="border-t dark:border-zinc-600">
                <td className="px-4 py-2">{ecole.nom}</td>
                <td className="text-center">{ecole.pays}</td>
                <td className="text-center">{ecole.type}</td>
                <td className="text-center font-semibold text-green-700 dark:text-green-400">{ecole.partenariats}</td>
                <td className="flex items-center justify-center gap-2 py-2">
                  <Button size="sm" variant="outline"><Eye className="w-4 h-4" /></Button>
                  <Button size="sm" variant="outline"><Edit className="w-4 h-4" /></Button>
                  <Button size="sm" variant="destructive"><Trash2 className="w-4 h-4" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-6">
        <Button variant="outline" size="sm">Charger plus</Button>
      </div>
    </div>
  )
}

Ecoles.layout = page => <AdminLayout>{page}</AdminLayout>
