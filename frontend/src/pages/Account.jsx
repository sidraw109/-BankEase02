import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBanking } from '../context/BankingContext';
import BalanceCard from '../components/BalanceCard';
import QuickAction from '../components/QuickAction';
import TransactionTable from '../components/TransactionTable';
import Modal from '../components/Modal';
import { monthlyOverviewData } from '../data/transactions';
import {
  FiSend,
  FiFileText,
  FiRepeat,
  FiUserPlus,
  FiShield,
  FiTrendingUp,
  FiArrowRight,
  FiCheckCircle
} from 'react-icons/fi';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#FFFFFF] p-3 rounded-xl border border-slate-200 shadow-modal text-xs">
        <p className="font-bold text-[#0F172A] mb-1.5">{label} 2026</p>
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="flex items-center justify-between gap-4 py-0.5">
            <span className="flex items-center gap-1.5 text-[#64748B]">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: entry.color }} />
              {entry.name}:
            </span>
            <span className="font-mono font-bold text-[#0F172A]">
              ₹{entry.value.toLocaleString('en-IN')}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const Account = () => {
  const { user } = useAuth();
  const { transactions, addBeneficiary } = useBanking();
  const navigate = useNavigate();

  // Add Beneficiary Modal from Quick Actions
  const [isAddBenModalOpen, setIsAddBenModalOpen] = useState(false);
  const [benForm, setBenForm] = useState({
    name: '',
    accountNumber: '',
    confirmAccountNumber: '',
    ifsc: '',
    bankName: 'BankEase'
  });
  const [benError, setBenError] = useState('');

  // Latest 5 transactions
  const recentTransactions = transactions.slice(0, 5);

  const handleAddBeneficiarySubmit = (e) => {
    e.preventDefault();
    if (!benForm.name || !benForm.accountNumber || !benForm.ifsc) {
      setBenError('Please fill in all mandatory fields.');
      return;
    }
    if (benForm.accountNumber !== benForm.confirmAccountNumber) {
      setBenError('Account numbers do not match.');
      return;
    }

    addBeneficiary({
      name: benForm.name,
      accountNumber: benForm.accountNumber,
      ifsc: benForm.ifsc.toUpperCase(),
      bankName: benForm.bankName
    });

    setBenForm({
      name: '',
      accountNumber: '',
      confirmAccountNumber: '',
      ifsc: '',
      bankName: 'BankEase'
    });
    setBenError('');
    setIsAddBenModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight flex items-center gap-2">
            Welcome back, {user?.name?.split(' ')[0] || 'Siddharth'} <span className="animate-bounce">👋</span>
          </h2>
          <p className="text-sm text-[#64748B] mt-1">
            Here's your financial overview.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EFF6FF] text-[#2563EB] text-xs font-semibold border border-[#BFDBFE]">
            <span className="w-2 h-2 rounded-full bg-[#16A34A]"></span>
            KYC Verified
          </span>
          <span className="inline-flex items-center px-3 py-1.5 rounded-xl bg-[#FFFFFF] text-[#64748B] text-xs font-medium border border-slate-200">
            Account: {user?.customerId || 'BE102938'}
          </span>
        </div>
      </div>

      {/* Balance Card Section */}
      <BalanceCard />

      {/* Quick Actions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-[#0F172A]">
            Quick Actions
          </h3>
          <span className="text-xs text-[#64748B]">Frequently used services</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          <QuickAction
            icon={FiSend}
            title="Transfer Money"
            description="Send funds instantly via IMPS / UPI"
            onClick={() => navigate('/payments?tab=transfer')}
          />
          <QuickAction
            icon={FiFileText}
            title="Pay Bills"
            description="Recharge, electricity, water & gas"
            onClick={() => navigate('/payments?tab=bills')}
          />
          <QuickAction
            icon={FiRepeat}
            title="Transactions"
            description="View activity, filter & download"
            onClick={() => navigate('/transactions')}
          />
          <QuickAction
            icon={FiUserPlus}
            title="Add Beneficiary"
            description="Register a new payee account"
            onClick={() => setIsAddBenModalOpen(true)}
          />
          <QuickAction
            icon={FiShield}
            title="Report Fraud"
            description="Block card or contest suspicious charges"
            onClick={() => navigate('/fraud-help')}
          />
        </div>
      </div>

      {/* Financial Overview (Recharts) */}
      <div className="bg-[#FFFFFF] p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-[#EFF6FF] text-[#2563EB]">
                <FiTrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#0F172A]">
                Financial Overview
              </h3>
            </div>
            <p className="text-xs text-[#64748B] mt-1">
              Monthly breakdown of Income, Expenses, and Transfers
            </p>
          </div>

          {/* Metric Badges */}
          <div className="flex items-center gap-3 text-xs flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#16A34A]/10 text-[#16A34A] font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#16A34A]"></span>
              Income: ₹74,340
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DC2626]/10 text-[#DC2626] font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#DC2626]"></span>
              Expenses: ₹32,608
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2563EB]/10 text-[#2563EB] font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#2563EB]"></span>
              Transfers: ₹15,500
            </span>
          </div>
        </div>

        {/* Recharts Bar Chart */}
        <div className="w-full h-72 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={monthlyOverviewData}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis
                dataKey="month"
                stroke="#94A3B8"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: '#E2E8F0' }}
              />
              <YAxis
                stroke="#94A3B8"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `₹${value / 1000}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: '16px', fontSize: '12px' }}
                iconType="circle"
              />
              <Bar
                dataKey="income"
                name="Income"
                fill="#16A34A"
                radius={[4, 4, 0, 0]}
                barSize={18}
              />
              <Bar
                dataKey="expenses"
                name="Expenses"
                fill="#DC2626"
                radius={[4, 4, 0, 0]}
                barSize={18}
              />
              <Bar
                dataKey="transfers"
                name="Transfers"
                fill="#2563EB"
                radius={[4, 4, 0, 0]}
                barSize={18}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Transactions Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-[#0F172A]">
              Recent Transactions
            </h3>
            <p className="text-xs text-[#64748B]">
              Latest 5 activities on your savings account
            </p>
          </div>

          <button
            onClick={() => navigate('/transactions')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2563EB] hover:text-[#1E3A8A] transition-colors"
          >
            <span>View All</span>
            <FiArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <TransactionTable transactions={recentTransactions} showPagination={false} />
      </div>

      {/* Add Beneficiary Modal */}
      <Modal
        isOpen={isAddBenModalOpen}
        onClose={() => setIsAddBenModalOpen(false)}
        title="Add New Beneficiary"
        footer={
          <>
            <button
              onClick={() => setIsAddBenModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#64748B] hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              onClick={handleAddBeneficiarySubmit}
              className="px-5 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1E3A8A] text-white text-xs font-semibold shadow-sm"
            >
              Add Beneficiary
            </button>
          </>
        }
      >
        <form onSubmit={handleAddBeneficiarySubmit} className="space-y-3.5">
          {benError && (
            <div className="p-2.5 rounded-lg bg-red-50 text-xs text-[#DC2626] font-medium border border-red-200">
              {benError}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1">
              Beneficiary Full Name
            </label>
            <input
              type="text"
              placeholder="e.g. Rahul Sharma"
              value={benForm.name}
              onChange={(e) => setBenForm({ ...benForm, name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-slate-200 text-sm focus:outline-none focus:border-[#2563EB]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1">
              Account Number
            </label>
            <input
              type="text"
              placeholder="Enter account number"
              value={benForm.accountNumber}
              onChange={(e) => setBenForm({ ...benForm, accountNumber: e.target.value.replace(/\D/g, '') })}
              className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-slate-200 text-sm font-mono focus:outline-none focus:border-[#2563EB]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1">
              Confirm Account Number
            </label>
            <input
              type="text"
              placeholder="Re-enter account number"
              value={benForm.confirmAccountNumber}
              onChange={(e) => setBenForm({ ...benForm, confirmAccountNumber: e.target.value.replace(/\D/g, '') })}
              className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-slate-200 text-sm font-mono focus:outline-none focus:border-[#2563EB]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                IFSC Code
              </label>
              <input
                type="text"
                placeholder="BKES0001024"
                value={benForm.ifsc}
                onChange={(e) => setBenForm({ ...benForm, ifsc: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-slate-200 text-sm uppercase font-mono focus:outline-none focus:border-[#2563EB]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                Bank Name
              </label>
              <input
                type="text"
                placeholder="BankEase"
                value={benForm.bankName}
                onChange={(e) => setBenForm({ ...benForm, bankName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-slate-200 text-sm focus:outline-none focus:border-[#2563EB]"
              />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Account;
