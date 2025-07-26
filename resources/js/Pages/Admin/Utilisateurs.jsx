import AdminLayout from '@/Layouts/AdminLayout';
import { Inertia } from '@inertiajs/inertia';
import { useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { UserPlus, Pencil, Trash2 } from 'lucide-react';

export default function Utilisateurs({ users, roles }) {
  const [open, setOpen] = useState(false); // Gère l'ouverture/fermeture du modal
  const [editingUser, setEditingUser] = useState(null); // Utilisateur en cours d'édition

  const { data, setData, post, patch, delete: destroy, reset, processing } = useForm({
    name: '',
    email: '',
    password: '',
    role: '',
  });

  const flash = usePage()?.props?.flash || {};

  useEffect(() => {
    if (flash.success) toast.success(flash.success);
    if (flash.error) toast.error(flash.error);
  }, [flash]);

  const openCreateModal = () => {
    reset();
    setEditingUser(null);
    setOpen(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.roles[0]?.name || '',
    });
    setOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingUser) {
      patch(route('utilisateurs.update', editingUser.id), {
        onSuccess: () => {
          toast.success('Utilisateur mis à jour.');
          setOpen(false);
        },
        onError: () => toast.error('Erreur lors de la mise à jour.'),
      });
    } else {
      post(route('utilisateurs.store'), {
        onSuccess: () => {
          toast.success('Utilisateur créé avec succès.');
          setOpen(false);
        },
        onError: () => toast.error('Erreur lors de la création.'),
      });
    }
  };

  const handleDelete = (userId) => {
    if (confirm('Supprimer cet utilisateur ?')) {
      destroy(route('utilisateurs.destroy', userId), {
        onSuccess: () => toast.success('Utilisateur supprimé.'),
        onError: () => toast.error('Erreur lors de la suppression.'),
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-12">
      {/* Titre et bouton de création */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold mb-1 flex items-center gap-2">
            <UserPlus className="w-6 h-6 text-green-600" /> Gestion des utilisateurs
          </h1>
          <p className="text-muted-foreground">Ajoutez, modifiez et supprimez les comptes utilisateurs.</p>
        </div>
        <Button className="flex items-center gap-2" onClick={openCreateModal}>
          <UserPlus className="w-4 h-4" /> Créer un utilisateur
        </Button>
      </motion.div>

      {/* Liste des utilisateurs */}
      {(!users || users.length === 0) ? (
        <div className="text-center text-zinc-500 py-8">Aucun utilisateur trouvé.</div>
      ) : (
        <motion.div
          className="overflow-x-auto bg-white dark:bg-zinc-800 rounded-xl shadow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <table className="w-full text-sm">
            <thead className="bg-zinc-100 dark:bg-zinc-700">
              <tr>
                <th className="px-4 py-2 text-left">Nom</th>
                <th>Email</th>
                <th>Rôle</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t dark:border-zinc-600">
                  <td className="px-4 py-2 font-medium">{user.name}</td>
                  <td className="text-center">{user.email}</td>
                  <td className="text-center">
                    <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-300">
                      {user.roles[0]?.name || '-'}
                    </span>
                  </td>
                  <td className="text-center space-x-2">
                    <Button size="sm" variant="outline" onClick={() => openEditModal(user)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(user.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      {/* Modal de création/édition */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingUser ? 'Modifier un utilisateur' : 'Créer un utilisateur'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
              placeholder="Nom"
              required
            />
            <Input
              value={data.email}
              onChange={(e) => setData('email', e.target.value)}
              placeholder="Email"
              required
            />
            <Input
              value={data.password}
              onChange={(e) => setData('password', e.target.value)}
              type="password"
              placeholder="Mot de passe"
              required={!editingUser}
            />
            <Select value={data.role} onValueChange={(value) => setData('role', value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Rôle" />
              </SelectTrigger>
              <SelectContent>
                {roles && roles.length > 0 ? (
                  roles.map((role) => (
                    <SelectItem key={role.id} value={role.name}>
                      {role.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem disabled>Aucun rôle disponible</SelectItem>
                )}
              </SelectContent>
            </Select>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={processing}>
                {editingUser ? 'Mettre à jour' : 'Créer'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

Utilisateurs.layout = (page) => <AdminLayout>{page}</AdminLayout>;
