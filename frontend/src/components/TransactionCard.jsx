import React from 'react';
import { FiArrowUpRight, FiArrowDownLeft, FiClock, FiShoppingBag, FiBriefcase, FiZap, FiSend, FiFilm } from 'react-icons/fi';

const getCategoryIcon = (category) => {
  switch (category?.toLowerCase()) {
    case 'salary':
    case 'income':
      return FiBriefcase;
    case 'shopping':
      return FiShoppingBag;
    case 'utilities':
      return FiZap;
    case 'transfer':
      return FiSend;
    case 'entertainment':
      return FiFilm;
    default:
      return FiArrowUpRight;
  }
};

const TransactionCard = ({ transaction, onClick }) => {
  const isCredit = transaction.type === 'Credit';
  const isPending = transaction.status === 'Pending';
  const Icon = getCategoryIcon(transaction.category);

  return (
    <div
      onClick={() => onClick && onClick(transaction)}
      className="flex items-center justify-between p-4 rounded-xl bg-[#FFFFFF] border border-slate-200/80 hover:border-[#BFDBFE] hover:shadow-sm cursor-pointer transition-all duration-200"
    >
      <div className="flex items-center gap-3.5 min-w-0">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
            isCredit
              ? 'bg-[#16A34A]/10 text-[#16A34A]'
              : 'bg-[#EFF6FF] text-[#2563EB]'
          }`}
        >
          {isCredit ? (
            <FiArrowDownLeft className="w-5 h-5" />
          ) : (
            <Icon className="w-5 h-5" />
          )}
        </div>

        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#0F172A] truncate">
            {transaction.description}
          </p>
          <div className="flex items-center gap-2 text-xs text-[#64748B] mt-0.5">
            <span>{transaction.displayDate || transaction.date}</span>
            <span>&bull;</span>
            <span className="truncate">{transaction.category}</span>
          </div>
        </div>
      </div>

      <div className="text-right flex-shrink-0 ml-3">
        <p
          className={`text-sm font-bold font-mono ${
            isCredit ? 'text-[#16A34A]' : 'text-[#DC2626]'
          }`}
        >
          {isCredit ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN')}
        </p>

        <div className="mt-0.5">
          {isPending ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#F59E0B]">
              <FiClock className="w-3 h-3" />
              Pending
            </span>
          ) : (
            <span className="text-[11px] font-medium text-[#64748B]">
              {transaction.status}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;
