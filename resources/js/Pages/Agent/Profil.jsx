// resources/js/Pages/Agent/Profil.jsx
import { Head } from "@inertiajs/react";
import AgentLayout from "@/Layouts/AgentLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "@inertiajs/react";
import { useState } from "react";
import { User, Lock, Save, Shield, Camera, Activity, Smartphone, Fingerprint } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export default function Profil({ user, roles }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [photoPreview, setPhotoPreview] = useState(user.photo ? `/storage/${user.photo}` : null);
  
  const { data, setData, patch, processing, errors } = useForm({
    name: user.name || '',
    email: user.email || '',
    telephone: user.telephone || '',
    photo: null,
  });
  
  const { data: passwordData, setData: setPasswordData, put, processing: passwordProcessing, errors: passwordErrors } = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = (e) => {
        setPhotoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
      setData('photo', file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    patch('/agent/profil', { 
      preserveScroll: true,
      forceFormData: true,
    });
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    put('/agent/profil/password', { 
      preserveScroll: true,
      forceFormData: true,
    });
  };

  return (
    <>
      <Head title="Mon profil" />
      <AgentLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mon profil</h1>
            <p className="mt-1 text-sm text-gray-600">Gérez vos informations personnelles et votre mot de passe</p>
          </div>
          
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profile" className="flex items-center">
                  <User className="mr-2 h-4 w-4" /> Profil
                </TabsTrigger>
                <TabsTrigger value="password" className="flex items-center">
                  <Lock className="mr-2 h-4 w-4" /> Mot de passe
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center">
                  <Shield className="mr-2 h-4 w-4" /> Sécurité
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile" className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Photo de profil */}
                  <div className="flex items-center space-x-6">
                    <div className="flex-shrink-0">
                      {photoPreview ? (
                        <img 
                          src={photoPreview} 
                          alt="Photo de profil" 
                          className="h-24 w-24 rounded-full object-cover border-2 border-gray-200"
                        />
                      ) : (
                        <div className="h-24 w-24 rounded-full bg-gray-200 border-2 border-dashed border-gray-300 flex items-center justify-center">
                          <User className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('photo-upload').click()}
                        className="flex items-center"
                      >
                        <Camera className="mr-2 h-4 w-4" />
                        Changer la photo
                      </Button>
                      <input
                        id="photo-upload"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handlePhotoChange}
                      />
                      <p className="mt-2 text-sm text-gray-500">JPG, GIF ou PNG. 1Mo max.</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name">Nom complet</Label>
                      <Input 
                        id="name" 
                        name="name" 
                        type="text" 
                        value={data.name} 
                        onChange={e => setData('name', e.target.value)} 
                        placeholder="Votre nom complet"
                      />
                      {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        name="email" 
                        type="email" 
                        value={data.email} 
                        onChange={e => setData('email', e.target.value)} 
                        placeholder="Votre adresse email"
                      />
                      {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
                    </div>
                    
                    <div>
                      <Label htmlFor="telephone">Téléphone</Label>
                      <Input 
                        id="telephone" 
                        name="telephone" 
                        type="text" 
                        value={data.telephone} 
                        onChange={e => setData('telephone', e.target.value)} 
                        placeholder="Votre numéro de téléphone"
                      />
                      {errors.telephone && <p className="mt-2 text-sm text-red-600">{errors.telephone}</p>}
                    </div>
                    
                    <div>
                      <Label htmlFor="role">Rôle</Label>
                      <div className="mt-1">
                        <Badge variant="outline" className="text-sm">
                          {roles?.map(r => r.name).join(', ') || 'Agent'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={processing} 
                    className="flex items-center justify-center w-full"
                  >
                    <Save className="mr-2 h-4 w-4" /> 
                    {processing ? 'Enregistrement...' : 'Enregistrer les modifications'}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="password" className="p-6">
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="current_password">Mot de passe actuel</Label>
                    <Input 
                      id="current_password" 
                      name="current_password" 
                      type="password" 
                      value={passwordData.current_password} 
                      onChange={e => setPasswordData('current_password', e.target.value)} 
                      placeholder="Entrez votre mot de passe actuel"
                    />
                    {passwordErrors.current_password && <p className="mt-2 text-sm text-red-600">{passwordErrors.current_password}</p>}
                  </div>
                  
                  <div>
                    <Label htmlFor="password">Nouveau mot de passe</Label>
                    <Input 
                      id="password" 
                      name="password" 
                      type="password" 
                      value={passwordData.password} 
                      onChange={e => setPasswordData('password', e.target.value)} 
                      placeholder="Entrez votre nouveau mot de passe"
                    />
                    {passwordErrors.password && <p className="mt-2 text-sm text-red-600">{passwordErrors.password}</p>}
                  </div>
                  
                  <div>
                    <Label htmlFor="password_confirmation">Confirmer le nouveau mot de passe</Label>
                    <Input 
                      id="password_confirmation" 
                      name="password_confirmation" 
                      type="password" 
                      value={passwordData.password_confirmation} 
                      onChange={e => setPasswordData('password_confirmation', e.target.value)} 
                      placeholder="Confirmez votre nouveau mot de passe"
                    />
                    {passwordErrors.password_confirmation && <p className="mt-2 text-sm text-red-600">{passwordErrors.password_confirmation}</p>}
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={passwordProcessing} 
                    className="flex items-center justify-center w-full"
                  >
                    <Save className="mr-2 h-4 w-4" /> 
                    {passwordProcessing ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="security" className="p-6">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Activity className="mr-2 h-5 w-5" />
                        Connexions récentes
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Chrome sur Windows</p>
                            <p className="text-sm text-gray-500">Paris, France • Il y a 2 heures</p>
                          </div>
                          <Badge variant="outline">Actuel</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Safari sur iPhone</p>
                            <p className="text-sm text-gray-500">Lyon, France • Hier à 14:30</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Smartphone className="mr-2 h-5 w-5" />
                        Appareils connectés
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">PC Portable - Dell XPS</p>
                            <p className="text-sm text-gray-500">Chrome • Paris, France</p>
                          </div>
                          <Badge variant="outline">Actuel</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">iPhone 13 Pro</p>
                            <p className="text-sm text-gray-500">Safari • Lyon, France</p>
                          </div>
                          <Button variant="outline" size="sm">Déconnecter</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Fingerprint className="mr-2 h-5 w-5" />
                        Authentification à deux facteurs
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Ajoutez une couche de sécurité supplémentaire</p>
                          <p className="text-sm text-gray-500">Protégez votre compte avec l'authentification à deux facteurs</p>
                        </div>
                        <Button variant="outline">Activer</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </AgentLayout>
    </>
  );
}