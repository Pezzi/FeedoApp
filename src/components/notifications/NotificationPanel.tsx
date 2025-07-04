import React from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import { type Notification } from '../../hooks/useNotifications';

interface NotificationPanelProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

function timeAgo(date: string) {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " anos";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " meses";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " dias";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " horas";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutos";
  return Math.floor(seconds) + " segundos";
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ notifications = [], onMarkAsRead, onMarkAllAsRead }) => {
  return (
    <div
      className="absolute right-0 mt-2 w-80 sm:w-96 max-h-[70vh] flex flex-col rounded-lg shadow-lg z-50 backdrop-blur-md"
      style={{ backgroundColor: 'rgba(35, 35, 35, 0.9)', border: '1px solid rgba(221, 242, 71, 0.2)' }}
    >
      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
        <h3 className="font-semibold text-white">Notificações</h3>
        <button onClick={onMarkAllAsRead} className="text-xs text-lemon hover:underline flex items-center gap-1">
          <CheckCheck className="h-3 w-3" />
          Marcar todas como lidas
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Bell className="h-12 w-12 mx-auto mb-2" />
            <p>Nenhuma notificação nova.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-700">
            {notifications.map((notification) => (
              // AQUI ESTÁ A CORREÇÃO DA "KEY"
              <div 
                key={notification.id} 
                className={`p-4 transition-colors ${!notification.is_read ? 'hover:bg-gray-700/50 cursor-pointer' : 'opacity-60'}`}
                onClick={() => !notification.is_read && onMarkAsRead(notification.id)}
              >
                <div className="flex items-start gap-3">
                  {!notification.is_read && (<div className="w-2.5 h-2.5 rounded-full bg-lemon mt-1.5 flex-shrink-0"></div>)}
                  <div className={`flex-1 ${notification.is_read ? 'ml-[22px]' : ''}`}>
                    <p className="text-sm text-white">{notification.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{timeAgo(notification.created_at)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};