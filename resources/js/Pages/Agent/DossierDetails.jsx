import { Head, Link, usePage, router, useForm } from "@inertiajs/react";
import AgentLayout from "@/Layouts/AgentLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Eye, Download, FileText, CheckCircle, XCircle, AlertCircle, RotateCcw } from "lucide-react";
import AffectationEcoleForm from "./AffectationEcoleForm";

export default function DossierDetails({ dossier, ecoles, filieres }) {
  const { flash } = usePage().props;
  const [showReorient, setShowReorient] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  
  const { post, data, setData, processing, errors, reset } = useForm({
    motif: '',
    ecole_id: '',
    filiere_id: '',
  });
  
  const { post: postDecision, data: decisionData, setData: setDecisionData, processing: processingDecision, errors: errorsDecision } = useForm({
    motif: '',
  });
  
  const handleValider = () => {
    router.post(`/agent/dossiers/${dossier.id}/valider`, {}, { preserveScroll: true });
  };
  
  const handleRefuser = (e) => {
    e.preventDefault();
    postDecision(`/agent/dossiers/${dossier.id}/rejeter`, { 
      motif: decisionData.motif 
    });
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
    <>
      <Head title={`Dossier - ${dossier.etudiant?.nom} ${dossier.etudiant?.prenom}`} />
      <AgentLayout>
        <div className="space-y-4">
          {/* Flash messages */}
          {flash.success && (
            <div className="p-3 rounded bg-green-100 text-green-800 border border-green-300">
              {flash.success}
            </div>
          )}
          {flash.error && (
            <div className="p-3 rounded bg-red-100 text-red-800 border border-red-300">
              {flash.error}
            </div>
          )}
          
          {/* En-tête avec actions */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">
                Dossier de {dossier.etudiant?.nom} {dossier.etudiant?.prenom}
              </h1>
              <p className="text-gray-600">
                N° {dossier.numero_dossier} • Créé le {formatDate(dossier.created_at)}
              </p>
            </div>
            <Link href={route('agent.dossiers.index')}>
              <Button variant="outline">
                ← Retour à la liste
              </Button>
            </Link>
          </div>
          
          {/* Carte principale */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Détails du dossier</span>
                <Badge className={getStatusColor(dossier.statut)}>
                  {dossier.statut}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="details" onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="details">Détails</TabsTrigger>
                  <TabsTrigger value="pieces">Pièces</TabsTrigger>
                  <TabsTrigger value="actions">Actions</TabsTrigger>
                  <TabsTrigger value="historique">Historique</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold mb-2">Informations personnelles</h3>
                      <div className="space-y-2">
                        <p><span className="text-gray-600">Nom :</span> {dossier.etudiant?.nom}</p>
                        <p><span className="text-gray-600">Prénom :</span> {dossier.etudiant?.prenom}</p>
                        <p><span className="text-gray-600">Email :</span> {dossier.etudiant?.email}</p>
                        <p><span className="text-gray-600">Téléphone :</span> {dossier.etudiant?.telephone}</p>
                        <p><span className="text-gray-600">Adresse :</span> {dossier.etudiant?.adresse}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-2">Candidature</h3>
                      <div className="space-y-2">
                        <p><span className="text-gray-600">Bourse :</span> {dossier.bourse?.nom || '—'}</p>
                        <p><span className="text-gray-600">Type de bourse :</span> {dossier.type_bourse}</p>
                        <p><span className="text-gray-600">Établissement :</span> {dossier.ecole?.nom || '—'}</p>
                        <p><span className="text-gray-600">Filière :</span> {dossier.filiere?.nom || '—'}</p>
                        <p><span className="text-gray-600">Niveau d'étude :</span> {dossier.niveau_etude}</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="pieces" className="space-y-4">
                  <h3 className="font-semibold">Pièces justificatives</h3>
                  {dossier.pieces && dossier.pieces.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {dossier.pieces.map((piece) => (
                        <div key={piece.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{piece.piece?.nom}</h4>
                              <p className="text-sm text-gray-600 mt-1">
                                {piece.nom_original} • {(piece.taille / 1024).toFixed(2)} KB
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => window.open(`/agent/dossiers/${dossier.id}/pieces/${piece.id}/download`, '_blank')}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium">Aucune pièce jointe</h3>
                      <p className="mt-1 text-sm">Ce dossier ne contient aucune pièce jointe.</p>
                    </div>
                  )}
                  
                  <div className="flex justify-center mt-6">
                    <Button 
                      variant="outline"
                      onClick={() => window.location.href = `/agent/dossiers/${dossier.id}/download-all`}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Télécharger toutes les pièces (ZIP)
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="actions" className="space-y-6">
                  <div className="flex flex-wrap gap-3">
                    <Button 
                      onClick={handleValider} 
                      disabled={processing || !canModify}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Valider
                    </Button>
                    
                    <Button 
                      variant="destructive" 
                      onClick={handleRefuser}
                      disabled={processingDecision || !canModify}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Refuser
                    </Button>
                    
                    <Button 
                      variant="outline"
                      onClick={() => setShowReorient(!showReorient)}
                      disabled={!canModify}
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Réorienter
                    </Button>
                  </div>
                  
                  {showReorient && (
                    <Card className="border border-yellow-200 bg-yellow-50">
                      <CardHeader>
                        <CardTitle className="text-yellow-800">Réorienter la candidature</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={handleReorienter} className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Nouvelle école
                            </label>
                            <select 
                              value={data.ecole_id} 
                              onChange={e => setData('ecole_id', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="">Sélectionner une école</option>
                              {ecoles.map(ecole => (
                                <option key={ecole.id} value={ecole.id}>
                                  {ecole.nom} (places restantes : {ecole.placesRestantes})
                                </option>
                              ))}
                            </select>
                            {errors.ecole_id && (
                              <p className="mt-1 text-sm text-red-600">{errors.ecole_id}</p>
                            )}
                          </div>
                          
                          {data.ecole_id && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nouvelle filière
                              </label>
                              <select 
                                value={data.filiere_id} 
                                onChange={e => setData('filiere_id', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              >
                                <option value="">Sélectionner une filière</option>
                                {filieres
                                  .filter(f => f.ecole_id == data.ecole_id)
                                  .map(filiere => (
                                    <option key={filiere.id} value={filiere.id}>
                                      {filiere.nom}
                                    </option>
                                  ))
                                }
                              </select>
                              {errors.filiere_id && (
                                <p className="mt-1 text-sm text-red-600">{errors.filiere_id}</p>
                              )}
                            </div>
                          )}
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Motif (optionnel)
                            </label>
                            <textarea
                              value={data.motif}
                              onChange={e => setData('motif', e.target.value)}
                              placeholder="Motif de la réorientation"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              rows={3}
                            />
                            {errors.motif && (
                              <p className="mt-1 text-sm text-red-600">{errors.motif}</p>
                            )}
                          </div>
                          
                          <div className="flex justify-end space-x-3">
                            <Button 
                              type="button" 
                              variant="outline"
                              onClick={() => setShowReorient(false)}
                            >
                              Annuler
                            </Button>
                            <Button 
                              type="submit" 
                              disabled={processing}
                              className="bg-yellow-600 hover:bg-yellow-700"
                            >
                              {processing ? 'Traitement...' : 'Confirmer la réorientation'}
                            </Button>
                          </div>
                        </form>
                      </CardContent>
                    </Card>
                  )}
                  
                  {dossier.statut === 'rejete' && dossier.raison_refus && (
                    <Card className="border border-red-200 bg-red-50">
                      <CardHeader>
                        <CardTitle className="text-red-800">Motif du refus</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>{dossier.raison_refus}</p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
                
                <TabsContent value="historique" className="space-y-4">
                  <h3 className="font-semibold">Historique des modifications</h3>
                  {dossier.historique && dossier.historique.length > 0 ? (
                    <div className="space-y-4">
                      {dossier.historique.map((historique, index) => (
                        <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                          <div className="flex justify-between">
                            <div>
                              <p className="font-medium">
                                {historique.ancien_statut ? 
                                  `Changement de statut : ${historique.ancien_statut} → ${historique.nouveau_statut}` : 
                                  `Initialisation : ${historique.nouveau_statut}`
                                }
                              </p>
                              <p className="text-sm text-gray-600 mt-1">{historique.motif}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-500">
                                {new Date(historique.created_at).toLocaleString('fr-FR')}
                              </p>
                              <p className="text-xs text-gray-400">
                                Par {historique.modifiePar?.name}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium">Aucun historique</h3>
                      <p className="mt-1 text-sm">Ce dossier n'a pas encore d'historique de modifications.</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </AgentLayout>
    </>
  );
}