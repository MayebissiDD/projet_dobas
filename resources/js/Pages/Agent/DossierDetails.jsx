import React, { useState } from 'react';
import AgentLayout from '@/Layouts/AgentLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, School } from 'lucide-react';
import { Link, router } from '@inertiajs/react';

export default function DossierDetails({ dossier, ecoles }) {
  const [selected, setSelected] = useState({
    ecole_id: dossier.ecole_id || '',
    filiere: dossier.filiere_souhaitee || ''
  });
  const [error, setError] = useState('');
  const [showAffectationForm, setShowAffectationForm] = useState(false);

  function handleEcoleChange(e) {
    setSelected({ ...selected, ecole_id: e.target.value, filiere: '' });
  }

  function handleFiliereChange(e) {
    setSelected({ ...selected, filiere: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!selected.ecole_id || !selected.filiere) {
      setError('Veuillez sélectionner une école et une filière.');
      return;
    }
    
    router.post(route('agent.dossiers.affecter', dossier.id), selected, {
      onSuccess: () => {
        setShowAffectationForm(false);
        setError('');
      }
    });
  }

  return (
    <AgentLayout>
      <div className="py-8 px-4 md:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-zinc-800 dark:text-white">
            Dossier de {dossier.nom} {dossier.prenom}
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Statut: <span className={`font-semibold ${
              dossier.statut === 'accepte' ? 'text-green-600' :
              dossier.statut === 'rejete' ? 'text-red-600' :
              dossier.statut === 'incomplet' ? 'text-yellow-500' :
              'text-blue-600'
            }`}>
              {dossier.statut}
            </span>
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informations du dossier */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Informations du dossier</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-zinc-500">Nom</p>
                    <p className="font-medium">{dossier.nom}</p>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500">Prénom</p>
                    <p className="font-medium">{dossier.prenom}</p>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500">Email</p>
                    <p className="font-medium">{dossier.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500">Téléphone</p>
                    <p className="font-medium">{dossier.telephone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500">Bourse</p>
                    <p className="font-medium">{dossier.bourse?.nom || '—'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500">École souhaitée</p>
                    <p className="font-medium flex items-center">
                      <School className="h-4 w-4 mr-1" />
                      {dossier.etablissement || dossier.ecole?.nom || '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500">Filière souhaitée</p>
                    <p className="font-medium">{dossier.filiere_souhaitee || '—'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500">Date de soumission</p>
                    <p className="font-medium">
                      {dossier.date_soumission ? new Date(dossier.date_soumission).toLocaleDateString('fr-FR') : '—'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Formulaire d'affectation */}
            {dossier.statut === 'en_attente' || dossier.statut === 'incomplet' ? (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    Affectation à une école
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowAffectationForm(!showAffectationForm)}
                    >
                      {showAffectationForm ? 'Masquer' : 'Afficher'} le formulaire
                    </Button>
                  </CardTitle>
                </CardHeader>
                {showAffectationForm && (
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block font-medium mb-1">École d'affectation</label>
                        <select 
                          value={selected.ecole_id} 
                          onChange={handleEcoleChange} 
                          className="w-full border rounded p-2"
                        >
                          <option value="">Sélectionner une école</option>
                          {ecoles.map(e => (
                            <option key={e.id} value={e.id} disabled={e.placesRestantes <= 0}>
                              {e.nom} (places restantes : {e.placesRestantes})
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      {selected.ecole_id && (
                        <div>
                          <label className="block font-medium mb-1">Filière</label>
                          <select 
                            value={selected.filiere} 
                            onChange={handleFiliereChange} 
                            className="w-full border rounded p-2"
                          >
                            <option value="">Sélectionner une filière</option>
                            {(ecoles.find(e => e.id == selected.ecole_id)?.filieres || '').split(',').map((f, i) => (
                              <option key={i} value={f.trim()}>{f.trim()}</option>
                            ))}
                          </select>
                        </div>
                      )}
                      
                      {error && <div className="text-red-500 text-sm">{error}</div>}
                      
                      <div className="flex justify-end space-x-2">
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => setShowAffectationForm(false)}
                        >
                          Annuler
                        </Button>
                        <Button type="submit">Affecter</Button>
                      </div>
                    </form>
                  </CardContent>
                )}
              </Card>
            ) : null}
            
            {/* Pièces jointes */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Pièces jointes</CardTitle>
              </CardHeader>
              <CardContent>
                {dossier.pieces && dossier.pieces.length > 0 ? (
                  <div className="space-y-2">
                    {dossier.pieces.map((piece) => (
                      <div key={piece.id} className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-zinc-500 mr-2" />
                          <span>{piece.nom_piece}</span>
                        </div>
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                        >
                          <a href={route('agent.dossiers.pieces.download', {
                            dossierId: dossier.id,
                            pieceId: piece.id
                          })}>
                            <Download className="h-4 w-4 mr-1" />
                            Télécharger
                          </a>
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-zinc-500">Aucune pièce jointe trouvée.</p>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Actions sur le dossier */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {dossier.statut === 'en_attente' || dossier.statut === 'incomplet' ? (
                  <>
                    <Button className="w-full" asChild>
                      <Link href={route('agent.dossiers.valider', dossier.id)} method="post">
                        Valider le dossier
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href={route('agent.dossiers.incomplet', dossier.id)} method="post">
                        Marquer comme incomplet
                      </Link>
                    </Button>
                    <Button variant="destructive" className="w-full" asChild>
                      <Link href={route('agent.dossiers.rejeter', dossier.id)} method="post">
                        Rejeter le dossier
                      </Link>
                    </Button>
                  </>
                ) : (
                  <p className="text-sm text-zinc-500">
                    Ce dossier a déjà été traité et ne peut plus être modifié.
                  </p>
                )}
              </CardContent>
            </Card>
            
            {/* Historique des statuts */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Historique</CardTitle>
              </CardHeader>
              <CardContent>
                {dossier.historique && dossier.historique.length > 0 ? (
                  <div className="space-y-4">
                    {dossier.historique.map((hist) => (
                      <div key={hist.id} className="border-l-2 border-zinc-200 pl-3 pb-3">
                        <div className="text-sm">
                          <span className="font-medium">
                            {hist.modifiePar?.name || 'Système'}
                          </span>
                          <span className="text-zinc-500 ml-2">
                            {new Date(hist.modifie_le).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                        <p className="text-sm">
                          Changement de statut: <span className="font-medium">{hist.ancien_statut}</span> → 
                          <span className="font-medium"> {hist.nouveau_statut}</span>
                        </p>
                        {hist.motif && (
                          <p className="text-sm text-zinc-600 mt-1">{hist.motif}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-zinc-500">Aucun historique disponible.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AgentLayout>
  );
}