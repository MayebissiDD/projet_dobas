import StudentLayout from '@/Layouts/StudentLayout';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { usePage } from '@inertiajs/react';

const icons = {
  info: <Info className="text-blue-500" />,
  success: <CheckCircle className="text-green-600" />,
  warning: <AlertTriangle className="text-yellow-500" />,
  error: <XCircle className="text-red-600" />,
};

export default function DossiersNotifications({ dossiers = [] }) {
  const { flash } = usePage().props;
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    window.Echo.private(`App.Models.User.${window.userId}`)
      .notification((notification) => {
        setNotifications((prev) => [
          {
            id: notification.id || Date.now(),
            title: notification.message || 'Notification',
            body: notification.message || '',
            type: notification.type || 'info',
            read: false,
            date: new Date().toLocaleString('fr-FR'),
          },
          ...prev,
        ]);
      });
  }, []);

  const filtered = notifications.filter(n =>
    filter === 'all' ? true :
    filter === 'read' ? n.read :
    !n.read
  );

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const archive = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="min-h-screen py-10 px-6 md:px-20 bg-gradient-to-br from-white via-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800 text-zinc-900 dark:text-white">
      {flash.success && (
        <div className="mb-4 p-3 rounded bg-green-100 text-green-800 border border-green-300">
          {flash.success}
        </div>
      )}
      {flash.error && (
        <div className="mb-4 p-3 rounded bg-red-100 text-red-800 border border-red-300">
          {flash.error}
        </div>
      )}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Bell className="w-6 h-6 text-green-500" />
          Mes dossiers de candidature
        </h1>
        <p className="text-muted-foreground">Suivi en temps réel de vos candidatures, pièces et paiements.</p>
      </motion.div>
      <div className="space-y-8 mb-12">
        {dossiers.length === 0 && (
          <div className="text-center text-zinc-400">Aucun dossier soumis pour l’instant.</div>
        )}
        {dossiers.map((dossier) => (
          <div key={dossier.id} className="rounded-xl border shadow-sm bg-white dark:bg-zinc-800 p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
              <div>
                <div className="font-semibold text-lg">{dossier.bourse?.nom}</div>
                <div className="text-zinc-500 text-sm">Soumis le {dossier.date_soumission ? new Date(dossier.date_soumission).toLocaleDateString('fr-FR') : ''}</div>
              </div>
              <div>
                <span className={
                  dossier.statut === 'accepté' ? 'text-green-600 font-semibold' :
                  dossier.statut === 'rejeté' ? 'text-red-600 font-semibold' :
                  'text-yellow-500 font-semibold'
                }>
                  {dossier.statut}
                </span>
              </div>
            </div>
            <div className="mt-2">
              <h4 className="font-semibold mb-1">Pièces et justificatifs</h4>
              {dossier.pieces && dossier.pieces.length > 0 ? (
                <ul className="list-disc ml-6">
                  {dossier.pieces.map((piece) => (
                    <li key={piece.id}>
                      {piece.nom_piece} :
                      {piece.url_fichier ? (
                        <a href={piece.url_fichier} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline ml-2">Voir le fichier</a>
                      ) : (
                        <span className="text-zinc-400 ml-2">Aucun fichier</span>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="text-zinc-400">Aucune pièce jointe</span>
              )}
            </div>
          </div>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Bell className="w-5 h-5 text-green-500" />
          Mes notifications
        </h2>
        <p className="text-muted-foreground mb-4">Alertes et informations importantes.</p>
        <div className="flex gap-2 mb-6">
          <Button variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')}>Toutes</Button>
          <Button variant={filter === 'unread' ? 'default' : 'outline'} onClick={() => setFilter('unread')}>Non lues</Button>
          <Button variant={filter === 'read' ? 'default' : 'outline'} onClick={() => setFilter('read')}>Lues</Button>
        </div>
        <div className="space-y-4">
          {filtered.length === 0 && (
            <div className="text-center text-zinc-400">Aucune notification pour l’instant.</div>
          )}
          {filtered.map((notif) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 }}
              className={cn(
                "p-4 rounded-lg shadow-sm border",
                notif.read ? "bg-zinc-100 dark:bg-zinc-800" : "bg-green-50 dark:bg-zinc-700"
              )}
            >
              <div className="flex items-start gap-4">
                <div className="mt-1">{icons[notif.type] || <Info />}</div>
                <div className="flex-1">
                  <h3 className="text-md font-semibold">{notif.title}</h3>
                  <p className="text-sm text-muted-foreground">{notif.body}</p>
                  <p className="text-xs text-zinc-500 mt-1">{notif.date}</p>
                </div>
                <div className="flex flex-col gap-2">
                  {!notif.read && (
                    <Button size="sm" variant="secondary" onClick={() => markAsRead(notif.id)}>
                      Marquer comme lue
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => archive(notif.id)}>
                    Archiver
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

DossiersNotifications.layout = (page) => <StudentLayout>{page}</StudentLayout>;
