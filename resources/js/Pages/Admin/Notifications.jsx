import AdminLayout from "@/Layouts/AdminLayout";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bell, CheckCircle, AlertTriangle, Info, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Echo from 'laravel-echo';

const icons = {
  info: <Info className="text-blue-500" />,
  success: <CheckCircle className="text-green-600" />,
  warning: <AlertTriangle className="text-yellow-500" />,
  error: <XCircle className="text-red-600" />,
};

const fakeNotifications = [
  { id: 1, title: "Nouvelle inscription", body: "Jean M. a rejoint la plateforme.", type: "success", read: false, date: "2024-05-31 10:32" },
  { id: 2, title: "Candidature rejetée", body: "La candidature de Claire B. a été rejetée.", type: "error", read: false, date: "2024-05-30 14:22" },
  { id: 3, title: "Demande d’assistance", body: "L'étudiant Teddy N. a signalé un problème.", type: "warning", read: true, date: "2024-05-28 09:15" },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState(fakeNotifications);
  const [filter, setFilter] = useState("all");

  const filtered = notifications.filter(n =>
    filter === "all" ? true :
    filter === "read" ? n.read :
    !n.read
  );

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  useEffect(() => {
    // Remplacer les fausses notifications par les vraies si besoin
    window.Echo.channel('notifications')
      .listen('Illuminate\\Notifications\\Events\\BroadcastNotificationCreated', (e) => {
        setNotifications((prev) => [
          {
            id: e.id || Date.now(),
            title: e.data?.message || 'Nouvelle notification',
            body: e.data?.message || '',
            type: 'info',
            read: false,
            date: new Date().toLocaleString('fr-FR'),
          },
          ...prev,
        ]);
      });
  }, []);

  return (
    <div className="min-h-screen py-10 px-6 md:px-20 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Bell className="w-6 h-6 text-yellow-400" />
          Notifications
        </h1>
        <p className="text-muted-foreground">Toutes les alertes système et mises à jour récentes.</p>
      </motion.div>

      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div className="flex gap-2">
          <Button variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")}>Toutes</Button>
          <Button variant={filter === "unread" ? "default" : "outline"} onClick={() => setFilter("unread")}>Non lues</Button>
          <Button variant={filter === "read" ? "default" : "outline"} onClick={() => setFilter("read")}>Lues</Button>
        </div>
      </div>

      <div className="space-y-4">
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
              {!notif.read && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => markAsRead(notif.id)}
                >
                  Marquer comme lue
                </Button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

Notifications.layout = (page) => <AdminLayout>{page}</AdminLayout>;
