import React from 'react';

const QuickAction = ({ icon: Icon, title, description, onClick, highlight = false }) => {
  return (
    <button
      onClick={onClick}
      className={`group flex items-start gap-4 p-5 rounded-2xl bg-[#FFFFFF] border transition-all duration-200 text-left hover:shadow-card hover:-translate-y-0.5 active:translate-y-0 w-full ${
        highlight
          ? 'border-[#BFDBFE] hover:border-[#2563EB]'
          : 'border-slate-200/90 hover:border-[#BFDBFE]'
      }`}
    >
      <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center flex-shrink-0 group-hover:bg-[#2563EB] group-hover:text-white transition-all duration-200">
        <Icon className="w-6 h-6 transition-transform group-hover:scale-110" />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-[#0F172A] group-hover:text-[#2563EB] transition-colors truncate">
          {title}
        </h4>
        <p className="text-xs text-[#64748B] mt-1 line-clamp-2 leading-relaxed">
          {description}
        </p>
      </div>
    </button>
  );
};

export default QuickAction;
