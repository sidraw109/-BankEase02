import React from 'react';

export const Spinner = ({ size = 'md', className = '' }) => {
  const sizeMap = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  };

  return (
    <div
      className={`inline-block animate-spin rounded-full border-solid border-[#2563EB] border-t-transparent ${sizeMap[size] || sizeMap.md} ${className}`}
      role="status"
      aria-label="loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export const CardSkeleton = () => (
  <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-slate-200 shadow-sm animate-pulse">
    <div className="h-4 bg-slate-200 rounded w-1/3 mb-4"></div>
    <div className="h-8 bg-slate-200 rounded w-2/3 mb-4"></div>
    <div className="h-4 bg-slate-100 rounded w-1/2"></div>
  </div>
);

export const TableSkeleton = ({ rows = 5 }) => (
  <div className="bg-[#FFFFFF] rounded-2xl border border-slate-200 shadow-sm p-4 animate-pulse">
    <div className="h-10 bg-slate-100 rounded-lg mb-4"></div>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex gap-4 py-3 border-b border-slate-100 items-center">
        <div className="h-4 bg-slate-200 rounded w-1/6"></div>
        <div className="h-4 bg-slate-200 rounded w-2/6"></div>
        <div className="h-4 bg-slate-100 rounded w-1/6"></div>
        <div className="h-4 bg-slate-200 rounded w-1/6"></div>
        <div className="h-4 bg-slate-100 rounded w-1/6"></div>
      </div>
    ))}
  </div>
);

const Loading = ({ text = "Loading BankEase..." }) => {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
      <Spinner size="lg" />
      <p className="text-sm font-medium text-[#64748B]">{text}</p>
    </div>
  );
};

export default Loading;
