import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectItem, SelectContent, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle } from 'lucide-react';

export default function AffectationEcoleForm({ dossier, ecoles, filieres }) {
  const [selected, setSelected] = useState({
    ecole_id: dossier.ecole_id || '',
    filiere_id: dossier.filiere_id || ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  function handleEcoleChange(e) {
    const ecoleId = e.target.value;
    setSelected({ 
      ...selected, 
      ecole_id: ecoleId, 
      filiere_id: '' // Réinitialiser la filière quand l'école change
    });
    setError('');
    setSuccess('');
  }
  
  function handleFiliereChange(e) {
    setSelected({ ...selected, filiere_id: e.target.value });
    setError('');
    setSuccess('');
  }
  
  function handleSubmit(e) {
    e.preventDefault();
    
    if (!selected.ecole_id) {
      setError('Veuillez sélectionner une école.');
      return;
    }
    
    if (!selected.filiere_id) {
      setError('Veuillez sélectionner une filière.');
      return;
    }
    
    // Vérifier que la filière appartient à l'école
    const filiere = filieres.find(f => f.id == selected.filiere_id);
    const ecole = ecoles.find(e => e.id == selected.ecole_id);
    
    if (!filiere || !ecole || filiere.ecole_id !== ecole.id) {
      setError('Cette filière n\'appartient pas à l\'école sélectionnée.');
      return;
    }
    
    // Vérifier la capacité de l'école
    if (ecole.placesRestantes <= 0) {
      setError('Cette école n\'a plus de places disponibles.');
      return;
    }
    
    Inertia.post(route('agent.dossiers.affecter', dossier.id), selected, {
      onSuccess: () => {
        setSuccess('Dossier affecté avec succès!');
        setError('');
      },
      onError: (errors) => {
        setError(errors.message || 'Une erreur est survenue lors de l\'affectation.');
      }
    });
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-yellow-500" />
          Affectation à une école
        </CardTitle>
      </CardHeader>
      <CardContent>
        {success && (
          <div className="mb-4 p-3 rounded bg-green-100 text-green-800 border border-green-300 flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            {success}
          </div>
        )}
        
        {error && (
          <div className="mb-4 p-3 rounded bg-red-100 text-red-800 border border-red-300 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="ecole_id" className="block font-medium mb-1">
              École d'affectation
            </Label>
            <Select 
              value={selected.ecole_id} 
              onValueChange={handleEcoleChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionner une école" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Sélectionner une école</SelectItem>
                {ecoles.map(ecole => (
                  <SelectItem 
                    key={ecole.id} 
                    value={ecole.id} 
                    disabled={ecole.placesRestantes <= 0}
                  >
                    {ecole.nom} (places restantes : {ecole.placesRestantes})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {selected.ecole_id && (
            <div>
              <Label htmlFor="filiere_id" className="block font-medium mb-1">
                Filière
              </Label>
              <Select 
                value={selected.filiere_id} 
                onValueChange={handleFiliereChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner une filière" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Sélectionner une filière</SelectItem>
                  {filieres
                    .filter(f => f.ecole_id == selected.ecole_id)
                    .map(filiere => (
                      <SelectItem key={filiere.id} value={filiere.id}>
                        {filiere.nom}
                      </SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="flex justify-end space-x-3">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => window.history.back()}
            >
              Annuler
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              Affecter
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}