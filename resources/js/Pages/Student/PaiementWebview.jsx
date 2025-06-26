import StudentLayout from '@/Layouts/StudentLayout';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const MODES = [
  { key: 'mobile_money', label: 'Mobile Money (Airtel/MTN)' },
  { key: 'stripe', label: 'Carte bancaire (Stripe)' },
];

export default function PaiementWebview({ montant = 10000, dossierId }) {
  const [mode, setMode] = useState('mobile_money');
  const [loading, setLoading] = useState(false);

  const handlePay = () => {
    setLoading(true);
    // Redirection ou ouverture de la webview selon le mode choisi
    if (mode === 'mobile_money') {
      window.location.href = `/paiement/lygos?dossier=${dossierId}`;
    } else {
      window.location.href = `/paiement/stripe?dossier=${dossierId}`;
    }
  };

  return (
    <div className="min-h-screen py-10 px-6 md:px-20 bg-gradient-to-br from-white via-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800 text-zinc-900 dark:text-white flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 w-full max-w-lg"
      >
        <h1 className="text-3xl font-bold mb-2">Paiement de la candidature</h1>
        <p className="text-muted-foreground mb-6">Montant à régler : <span className="font-semibold text-green-700">{montant} FCFA</span></p>
        <div className="mb-6">
          <label className="block mb-2 font-medium">Choisissez votre mode de paiement :</label>
          <div className="flex gap-4">
            {MODES.map((m) => (
              <Button
                key={m.key}
                variant={mode === m.key ? 'default' : 'outline'}
                onClick={() => setMode(m.key)}
                className="flex-1"
              >
                {m.label}
              </Button>
            ))}
          </div>
        </div>
        <Button
          onClick={handlePay}
          disabled={loading}
          className="w-full bg-green-700 hover:bg-green-800 text-lg py-3"
        >
          {loading ? 'Redirection...' : 'Payer maintenant'}
        </Button>
      </motion.div>
    </div>
  );
}

PaiementWebview.layout = (page) => <StudentLayout>{page}</StudentLayout>;
