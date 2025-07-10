import AdminLayout from '@/Layouts/AdminLayout';
import { useForm, usePage, router } from '@inertiajs/react';
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
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { UserPlus, Pencil, Trash2 } from 'lucide-react';

export default function Utilisateurs({ users, roles }) {
  const [editingUser, setEditingUser] = useState(null);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingUser) {
      patch(route('utilisateurs.update', editingUser.id), {
        onSuccess: () => {
          toast.success('Utilisateur mis à jour.');
          reset();
          setEditingUser(null);
        },
        onError: () => toast.error('Erreur lors de la mise à jour.'),
      });
    } else {
      post(route('utilisateurs.store'), {
        onSuccess: () => {
          toast.success('Utilisateur créé avec succès.');
          reset();
        },
        onError: () => toast.error('Erreur lors de la création.'),
      });
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.roles[0]?.name || '',
    });
  };

  const handleDelete = (userId) => {
    if (confirm('Supprimer cet utilisateur ?')) {
      destroy(route('utilisateurs.destroy', userId), {
        onSuccess: () => toast.success('Utilisateur supprimé.'),
        onError: () => toast.error('Erreur lors de la suppression.'),
      });
    }
  };

  const handlePageChange = (url) => {
    if (url) router.visit(url);
  };

  if (users || !Array.isArray(users.data)) {
    return (
      <div className="text-center text-muted-foreground py-10">
        Chargement des utilisateurs...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-12">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <UserPlus className="w-6 h-6 text-green-600" /> Gestion des utilisateurs
        </h1>
        <p className="text-muted-foreground">Ajoutez, modifiez et supprimez les comptes utilisateurs.</p>
      </motion.div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-md"
      >
        <div className="grid md:grid-cols-3 gap-4">
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
        </div>
        <Select value={data.role} onValueChange={(value) => setData('role', value)}>
          <SelectTrigger className="w-60">
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
        <Button type="submit" className="mt-4" disabled={processing}>
          {editingUser ? 'Mettre à jour' : 'Créer'}
        </Button>
      </form>

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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.data.map((user) => (
              <tr key={user.id} className="border-t dark:border-zinc-600">
                <td className="px-4 py-2 font-medium">{user.name}</td>
                <td className="text-center">{user.email}</td>
                <td className="text-center">
                  <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-300">
                    {user.roles[0]?.name || '-'}
                  </span>
                </td>
                <td className="text-center space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(user)}>
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

      {Array.isArray(users.links) && (
        <div className="flex justify-center gap-2 mt-6 flex-wrap">
          {users.links.map((link, i) => (
            <button
              key={i}
              className={`px-3 py-1 rounded text-sm transition duration-150 ${link.active ? 'bg-green-700 text-white' : 'bg-gray-200 dark:bg-zinc-700'}`}
              onClick={() => handlePageChange(link.url)}
              disabled={!link.url}
              dangerouslySetInnerHTML={{ __html: link.label }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

Utilisateurs.layout = (page) => <AdminLayout>{page}</AdminLayout>;
