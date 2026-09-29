import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBanking } from '../context/BankingContext';
import Modal from '../components/Modal';
import {
  FiUser,
  FiMail,
  FiPhone,
  FiCreditCard,
  FiMapPin,
  FiLock,
  FiShield,
  FiLogOut,
  FiEdit2,
  FiCheckCircle,
  FiEye,
  FiEyeOff
} from 'react-icons/fi';

const Profile = () => {
  const { user, logout, updateProfile } = useAuth();
  const { addToast, isCardBlocked, isAccountBlocked } = useBanking();
  const navigate = useNavigate();

  // Modals
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isSecuritySettingsOpen, setIsSecuritySettingsOpen] = useState(false);
  const [showPhone, setShowPhone] = useState(false);

  // Edit Profile Form State
  const [editForm, setEditForm] = useState({
    name: user?.name || 'Siddharth Rawat',
    email: user?.email || 'siddharth@example.com',
    phone: user?.phone || '+91 98765 43210',
    address: user?.address || 'Flat 402, Green Glen Heights, Bengaluru, KA 560103'
  });

  // Change Password Form State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');

  const handleEditProfileSubmit = (e) => {
    e.preventDefault();
    if (!editForm.name.trim() || !editForm.email.trim() || !editForm.phone.trim()) {
      addToast('Please fill in all profile fields.', 'danger');
      return;
    }

    const initials = editForm.name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

    updateProfile({
      ...editForm,
      avatarInitials: initials
    });

    addToast('Profile updated successfully.', 'success');
    setIsEditProfileOpen(false);
  };

  const handleChangePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordError('');

    if (!passwordForm.currentPassword) {
      setPasswordError('Please enter your current password.');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    addToast('Password changed successfully. Please keep your credentials secure.', 'success');
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setIsChangePasswordOpen(false);
  };

  const handleLogout = () => {
    logout();
    addToast('You have been securely logged out.', 'info');
    navigate('/login');
  };

  const maskedPhone = user?.phone
    ? user.phone.replace(/(\+91\s?)(\d{5})(\d{5})/, '$1XXXXX $3')
    : '+91 XXXXX XXXXX';

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
          Profile
        </h2>
        <p className="text-sm text-[#64748B] mt-1">
          Manage your personal details, credentials, and banking preferences
        </p>
      </div>

      {/* Main Profile Header Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#FFFFFF] border border-slate-200/90 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1E3A8A] to-[#2563EB] text-[#FFFFFF] font-extrabold text-2xl flex items-center justify-center shadow-md shadow-blue-500/20 border-2 border-white">
              {user?.avatarInitials || 'SR'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-bold text-[#0F172A]">
                  {user?.name || 'Siddharth Rawat'}
                </h3>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#16A34A]/10 text-[#16A34A]">
                  <FiCheckCircle className="w-3.5 h-3.5" />
                  Verified
                </span>
              </div>
              <p className="text-xs sm:text-sm font-mono text-[#2563EB] font-semibold mt-0.5">
                Customer ID: {user?.customerId || 'BE102938'}
              </p>
              <p className="text-xs text-[#94A3B8] mt-1">
                Member since {user?.joinedDate || 'January 2022'}
              </p>
            </div>
          </div>

          {/* Quick status indicators */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-xl bg-[#EFF6FF] text-[#2563EB] text-xs font-semibold border border-[#BFDBFE]">
              {user?.accountType || 'Savings Account'}
            </span>
            {isCardBlocked && (
              <span className="px-3 py-1 rounded-xl bg-red-100 text-[#DC2626] text-xs font-semibold">
                Debit Card Blocked
              </span>
            )}
            {isAccountBlocked && (
              <span className="px-3 py-1 rounded-xl bg-red-100 text-[#DC2626] text-xs font-semibold">
                Account Locked
              </span>
            )}
          </div>
        </div>

        {/* Profile Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 text-sm">
          {/* Email */}
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200/80">
            <div className="flex items-center gap-2 text-xs text-[#64748B] mb-1">
              <FiMail className="w-4 h-4 text-[#2563EB]" />
              <span className="font-semibold uppercase tracking-wider">Email Address</span>
            </div>
            <p className="font-medium text-[#0F172A] truncate">
              {user?.email || 'siddharth@example.com'}
            </p>
            <span className="text-[11px] text-[#16A34A] font-semibold mt-1 inline-block">
              Primary &bull; Verified
            </span>
          </div>

          {/* Phone */}
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200/80">
            <div className="flex items-center justify-between text-xs text-[#64748B] mb-1">
              <div className="flex items-center gap-2">
                <FiPhone className="w-4 h-4 text-[#2563EB]" />
                <span className="font-semibold uppercase tracking-wider">Phone</span>
              </div>
              <button
                onClick={() => setShowPhone(!showPhone)}
                className="text-[11px] font-semibold text-[#2563EB] hover:underline"
              >
                {showPhone ? 'Mask' : 'Reveal'}
              </button>
            </div>
            <p className="font-medium font-mono text-[#0F172A]">
              {showPhone ? user?.phone || '+91 98765 43210' : maskedPhone}
            </p>
            <span className="text-[11px] text-[#16A34A] font-semibold mt-1 inline-block">
              SMS Alerts Enabled
            </span>
          </div>

          {/* Account Type */}
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200/80">
            <div className="flex items-center gap-2 text-xs text-[#64748B] mb-1">
              <FiCreditCard className="w-4 h-4 text-[#2563EB]" />
              <span className="font-semibold uppercase tracking-wider">Account Type</span>
            </div>
            <p className="font-medium text-[#0F172A]">
              {user?.accountType || 'Savings Account'}
            </p>
            <span className="text-[11px] font-mono text-[#64748B] mt-1 inline-block">
              A/C: {user?.accountNumber || 'XXXX XXXX 4521'}
            </span>
          </div>

          {/* Branch */}
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200/80">
            <div className="flex items-center gap-2 text-xs text-[#64748B] mb-1">
              <FiMapPin className="w-4 h-4 text-[#2563EB]" />
              <span className="font-semibold uppercase tracking-wider">Branch</span>
            </div>
            <p className="font-medium text-[#0F172A]">
              {user?.branch || 'Main Branch'}
            </p>
            <span className="text-[11px] font-mono text-[#64748B] mt-1 inline-block">
              IFSC: {user?.ifsc || 'BKES0001024'}
            </span>
          </div>

          {/* Residential Address */}
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200/80 md:col-span-2">
            <div className="flex items-center gap-2 text-xs text-[#64748B] mb-1">
              <FiMapPin className="w-4 h-4 text-[#2563EB]" />
              <span className="font-semibold uppercase tracking-wider">Registered Address</span>
            </div>
            <p className="font-medium text-[#0F172A]">
              {user?.address || 'Flat 402, Green Glen Heights, Bengaluru, KA 560103'}
            </p>
          </div>
        </div>
      </div>

      {/* Profile Actions Cards */}
      <div>
        <h3 className="text-lg font-bold text-[#0F172A] mb-4">
          Account Actions
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Edit Profile */}
          <button
            onClick={() => {
              setEditForm({
                name: user?.name || '',
                email: user?.email || '',
                phone: user?.phone || '',
                address: user?.address || ''
              });
              setIsEditProfileOpen(true);
            }}
            className="p-5 rounded-2xl bg-[#FFFFFF] border border-slate-200/90 shadow-subtle hover:border-[#BFDBFE] hover:shadow-card text-left transition-all group flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mb-3 group-hover:bg-[#2563EB] group-hover:text-white transition-colors">
              <FiEdit2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#0F172A]">Edit Profile</h4>
              <p className="text-xs text-[#64748B] mt-1">
                Update contact information and registered address
              </p>
            </div>
            <span className="mt-4 text-xs font-semibold text-[#2563EB]">
              Update Details &rarr;
            </span>
          </button>

          {/* Change Password */}
          <button
            onClick={() => {
              setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
              setPasswordError('');
              setIsChangePasswordOpen(true);
            }}
            className="p-5 rounded-2xl bg-[#FFFFFF] border border-slate-200/90 shadow-subtle hover:border-[#BFDBFE] hover:shadow-card text-left transition-all group flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mb-3 group-hover:bg-[#2563EB] group-hover:text-white transition-colors">
              <FiLock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#0F172A]">Change Password</h4>
              <p className="text-xs text-[#64748B] mt-1">
                Modify your internet banking access password
              </p>
            </div>
            <span className="mt-4 text-xs font-semibold text-[#2563EB]">
              Change &rarr;
            </span>
          </button>

          {/* Security Settings */}
          <button
            onClick={() => setIsSecuritySettingsOpen(true)}
            className="p-5 rounded-2xl bg-[#FFFFFF] border border-slate-200/90 shadow-subtle hover:border-[#BFDBFE] hover:shadow-card text-left transition-all group flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mb-3 group-hover:bg-[#2563EB] group-hover:text-white transition-colors">
              <FiShield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#0F172A]">Security Settings</h4>
              <p className="text-xs text-[#64748B] mt-1">
                2FA, login history, and device permissions
              </p>
            </div>
            <span className="mt-4 text-xs font-semibold text-[#2563EB]">
              Manage &rarr;
            </span>
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="p-5 rounded-2xl bg-[#FFFFFF] border border-slate-200/90 shadow-subtle hover:border-red-200 hover:shadow-card text-left transition-all group flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-xl bg-red-50 text-[#DC2626] flex items-center justify-center mb-3 group-hover:bg-[#DC2626] group-hover:text-white transition-colors">
              <FiLogOut className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#DC2626]">Logout</h4>
              <p className="text-xs text-[#64748B] mt-1">
                Safely end your current Net Banking session
              </p>
            </div>
            <span className="mt-4 text-xs font-semibold text-[#DC2626]">
              Sign Out &rarr;
            </span>
          </button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        title="Edit Profile Information"
        footer={
          <>
            <button
              onClick={() => setIsEditProfileOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#64748B] hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              onClick={handleEditProfileSubmit}
              className="px-5 py-2 rounded-xl bg-[#2563EB] text-white text-xs font-semibold hover:bg-[#1E3A8A]"
            >
              Save Changes
            </button>
          </>
        }
      >
        <form onSubmit={handleEditProfileSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-slate-200 text-sm focus:outline-none focus:border-[#2563EB]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={editForm.email}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-slate-200 text-sm focus:outline-none focus:border-[#2563EB]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1">
              Phone Number
            </label>
            <input
              type="text"
              value={editForm.phone}
              onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-slate-200 text-sm font-mono focus:outline-none focus:border-[#2563EB]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1">
              Registered Address
            </label>
            <textarea
              rows={3}
              value={editForm.address}
              onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-slate-200 text-sm focus:outline-none focus:border-[#2563EB]"
            />
          </div>
        </form>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
        title="Change Internet Banking Password"
        footer={
          <>
            <button
              onClick={() => setIsChangePasswordOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#64748B] hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              onClick={handleChangePasswordSubmit}
              className="px-5 py-2 rounded-xl bg-[#2563EB] text-white text-xs font-semibold hover:bg-[#1E3A8A]"
            >
              Update Password
            </button>
          </>
        }
      >
        <form onSubmit={handleChangePasswordSubmit} className="space-y-3.5">
          {passwordError && (
            <div className="p-2.5 rounded-lg bg-red-50 text-xs text-[#DC2626] font-medium border border-red-200">
              {passwordError}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1">
              Current Password
            </label>
            <input
              type="password"
              placeholder="Enter current password"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-slate-200 text-sm focus:outline-none focus:border-[#2563EB]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1">
              New Password
            </label>
            <input
              type="password"
              placeholder="Min. 6 alphanumeric characters"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-slate-200 text-sm focus:outline-none focus:border-[#2563EB]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              placeholder="Re-enter new password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-slate-200 text-sm focus:outline-none focus:border-[#2563EB]"
            />
          </div>
        </form>
      </Modal>

      {/* Security Settings Modal */}
      <Modal
        isOpen={isSecuritySettingsOpen}
        onClose={() => setIsSecuritySettingsOpen(false)}
        title="Security & Devices"
        footer={
          <button
            onClick={() => {
              setIsSecuritySettingsOpen(false);
              addToast('Security preferences saved.', 'success');
            }}
            className="px-5 py-2 rounded-xl bg-[#2563EB] text-white text-xs font-semibold hover:bg-[#1E3A8A]"
          >
            Done
          </button>
        }
      >
        <div className="space-y-4 text-xs">
          <div className="p-3 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] text-[#1E3A8A]">
            <p className="font-semibold">Active Session Protection</p>
            <p className="mt-0.5 text-[11px] text-[#64748B]">Auto-logout after 15 minutes of inactivity is active.</p>
          </div>

          <div className="p-3 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-1">
            <p className="font-bold text-[#0F172A]">Recognized Devices</p>
            <div className="flex justify-between items-center text-[11px] text-[#64748B] pt-1">
              <span>Windows 11 PC (Chrome 128) &bull; Current</span>
              <span className="text-[#16A34A] font-semibold">Active</span>
            </div>
            <div className="flex justify-between items-center text-[11px] text-[#64748B] pt-1">
              <span>Pixel 8 Pro (BankEase App)</span>
              <span className="text-[#2563EB] font-semibold">Trusted</span>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Profile;
