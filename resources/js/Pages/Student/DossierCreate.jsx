import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { motion, AnimatePresence } from 'framer-motion';
import { usePage } from '@inertiajs/inertia-react';
import illustration from '@/assets/scholarship-illustration.svg';

const steps = [
  'Informations personnelles',
  'Parcours scolaire',
  'Choix des écoles/options',
  'Pièces jointes',
  'Récapitulatif'
];

export default function DossierCreate({ ecoles, bourses }) {
  const { errors } = usePage().props;
  const [step, setStep] = useState(0);
  const [values, setValues] = useState({
    nom: '',
    email: '',
    bourse_id: '',
    parcours: '',
    choix_ecoles: [{ ecole: '', options: ['', ''] }, { ecole: '', options: ['', ''] }, { ecole: '', options: ['', ''] }],
    pieces: {},
  });

  function handleChange(e) {
    setValues({ ...values, [e.target.name]: e.target.value });
  }

  function handleChoixChange(i, field, val) {
    const choix = [...values.choix_ecoles];
    if (field === 'ecole') choix[i].ecole = val;
    else choix[i].options = val;
    setValues({ ...values, choix_ecoles: choix });
  }

  function handleFileChange(e) {
    setValues({ ...values, pieces: { ...values.pieces, [e.target.name]: e.target.files[0] } });
  }

  function nextStep() { setStep(s => Math.min(s + 1, steps.length - 1)); }
  function prevStep() { setStep(s => Math.max(s - 1, 0)); }

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(values).forEach(([k, v]) => {
      if (k === 'choix_ecoles') formData.append(k, JSON.stringify(v));
      else if (k === 'pieces') Object.entries(v).forEach(([name, file]) => file && formData.append(`pieces[${name}]`, file));
      else formData.append(k, v);
    });
    Inertia.post(route('etudiant.dossiers.store'), formData);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-yellow-100 dark:from-zinc-900 dark:to-zinc-800">
      <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-8 relative">
        <img src={illustration} alt="Scholarship" className="w-32 absolute -top-16 left-1/2 -translate-x-1/2" />
        <div className="flex justify-between mb-8">
          {steps.map((s, i) => (
            <div key={i} className={`flex-1 text-center ${i === step ? 'font-bold text-green-700 dark:text-yellow-400' : 'text-gray-400 dark:text-zinc-500'}`}>{s}</div>
          ))}
        </div>
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
              <h2 className="text-xl font-semibold mb-4">Informations personnelles</h2>
              <input name="nom" value={values.nom} onChange={handleChange} placeholder="Nom complet" className="form-input mb-3 w-full" />
              <input name="email" value={values.email} onChange={handleChange} placeholder="Email" className="form-input mb-3 w-full" />
              <label className="block mb-1">Choix de la bourse <span className="text-red-500">*</span></label>
              <select name="bourse_id" value={values.bourse_id} onChange={handleChange} className="form-select mb-3 w-full" required>
                <option value="">Sélectionner une bourse</option>
                {bourses && bourses.map(b => (
                  <option key={b.id} value={b.id}>{b.nom} ({b.montant} FCFA)</option>
                ))}
              </select>
              {errors && errors.bourse_id && <div className="text-red-500 text-sm mb-2">{errors.bourse_id}</div>}
              <button className="btn btn-primary mt-4" onClick={nextStep}>Suivant</button>
            </motion.div>
          )}
          {step === 1 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
              <h2 className="text-xl font-semibold mb-4">Parcours scolaire</h2>
              <textarea name="parcours" value={values.parcours} onChange={handleChange} placeholder="Décrivez votre parcours scolaire jusqu'au bac..." className="form-textarea w-full mb-3" rows={4} />
              <div className="flex justify-between">
                <button className="btn btn-secondary" onClick={prevStep}>Précédent</button>
                <button className="btn btn-primary" onClick={nextStep}>Suivant</button>
              </div>
            </motion.div>
          )}
          {step === 2 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
              <h2 className="text-xl font-semibold mb-4">Choix des écoles et options</h2>
              {values.choix_ecoles.map((choix, i) => (
                <div key={i} className="mb-4 p-4 border rounded">
                  <label className="block mb-1">École #{i + 1} (obligatoire)</label>
                  <select value={choix.ecole} onChange={e => handleChoixChange(i, 'ecole', e.target.value)} className="form-select w-full mb-2">
                    <option value="">Sélectionner une école</option>
                    {ecoles.map(e => <option key={e.id} value={e.id}>{e.nom}</option>)}
                  </select>
                  <label className="block mb-1">Options/filières (au moins 2)</label>
                  {[0, 1].map(j => (
                    <input key={j} value={choix.options[j] || ''} onChange={e => {
                      const opts = [...choix.options]; opts[j] = e.target.value; handleChoixChange(i, 'options', opts);
                    }} placeholder={`Option ${j + 1}`} className="form-input w-full mb-1" />
                  ))}
                </div>
              ))}
              <div className="flex justify-between">
                <button className="btn btn-secondary" onClick={prevStep}>Précédent</button>
                <button className="btn btn-primary" onClick={nextStep}>Suivant</button>
              </div>
            </motion.div>
          )}
          {step === 3 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
              <h2 className="text-xl font-semibold mb-4">Pièces jointes</h2>
              <div className="mb-3">
                <label className="block mb-1">Carte d'identité (PDF/JPG)</label>
                <input type="file" name="identite" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} className="form-input w-full" />
              </div>
              <div className="mb-3">
                <label className="block mb-1">Diplôme du bac (PDF/JPG)</label>
                <input type="file" name="bac" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} className="form-input w-full" />
              </div>
              <div className="mb-3">
                <label className="block mb-1">Relevés de notes (PDF/JPG)</label>
                <input type="file" name="releves" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} className="form-input w-full" />
              </div>
              <div className="flex justify-between">
                <button className="btn btn-secondary" onClick={prevStep}>Précédent</button>
                <button className="btn btn-primary" onClick={nextStep}>Suivant</button>
              </div>
            </motion.div>
          )}
          {step === 4 && (
            <motion.div key="step5" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
              <h2 className="text-xl font-semibold mb-4">Récapitulatif</h2>
              <div className="mb-4">Merci de vérifier vos informations avant de soumettre votre dossier.</div>
              {/* Affichage du récapitulatif ici */}
              <div className="flex justify-between">
                <button className="btn btn-secondary" onClick={prevStep}>Précédent</button>
                <button className="btn btn-success" onClick={handleSubmit}>Soumettre la candidature</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
