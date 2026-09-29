import React from 'react';
import { FiEdit2, FiTrash2, FiSend, FiCheckCircle } from 'react-icons/fi';

const BeneficiaryCard = ({ 
  beneficiary, 
  onSelect, 
  onEdit, 
  onDelete,
  selected = false 
}) => {
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div
      className={`group relative p-4 sm:p-5 rounded-2xl border transition-all duration-200 ${
        selected
          ? 'bg-[#EFF6FF] border-[#2563EB] shadow-card ring-2 ring-[#2563EB]/20'
          : 'bg-[#FFFFFF] border-slate-200/90 hover:border-[#BFDBFE] hover:shadow-subtle'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-11 h-11 rounded-xl bg-[#EFF6FF] text-[#2563EB] font-bold text-sm flex items-center justify-center flex-shrink-0 border border-[#BFDBFE]">
            {getInitials(beneficiary.name)}
          </div>

          <div className="min-w-0">
            <h4 className="text-sm font-bold text-[#0F172A] truncate group-hover:text-[#2563EB] transition-colors">
              {beneficiary.name}
            </h4>
            <p className="text-xs font-mono font-medium text-[#64748B] mt-0.5">
              {beneficiary.maskedAccount}
            </p>
            <p className="text-[11px] text-[#94A3B8] truncate mt-0.5">
              {beneficiary.bankName} &bull; {beneficiary.ifsc}
            </p>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(beneficiary)}
            className="p-1.5 rounded-lg text-[#64748B] hover:text-[#2563EB] hover:bg-[#EFF6FF] transition-colors"
            title="Edit Beneficiary"
          >
            <FiEdit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(beneficiary.id)}
            className="p-1.5 rounded-lg text-[#64748B] hover:text-[#DC2626] hover:bg-red-50 transition-colors"
            title="Delete Beneficiary"
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] font-medium text-[#64748B] bg-slate-100 px-2 py-0.5 rounded-md">
          {beneficiary.type || 'Savings'}
        </span>

        {onSelect && (
          <button
            onClick={() => onSelect(beneficiary)}
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
              selected
                ? 'bg-[#2563EB] text-white'
                : 'text-[#2563EB] hover:bg-[#EFF6FF]'
            }`}
          >
            {selected ? (
              <>
                <FiCheckCircle className="w-3.5 h-3.5" />
                <span>Selected</span>
              </>
            ) : (
              <>
                <FiSend className="w-3.5 h-3.5" />
                <span>Quick Transfer</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default BeneficiaryCard;
