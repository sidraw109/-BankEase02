import React from 'react';

const PaymentCard = ({ 
  icon: Icon, 
  title, 
  subtitle, 
  isSelected = false, 
  onClick,
  badge = null 
}) => {
  return (
    <button
      onClick={onClick}
      className={`group relative flex flex-col items-center justify-center p-5 rounded-2xl border text-center transition-all duration-200 active:scale-95 ${
        isSelected
          ? 'bg-[#EFF6FF] border-[#2563EB] shadow-card ring-2 ring-[#2563EB]/20'
          : 'bg-[#FFFFFF] border-slate-200/90 hover:border-[#BFDBFE] hover:shadow-subtle'
      }`}
    >
      {badge && (
        <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#2563EB] text-white">
          {badge}
        </span>
      )}

      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-transform duration-200 group-hover:scale-110 ${
          isSelected
            ? 'bg-[#2563EB] text-white'
            : 'bg-[#EFF6FF] text-[#2563EB]'
        }`}
      >
        <Icon className="w-6 h-6" />
      </div>

      <h4 className="text-sm font-semibold text-[#0F172A] group-hover:text-[#2563EB] transition-colors">
        {title}
      </h4>

      {subtitle && (
        <p className="text-xs text-[#64748B] mt-0.5">
          {subtitle}
        </p>
      )}
    </button>
  );
};

export default PaymentCard;
