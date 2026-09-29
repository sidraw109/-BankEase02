import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBanking } from '../context/BankingContext';
import {
  FiBell,
  FiChevronDown,
  FiUser,
  FiLogOut,
  FiMenu,
  FiShield,
  FiCheckCircle,
  FiArrowRight
} from 'react-icons/fi';

const Navbar = ({ onOpenMobileMenu }) => {
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markNotificationRead } = useBanking();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const navigate = useNavigate();

  const profileRef = useRef(null);
  const notifRef = useRef(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const recentNotifs = notifications.slice(0, 4);

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#FFFFFF] border-b border-slate-200/80 shadow-subtle px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      {/* Left side: Mobile Toggle & Brand indicator */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-[#0F172A] hover:bg-[#F8FAFC] border border-slate-200"
          aria-label="Open navigation menu"
        >
          <FiMenu className="w-5 h-5" />
        </button>

        <div className="lg:hidden flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center text-white font-bold text-sm">
            BE
          </div>
          <span className="font-bold text-lg text-[#0F172A]">
            Bank<span className="text-[#2563EB]">Ease</span>
          </span>
        </div>

        <div className="hidden lg:block text-xs font-medium text-[#64748B]">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EFF6FF] text-[#2563EB] font-semibold border border-[#BFDBFE]">
            <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse"></span>
            BankEase 256-bit SSL Secure
          </span>
        </div>
      </div>

      {/* Right side: Notifications & Profile dropdown */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Notifications Icon & Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setNotifOpen(prev => !prev);
              setProfileOpen(false);
            }}
            className="relative p-2.5 rounded-xl text-[#0F172A] hover:bg-[#F8FAFC] border border-slate-200 transition-colors"
            aria-label="Notifications"
          >
            <FiBell className="w-5 h-5 text-[#0F172A]" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#DC2626] text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Quick Notification Dropdown */}
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#FFFFFF] shadow-modal border border-slate-200 py-2 animate-fade-in z-50">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-sm text-[#0F172A]">Notifications</h4>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#EFF6FF] text-[#2563EB]">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <Link
                  to="/notifications"
                  onClick={() => setNotifOpen(false)}
                  className="text-xs text-[#2563EB] hover:text-[#1E3A8A] font-semibold flex items-center gap-1"
                >
                  View All <FiArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {recentNotifs.length === 0 ? (
                  <div className="p-6 text-center text-xs text-[#64748B]">
                    No notifications
                  </div>
                ) : (
                  recentNotifs.map(n => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`p-3.5 hover:bg-[#F8FAFC] cursor-pointer transition-colors ${
                        !n.read ? 'bg-[#EFF6FF]/40' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-semibold text-[#0F172A]">
                          {n.title}
                        </p>
                        <span className="text-[10px] text-[#94A3B8] whitespace-nowrap">
                          {n.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-[#64748B] mt-1 line-clamp-2">
                        {n.message}
                      </p>
                    </div>
                  ))
                )}
              </div>

              <div className="p-2 border-t border-slate-100 text-center">
                <Link
                  to="/notifications"
                  onClick={() => setNotifOpen(false)}
                  className="block py-1.5 text-xs font-semibold text-[#2563EB] hover:underline"
                >
                  Manage all notifications
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => {
              setProfileOpen(prev => !prev);
              setNotifOpen(false);
            }}
            className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 hover:bg-[#F8FAFC] transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-[#1E3A8A] text-[#BFDBFE] font-bold text-xs flex items-center justify-center">
              {user?.avatarInitials || 'SR'}
            </div>
            <div className="hidden sm:block text-left">
              <span className="block text-sm font-semibold text-[#0F172A] leading-tight">
                {user?.name?.split(' ')[0] || 'Siddharth'}
              </span>
              <span className="block text-[11px] text-[#64748B] leading-none">
                Customer
              </span>
            </div>
            <FiChevronDown className="w-4 h-4 text-[#64748B]" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#FFFFFF] shadow-modal border border-slate-200 py-2 animate-fade-in z-50">
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-sm font-bold text-[#0F172A]">{user?.name}</p>
                <p className="text-xs text-[#64748B] truncate">{user?.email}</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-[#EFF6FF] text-[#2563EB]">
                  {user?.accountType}
                </span>
              </div>

              <div className="py-1">
                <Link
                  to="/profile"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[#0F172A] hover:bg-[#F8FAFC]"
                >
                  <FiUser className="w-4 h-4 text-[#64748B]" />
                  <span>My Profile</span>
                </Link>
                <Link
                  to="/fraud-help"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[#0F172A] hover:bg-[#F8FAFC]"
                >
                  <FiShield className="w-4 h-4 text-[#64748B]" />
                  <span>Security & Help</span>
                </Link>
              </div>

              <div className="border-t border-slate-100 pt-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[#DC2626] hover:bg-[#DC2626]/10"
                >
                  <FiLogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
