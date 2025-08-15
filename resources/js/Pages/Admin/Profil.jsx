// resources/js/Pages/Admin/Profil.jsx
import { Head } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "@inertiajs/react";
import { useState } from "react";
import { User, Lock, Save } from "lucide-react";

export default function Profil({ user }) {
  const [activeTab, setActiveTab] = useState('profile');
  const { data, setData, patch, processing, errors } = useForm({
    name: user.name || '',
    email: user.email || '',
    telephone: user.telephone || '',
  });
  const { data: passwordData, setData: setPasswordData, put, processing: passwordProcessing, errors: passwordErrors } = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    patch('/admin/profil', { preserveScroll: true });
  };
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    put('/admin/profil/password', { preserveScroll: true });
  };

  return (
    <>
      <Head title="Mon profil" />
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mon profil</h1>
            <p className="mt-1 text-sm text-gray-600">Gérez vos informations personnelles et votre mot de passe</p>
          </div>
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`${activeTab === 'profile' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  <User className="mr-2 h-5 w-5 inline" /> Informations personnelles
                </button>
                <button
                  onClick={() => setActiveTab('password')}
                  className={`${activeTab === 'password' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ml-8`}
                >
                  <Lock className="mr-2 h-5 w-5 inline" /> Mot de passe
                </button>
              </nav>
            </div>
            <div className="px-4 py-5 sm:p-6">
              {activeTab === 'profile' && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name">Nom</Label>
                    <Input id="name" name="name" type="text" value={data.name} onChange={e => setData('name', e.target.value)} />
                    {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" value={data.email} onChange={e => setData('email', e.target.value)} />
                    {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
                  </div>
                  <div>
                    <Label htmlFor="telephone">Téléphone</Label>
                    <Input id="telephone" name="telephone" type="text" value={data.telephone} onChange={e => setData('telephone', e.target.value)} />
                    {errors.telephone && <p className="mt-2 text-sm text-red-600">{errors.telephone}</p>}
                  </div>
                  <Button type="submit" disabled={processing} className="flex items-center">
                    <Save className="mr-2 h-4 w-4" /> {processing ? 'Enregistrement...' : 'Enregistrer les modifications'}
                  </Button>
                </form>
              )}
              {activeTab === 'password' && (
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="current_password">Mot de passe actuel</Label>
                    <Input id="current_password" name="current_password" type="password" value={passwordData.current_password} onChange={e => setPasswordData('current_password', e.target.value)} />
                    {passwordErrors.current_password && <p className="mt-2 text-sm text-red-600">{passwordErrors.current_password}</p>}
                  </div>
                  <div>
                    <Label htmlFor="password">Nouveau mot de passe</Label>
                    <Input id="password" name="password" type="password" value={passwordData.password} onChange={e => setPasswordData('password', e.target.value)} />
                    {passwordErrors.password && <p className="mt-2 text-sm text-red-600">{passwordErrors.password}</p>}
                  </div>
                  <div>
                    <Label htmlFor="password_confirmation">Confirmer le nouveau mot de passe</Label>
                    <Input id="password_confirmation" name="password_confirmation" type="password" value={passwordData.password_confirmation} onChange={e => setPasswordData('password_confirmation', e.target.value)} />
                    {passwordErrors.password_confirmation && <p className="mt-2 text-sm text-red-600">{passwordErrors.password_confirmation}</p>}
                  </div>
                  <Button type="submit" disabled={passwordProcessing} className="flex items-center">
                    <Lock className="mr-2 h-4 w-4" /> {passwordProcessing ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
}
