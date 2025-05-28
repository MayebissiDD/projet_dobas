import { useForm, usePage, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export default function UsersIndex({ users, roles }) {
  const { flash } = usePage().props;

  const { data, setData, post, patch, delete: destroy, reset, processing } = useForm({
    name: '',
    email: '',
    password: '',
    role: '',
  });

  const [editingUser, setEditingUser] = useState(null);

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
    router.visit(url);
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-12">
      <h1 className="text-3xl font-bold">Gestion des utilisateurs</h1>

      {/* Formulaire création ou édition */}
      <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-zinc-800 p-6 rounded-md shadow">
        <div className="grid md:grid-cols-3 gap-4">
          <Input value={data.name} onChange={e => setData('name', e.target.value)} placeholder="Nom" required />
          <Input value={data.email} onChange={e => setData('email', e.target.value)} placeholder="Email" required />
          <Input value={data.password} onChange={e => setData('password', e.target.value)} type="password" placeholder="Mot de passe" required={!editingUser} />
        </div>
        <Select value={data.role} onValueChange={value => setData('role', value)}>
          <SelectTrigger className="w-60">
            <SelectValue placeholder="Rôle" />
          </SelectTrigger>
          <SelectContent>
            {roles.map(role => (
              <SelectItem key={role.id} value={role.name}>{role.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="submit" className="mt-4" disabled={processing}>
          {editingUser ? 'Mettre à jour' : 'Créer'}
        </Button>
      </form>

      {/* Liste des utilisateurs */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b border-zinc-300 dark:border-zinc-600">
              <th className="py-2">Nom</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.data.map(user => (
              <tr key={user.id} className="border-b border-zinc-200 dark:border-zinc-700">
                <td className="py-2">{user.name}</td>
                <td>{user.email}</td>
                <td>{user.roles[0]?.name}</td>
                <td className="space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(user)}>Éditer</Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(user.id)}>Supprimer</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-4">
        {users.links.map((link, i) => (
          <button
            key={i}
            className={`px-3 py-1 rounded text-sm ${link.active ? 'bg-green-700 text-white' : 'bg-gray-200 dark:bg-zinc-700'}`}
            onClick={() => handlePageChange(link.url)}
            disabled={!link.url}
            dangerouslySetInnerHTML={{ __html: link.label }}
          />
        ))}
      </div>
    </div>
  );
}
