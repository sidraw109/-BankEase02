import React, { useState, useMemo } from 'react';
import { useBanking } from '../context/BankingContext';
import NotificationItem from '../components/NotificationItem';
import {
  FiBell,
  FiCheckCircle,
  FiFilter,
  FiShield,
  FiRepeat,
  FiFileText,
  FiAlertTriangle,
  FiInbox
} from 'react-icons/fi';

const Notifications = () => {
  const { 
    notifications, 
    unreadCount, 
    markNotificationRead, 
    markAllNotificationsRead, 
    deleteNotification 
  } = useBanking();

  const [activeFilter, setActiveFilter] = useState('ALL');

  // Filtered notifications
  const filteredNotifications = useMemo(() => {
    if (activeFilter === 'ALL') return notifications;
    if (activeFilter === 'UNREAD') return notifications.filter(n => !n.read);
    return notifications.filter(n => n.category === activeFilter);
  }, [notifications, activeFilter]);

  // Category counts
  const categoryCounts = useMemo(() => {
    return {
      ALL: notifications.length,
      UNREAD: unreadCount,
      Transaction: notifications.filter(n => n.category === 'Transaction').length,
      Security: notifications.filter(n => n.category === 'Security').length,
      Payment: notifications.filter(n => n.category === 'Payment').length,
      Warning: notifications.filter(n => n.category === 'Warning').length
    };
  }, [notifications, unreadCount]);

  const filterTabs = [
    { id: 'ALL', label: 'All Alerts', count: categoryCounts.ALL },
    { id: 'UNREAD', label: 'Unread', count: categoryCounts.UNREAD, highlight: unreadCount > 0 },
    { id: 'Transaction', label: 'Transactions', count: categoryCounts.Transaction, icon: FiRepeat },
    { id: 'Security', label: 'Security', count: categoryCounts.Security, icon: FiShield },
    { id: 'Payment', label: 'Payments', count: categoryCounts.Payment, icon: FiFileText },
    { id: 'Warning', label: 'Warnings', count: categoryCounts.Warning, icon: FiAlertTriangle }
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
              Notifications
            </h2>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#DC2626] text-white">
                {unreadCount} unread
              </span>
            )}
          </div>
          <p className="text-sm text-[#64748B] mt-1">
            Stay informed with real-time banking updates & security alerts
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllNotificationsRead}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FFFFFF] border border-slate-200 hover:border-[#BFDBFE] hover:bg-[#EFF6FF] text-[#2563EB] text-xs font-semibold shadow-subtle transition-all active:scale-95"
          >
            <FiCheckCircle className="w-4 h-4 text-[#2563EB]" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {filterTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeFilter === tab.id
                ? 'bg-[#2563EB] text-white shadow-md shadow-blue-600/20'
                : 'bg-[#FFFFFF] text-[#64748B] hover:text-[#0F172A] border border-slate-200 hover:border-[#BFDBFE]'
            }`}
          >
            {tab.icon && <tab.icon className="w-3.5 h-3.5" />}
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeFilter === tab.id
                  ? 'bg-white/20 text-white'
                  : tab.highlight
                  ? 'bg-red-100 text-[#DC2626]'
                  : 'bg-slate-100 text-[#64748B]'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#FFFFFF] border border-slate-200 shadow-subtle">
            <FiInbox className="w-12 h-12 text-[#94A3B8] mx-auto mb-3" />
            <h4 className="text-base font-bold text-[#0F172A]">No Notifications</h4>
            <p className="text-xs text-[#64748B] mt-1">
              You do not have any notifications matching this filter category.
            </p>
          </div>
        ) : (
          filteredNotifications.map(notification => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkRead={markNotificationRead}
              onDelete={deleteNotification}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
