import React from 'react';
import { useBanking } from '../context/BankingContext';
import { 
  FiCheckCircle, 
  FiAlertTriangle, 
  FiAlertCircle, 
  FiInfo, 
  FiX 
} from 'react-icons/fi';

const Toast = () => {
  const { toasts, removeToast } = useBanking();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-3">
      {toasts.map(toast => {
        const isSuccess = toast.type === 'success';
        const isDanger = toast.type === 'danger';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg animate-fade-in transition-all duration-300 bg-[#FFFFFF] ${
              isSuccess
                ? 'border-[#16A34A] text-[#0F172A]'
                : isDanger
                ? 'border-[#DC2626] text-[#0F172A]'
                : isWarning
                ? 'border-[#F59E0B] text-[#0F172A]'
                : 'border-[#BFDBFE] text-[#0F172A]'
            }`}
          >
            <div className="mt-0.5 flex-shrink-0">
              {isSuccess && <FiCheckCircle className="w-5 h-5 text-[#16A34A]" />}
              {isDanger && <FiAlertCircle className="w-5 h-5 text-[#DC2626]" />}
              {isWarning && <FiAlertTriangle className="w-5 h-5 text-[#F59E0B]" />}
              {!isSuccess && !isDanger && !isWarning && <FiInfo className="w-5 h-5 text-[#2563EB]" />}
            </div>

            <div className="flex-1 text-sm font-medium leading-snug">
              {toast.message}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#64748B] hover:text-[#0F172A] p-0.5 rounded transition-colors"
              aria-label="Close notification"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Toast;
