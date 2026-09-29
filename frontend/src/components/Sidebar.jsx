import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBanking } from '../context/BankingContext';
import {
  FiGrid,
  FiRepeat,
  FiSend,
  FiBell,
  FiShield,
  FiUser,
  FiLogOut,
  FiCreditCard
} from 'react-icons/fi';

const Sidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const { logout, user } = useAuth();
  const { unreadCount } = useBanking();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Account', path: '/account', icon: FiGrid },
    { label: 'Transactions', path: '/transactions', icon: FiRepeat },
    { label: 'Payments', path: '/payments', icon: FiSend },
    { 
      label: 'Notifications', 
      path: '/notifications', 
      icon: FiBell,
      badge: unreadCount > 0 ? unreadCount : null 
    },
    { label: 'Fraud & Help', path: '/fraud-help', icon: FiShield },
    { label: 'Profile', path: '/profile', icon: FiUser }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-[#0F172A]/70 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#0F172A] text-white flex flex-col justify-between border-r border-[#1E3A8A]/40 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div>
          <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-800/80">
            <div className="w-10 h-10 rounded-xl bg-[#2563EB] flex items-center justify-center shadow-md">
              <FiCreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1">
                Bank<span className="text-[#3B82F6]">Ease</span>
              </h1>
              <p className="text-[10px] uppercase tracking-wider text-[#94A3B8] font-medium">
                NextGen Net Banking
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 mt-2">
            <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">
              Main Menu
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                      isActive
                        ? 'bg-[#2563EB] text-white shadow-md shadow-blue-900/40'
                        : 'text-[#94A3B8] hover:bg-[#1E3A8A] hover:text-white'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-[#DC2626] text-white">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout at bottom */}
        <div className="p-4 border-t border-slate-800/80 space-y-3">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="w-9 h-9 rounded-full bg-[#1E3A8A] text-[#BFDBFE] font-bold text-xs flex items-center justify-center border border-[#3B82F6]/40">
              {user?.avatarInitials || 'SR'}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-sm font-semibold text-white truncate">
                {user?.name || 'Siddharth'}
              </p>
              <p className="text-xs text-[#94A3B8] truncate">
                ID: {user?.customerId || 'BE102938'}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#94A3B8] hover:text-white hover:bg-[#DC2626]/20 hover:border hover:border-[#DC2626]/40 transition-colors"
          >
            <FiLogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
