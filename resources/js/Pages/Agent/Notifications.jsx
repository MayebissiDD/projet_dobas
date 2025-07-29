import AgentLayout from '@/Layouts/AgentLayout';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Inertia } from '@inertiajs/inertia';
import { usePage } from '@inertiajs/react';

// Icônes par type
const icons = {
  info: <Info className="text-blue-500" />,
  success: <CheckCircle className="text-green-600" />,
  warning: <AlertTriangle className="text-yellow-500" />,
  error: <XCircle className="text-red-600" />,
};

// Couleur de bordure par type
const borderColor = {
  info: 'border-blue-400',
  success: 'border-green-400',
  warning: 'border-yellow-400',
  error: 'border-red-400',
};

export default function AgentNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const { props } = usePage();

  // Réception en temps réel
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

  // Marquer tout comme lu
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map(n => ({ ...n, read: true })));
    Inertia.post(route('notifications.markAllAsRead')); // backend
  };

  // Marquer une seule comme lue
  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  // Archiver (supprimer localement)
  const archive = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Filtrage
  const filtered = notifications.filter(n =>
    filter === 'all' ? true :
    filter === 'read' ? n.read :
    !n.read
  );

  // Regroupement par date
  const groupedByDate = filtered.reduce((groups, notif) => {
    const date = new Date(notif.date).toLocaleDateString('fr-FR', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
    if (!groups[date]) groups[date] = [];
    groups[date].push(notif);
    return groups;
  }, {});

  return (
    <AgentLayout>
      <div className="py-10 px-6 md:px-20 bg-gradient-to-br from-white via-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800 text-zinc-900 dark:text-white">

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-1 flex items-center gap-2">
              <Bell className="w-6 h-6 text-green-500" />
              Notifications agent
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="ml-2 text-sm bg-red-600 text-white px-2 py-0.5 rounded-full">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </h1>
            <p className="text-muted-foreground text-sm">
              Alertes en temps réel sur les dossiers, paiements et candidatures.
            </p>
          </div>

          <Button onClick={markAllAsRead} variant="secondary">
            Tout marquer comme lues
          </Button>
        </motion.div>

        {/* Filtres */}
        <div className="flex gap-2 mb-6">
          <Button variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')}>Toutes</Button>
          <Button variant={filter === 'unread' ? 'default' : 'outline'} onClick={() => setFilter('unread')}>Non lues</Button>
          <Button variant={filter === 'read' ? 'default' : 'outline'} onClick={() => setFilter('read')}>Lues</Button>
        </div>

        {/* Notifications groupées */}
        {Object.entries(groupedByDate).map(([date, notifs]) => (
          <div key={date} className="mb-8">
            <h3 className="text-lg font-semibold text-zinc-600 dark:text-zinc-300 mb-4">{date}</h3>
            <div className="space-y-4">
              {notifs.map((notif) => (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 }}
                  className={cn(
                    "p-4 rounded-lg shadow-sm border",
                    notif.read ? "bg-zinc-100 dark:bg-zinc-800" : "bg-green-50 dark:bg-zinc-700",
                    borderColor[notif.type] || 'border-zinc-300'
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
          </div>
        ))}
      </div>
    </AgentLayout>
  );
}
