import { useEffect, useState } from 'react';
import { fetchNotifications, markAsRead } from '../api/notification';

interface Notification {
  id: string;
  content: string;
  read: boolean;
  createdAt: string;
}

export default function NotificationPanel() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  const loadNotifications = async () => {
    try {
      const data = await fetchNotifications();
      setNotifications(data);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    }
  };

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 15000); // Poll every 15s
    return () => clearInterval(interval);
  }, []);

  const handleClick = async (notif: Notification) => {
    if (!notif.read) {
      await markAsRead(notif.id);
      loadNotifications();
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="relative">
        🔔
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 text-xs bg-red-500 text-white rounded-full px-1">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white border rounded shadow z-50">
          <div className="p-2 text-sm font-bold border-b">Notifications</div>
          <ul className="max-h-60 overflow-y-auto">
            {notifications.length === 0 && (
              <li className="p-2 text-gray-500">No notifications</li>
            )}
            {notifications.map((notif) => (
              <li
                key={notif.id}
                onClick={() => handleClick(notif)}
                className={`p-2 text-sm cursor-pointer hover:bg-gray-100 ${
                  !notif.read ? 'font-semibold' : 'text-gray-600'
                }`}
              >
                <div>{notif.content}</div>
                <div className="text-xs text-gray-400">
                  {new Date(notif.createdAt).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
