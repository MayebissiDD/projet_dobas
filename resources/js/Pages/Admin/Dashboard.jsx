import AdminLayout from '@/Layouts/AdminLayout';
import { motion } from 'framer-motion';
import { User, ShieldCheck, Database, Users, Bell } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [stats, setStats] = useState({
    utilisateurs: 0,
    etudiants: 0,
    agents: 0,
    candidaturesAcceptees: 0,
    candidaturesRejetees: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        utilisateurs: Math.min(prev.utilisateurs + 1, 48),
        etudiants: Math.min(prev.etudiants + 1, 36),
        agents: Math.min(prev.agents + 1, 10),
        candidaturesAcceptees: Math.min(prev.candidaturesAcceptees + 1, 90),
        candidaturesRejetees: Math.min(prev.candidaturesRejetees + 1, 30)
      }));
    }, 40);
    return () => clearInterval(interval);
  }, []);

  const notifications = [
    "Nouvel étudiant inscrit : Jean M.",
    "Agent Clara A. a validé une candidature",
    "Candidature rejetée pour Mbemba T."
  ];

  const graphData = [
    { name: 'Jan', utilisateurs: 20, candidatures: 15 },
    { name: 'Fév', utilisateurs: 35, candidatures: 28 },
    { name: 'Mar', utilisateurs: 40, candidatures: 36 },
    { name: 'Avr', utilisateurs: 48, candidatures: 50 },
  ];

  return (
    <div className="min-h-screen py-10 px-6 md:px-20 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
      {/* Notifications */}
      <div className="flex justify-end mb-4">
        <div className="relative">
          <button onClick={() => setShowNotifications(!showNotifications)} className="relative">
            <Bell className="w-6 h-6 text-green-700 dark:text-yellow-400" />
            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
              {notifications.length}
            </span>
          </button>
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-2xl z-50 p-4">
              <h3 className="text-sm font-semibold mb-2">Notifications</h3>
              <ul className="text-xs space-y-2">
                {notifications.map((notif, index) => (
                  <li key={index} className="border-b border-zinc-200 dark:border-zinc-600 pb-2 last:border-b-0">{notif}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

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
        className="grid md:grid-cols-4 gap-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {[{
          label: 'Utilisateurs', value: stats.utilisateurs, icon: <User className="w-6 h-6" />
        }, {
          label: 'Étudiants', value: stats.etudiants, icon: <Users className="w-6 h-6" />
        }, {
          label: 'Agents', value: stats.agents, icon: <ShieldCheck className="w-6 h-6" />
        }, {
          label: 'Candidatures', value: `${stats.candidaturesAcceptees} ✅ / ${stats.candidaturesRejetees} ❌`, icon: <Database className="w-6 h-6" />
        }].map((stat, i) => (
          <motion.div
            key={i}
            className="bg-white dark:bg-zinc-800 shadow-lg rounded-2xl p-6 flex flex-col items-start gap-4 hover:shadow-2xl transition-all duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <div className="bg-green-600 text-white rounded-full p-2 shadow">
              {stat.icon}
            </div>
            <p className="text-sm text-muted-foreground tracking-wide">{stat.label}</p>
            <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <motion.div
          className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition duration-300"
          whileHover={{ y: -5 }}
        >
          <h2 className="text-lg font-semibold mb-4">Tendance des candidatures</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={graphData} className="rounded">
              <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip contentStyle={{ backgroundColor: '#f9fafb', borderRadius: '0.5rem' }} />
              <Legend />
              <Line type="monotone" dataKey="candidatures" stroke="#22c55e" strokeWidth={3} dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition duration-300"
          whileHover={{ y: -5 }}
        >
          <h2 className="text-lg font-semibold mb-4">Activités récentes</h2>
          <ul className="space-y-3 text-sm">
            <li className="border-l-4 border-green-700 pl-3">Nouvel étudiant inscrit : <strong>Jean M.</strong></li>
            <li className="border-l-4 border-yellow-500 pl-3">Agent <strong>Clara A.</strong> a validé une candidature</li>
            <li className="border-l-4 border-red-600 pl-3">Candidature rejetée pour <strong>Mbemba T.</strong></li>
          </ul>
        </motion.div>
      </motion.div>
    </div>
  );
}

Dashboard.layout = page => <AdminLayout>{page}</AdminLayout>;
