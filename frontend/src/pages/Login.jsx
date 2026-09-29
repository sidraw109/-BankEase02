import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBanking } from '../context/BankingContext';
import {
  FiEye,
  FiEyeOff,
  FiShield,
  FiLock,
  FiUser,
  FiCheckCircle,
  FiHelpCircle,
  FiArrowRight,
  FiKey
} from 'react-icons/fi';
import { Spinner } from '../components/Loading';
import Modal from '../components/Modal';

const Login = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const { addToast } = useBanking();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  // Extra fields used only in register mode.
  const [reg, setReg] = useState({ firstName: '', lastName: '', phone: '', accountType: 'SAVINGS' });

  const EMAIL_RE = /^\S+@\S+\.\S+$/;
  const PHONE_RE = /^[6-9]\d{9}$/;
  const PASS_RE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const validateLogin = () => {
    const errs = {};
    if (!identifier.trim()) errs.identifier = 'Registered Email is required';
    else if (!EMAIL_RE.test(identifier.trim())) errs.identifier = 'Enter a valid email address';
    if (!password) errs.password = 'Password is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateRegister = () => {
    const errs = {};
    if (reg.firstName.trim().length < 2) errs.firstName = 'First name is required (min 2 chars)';
    if (reg.lastName.trim().length < 2) errs.lastName = 'Last name is required (min 2 chars)';
    if (!EMAIL_RE.test(identifier.trim())) errs.identifier = 'Valid email is required';
    if (!PHONE_RE.test(reg.phone)) errs.phone = 'Valid 10-digit Indian mobile number (starting 6-9)';
    if (!PASS_RE.test(password)) errs.password = 'Min 8 chars with upper, lower, digit & special (@$!%*?&)';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (mode === 'login') {
      if (!validateLogin()) return;
      setLoading(true);
      const result = await login(identifier, password, rememberMe);
      setLoading(false);
      if (result.success) {
        addToast('Welcome back to BankEase! Secure session initialized.', 'success');
        navigate('/account');
      } else {
        setErrors({ general: result.error });
        addToast(result.error, 'danger');
      }
      return;
    }

    // Register mode
    if (!validateRegister()) return;
    setLoading(true);
    const result = await register({
      firstName: reg.firstName.trim(),
      lastName: reg.lastName.trim(),
      email: identifier.trim(),
      phone: reg.phone,
      password,
      accountType: reg.accountType,
    });
    setLoading(false);
    if (result.success) {
      addToast('Account created! Welcome to BankEase.', 'success');
      navigate('/account');
    } else {
      setErrors({ general: result.error, ...(result.fieldErrors || {}) });
      addToast(result.error, 'danger');
    }
  };

  const switchMode = (next) => {
    setMode(next);
    setErrors({});
    setPassword('');
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!resetEmail) return;
    setResetSent(true);
    setTimeout(() => {
      addToast(`Password reset link sent to ${resetEmail}`, 'info');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden shadow-2xl border border-[#BFDBFE]/60 bg-[#FFFFFF]">
        
        {/* Left Side: Brand & Visual Security Illustration */}
        <div className="lg:col-span-6 bg-gradient-to-br from-[#0F172A] via-[#1E3A8A] to-[#0F172A] p-8 sm:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Subtle background ambient circles */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-[#2563EB]/20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 rounded-full bg-[#3B82F6]/15 blur-3xl pointer-events-none" />

          {/* Top Brand Header */}
          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#2563EB] flex items-center justify-center shadow-lg shadow-blue-500/30">
                <FiLock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-white">
                  Bank<span className="text-[#3B82F6]">Ease</span>
                </h1>
                <p className="text-[11px] uppercase tracking-widest text-[#94A3B8] font-semibold">
                  NextGen Net Banking
                </p>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight text-white">
                Secure banking designed for your everyday financial needs.
              </h2>
              <p className="mt-3 text-sm text-[#BFDBFE]/90 leading-relaxed font-normal">
                Manage your accounts, instant payments, statements, and security controls seamlessly in one unified portal.
              </p>
            </div>
          </div>

          {/* Modern Banking SVG Illustration */}
          <div className="relative z-10 my-8 flex items-center justify-center">
            <div className="w-full max-w-sm p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs text-[#BFDBFE]">
                <div className="flex items-center gap-2">
                  <FiShield className="w-4 h-4 text-[#3B82F6]" />
                  <span>Bank-Grade Encryption</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#16A34A]/20 text-[#16A34A] text-[10px] font-bold">
                  256-Bit SSL
                </span>
              </div>

              {/* Mock credit card graphic */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#1E3A8A] text-white shadow-lg space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-white/80">BankEase Platinum</span>
                  <div className="w-6 h-4 rounded bg-yellow-400/80" />
                </div>
                <div className="font-mono text-sm tracking-widest pt-2">
                  •••• &nbsp; •••• &nbsp; •••• &nbsp; 4521
                </div>
                <div className="flex justify-between items-end text-[10px] text-white/70">
                  <div>
                    <span>Cardholder</span>
                    <p className="font-semibold text-white text-xs">SIDDHARTH RAWAT</p>
                  </div>
                  <div>
                    <span>Expires</span>
                    <p className="font-semibold text-white text-xs">08/30</p>
                  </div>
                </div>
              </div>

              {/* Feature pills */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-[#BFDBFE]">
                <div className="flex items-center gap-1.5 p-2 rounded-lg bg-white/5">
                  <FiCheckCircle className="w-3.5 h-3.5 text-[#16A34A]" />
                  <span>Instant Transfers</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 rounded-lg bg-white/5">
                  <FiCheckCircle className="w-3.5 h-3.5 text-[#16A34A]" />
                  <span>Zero Phishing Alert</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Security Quote */}
          <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-[#94A3B8]">
            <span>RBI Regulated Bank</span>
            <span>ISO/IEC 27001 Certified</span>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-between bg-[#FFFFFF]">
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-2xl font-bold text-[#0F172A]">
                  {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                </h3>
                <p className="text-xs text-[#64748B] mt-1">
                  {mode === 'login'
                    ? 'Log in to your BankEase internet banking account'
                    : 'Register a new BankEase net-banking account'}
                </p>
              </div>
              <span className="hidden sm:inline-block px-2.5 py-1 rounded-full bg-[#ECFDF5] text-[#16A34A] text-xs font-semibold border border-[#A7F3D0]">
                Live API
              </span>
            </div>

            {/* Mode toggle */}
            <div className="mb-6 grid grid-cols-2 gap-1 p-1 rounded-xl bg-[#F1F5F9] border border-slate-200">
              <button
                type="button"
                onClick={() => switchMode('login')}
                className={`py-2 rounded-lg text-xs font-semibold transition-colors ${mode === 'login' ? 'bg-white text-[#2563EB] shadow-sm' : 'text-[#64748B] hover:text-[#0F172A]'}`}
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => switchMode('register')}
                className={`py-2 rounded-lg text-xs font-semibold transition-colors ${mode === 'register' ? 'bg-white text-[#2563EB] shadow-sm' : 'text-[#64748B] hover:text-[#0F172A]'}`}
              >
                Register
              </button>
            </div>

            {/* Error banner */}
            {errors.general && (
              <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-[#DC2626] font-medium flex items-center gap-2">
                <FiLock className="w-4 h-4 flex-shrink-0" />
                <span>{errors.general}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">
                  Registered Email
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                    <FiUser className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    value={identifier}
                    onChange={(e) => {
                      setIdentifier(e.target.value);
                      if (errors.identifier) setErrors({ ...errors, identifier: null });
                    }}
                    placeholder="you@example.com"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F8FAFC] border text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none transition-colors ${
                      errors.identifier
                        ? 'border-[#DC2626] focus:border-[#DC2626]'
                        : 'border-slate-200 focus:border-[#2563EB]'
                    }`}
                  />
                </div>
                {errors.identifier && (
                  <p className="mt-1 text-xs text-[#DC2626]">{errors.identifier}</p>
                )}
              </div>

              {/* Register-only fields */}
              {mode === 'register' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">First Name</label>
                      <input
                        type="text"
                        value={reg.firstName}
                        onChange={(e) => setReg({ ...reg, firstName: e.target.value })}
                        placeholder="Aarav"
                        className={`w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border text-sm focus:outline-none ${errors.firstName ? 'border-[#DC2626]' : 'border-slate-200 focus:border-[#2563EB]'}`}
                      />
                      {errors.firstName && <p className="mt-1 text-xs text-[#DC2626]">{errors.firstName}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">Last Name</label>
                      <input
                        type="text"
                        value={reg.lastName}
                        onChange={(e) => setReg({ ...reg, lastName: e.target.value })}
                        placeholder="Sharma"
                        className={`w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border text-sm focus:outline-none ${errors.lastName ? 'border-[#DC2626]' : 'border-slate-200 focus:border-[#2563EB]'}`}
                      />
                      {errors.lastName && <p className="mt-1 text-xs text-[#DC2626]">{errors.lastName}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">Mobile Number</label>
                    <input
                      type="tel"
                      value={reg.phone}
                      onChange={(e) => setReg({ ...reg, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                      placeholder="10-digit mobile (starts 6-9)"
                      className={`w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border text-sm focus:outline-none ${errors.phone ? 'border-[#DC2626]' : 'border-slate-200 focus:border-[#2563EB]'}`}
                    />
                    {errors.phone && <p className="mt-1 text-xs text-[#DC2626]">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">Account Type</label>
                    <select
                      value={reg.accountType}
                      onChange={(e) => setReg({ ...reg, accountType: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-slate-200 text-sm focus:outline-none focus:border-[#2563EB]"
                    >
                      <option value="SAVINGS">Savings Account</option>
                      <option value="CURRENT">Current Account</option>
                      <option value="SALARY">Salary Account</option>
                      <option value="FIXED_DEPOSIT">Fixed Deposit</option>
                    </select>
                  </div>
                </>
              )}

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                    <FiKey className="w-4 h-4" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors({ ...errors, password: null });
                    }}
                    placeholder="Enter your banking password"
                    className={`w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#F8FAFC] border text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none transition-colors ${
                      errors.password
                        ? 'border-[#DC2626] focus:border-[#DC2626]'
                        : 'border-slate-200 focus:border-[#2563EB]'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#94A3B8] hover:text-[#0F172A] transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-[#DC2626]">{errors.password}</p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-[#2563EB] focus:ring-[#2563EB] border-slate-300"
                  />
                  <span className="text-[#64748B] font-medium">Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={() => setForgotModalOpen(true)}
                  className="font-semibold text-[#2563EB] hover:text-[#1E3A8A] hover:underline transition-colors"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#2563EB] hover:bg-[#1E3A8A] text-white text-sm font-semibold shadow-md shadow-blue-600/20 active:scale-[0.99] transition-all disabled:opacity-75"
              >
                {loading ? (
                  <>
                    <Spinner size="sm" className="border-white" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>{mode === 'login' ? 'Log In to BankEase' : 'Create BankEase Account'}</span>
                    <FiArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Help & Support Footer Link */}
          <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-[#64748B]">
            <Link
              to="/fraud-help"
              className="inline-flex items-center gap-1.5 text-[#2563EB] hover:text-[#1E3A8A] font-semibold"
            >
              <FiHelpCircle className="w-4 h-4" />
              <span>Help & Support</span>
            </Link>
            <span className="text-[11px] text-[#94A3B8]">Safe & Phishing-free</span>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={forgotModalOpen}
        onClose={() => {
          setForgotModalOpen(false);
          setResetSent(false);
        }}
        title="Reset Internet Banking Password"
        footer={
          resetSent ? (
            <button
              onClick={() => {
                setForgotModalOpen(false);
                setResetSent(false);
              }}
              className="px-4 py-2 rounded-xl bg-[#2563EB] text-white text-xs font-semibold hover:bg-[#1E3A8A]"
            >
              Done
            </button>
          ) : (
            <>
              <button
                onClick={() => setForgotModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#64748B] hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleForgotSubmit}
                className="px-4 py-2 rounded-xl bg-[#2563EB] text-white text-xs font-semibold hover:bg-[#1E3A8A]"
              >
                Send Reset Instructions
              </button>
            </>
          )
        }
      >
        {resetSent ? (
          <div className="text-center py-4 space-y-2">
            <FiCheckCircle className="w-12 h-12 text-[#16A34A] mx-auto" />
            <h4 className="text-base font-bold text-[#0F172A]">Reset Link Sent</h4>
            <p className="text-xs text-[#64748B]">
              We have dispatched a secure password reset link to your registered email address.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-[#64748B]">
              Enter your Customer ID or registered email address. We will send you an OTP / secure reset link.
            </p>
            <input
              type="text"
              placeholder="siddharth@example.com or BE102938"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-slate-200 text-sm text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Login;
