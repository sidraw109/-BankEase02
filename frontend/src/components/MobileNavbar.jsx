import React from 'react';
import { NavLink } from 'react-router-dom';
import { useBanking } from '../context/BankingContext';
import {
  FiGrid,
  FiRepeat,
  FiSend,
  FiBell,
  FiUser
} from 'react-icons/fi';

const MobileNavbar = () => {
  const { unreadCount } = useBanking();

  const items = [
    { label: 'Home', path: '/account', icon: FiGrid },
    { label: 'Transactions', path: '/transactions', icon: FiRepeat },
    { label: 'Payments', path: '/payments', icon: FiSend },
    { label: 'Notifications', path: '/notifications', icon: FiBell, badge: unreadCount },
    { label: 'Profile', path: '/profile', icon: FiUser }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#FFFFFF] border-t border-slate-200 lg:hidden shadow-lg pb-safe">
      <div className="flex items-center justify-around h-16 px-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center flex-1 py-1 text-[11px] font-medium transition-colors relative ${
                  isActive
                    ? 'text-[#2563EB] font-semibold'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`
              }
            >
              <div className="relative">
                <Icon className="w-5 h-5 mb-0.5" />
                {item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#DC2626] text-[9px] font-bold text-white">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </div>
              <span className="truncate">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNavbar;
