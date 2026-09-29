import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBanking } from '../context/BankingContext';
import { useAuth } from '../context/AuthContext';
import {
  FiSend,
  FiFileText,
  FiList,
  FiEye,
  FiEyeOff,
  FiCopy,
  FiCheck,
  FiShield
} from 'react-icons/fi';

const BalanceCard = () => {
  const { balance, isAccountBlocked } = useBanking();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [hideBalance, setHideBalance] = useState(false);
  const [copied, setCopied] = useState(false);

  const formattedBalance = balance.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  const handleCopyAccount = () => {
    navigator.clipboard?.writeText(user?.rawAccountNumber || '409283744521');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0F172A] via-[#1E3A8A] to-[#0F172A] text-white p-6 sm:p-8 shadow-xl border border-[#1E3A8A]/50">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 rounded-full bg-[#2563EB]/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-10 w-48 h-48 rounded-full bg-[#3B82F6]/15 blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col justify-between h-full gap-6">
        {/* Top bar of Card */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FFFFFF]/10 backdrop-blur-md border border-white/10 text-[#BFDBFE]">
              <FiShield className="w-3.5 h-3.5 text-[#3B82F6]" />
              {user?.accountType || 'Savings Account'}
            </span>
            {isAccountBlocked ? (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#DC2626] text-white">
                Account Locked
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#16A34A]/80 text-white flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                Active
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-[#BFDBFE]">
            <span>A/C:</span>
            <span className="font-mono tracking-wider font-semibold">
              {user?.accountNumber || 'XXXX XXXX 4521'}
            </span>
            <button
              onClick={handleCopyAccount}
              title="Copy account number"
              className="p-1 rounded hover:bg-white/10 text-white transition-colors"
            >
              {copied ? <FiCheck className="w-3.5 h-3.5 text-[#16A34A]" /> : <FiCopy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Balance Display */}
        <div className="my-2">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#94A3B8] font-semibold">
            <span>Available Balance</span>
            <button
              onClick={() => setHideBalance(!hideBalance)}
              className="text-[#BFDBFE] hover:text-white transition-colors p-0.5"
              aria-label={hideBalance ? "Show balance" : "Hide balance"}
            >
              {hideBalance ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
            </button>
          </div>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
              {hideBalance ? '••••••••' : `₹${formattedBalance}`}
            </span>
            <span className="text-xs font-medium text-[#BFDBFE]">INR</span>
          </div>
          <p className="mt-1 text-xs text-[#94A3B8]">
            Branch: {user?.branch || 'Main Branch'} &bull; IFSC: {user?.ifsc || 'BKES0001024'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            onClick={() => navigate('/payments?tab=transfer')}
            className="flex-1 min-w-[130px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#3B82F6] text-white text-sm font-semibold shadow-md transition-all active:scale-[0.98]"
          >
            <FiSend className="w-4 h-4" />
            <span>Send Money</span>
          </button>

          <button
            onClick={() => navigate('/payments?tab=bills')}
            className="flex-1 min-w-[130px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold border border-white/15 backdrop-blur-sm transition-all active:scale-[0.98]"
          >
            <FiFileText className="w-4 h-4" />
            <span>Pay Bills</span>
          </button>

          <button
            onClick={() => navigate('/transactions')}
            className="flex-1 min-w-[130px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold border border-white/15 backdrop-blur-sm transition-all active:scale-[0.98]"
          >
            <FiList className="w-4 h-4" />
            <span>View Transactions</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;
