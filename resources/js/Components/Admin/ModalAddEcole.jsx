import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "@inertiajs/react";
import { useEffect } from "react";

export default function ModalAddEcole({ trigger, editing = null, onSaved }) {
  const { data, setData, post, reset, processing, errors } = useForm({
    nom: editing?.nom || "",
    pays: editing?.pays || "",
    type: editing?.type || "",
  });

  useEffect(() => {
    if (editing) {
      setData({
        nom: editing.nom,
        pays: editing.pays,
        type: editing.type,
      });
    } else {
      reset();
    }
  }, [editing]);

  const handleSubmit = (e) => {
    e.preventDefault();

    post(route("admin.ecoles.store"), {
      preserveScroll: true,
      onSuccess: () => {
        reset();
        if (onSaved) onSaved();
      },
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editing ? "Modifier l’école" : "Ajouter une école"}</DialogTitle>
          <DialogDescription>
            {editing ? "Modifier les détails de l’établissement partenaire." : "Enregistrez un nouvel établissement partenaire."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nom</label>
            <Input value={data.nom} onChange={(e) => setData("nom", e.target.value)} />
            {errors.nom && <p className="text-red-500 text-xs mt-1">{errors.nom}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Pays</label>
            <Input value={data.pays} onChange={(e) => setData("pays", e.target.value)} />
            {errors.pays && <p className="text-red-500 text-xs mt-1">{errors.pays}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <Input value={data.type} onChange={(e) => setData("type", e.target.value)} />
            {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
          </div>

          <DialogFooter className="flex justify-between mt-4">
            <DialogClose asChild>
              <Button type="button" variant="ghost">
                Annuler
              </Button>
            </DialogClose>
            <Button type="submit" disabled={processing}>
              {editing ? "Enregistrer les modifications" : "Ajouter"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
