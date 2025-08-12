// resources/js/Pages/Student/Profil.jsx
import { Head } from "@inertiajs/react";
import StudentLayout from "@/Layouts/StudentLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { useForm } from "@inertiajs/react";
import { 
  User, 
  Lock, 
  Save, 
  Camera,
  Mail,
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  Award
} from "lucide-react";

export default function Profil({ etudiant }) {
  const [activeTab, setActiveTab] = useState('profile');
  
  // Formulaire pour les informations personnelles
  const { data, setData, post, processing, errors } = useForm({
    nom: etudiant.nom,
    prenom: etudiant.prenom,
    email: etudiant.email,
    telephone: etudiant.telephone,
    date_naissance: etudiant.date_naissance,
    lieu_naissance: etudiant.lieu_naissance,
    sexe: etudiant.sexe,
    adresse: etudiant.adresse,
    niveau_etude: etudiant.niveau_etude,
    moyenne: etudiant.moyenne,
    cas_social: etudiant.cas_social,
    photo_identite: null,
  });
  
  // Formulaire pour le mot de passe
  const { 
    data: passwordData, 
    setData: setPasswordData, 
    post: postPassword, 
    processing: passwordProcessing, 
    errors: passwordErrors 
  } = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    post('/etudiant/profil', {
      preserveScroll: true,
      onSuccess: () => {
        // Réinitialiser le champ photo_identite après la soumission
        setData('photo_identite', null);
      },
    });
  };
  
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    postPassword('/etudiant/profil/password', {
      preserveScroll: true,
      onSuccess: () => {
        // Réinitialiser le formulaire du mot de passe
        setPasswordData({
          current_password: '',
          password: '',
          password_confirmation: '',
        });
      },
    });
  };
  
  const handlePhotoChange = (e) => {
    setData('photo_identite', e.target.files[0]);
  };
  
  return (
    <>
      <Head title="Mon profil" />
      <StudentLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mon profil</h1>
            <p className="mt-1 text-sm text-gray-600">
              Gérez vos informations personnelles et votre mot de passe
            </p>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`${
                    activeTab === 'profile'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  <User className="mr-2 h-5 w-5 inline" />
                  Informations personnelles
                </button>
                <button
                  onClick={() => setActiveTab('password')}
                  className={`${
                    activeTab === 'password'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ml-8`}
                >
                  <Lock className="mr-2 h-5 w-5 inline" />
                  Mot de passe
                </button>
              </nav>
            </div>

            <div className="px-4 py-5 sm:p-6">
              {activeTab === 'profile' && (
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {/* Photo de profil */}
                    <div className="sm:col-span-2">
                      <Label htmlFor="photo_identite" className="block text-sm font-medium text-gray-700">
                        Photo d'identité
                      </Label>
                      <div className="mt-1 flex items-center">
                        <span className="inline-block h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                          {etudiant.photo_identite ? (
                            <img 
                              src={etudiant.photo_identite} 
                              alt="Photo de profil" 
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <User className="h-full w-full text-gray-300" />
                          )}
                        </span>
                        <label
                          htmlFor="photo_identite"
                          className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
                        >
                          <Camera className="h-4 w-4 inline mr-1" />
                          Changer
                        </label>
                        <input
                          id="photo_identite"
                          name="photo_identite"
                          type="file"
                          className="sr-only"
                          onChange={handlePhotoChange}
                        />
                      </div>
                      {errors.photo_identite && (
                        <p className="mt-2 text-sm text-red-600">{errors.photo_identite}</p>
                      )}
                    </div>

                    {/* Nom */}
                    <div>
                      <Label htmlFor="nom" className="block text-sm font-medium text-gray-700">
                        Nom
                      </Label>
                      <Input
                        id="nom"
                        name="nom"
                        type="text"
                        value={data.nom}
                        onChange={(e) => setData('nom', e.target.value)}
                        className="mt-1"
                      />
                      {errors.nom && (
                        <p className="mt-2 text-sm text-red-600">{errors.nom}</p>
                      )}
                    </div>

                    {/* Prénom */}
                    <div>
                      <Label htmlFor="prenom" className="block text-sm font-medium text-gray-700">
                        Prénom
                      </Label>
                      <Input
                        id="prenom"
                        name="prenom"
                        type="text"
                        value={data.prenom}
                        onChange={(e) => setData('prenom', e.target.value)}
                        className="mt-1"
                      />
                      {errors.prenom && (
                        <p className="mt-2 text-sm text-red-600">{errors.prenom}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        className="mt-1"
                      />
                      {errors.email && (
                        <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                      )}
                    </div>

                    {/* Téléphone */}
                    <div>
                      <Label htmlFor="telephone" className="block text-sm font-medium text-gray-700">
                        Téléphone
                      </Label>
                      <Input
                        id="telephone"
                        name="telephone"
                        type="text"
                        value={data.telephone}
                        onChange={(e) => setData('telephone', e.target.value)}
                        className="mt-1"
                      />
                      {errors.telephone && (
                        <p className="mt-2 text-sm text-red-600">{errors.telephone}</p>
                      )}
                    </div>

                    {/* Date de naissance */}
                    <div>
                      <Label htmlFor="date_naissance" className="block text-sm font-medium text-gray-700">
                        Date de naissance
                      </Label>
                      <Input
                        id="date_naissance"
                        name="date_naissance"
                        type="date"
                        value={data.date_naissance}
                        onChange={(e) => setData('date_naissance', e.target.value)}
                        className="mt-1"
                      />
                      {errors.date_naissance && (
                        <p className="mt-2 text-sm text-red-600">{errors.date_naissance}</p>
                      )}
                    </div>

                    {/* Lieu de naissance */}
                    <div>
                      <Label htmlFor="lieu_naissance" className="block text-sm font-medium text-gray-700">
                        Lieu de naissance
                      </Label>
                      <Input
                        id="lieu_naissance"
                        name="lieu_naissance"
                        type="text"
                        value={data.lieu_naissance}
                        onChange={(e) => setData('lieu_naissance', e.target.value)}
                        className="mt-1"
                      />
                      {errors.lieu_naissance && (
                        <p className="mt-2 text-sm text-red-600">{errors.lieu_naissance}</p>
                      )}
                    </div>

                    {/* Sexe */}
                    <div>
                      <Label htmlFor="sexe" className="block text-sm font-medium text-gray-700">
                        Sexe
                      </Label>
                      <Select value={data.sexe} onValueChange={(value) => setData('sexe', value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Masculin">Masculin</SelectItem>
                          <SelectItem value="Féminin">Féminin</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.sexe && (
                        <p className="mt-2 text-sm text-red-600">{errors.sexe}</p>
                      )}
                    </div>

                    {/* Niveau d'étude */}
                    <div>
                      <Label htmlFor="niveau_etude" className="block text-sm font-medium text-gray-700">
                        Niveau d'étude
                      </Label>
                      <Select value={data.niveau_etude} onValueChange={(value) => setData('niveau_etude', value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Bac Technique">Bac Technique</SelectItem>
                          <SelectItem value="BET">BET</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.niveau_etude && (
                        <p className="mt-2 text-sm text-red-600">{errors.niveau_etude}</p>
                      )}
                    </div>

                    {/* Adresse */}
                    <div className="sm:col-span-2">
                      <Label htmlFor="adresse" className="block text-sm font-medium text-gray-700">
                        Adresse
                      </Label>
                      <Input
                        id="adresse"
                        name="adresse"
                        type="text"
                        value={data.adresse}
                        onChange={(e) => setData('adresse', e.target.value)}
                        className="mt-1"
                      />
                      {errors.adresse && (
                        <p className="mt-2 text-sm text-red-600">{errors.adresse}</p>
                      )}
                    </div>

                    {/* Cas social */}
                    <div className="sm:col-span-2">
                      <div className="flex items-center">
                        <Checkbox
                          id="cas_social"
                          checked={data.cas_social}
                          onCheckedChange={(checked) => setData('cas_social', checked)}
                        />
                        <label htmlFor="cas_social" className="ml-2 block text-sm text-gray-900">
                          Je suis un cas social
                        </label>
                      </div>
                    </div>

                    {/* Moyenne */}
                    {!data.cas_social && (
                      <div>
                        <Label htmlFor="moyenne" className="block text-sm font-medium text-gray-700">
                          Moyenne
                        </Label>
                        <Input
                          id="moyenne"
                          name="moyenne"
                          type="number"
                          step="0.01"
                          min="0"
                          max="20"
                          value={data.moyenne || ''}
                          onChange={(e) => setData('moyenne', e.target.value)}
                          className="mt-1"
                        />
                        {errors.moyenne && (
                          <p className="mt-2 text-sm text-red-600">{errors.moyenne}</p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="mt-6">
                    <Button type="submit" disabled={processing} className="flex items-center">
                      <Save className="mr-2 h-4 w-4" />
                      {processing ? 'Enregistrement...' : 'Enregistrer les modifications'}
                    </Button>
                  </div>
                </form>
              )}

              {activeTab === 'password' && (
                <form onSubmit={handlePasswordSubmit}>
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="current_password" className="block text-sm font-medium text-gray-700">
                        Mot de passe actuel
                      </Label>
                      <Input
                        id="current_password"
                        name="current_password"
                        type="password"
                        value={passwordData.current_password}
                        onChange={(e) => setPasswordData('current_password', e.target.value)}
                        className="mt-1"
                      />
                      {passwordErrors.current_password && (
                        <p className="mt-2 text-sm text-red-600">{passwordErrors.current_password}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Nouveau mot de passe
                      </Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        value={passwordData.password}
                        onChange={(e) => setPasswordData('password', e.target.value)}
                        className="mt-1"
                      />
                      {passwordErrors.password && (
                        <p className="mt-2 text-sm text-red-600">{passwordErrors.password}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
                        Confirmer le nouveau mot de passe
                      </Label>
                      <Input
                        id="password_confirmation"
                        name="password_confirmation"
                        type="password"
                        value={passwordData.password_confirmation}
                        onChange={(e) => setPasswordData('password_confirmation', e.target.value)}
                        className="mt-1"
                      />
                      {passwordErrors.password_confirmation && (
                        <p className="mt-2 text-sm text-red-600">{passwordErrors.password_confirmation}</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-6">
                    <Button type="submit" disabled={passwordProcessing} className="flex items-center">
                      <Lock className="mr-2 h-4 w-4" />
                      {passwordProcessing ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </StudentLayout>
    </>
  );
}