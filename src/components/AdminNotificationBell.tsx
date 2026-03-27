"use client";

import { useState, useEffect, useRef } from 'react';
import { Bell, ShoppingCart, Info, Check } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { api } from '@/utils/api';
import Link from 'next/link';

export default function AdminNotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      const data = await api.get('/notifications');
      setNotifications(data || []);
    } catch (err) {
      console.error('Failed to fetch notifications in bell:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Poll every minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllAsRead = async () => {
    try {
      const unread = notifications.filter(n => !n.isRead);
      await Promise.all(unread.map(n => api.put(`/notifications/${n._id}/read`, {})));
      fetchNotifications();
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-stone-400 hover:text-stone-900 transition-colors group"
      >
        <Bell className="w-5 h-5" strokeWidth={1.5} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-stone-900 text-white text-[8px] font-bold flex items-center justify-center rounded-full border-2 border-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-stone-200 rounded-xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] z-50 overflow-hidden animate-fade-in origin-top-right">
          <div className="px-5 py-4 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-stone-900">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="text-[9px] font-bold uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-colors"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length > 0 ? (
              <div className="divide-y divide-stone-50">
                {notifications.map((n: any) => (
                  <div key={n._id} className={`px-5 py-4 hover:bg-stone-50/30 transition-colors ${!n.isRead ? 'bg-stone-50/10' : ''}`}>
                    <div className="flex gap-3">
                      <div className={`mt-0.5 p-1.5 rounded-lg h-fit ${n.type === 'NEW_ORDER' ? 'bg-green-50 text-green-600' : 'bg-stone-50 text-stone-400'}`}>
                        {n.type === 'NEW_ORDER' ? <ShoppingCart className="w-3 h-3" /> : <Info className="w-3 h-3" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-medium text-stone-900 leading-snug mb-1">{n.title}</p>
                        <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed mb-2">{n.message}</p>
                        <time className="text-[9px] font-bold uppercase tracking-tight text-stone-300">
                          {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                        </time>
                      </div>
                      {!n.isRead && (
                        <div className="w-1.5 h-1.5 rounded-full bg-stone-900 mt-2 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-5 py-12 text-center">
                <Bell className="w-6 h-6 text-stone-100 mx-auto mb-3" />
                <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">No notifications yet</p>
              </div>
            )}
          </div>
          
          <div className="px-5 py-3 border-t border-stone-100 bg-stone-50/30 text-center">
             <Link 
              href="/admin" 
              onClick={() => setIsOpen(false)}
              className="text-[9px] font-bold uppercase tracking-widest text-stone-500 hover:text-stone-900 transition-colors"
             >
               View All Activity
             </Link>
          </div>
        </div>
      )}
    </div>
  );
}
