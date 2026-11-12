'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight, User, Calendar, Ticket, MessageCircle, Heart, Star } from 'lucide-react';
import Link from 'next/link';
import useAuthStore from '@/stores/authStore';

const notificationIcons = {
  order: Ticket,
  ticket: Ticket,
  event: Calendar,
  user: User,
  message: MessageCircle,
  promotion: Heart,
  review: Star,
};

const notificationColors = {
  order: 'bg-primary-accent/10 text-primary-accent',
  ticket: 'bg-success/10 text-success',
  event: 'bg-secondary-accent/10 text-secondary-accent',
  user: 'bg-warning/10 text-warning',
  message: 'bg-blue-500/10 text-blue-500',
  promotion: 'bg-pink-500/10 text-pink-500',
  review: 'bg-yellow-500/10 text-yellow-500',
};

// Mock notifications - replace with real data.
// Built at module scope so no impure call happens during render.
const MOCK_NOW = Date.now();
const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: 'order',
    title: 'Pembayaran Berhasil',
    message: 'Pembayaran untuk Java Jazz Festival 2026 telah berhasil.',
    time: new Date(MOCK_NOW - 1000 * 60 * 5),
    read: false,
    link: '/my-tickets',
  },
  {
    id: 2,
    type: 'event',
    title: 'Coldplay Tour Rilis',
    message: 'Tiket Coldplay: Music of the Spheres kini tersedia!',
    time: new Date(MOCK_NOW - 1000 * 60 * 60 * 2),
    read: false,
    link: '/festivals/coldplay',
  },
  {
    id: 3,
    type: 'ticket',
    title: 'Tiket Siap Check-in',
    message: 'Tiket Dewa 19 Reunion Tour siap digunakan.',
    time: new Date(MOCK_NOW - 1000 * 60 * 60 * 24),
    read: true,
    link: '/my-tickets',
  },
];

export default function NotificationBell({ className = '' }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const user = useAuthStore((state) => state.user);

  const notifications = MOCK_NOTIFICATIONS;

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatTime = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Baru saja';
    if (minutes < 60) return `${minutes} menit lalu`;
    if (hours < 24) return `${hours} jam lalu`;
    if (days === 1) return 'Kemarin';
    return `${days} hari lalu`;
  };

  const markAsRead = (id) => {
    // Update notification as read
    console.log('Mark as read:', id);
  };

  const markAllAsRead = () => {
    // Mark all as read
    console.log('Mark all as read');
  };

  if (!user) return null;

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full text-text-secondary hover:text-text-primary hover:bg-surface transition-colors cursor-pointer"
        aria-label="Notifikasi"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>

        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-error text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-80 bg-secondary-bg border border-border rounded-[18px] shadow-xl overflow-hidden z-50"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <h3 className="font-semibold text-text-primary">Notifikasi</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-primary-accent hover:underline"
                >
                  Tandai semua dibaca
                </button>
              )}
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center mx-auto mb-3">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-muted">
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                  </div>
                  <p className="text-sm text-text-muted">Belum ada notifikasi</p>
                </div>
              ) : (
                notifications.map((notification) => {
                  const Icon = notificationIcons[notification.type] || Ticket;
                  const colorClass = notificationColors[notification.type];

                  return (
                    <Link
                      key={notification.id}
                      href={notification.link}
                      onClick={() => {
                        setIsOpen(false);
                        if (!notification.read) markAsRead(notification.id);
                      }}
                      className={`flex gap-3 px-4 py-3 hover:bg-surface transition-colors border-b border-border/50 last:border-0 ${
                        !notification.read ? 'bg-primary-accent/5' : ''
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${colorClass}`}>
                        <Icon size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium text-text-primary truncate">
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <span className="w-2 h-2 rounded-full bg-primary-accent shrink-0 mt-1" />
                          )}
                        </div>
                        <p className="text-xs text-text-muted mt-0.5 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-text-muted/70 mt-1">
                          {formatTime(notification.time)}
                        </p>
                      </div>
                    </Link>
                  );
                })
              )}
            </div>

            {notifications.length > 0 && (
              <div className="px-4 py-3 border-t border-border">
                <Link
                  href="/notifications"
                  className="flex items-center justify-center gap-1 text-sm text-primary-accent hover:underline"
                  onClick={() => setIsOpen(false)}
                >
                  Lihat semua notifikasi
                  <ChevronRight size={14} />
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
