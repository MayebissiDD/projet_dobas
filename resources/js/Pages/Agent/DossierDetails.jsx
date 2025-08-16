import { Head, Link, usePage, router, useForm } from "@inertiajs/react";
import AgentLayout from "@/Layouts/AgentLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useMemo } from "react";
import { 
  Eye, 
  Download, 
  FileText, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  RotateCcw,
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Building,
  Calendar,
  ArrowLeft,
  Info,
  History,
  Settings,
  ChevronRight,
  Clock,
  Shield,
  Loader,
  FileImage,
  FileVideo,
  File as FileIcon
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Sous-composant pour les informations personnelles
function PersonalInfo({ etudiant }) {
  return (
    <div>
      <h3 className="flex items-center mb-4 text-lg font-medium text-gray-900">
        <User className="w-5 h-5 mr-2 text-gray-500" />
        Informations personnelles
      </h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <InfoCard 
          icon={<User className="w-5 h-5 text-blue-600" />}
          bgColor="bg-blue-100"
          title="Nom complet"
          value={`${etudiant?.nom} ${etudiant?.prenom}`}
        />
        <InfoCard 
          icon={<Mail className="w-5 h-5 text-green-600" />}
          bgColor="bg-green-100"
          title="Email"
          value={etudiant?.email}
        />
        <InfoCard 
          icon={<Phone className="w-5 h-5 text-purple-600" />}
          bgColor="bg-purple-100"
          title="Téléphone"
          value={etudiant?.telephone}
        />
        <InfoCard 
          icon={<MapPin className="w-5 h-5 text-yellow-600" />}
          bgColor="bg-yellow-100"
          title="Adresse"
          value={etudiant?.adresse}
        />
      </div>
    </div>
  );
}

// Sous-composant pour les détails de la candidature
function ApplicationDetails({ dossier }) {
  return (
    <div>
      <h3 className="flex items-center mb-4 text-lg font-medium text-gray-900">
        <GraduationCap className="w-5 h-5 mr-2 text-gray-500" />
        Candidature
      </h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <InfoCard 
          icon={<Building className="w-5 h-5 text-indigo-600" />}
          bgColor="bg-indigo-100"
          title="Bourse"
          value={dossier.bourse?.nom || '—'}
        />
        <InfoCard 
          icon={<Info className="w-5 h-5 text-pink-600" />}
          bgColor="bg-pink-100"
          title="Type de bourse"
          value={dossier.type_bourse}
        />
        <InfoCard 
          icon={<Building className="w-5 h-5 text-teal-600" />}
          bgColor="bg-teal-100"
          title="Établissement"
          value={dossier.ecole?.nom || '—'}
        />
        <InfoCard 
          icon={<GraduationCap className="w-5 h-5 text-cyan-600" />}
          bgColor="bg-cyan-100"
          title="Filière"
          value={dossier.filiere?.nom || '—'}
        />
      </div>
    </div>
  );
}

// Sous-composant pour la liste des pièces
function PiecesList({ pieces, onPreview, dossierId }) {
  const getFileIcon = (mimeType) => {
    if (mimeType && mimeType.startsWith('image/')) {
      return <FileImage className="w-5 h-5" />;
    } else if (mimeType && mimeType.startsWith('video/')) {
      return <FileVideo className="w-5 h-5" />;
    } else if (mimeType && mimeType.includes('pdf')) {
      return <FileText className="w-5 h-5" />;
    } else {
      return <FileIcon className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="flex items-center text-lg font-medium text-gray-900">
        <FileText className="w-5 h-5 mr-2 text-gray-500" />
        Pièces justificatives
      </h3>
      
      {pieces && pieces.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {pieces.map((piece) => (
            <div key={piece.id} className="overflow-hidden transition-shadow bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md">
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start">
                    <div className="p-2 mr-3 bg-blue-100 rounded-lg">
                      {getFileIcon(piece.type_mime)}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{piece.piece?.nom}</h4>
                      <p className="mt-1 text-sm text-gray-500">
                        {piece.nom_original}
                      </p>
                      <div className="flex items-center mt-2 text-xs text-gray-500">
                        <span>{piece.type_mime || 'Type inconnu'}</span>
                        <span className="mx-2">•</span>
                        <span>{(piece.taille / 1024).toFixed(2)} KB</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onPreview(piece)}
                      className="p-2"
                      aria-label={`Prévisualiser ${piece.piece?.nom}`}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center border border-gray-200 rounded-lg bg-gray-50">
          <FileText className="w-12 h-12 mx-auto text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune pièce jointe</h3>
          <p className="mt-1 text-sm text-gray-500">Ce dossier ne contient aucune pièce jointe.</p>
        </div>
      )}
      
      <div className="flex justify-center">
        <Button 
          variant="outline"
          onClick={() => window.location.href = `/agent/dossiers/${dossierId}/download-all`}
          className="flex items-center"
        >
          <Download className="w-4 h-4 mr-2" />
          Télécharger toutes les pièces (ZIP)
        </Button>
      </div>
    </div>
  );
}

// Sous-composant pour le panneau d'actions
function ActionsPanel({ 
  dossier, 
  ecoles, 
  filieres, 
  onValidate, 
  onReject, 
  canModify 
}) {
  const [showReorient, setShowReorient] = useState(false);
  const [showValidateDialog, setShowValidateDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  
  const { post, data, setData, processing, errors, reset, setError } = useForm({
    motif: '',
    ecole_id: '',
    filiere_id: '',
  });
  
  const { post: postDecision, data: decisionData, setData: setDecisionData, processing: processingDecision } = useForm({
    motif: '',
    motifError: '',
  });

  const handleValider = () => {
    onValidate();
    setShowValidateDialog(false);
  };
  
  const handleRefuser = () => {
    if (!decisionData.motif || decisionData.motif.trim() === '') {
      setDecisionData({ ...decisionData, motifError: 'Veuillez renseigner un motif pour le refus' });
      return;
    }
    
    onReject(decisionData.motif);
    setShowRejectDialog(false);
    setDecisionData({ motif: '', motifError: '' });
  };
  
  const handleReorienter = (e) => {
    e.preventDefault();
    
    // Validation des champs
    if (!data.ecole_id) {
      setError('ecole_id', 'Veuillez sélectionner une école');
      return;
    }
    
    if (!data.filiere_id) {
      setError('filiere_id', 'Veuillez sélectionner une filière');
      return;
    }
    
    // Utiliser Inertia.js pour soumettre le formulaire
    post(`/agent/dossiers/${dossier.id}/affecter`, {
      preserveScroll: true,
      onSuccess: () => {
        // Fermer le formulaire après succès
        setShowReorient(false);
        reset();
      },
      onError: (errors) => {
        console.error('Erreur lors de la réorientation:', errors);
      }
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="flex items-center text-lg font-medium text-gray-900">
        <Settings className="w-5 h-5 mr-2 text-gray-500" />
        Actions sur le dossier
      </h3>
      
      <div className="flex flex-wrap gap-4">
        <Dialog open={showValidateDialog} onOpenChange={setShowValidateDialog}>
          <DialogTrigger asChild>
            <Button 
              disabled={!canModify}
              className="flex items-center bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Valider
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center text-green-700">
                <CheckCircle className="w-5 h-5 mr-2" />
                Valider le dossier
              </DialogTitle>
              <DialogDescription>
                Êtes-vous sûr de vouloir valider ce dossier ? Cette action est irréversible.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowValidateDialog(false)}>
                Annuler
              </Button>
              <Button 
                onClick={handleValider} 
                disabled={processing}
                className="bg-green-600 hover:bg-green-700"
              >
                {processing ? 'Traitement...' : 'Confirmer'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
          <DialogTrigger asChild>
            <Button 
              variant="destructive" 
              disabled={!canModify}
              className="flex items-center"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Refuser
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center text-red-700">
                <XCircle className="w-5 h-5 mr-2" />
                Refuser le dossier
              </DialogTitle>
              <DialogDescription>
                Veuillez indiquer le motif du refus. Cette action est irréversible.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="motif">Motif du refus</Label>
                <Textarea
                  id="motif"
                  value={decisionData.motif}
                  onChange={(e) => setDecisionData({ motif: e.target.value, motifError: '' })}
                  placeholder="Raison du refus"
                  className="col-span-3"
                />
                {decisionData.motifError && (
                  <p className="text-sm text-red-500">{decisionData.motifError}</p>
                )}
              </div>
            </div>
            <DialogFooter className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
                Annuler
              </Button>
              <Button 
                onClick={handleRefuser} 
                disabled={processingDecision}
                variant="destructive"
              >
                {processingDecision ? 'Traitement...' : 'Confirmer'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <Button 
          variant="outline"
          onClick={() => setShowReorient(!showReorient)}
          disabled={!canModify}
          className="flex items-center"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Réorienter
        </Button>
      </div>
      
      {showReorient && (
        <Card className="border border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center text-yellow-800">
              <RotateCcw className="w-5 h-5 mr-2" />
              Réorienter la candidature
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleReorienter} className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Nouvelle école <span className="text-red-500">*</span>
                </label>
                <select 
                  value={data.ecole_id} 
                  onChange={e => setData('ecole_id', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.ecole_id ? 'border-red-500' : 'border-gray-300'
                  }`}
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
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Nouvelle filière <span className="text-red-500">*</span>
                  </label>
                  <select 
                    value={data.filiere_id} 
                    onChange={e => setData('filiere_id', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.filiere_id ? 'border-red-500' : 'border-gray-300'
                    }`}
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
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Motif (optionnel)
                </label>
                <Textarea
                  value={data.motif}
                  onChange={e => setData('motif', e.target.value)}
                  placeholder="Motif de la réorientation"
                  className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.motif ? 'border-red-500' : 'border-gray-300'
                  }`}
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
                  onClick={() => {
                    setShowReorient(false);
                    reset();
                  }}
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
            <CardTitle className="flex items-center text-red-800">
              <XCircle className="w-5 h-5 mr-2" />
              Motif du refus
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{dossier.raison_refus}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Sous-composant pour l'historique
function HistoryPanel({ historique }) {
  const formatDateTime = useMemo(() => (dateString) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return isNaN(date.getTime()) 
      ? 'Date invalide' 
      : date.toLocaleString('fr-FR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
  }, []);

  return (
    <div className="space-y-6">
      <h3 className="flex items-center text-lg font-medium text-gray-900">
        <History className="w-5 h-5 mr-2 text-gray-500" />
        Historique des modifications
      </h3>
      
      {historique && historique.length > 0 ? (
        <div className="space-y-4">
          {historique.map((hist, index) => (
            <div key={index} className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="flex justify-between">
                <div>
                  <p className="font-medium text-gray-900">
                    {hist.ancien_statut ? 
                      `Changement de statut : ${hist.ancien_statut} → ${hist.nouveau_statut}` : 
                      `Initialisation : ${hist.nouveau_statut}`
                    }
                  </p>
                  {hist.motif && (
                    <p className="mt-1 text-sm text-gray-600">{hist.motif}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    {formatDateTime(hist.modifie_le)}
                  </p>
                  <p className="text-xs text-gray-400">
                    {hist.modifiePar ? `Par ${hist.modifiePar.name}` : 'Utilisateur inconnu'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center border border-gray-200 rounded-lg bg-gray-50">
          <History className="w-12 h-12 mx-auto text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun historique</h3>
          <p className="mt-1 text-sm text-gray-500">Ce dossier n'a pas encore d'historique de modifications.</p>
        </div>
      )}
    </div>
  );
}

// Sous-composant pour les cartes d'information
function InfoCard({ icon, bgColor, title, value }) {
  return (
    <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
      <div className="flex items-center">
        <div className={`p-2 mr-3 ${bgColor} rounded-lg`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="font-medium">{value}</p>
        </div>
      </div>
    </div>
  );
}

// Composant principal
export default function DossierDetails({ dossier, ecoles, filieres }) {
  const { props } = usePage();
  const flash = props.flash || {};
  const [activeTab, setActiveTab] = useState("details");
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  
  const { post: postAction, processing } = useForm();
  
  // Vérifier les permissions (si disponibles)
  const canModify = useMemo(() => {
    if (!props.auth || !props.auth.user) return false;
    return props.auth.user.can_modify_dossiers !== false && 
           !['accepte', 'valide', 'rejete', 'reoriente'].includes(dossier.statut);
  }, [props.auth, dossier.statut]);
  
  // Fonctions pour les actions
  const handleValider = () => {
    postAction(`/agent/dossiers/${dossier.id}/valider`, {}, { 
      preserveScroll: true,
    });
  };
  
  const handleRefuser = (motif) => {
    postAction(`/agent/dossiers/${dossier.id}/rejeter`, { 
      motif 
    }, {
      preserveScroll: true,
    });
  };
  
  const handlePreview = (piece) => {
    setPreviewFile(piece);
    setShowPreviewModal(true);
  };
  
  // Fonctions utilitaires avec useMemo
  const getStatusColor = useMemo(() => (status) => {
    switch (status) {
      case 'soumis': return 'bg-gray-100 text-gray-800';
      case 'en_attente': return 'bg-blue-100 text-blue-800';
      case 'en_cours': return 'bg-yellow-100 text-yellow-800';
      case 'accepte': return 'bg-green-100 text-green-800';
      case 'valide': return 'bg-purple-100 text-purple-800';
      case 'rejete': return 'bg-red-100 text-red-800';
      case 'incomplet': return 'bg-orange-100 text-orange-800';
      case 'reoriente': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }, []);
  
  const getStatusIcon = useMemo(() => (status) => {
    switch (status) {
      case 'soumis': return <FileText className="w-4 h-4" />;
      case 'en_attente': return <Clock className="w-4 h-4" />;
      case 'en_cours': return <Loader className="w-4 h-4" />;
      case 'accepte': return <CheckCircle className="w-4 h-4" />;
      case 'valide': return <Shield className="w-4 h-4" />;
      case 'rejete': return <XCircle className="w-4 h-4" />;
      case 'incomplet': return <AlertCircle className="w-4 h-4" />;
      case 'reoriente': return <RotateCcw className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  }, []);
  
  const formatDate = useMemo(() => (dateString) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return isNaN(date.getTime()) 
      ? 'Date invalide' 
      : date.toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
  }, []);
  
  const getFileUrl = useMemo(() => (filePath) => {
    return filePath ? `/storage/${filePath}` : '';
  }, []);
  
  const renderPreview = useMemo(() => (piece) => {
    const fileUrl = getFileUrl(piece.fichier);
    const mimeType = piece.type_mime;
    
    if (!fileUrl) {
      return (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">Fichier non disponible</p>
        </div>
      );
    }
    
    if (mimeType && mimeType.startsWith('image/')) {
      return (
        <div className="flex items-center justify-center h-full">
          <img 
            src={fileUrl} 
            alt={piece.nom_original} 
            className="object-contain max-w-full max-h-full"
          />
        </div>
      );
    } else if (mimeType && mimeType.startsWith('video/')) {
      return (
        <div className="flex items-center justify-center h-full">
          <video 
            src={fileUrl} 
            controls 
            className="max-w-full max-h-full"
          >
            Votre navigateur ne supporte pas la lecture de cette vidéo.
          </video>
        </div>
      );
    } else if (mimeType && mimeType.includes('pdf')) {
      return (
        <div className="h-full">
          <iframe 
            src={fileUrl} 
            className="w-full h-full border-0"
            title={piece.nom_original}
          />
        </div>
      );
    } else {
      return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
          <FileIcon className="w-16 h-16 mb-4 text-gray-400" />
          <p className="font-medium text-gray-700">Aperçu non disponible</p>
          <p className="mt-2 text-gray-500">
            Ce type de fichier ne peut pas être prévisualisé. Veuillez le télécharger pour le consulter.
          </p>
          <Button 
            asChild 
            className="mt-4"
          >
            <a href={route('agent.dossiers.pieces.download', {
              dossierId: dossier.id,
              pieceId: piece.id
            })}>
              <Download className="w-4 h-4 mr-2" />
              Télécharger le fichier
            </a>
          </Button>
        </div>
      );
    }
  }, [getFileUrl, dossier.id]);

  return (
    <>
      <Head title={`Dossier - ${dossier.etudiant?.nom} ${dossier.etudiant?.prenom}`} />
      <AgentLayout>
        <div className="min-h-screen py-8 bg-gray-50">
          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            {/* Flash messages */}
            {flash.success && (
              <div className="p-4 mb-6 border-l-4 border-green-400 shadow-sm bg-green-50 rounded-r-md">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <p className="ml-3 text-green-700">{flash.success}</p>
                </div>
              </div>
            )}
            {flash.error && (
              <div className="p-4 mb-6 border-l-4 border-red-400 shadow-sm bg-red-50 rounded-r-md">
                <div className="flex items-center">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <p className="ml-3 text-red-700">{flash.error}</p>
                </div>
              </div>
            )}
            
            {/* En-tête avec actions */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="mb-4 md:mb-0">
                  <div className="flex items-center mb-2">
                    <Link href={route('agent.dossiers.index')} className="flex items-center text-gray-500 transition-colors hover:text-gray-700">
                      <ArrowLeft className="w-5 h-5 mr-1" />
                      Retour à la liste
                    </Link>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
                    Dossier de {dossier.etudiant?.nom} {dossier.etudiant?.prenom}
                  </h1>
                  <div className="flex flex-col mt-2 text-gray-600 sm:flex-row sm:items-center">
                    <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800 mb-2 sm:mb-0">
                      N° {dossier.numero_dossier}
                    </span>
                    <span className="hidden mx-0 text-gray-400 sm:mx-2 sm:inline">•</span>
                    <span>Créé le {formatDate(dossier.created_at)}</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <Badge className={`${getStatusColor(dossier.statut)} flex items-center px-3 py-1 rounded-full text-sm font-medium`}>
                    {getStatusIcon(dossier.statut)}
                    <span className="ml-2">{dossier.statut}</span>
                  </Badge>
                </div>
              </div>
            </div>
            
            {/* Contenu principal */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Colonne principale */}
              <div className="space-y-6 lg:col-span-2">
                {/* Carte principale avec onglets */}
                <Card className="overflow-hidden border border-gray-200 shadow-sm">
                  <CardContent className="p-0">
                    {/* Navigation par onglets personnalisée */}
                    <div className="flex border-b bg-gray-50" role="tablist">
                      {[
                        { id: "details", icon: <User className="w-4 h-4 mr-2" />, label: "Détails" },
                        { id: "pieces", icon: <FileText className="w-4 h-4 mr-2" />, label: "Pièces" },
                        { id: "actions", icon: <Settings className="w-4 h-4 mr-2" />, label: "Actions" },
                        { id: "historique", icon: <History className="w-4 h-4 mr-2" />, label: "Historique" },
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          role="tab"
                          aria-selected={activeTab === tab.id}
                          aria-controls={`${tab.id}-panel`}
                          tabIndex={activeTab === tab.id ? 0 : -1}
                          className={`px-4 py-3 font-medium text-sm flex-1 flex items-center justify-center ${
                            activeTab === tab.id
                              ? "text-blue-600 border-b-2 border-blue-500 bg-white"
                              : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                          }`}
                          onClick={() => setActiveTab(tab.id)}
                        >
                          {tab.icon}
                          {tab.label}
                        </button>
                      ))}
                    </div>
                    
                    {/* Contenu des onglets */}
                    <div className="p-6">
                      {activeTab === "details" && (
                        <div className="space-y-8" role="tabpanel" id="details-panel">
                          <PersonalInfo etudiant={dossier.etudiant} />
                          <ApplicationDetails dossier={dossier} />
                        </div>
                      )}
                      
                      {activeTab === "pieces" && (
                        <div role="tabpanel" id="pieces-panel">
                          <PiecesList 
                            pieces={dossier.pieces} 
                            onPreview={handlePreview}
                            dossierId={dossier.id}
                          />
                        </div>
                      )}
                      
                      {activeTab === "actions" && (
                        <div role="tabpanel" id="actions-panel">
                          <ActionsPanel 
                            dossier={dossier}
                            ecoles={ecoles}
                            filieres={filieres}
                            onValidate={handleValider}
                            onReject={handleRefuser}
                            canModify={canModify}
                          />
                        </div>
                      )}
                      
                      {activeTab === "historique" && (
                        <div role="tabpanel" id="historique-panel">
                          <HistoryPanel historique={dossier.historique} />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Colonne latérale */}
              <div className="space-y-6">
                {/* Carte d'informations rapides */}
                <Card className="border border-gray-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-medium text-gray-900">Informations rapides</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Date de soumission</span>
                      <span className="text-sm font-medium">
                        {dossier.date_soumission ? formatDate(dossier.date_soumission) : '—'}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">École souhaitée</span>
                      <span className="text-sm font-medium">
                        {dossier.etablissement || dossier.ecole?.nom || '—'}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Filière souhaitée</span>
                      <span className="text-sm font-medium">
                        {dossier.filiere_souhaitee || '—'}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Niveau d'étude</span>
                      <span className="text-sm font-medium">
                        {dossier.niveau_etude || '—'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Carte d'actions rapides */}
                <Card className="border border-gray-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-medium text-gray-900">Actions rapides</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {dossier.statut === 'en_attente' && canModify && (
                      <>
                        <Button className="justify-start w-full" asChild>
                          <Link href={route('agent.dossiers.valider', dossier.id)} method="post">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Valider le dossier
                          </Link>
                        </Button>
                        
                        <Button variant="outline" className="justify-start w-full" asChild>
                          <Link href={route('agent.dossiers.rejeter', dossier.id)} method="post">
                            <XCircle className="w-4 h-4 mr-2" />
                            Rejeter le dossier
                          </Link>
                        </Button>
                        
                        <Button variant="secondary" className="justify-start w-full" asChild>
                          <Link href={route('agent.dossiers.incomplet', dossier.id)} method="post">
                            <AlertCircle className="w-4 h-4 mr-2" />
                            Marquer comme incomplet
                          </Link>
                        </Button>
                      </>
                    )}
                  </CardContent>
                </Card>
                
                {/* Carte d'historique récent */}
                <Card className="border border-gray-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-medium text-gray-900">Historique récent</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {dossier.historique && dossier.historique.length > 0 ? (
                      <div className="space-y-4">
                        {dossier.historique.slice(0, 3).map((hist) => (
                          <div key={hist.id} className="pb-3 border-b border-gray-200 last:border-0 last:pb-0">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="p-1 mr-2 bg-gray-100 rounded-md">
                                  {getStatusIcon(hist.nouveau_statut)}
                                </div>
                                <div>
                                  <p className="text-sm font-medium">
                                    {hist.nouveau_statut}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {hist.modifie_le ? 
                                        formatDate(hist.modifie_le) : 
                                        'Date non disponible'
                                    }
                                  </p>
                                </div>
                              </div>
                              <ChevronRight className="w-4 h-4 text-gray-400" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">Aucun historique disponible.</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
        
        {/* Modal de prévisualisation amélioré */}
        {showPreviewModal && previewFile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75">
            <div className="bg-white rounded-xl w-full max-w-5xl h-[90vh] max-h-[90vh] flex flex-col shadow-2xl">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center">
                  {previewFile.type_mime && previewFile.type_mime.startsWith('image/') ? (
                    <FileImage className="w-5 h-5 mr-2" />
                  ) : previewFile.type_mime && previewFile.type_mime.startsWith('video/') ? (
                    <FileVideo className="w-5 h-5 mr-2" />
                  ) : (
                    <FileText className="w-5 h-5 mr-2" />
                  )}
                  <h3 className="max-w-md ml-2 text-lg font-medium text-gray-900 truncate">
                    {previewFile.piece?.nom || previewFile.nom_original}
                  </h3>
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    asChild
                    variant="outline"
                  >
                    <a href={route('agent.dossiers.pieces.download', {
                      dossierId: dossier.id,
                      pieceId: previewFile.id
                    })}>
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger
                    </a>
                  </Button>
                  <Button variant="outline" onClick={() => setShowPreviewModal(false)}>
                    Fermer
                  </Button>
                </div>
              </div>
              <div className="flex-1 p-4 overflow-auto bg-gray-100">
                {renderPreview(previewFile)}
              </div>
              <div className="flex justify-between p-3 text-sm text-gray-500 border-t border-gray-200 bg-gray-50">
                <span>Type: {previewFile.type_mime || 'Inconnu'}</span>
                <span>Taille: {(previewFile.taille / 1024).toFixed(2)} KB</span>
              </div>
            </div>
          </div>
        )}
      </AgentLayout>
    </>
  );
}