import React from 'react';
import AgentLayout from '@/Layouts/AgentLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Eye, FileText } from 'lucide-react';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function DossierDetails({ dossier, ecoles }) {
  const [previewFile, setPreviewFile] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const handlePreview = (piece) => {
    // Vérifier si le fichier est un PDF ou une image pour la prévisualisation
    const fileExtension = piece.fichier.split('.').pop().toLowerCase();
    const previewableTypes = ['pdf', 'jpg', 'jpeg', 'png', 'gif'];
    
    if (previewableTypes.includes(fileExtension)) {
      setPreviewFile(piece);
      setShowPreviewModal(true);
    } else {
      // Si le fichier n'est pas prévisualisable, le télécharger directement
      window.open(route('agent.dossiers.pieces.download', {
        dossierId: dossier.id,
        pieceId: piece.id
      }), '_blank');
    }
  };

  // Fonction pour générer l'URL du fichier
  const getFileUrl = (filePath) => {
    return `/storage/${filePath}`;
  };
  
  const handleReorienter = (e) => {
    e.preventDefault();
    post(`/agent/dossiers/${dossier.id}/reorienter`, {
      data: {
        motif: data.motif,
        ecole_id: data.ecole_id,
        filiere_id: data.filiere_id,
      },
      onSuccess: () => {
        setShowReorient(false);
        reset();
      },
    });
  };
  
  // Fonction pour obtenir la couleur du statut
  const getStatusColor = (status) => {
    switch (status) {
      case 'en_attente': return 'text-blue-600 bg-blue-100';
      case 'en_cours': return 'text-yellow-600 bg-yellow-100';
      case 'accepte': return 'text-green-600 bg-green-100';
      case 'valide': return 'text-purple-600 bg-purple-100';
      case 'rejete': return 'text-red-600 bg-red-100';
      case 'incomplet': return 'text-orange-600 bg-orange-100';
      case 'reoriente': return 'text-indigo-600 bg-indigo-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };
  
  // Fonction pour formater la date
  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  // Vérifier si le dossier peut être modifié
  const canModify = !['accepte', 'valide', 'rejete', 'reoriente'].includes(dossier.statut);
  
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
              dossier.statut === 'refuse' ? 'text-red-600' :
              dossier.statut === 'incomplet' ? 'text-yellow-500' :
              'text-blue-600'
            }`}>
              {dossier.statut === 'accepte' ? 'Accepté' : 
               dossier.statut === 'refuse' ? 'Rejeté' :
               dossier.statut === 'incomplet' ? 'Incomplet' :
               dossier.statut}
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
                    <p className="font-medium">{dossier.etablissement || dossier.ecole?.nom || '—'}</p>
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
                          <div>
                            <span className="font-medium">{piece.piece?.nom || piece.nom_original}</span>
                            <p className="text-xs text-zinc-500">
                              {piece.type_mime || 'Type inconnu'} • {(piece.taille / 1024).toFixed(2)} KB
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePreview(piece)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Voir
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
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
                {dossier.statut === 'en_attente' && (
                  <>
                    <Button className="w-full" asChild>
                      <Link href={route('agent.dossiers.valider', dossier.id)} method="post">
                        Valider le dossier
                      </Link>
                    </Button>
                    
                    <Button variant="outline" className="w-full" asChild>
                      <Link href={route('agent.dossiers.rejeter', dossier.id)} method="post">
                        Rejeter le dossier
                      </Link>
                    </Button>
                    
                    <Button variant="secondary" className="w-full" asChild>
                      <Link href={route('agent.dossiers.incomplet', dossier.id)} method="post">
                        Marquer comme incomplet
                      </Link>
                    </Button>
                  </>
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
      
      {/* Modal de prévisualisation */}
      {showPreviewModal && previewFile && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl h-full max-h-[90vh] flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-medium">
                {previewFile.piece?.nom || previewFile.nom_original}
              </h3>
              <Button variant="outline" onClick={() => setShowPreviewModal(false)}>
                Fermer
              </Button>
            </div>
            <div className="flex-1 overflow-auto p-4">
              {previewFile.fichier && (
                <iframe 
                  src={getFileUrl(previewFile.fichier)} 
                  className="w-full h-full border-0"
                  title={previewFile.piece?.nom || previewFile.nom_original}
                />
              )}
            </div>
            <div className="p-4 border-t flex justify-end">
              <Button asChild>
                <a href={route('agent.dossiers.pieces.download', {
                  dossierId: dossier.id,
                  pieceId: previewFile.id
                })}>
                  <Download className="h-4 w-4 mr-1" />
                  Télécharger
                </a>
              </Button>
            </div>
          </div>
        </div>
      )}
    </AgentLayout>
  );
}