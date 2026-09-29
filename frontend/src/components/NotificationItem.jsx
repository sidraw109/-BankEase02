import React from 'react';
import { 
  FiRepeat, 
  FiShield, 
  FiFileText, 
  FiAlertTriangle, 
  FiCheck, 
  FiTrash2,
  FiClock
} from 'react-icons/fi';

const NotificationItem = ({ notification, onMarkRead, onDelete }) => {
  const getCategoryTheme = (category) => {
    switch (category) {
      case 'Transaction':
        return {
          icon: FiRepeat,
          badgeBg: 'bg-[#EFF6FF]',
          badgeText: 'text-[#2563EB]',
          iconBg: 'bg-[#EFF6FF] text-[#2563EB]'
        };
      case 'Security':
        return {
          icon: FiShield,
          badgeBg: 'bg-[#1E3A8A]/10',
          badgeText: 'text-[#1E3A8A]',
          iconBg: 'bg-[#1E3A8A]/10 text-[#1E3A8A]'
        };
      case 'Payment':
        return {
          icon: FiFileText,
          badgeBg: 'bg-[#16A34A]/10',
          badgeText: 'text-[#16A34A]',
          iconBg: 'bg-[#16A34A]/10 text-[#16A34A]'
        };
      case 'Warning':
        return {
          icon: FiAlertTriangle,
          badgeBg: 'bg-[#F59E0B]/10',
          badgeText: 'text-[#F59E0B]',
          iconBg: 'bg-[#F59E0B]/15 text-[#F59E0B]'
        };
      default:
        return {
          icon: FiRepeat,
          badgeBg: 'bg-[#EFF6FF]',
          badgeText: 'text-[#2563EB]',
          iconBg: 'bg-[#EFF6FF] text-[#2563EB]'
        };
    }
  };

  const theme = getCategoryTheme(notification.category);
  const Icon = theme.icon;

  return (
    <div
      className={`group relative p-4 sm:p-5 rounded-2xl border transition-all duration-200 ${
        notification.read
          ? 'bg-[#FFFFFF] border-slate-200/80 hover:border-slate-300'
          : 'bg-[#EFF6FF]/40 border-[#BFDBFE] shadow-subtle'
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Category Icon */}
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${theme.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${theme.badgeBg} ${theme.badgeText}`}>
                {notification.category}
              </span>
              {!notification.read && (
                <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse"></span>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-xs text-[#94A3B8]">
              <FiClock className="w-3.5 h-3.5" />
              <span>{notification.timestamp}</span>
            </div>
          </div>

          <h4 className="text-sm font-semibold text-[#0F172A] mt-2">
            {notification.title}
          </h4>

          <p className="text-xs sm:text-sm text-[#64748B] mt-1 leading-relaxed">
            {notification.message}
          </p>

          {notification.details && (
            <div className="mt-2.5 p-2.5 rounded-lg bg-[#FFFFFF] border border-slate-200/80 text-xs text-[#64748B] font-mono">
              {notification.details}
            </div>
          )}

          {/* Action buttons */}
          <div className="mt-3.5 flex items-center gap-3">
            {!notification.read && (
              <button
                onClick={() => onMarkRead(notification.id)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2563EB] hover:text-[#1E3A8A] transition-colors"
              >
                <FiCheck className="w-3.5 h-3.5" />
                <span>Mark as read</span>
              </button>
            )}

            <button
              onClick={() => onDelete(notification.id)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#64748B] hover:text-[#DC2626] transition-colors"
            >
              <FiTrash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
