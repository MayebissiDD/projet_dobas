// resources/js/Pages/Student/Notifications.jsx
import { Head } from "@inertiajs/react";
import StudentLayout from "@/Layouts/StudentLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Link } from "@inertiajs/react";
import { 
  Bell, 
  Check, 
  Archive, 
  Filter,
  Inbox,
  MailOpen,
  AlertCircle,
  Info,
  CheckCircle,
  XCircle
} from "lucide-react";

export default function Notifications({ notifications, unreadCount }) {
  const [filter, setFilter] = useState('all');
  const [filteredNotifications, setFilteredNotifications] = useState(notifications.data);
  
  useEffect(() => {
    // Écouter les nouvelles notifications en temps réel
    window.Echo.private(`App.Models.User.${window.userId}`)
      .notification((notification) => {
        // Ajouter la nouvelle notification à la liste
        const newNotification = {
          id: notification.id,
          type: notification.type,
          message: notification.data.message || 'Notification',
          read_at: null,
          created_at: new Date().toLocaleString('fr-FR'),
        };
        
        setFilteredNotifications(prev => [newNotification, ...prev]);
      });
  }, []);

  useEffect(() => {
    // Filtrer les notifications selon le filtre sélectionné
    if (filter === 'all') {
      setFilteredNotifications(notifications.data);
    } else if (filter === 'unread') {
      setFilteredNotifications(notifications.data.filter(n => !n.read_at));
    } else if (filter === 'read') {
      setFilteredNotifications(notifications.data.filter(n => n.read_at));
    }
  }, [filter, notifications]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'App\\Notifications\\DossierAccepteNotification':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'App\\Notifications\\DossierRejeteNotification':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'App\\Notifications\\DossierEnCoursNotification':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'App\\Notifications\\PaiementRecuNotification':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const markAsRead = (id) => {
    // Envoyer une requête pour marquer la notification comme lue
    fetch(`/etudiant/notifications/${id}/read`, {
      method: 'POST',
      headers: {
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
        'Content-Type': 'application/json',
      },
    })
    .then(response => {
      if (response.ok) {
        // Mettre à jour l'état local
        setFilteredNotifications(prev => 
          prev.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n)
        );
      }
    });
  };

  const markAllAsRead = () => {
    // Envoyer une requête pour marquer toutes les notifications comme lues
    fetch('/etudiant/notifications/read-all', {
      method: 'POST',
      headers: {
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
        'Content-Type': 'application/json',
      },
    })
    .then(response => {
      if (response.ok) {
        // Mettre à jour l'état local
        setFilteredNotifications(prev => 
          prev.map(n => ({ ...n, read_at: new Date().toISOString() }))
        );
      }
    });
  };

  return (
    <>
      <Head title="Mes notifications" />
      <StudentLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mes notifications</h1>
              <p className="mt-1 text-sm text-gray-600">
                Suivez l'évolution de vos candidatures et paiements
              </p>
            </div>
            {unreadCount > 0 && (
              <Button onClick={markAllAsRead} variant="outline">
                <MailOpen className="mr-2 h-4 w-4" />
                Tout marquer comme lu
              </Button>
            )}
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Bell className="mr-2 h-5 w-5" />
                  Notifications
                  {unreadCount > 0 && (
                    <Badge className="ml-2 bg-red-500 text-white">
                      {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
                    </Badge>
                  )}
                </CardTitle>
                <div className="flex space-x-2">
                  <Button 
                    variant={filter === 'all' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setFilter('all')}
                  >
                    <Inbox className="mr-1 h-4 w-4" />
                    Toutes
                  </Button>
                  <Button 
                    variant={filter === 'unread' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setFilter('unread')}
                  >
                    <MailOpen className="mr-1 h-4 w-4" />
                    Non lues
                  </Button>
                  <Button 
                    variant={filter === 'read' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setFilter('read')}
                  >
                    <Check className="mr-1 h-4 w-4" />
                    Lues
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredNotifications.length > 0 ? (
                <div className="flow-root">
                  <ul className="-mb-8">
                    {filteredNotifications.map((notification, index) => (
                      <li key={notification.id}>
                        <div className="relative pb-8">
                          {index !== filteredNotifications.length - 1 ? (
                            <span
                              className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                              aria-hidden="true"
                            />
                          ) : null}
                          <div className="relative flex space-x-3">
                            <div>
                              <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${notification.read_at ? 'bg-gray-200' : 'bg-blue-500'}`}>
                                {getNotificationIcon(notification.type)}
                              </span>
                            </div>
                            <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                              <div>
                                <p className={`text-sm ${notification.read_at ? 'text-gray-500' : 'text-gray-900 font-medium'}`}>
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {notification.created_at}
                                </p>
                              </div>
                              <div className="text-right">
                                {!notification.read_at && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => markAsRead(notification.id)}
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Bell className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune notification</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {filter === 'unread' 
                      ? "Vous n'avez aucune notification non lue." 
                      : "Vous n'avez aucune notification pour le moment."}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </StudentLayout>
    </>
  );
}