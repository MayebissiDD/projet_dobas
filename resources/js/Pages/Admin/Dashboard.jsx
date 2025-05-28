import AdminLayout from '@/Layouts/AdminLayout';
import { motion } from 'framer-motion';
import { User, ShieldCheck, Database, Users } from 'lucide-react';

export default function Dashboard() {
  const stats = [
    { icon: <User className="w-6 h-6" />, label: 'Utilisateurs', value: 48 },
    { icon: <Users className="w-6 h-6" />, label: 'Étudiants', value: 36 },
    { icon: <ShieldCheck className="w-6 h-6" />, label: 'Agents', value: 10 },
    { icon: <Database className="w-6 h-6" />, label: 'Candidatures', value: 120 },
  ];

  return (
    <div className="min-h-screen py-10 px-6 md:px-20 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-10"
      >
        <h1 className="text-3xl font-bold">Tableau de bord Admin</h1>
        <p className="text-muted-foreground mt-2">Vue d'ensemble de la plateforme.</p>
      </motion.div>

      <motion.div
        className="grid md:grid-cols-4 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {stats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-zinc-800 shadow rounded-xl p-5 flex flex-col items-start gap-3">
            <div className="bg-green-700 text-white rounded-full p-2">
              {stat.icon}
            </div>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-16"
      >
        <h2 className="text-xl font-semibold mb-4">Activités récentes</h2>
        <ul className="space-y-3 text-sm">
          <li className="border-l-4 border-green-700 pl-3">Nouvel étudiant inscrit : <strong>Jean M.</strong></li>
          <li className="border-l-4 border-yellow-500 pl-3">Agent <strong>Clara A.</strong> a validé une candidature</li>
          <li className="border-l-4 border-red-600 pl-3">Candidature rejetée pour <strong>Mbemba T.</strong></li>
        </ul>
      </motion.div>
    </div>
  );
}

Dashboard.layout = page => <AdminLayout>{page}</AdminLayout>;
