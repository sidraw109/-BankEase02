import React, { useState, useMemo } from 'react';
import { useBanking } from '../context/BankingContext';
import TransactionTable from '../components/TransactionTable';
import {
  FiSearch,
  FiFilter,
  FiCalendar,
  FiDownload,
  FiRefreshCw,
  FiTrendingUp,
  FiTrendingDown,
  FiCheckCircle,
  FiSliders
} from 'react-icons/fi';

const Transactions = () => {
  const { transactions, addToast } = useBanking();

  // Filter and Search States
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateRange, setDateRange] = useState('ALL');
  const [sortBy, setSortBy] = useState('NEWEST');

  // Filtered and Sorted Transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(txn => {
      // Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchDesc = txn.description.toLowerCase().includes(query);
        const matchId = txn.id.toLowerCase().includes(query);
        const matchCategory = txn.category?.toLowerCase().includes(query);
        const matchRemarks = txn.remarks?.toLowerCase().includes(query);
        if (!matchDesc && !matchId && !matchCategory && !matchRemarks) {
          return false;
        }
      }

      // Type filter
      if (typeFilter !== 'ALL' && txn.type !== typeFilter) {
        return false;
      }

      // Status filter
      if (statusFilter !== 'ALL' && txn.status !== statusFilter) {
        return false;
      }

      // Date range filter
      if (dateRange !== 'ALL') {
        const txnDate = new Date(txn.date);
        const now = new Date();
        const diffDays = (now - txnDate) / (1000 * 60 * 60 * 24);

        if (dateRange === '7D' && diffDays > 7) return false;
        if (dateRange === '30D' && diffDays > 30) return false;
        if (dateRange === '90D' && diffDays > 90) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'NEWEST') {
        return new Date(b.date) - new Date(a.date);
      }
      if (sortBy === 'OLDEST') {
        return new Date(a.date) - new Date(b.date);
      }
      if (sortBy === 'AMOUNT_HIGH') {
        return b.amount - a.amount;
      }
      if (sortBy === 'AMOUNT_LOW') {
        return a.amount - b.amount;
      }
      return 0;
    });
  }, [transactions, searchTerm, typeFilter, statusFilter, dateRange, sortBy]);

  // Aggregate stats
  const totalCredit = useMemo(() => {
    return transactions
      .filter(t => t.type === 'Credit' && t.status === 'Completed')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const totalDebit = useMemo(() => {
    return transactions
      .filter(t => t.type === 'Debit' && t.status === 'Completed')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const handleDownloadStatement = () => {
    addToast('Account Statement for September 2026 downloaded (PDF simulation).', 'success');
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setTypeFilter('ALL');
    setStatusFilter('ALL');
    setDateRange('ALL');
    setSortBy('NEWEST');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
            Transactions
          </h2>
          <p className="text-sm text-[#64748B] mt-1">
            View and manage your banking activity
          </p>
        </div>

        <button
          onClick={handleDownloadStatement}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FFFFFF] border border-slate-200 hover:border-[#BFDBFE] hover:bg-[#EFF6FF] text-[#0F172A] text-xs font-semibold shadow-subtle transition-all active:scale-95"
        >
          <FiDownload className="w-4 h-4 text-[#2563EB]" />
          <span>Download Statement</span>
        </button>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFFFF] border border-slate-200/90 shadow-subtle flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
              Total Credits
            </p>
            <p className="text-xl sm:text-2xl font-bold font-mono text-[#16A34A] mt-1">
              +₹{totalCredit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#16A34A]/10 text-[#16A34A] flex items-center justify-center">
            <FiTrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFFFF] border border-slate-200/90 shadow-subtle flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
              Total Debits
            </p>
            <p className="text-xl sm:text-2xl font-bold font-mono text-[#DC2626] mt-1">
              -₹{totalDebit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-50 text-[#DC2626] flex items-center justify-center">
            <FiTrendingDown className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFFFF] border border-slate-200/90 shadow-subtle flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
              Recorded Records
            </p>
            <p className="text-xl sm:text-2xl font-bold font-mono text-[#2563EB] mt-1">
              {transactions.length} Events
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
            <FiCheckCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFFFF] border border-slate-200/90 shadow-subtle space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
              <FiSearch className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search by description, reference, or transaction ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-slate-200 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#2563EB] transition-colors"
            />
          </div>

          {/* Reset button if filtered */}
          {(searchTerm || typeFilter !== 'ALL' || statusFilter !== 'ALL' || dateRange !== 'ALL' || sortBy !== 'NEWEST') && (
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#64748B] hover:text-[#DC2626] hover:bg-red-50 border border-slate-200 transition-colors"
            >
              <FiRefreshCw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100 text-xs">
          {/* Type Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-[#64748B] uppercase mb-1">
              Type
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-slate-200 font-medium text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
            >
              <option value="ALL">All Types</option>
              <option value="Credit">Credit (+)</option>
              <option value="Debit">Debit (-)</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-[#64748B] uppercase mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-slate-200 font-medium text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
            >
              <option value="ALL">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          {/* Date Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-[#64748B] uppercase mb-1">
              Date Period
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-slate-200 font-medium text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
            >
              <option value="ALL">All Time</option>
              <option value="7D">Last 7 Days</option>
              <option value="30D">Last 30 Days</option>
              <option value="90D">Last 90 Days</option>
            </select>
          </div>

          {/* Sort Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-[#64748B] uppercase mb-1">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-slate-200 font-medium text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
            >
              <option value="NEWEST">Date: Newest First</option>
              <option value="OLDEST">Date: Oldest First</option>
              <option value="AMOUNT_HIGH">Amount: High to Low</option>
              <option value="AMOUNT_LOW">Amount: Low to High</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transaction Table */}
      <TransactionTable
        transactions={filteredTransactions}
        itemsPerPage={8}
        showPagination={true}
      />
    </div>
  );
};

export default Transactions;
