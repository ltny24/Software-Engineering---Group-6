import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { notificationService, NotificationItem } from '../services/notificationApi';

import './NotificationsPage.css';

export default function NotificationsPage() {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await notificationService.list();
      setItems(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load notifications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleMarkRead = async (id: number) => {
    try {
      await notificationService.markRead(id);
      setItems((prev) => prev.map((n) => (n.notificationId === id ? { ...n, read: true } : n)));
    } catch {
      toast.error('Failed to mark as read.');
    }
  };

  const markAllRead = async () => {
    const unread = items.filter((n) => !n.read);
    if (unread.length === 0) return;
    try {
      await Promise.all(unread.map((n) => notificationService.markRead(n.notificationId)));
      setItems((prev) => prev.map((n) => ({ ...n, read: true })));
      toast.success('All notifications marked as read.');
    } catch {
      toast.error('Failed to mark all as read.');
    }
  };

  const unreadCount = items.filter((n) => !n.read).length;

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <h1>Notifications</h1>
        {unreadCount > 0 && (
          <button className="notif-mark-all" onClick={markAllRead}>
            Mark all as read ({unreadCount})
          </button>
        )}
      </div>

      {loading ? (
        <p className="notif-muted">Loading notifications…</p>
      ) : error ? (
        <p className="notif-error">{error}</p>
      ) : items.length === 0 ? (
        <div className="notif-empty">
          <p>You have no notifications.</p>
        </div>
      ) : (
        <ul className="notif-list">
          {items.map((n) => (
            <li
              key={n.notificationId}
              className={`notif-item${n.read ? '' : ' notif-item--unread'}`}
            >
              <div className="notif-body">
                <div className="notif-title-row">
                  <strong>{n.title}</strong>
                  <span className="notif-time">{new Date(n.createdAt).toLocaleString()}</span>
                </div>
                <p className="notif-message">{n.message}</p>
              </div>
              {!n.read && (
                <button className="notif-read-btn" onClick={() => handleMarkRead(n.notificationId)}>
                  Mark read
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
