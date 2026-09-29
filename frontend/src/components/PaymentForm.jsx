import React, { useState, useEffect } from 'react';
import { useBanking } from '../context/BankingContext';
import { useAuth } from '../context/AuthContext';
import Modal from './Modal';
import { 
  FiSend, 
  FiCheckCircle, 
  FiArrowRight, 
  FiShield, 
  FiAlertCircle, 
  FiDollarSign,
  FiRepeat
} from 'react-icons/fi';
import { Spinner } from './Loading';

const PaymentForm = ({ selectedBeneficiary, onTransferComplete }) => {
  const { balance, beneficiaries, executeTransfer, isAccountBlocked } = useBanking();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    beneficiaryId: '',
    beneficiaryName: '',
    accountNumber: '',
    ifsc: 'BKES0001024',
    amount: '',
    remarks: ''
  });

  const [errors, setErrors] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successTxn, setSuccessTxn] = useState(null);

  // Sync when selectedBeneficiary prop changes
  useEffect(() => {
    if (selectedBeneficiary) {
      setFormData(prev => ({
        ...prev,
        beneficiaryId: selectedBeneficiary.id,
        beneficiaryName: selectedBeneficiary.name,
        accountNumber: selectedBeneficiary.accountNumber,
        ifsc: selectedBeneficiary.ifsc || 'BKES0001024'
      }));
    }
  }, [selectedBeneficiary]);

  const handleBeneficiarySelect = (e) => {
    const benId = e.target.value;
    if (benId === 'custom') {
      setFormData(prev => ({
        ...prev,
        beneficiaryId: 'custom',
        beneficiaryName: '',
        accountNumber: '',
        ifsc: ''
      }));
    } else {
      const ben = beneficiaries.find(b => b.id === benId);
      if (ben) {
        setFormData(prev => ({
          ...prev,
          beneficiaryId: ben.id,
          beneficiaryName: ben.name,
          accountNumber: ben.accountNumber,
          ifsc: ben.ifsc
        }));
      }
    }
    setErrors(prev => ({ ...prev, beneficiary: null }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.beneficiaryName.trim()) {
      newErrors.beneficiaryName = 'Beneficiary name is required';
    }

    if (!formData.accountNumber.trim()) {
      newErrors.accountNumber = 'Account number is required';
    } else if (formData.accountNumber.length < 9) {
      newErrors.accountNumber = 'Account number must be at least 9 digits';
    }

    if (!formData.ifsc.trim()) {
      newErrors.ifsc = 'IFSC code is required';
    }

    const numAmount = parseFloat(formData.amount);
    if (!formData.amount || isNaN(numAmount) || numAmount <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than ₹0';
    } else if (numAmount > balance) {
      newErrors.amount = `Insufficient balance. Available: ₹${balance.toLocaleString('en-IN')}`;
    }

    if (isAccountBlocked) {
      newErrors.general = 'Account is locked. Cannot initiate transfers.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInitiateTransfer = (e) => {
    e.preventDefault();
    if (validate()) {
      setShowConfirmModal(true);
    }
  };

  const handleConfirmPayment = async () => {
    setIsProcessing(true);
    setShowConfirmModal(false);

    const result = await executeTransfer({
      beneficiaryName: formData.beneficiaryName,
      accountNumber: formData.accountNumber,
      ifsc: formData.ifsc,
      amount: formData.amount,
      remarks: formData.remarks || 'Transfer via Net Banking'
    });

    setIsProcessing(false);

    if (result.success) {
      setSuccessTxn(result.transaction);
      if (onTransferComplete) {
        onTransferComplete(result.transaction);
      }
    }
  };

  const handleResetForm = () => {
    setFormData({
      beneficiaryId: '',
      beneficiaryName: '',
      accountNumber: '',
      ifsc: 'BKES0001024',
      amount: '',
      remarks: ''
    });
    setSuccessTxn(null);
  };

  const quickAmounts = [500, 1000, 2500, 5000, 10000];

  return (
    <div className="bg-[#FFFFFF] rounded-2xl border border-slate-200/90 shadow-card p-6 sm:p-8">
      {successTxn ? (
        /* Success Animation and Receipt */
        <div className="py-6 text-center space-y-6 animate-fade-in">
          {/* Animated check circle */}
          <div className="mx-auto w-20 h-20 rounded-full bg-[#16A34A]/10 text-[#16A34A] flex items-center justify-center animate-pulse-glow">
            <FiCheckCircle className="w-12 h-12" />
          </div>

          <div>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#16A34A]/10 text-[#16A34A] mb-2">
              Transfer Successful
            </span>
            <h3 className="text-2xl font-bold text-[#0F172A]">
              Payment Completed
            </h3>
            <p className="text-sm text-[#64748B] mt-1">
              Funds have been transferred to the beneficiary account.
            </p>
          </div>

          {/* Receipt Card */}
          <div className="max-w-md mx-auto p-5 rounded-2xl bg-[#F8FAFC] border border-[#BFDBFE]/60 text-left space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200">
              <span className="text-xs font-semibold text-[#64748B]">Amount Transferred</span>
              <span className="text-xl font-mono font-extrabold text-[#16A34A]">
                ₹{successTxn.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-[#64748B]">Transaction ID</span>
              <span className="font-mono font-bold text-[#0F172A]">{successTxn.id}</span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-[#64748B]">Reference Number</span>
              <span className="font-mono font-medium text-[#0F172A]">{successTxn.referenceNo}</span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-[#64748B]">Beneficiary</span>
              <span className="font-semibold text-[#0F172A]">{formData.beneficiaryName}</span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-[#64748B]">Account Number</span>
              <span className="font-mono text-[#0F172A]">
                XXXX XXXX {formData.accountNumber.slice(-4)}
              </span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-[#64748B]">Debit Account</span>
              <span className="font-mono text-[#0F172A]">{user?.accountNumber || 'XXXX XXXX 4521'}</span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-[#64748B]">Date & Time</span>
              <span className="text-[#0F172A]">{successTxn.displayDate}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={handleResetForm}
              className="px-6 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1E3A8A] text-white text-sm font-semibold transition-colors shadow-sm"
            >
              Make Another Transfer
            </button>
          </div>
        </div>
      ) : (
        /* Transfer Form */
        <form onSubmit={handleInitiateTransfer} className="space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-[#0F172A]">
                Money Transfer
              </h3>
              <p className="text-xs text-[#64748B]">
                Immediate transfer to any verified bank account
              </p>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-[#64748B] block">Available Balance</span>
              <span className="text-sm font-bold font-mono text-[#2563EB]">
                ₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {errors.general && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-[#DC2626] flex items-center gap-2">
              <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errors.general}</span>
            </div>
          )}

          {/* Select Beneficiary */}
          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">
              Select Beneficiary
            </label>
            <select
              value={formData.beneficiaryId}
              onChange={handleBeneficiarySelect}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-slate-200 text-sm text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-colors"
            >
              <option value="">-- Choose saved beneficiary or enter new --</option>
              {beneficiaries.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.maskedAccount}) - {b.bankName}
                </option>
              ))}
              <option value="custom">+ Enter New Beneficiary Details</option>
            </select>
          </div>

          {/* Beneficiary Name (if manual) */}
          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">
              Beneficiary Name
            </label>
            <input
              type="text"
              placeholder="e.g. Rahul Sharma"
              value={formData.beneficiaryName}
              onChange={(e) => {
                setFormData({ ...formData, beneficiaryName: e.target.value });
                if (errors.beneficiaryName) setErrors({ ...errors, beneficiaryName: null });
              }}
              className={`w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border text-sm text-[#0F172A] focus:outline-none transition-colors ${
                errors.beneficiaryName
                  ? 'border-[#DC2626] focus:border-[#DC2626]'
                  : 'border-slate-200 focus:border-[#2563EB]'
              }`}
            />
            {errors.beneficiaryName && (
              <p className="mt-1 text-xs text-[#DC2626]">{errors.beneficiaryName}</p>
            )}
          </div>

          {/* Account Number & IFSC Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">
                Account Number
              </label>
              <input
                type="text"
                placeholder="e.g. 987654324521"
                value={formData.accountNumber}
                onChange={(e) => {
                  setFormData({ ...formData, accountNumber: e.target.value.trim() });
                  if (errors.accountNumber) setErrors({ ...errors, accountNumber: null });
                }}
                className={`w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border text-sm font-mono text-[#0F172A] focus:outline-none transition-colors ${
                  errors.accountNumber
                    ? 'border-[#DC2626] focus:border-[#DC2626]'
                    : 'border-slate-200 focus:border-[#2563EB]'
                }`}
              />
              {errors.accountNumber && (
                <p className="mt-1 text-xs text-[#DC2626]">{errors.accountNumber}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">
                IFSC Code
              </label>
              <input
                type="text"
                placeholder="e.g. BKES0001024"
                value={formData.ifsc}
                onChange={(e) => {
                  setFormData({ ...formData, ifsc: e.target.value.toUpperCase() });
                  if (errors.ifsc) setErrors({ ...errors, ifsc: null });
                }}
                className={`w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border text-sm uppercase font-mono text-[#0F172A] focus:outline-none transition-colors ${
                  errors.ifsc
                    ? 'border-[#DC2626] focus:border-[#DC2626]'
                    : 'border-slate-200 focus:border-[#2563EB]'
                }`}
              />
              {errors.ifsc && (
                <p className="mt-1 text-xs text-[#DC2626]">{errors.ifsc}</p>
              )}
            </div>
          </div>

          {/* Amount Field with Quick Chips */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-[#0F172A]">
                Amount (₹)
              </label>
              <span className="text-[11px] text-[#64748B]">Zero transaction fees</span>
            </div>

            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-[#64748B]">
                ₹
              </span>
              <input
                type="number"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => {
                  setFormData({ ...formData, amount: e.target.value });
                  if (errors.amount) setErrors({ ...errors, amount: null });
                }}
                className={`w-full pl-8 pr-4 py-2.5 rounded-xl bg-[#F8FAFC] border text-base font-bold font-mono text-[#0F172A] focus:outline-none transition-colors ${
                  errors.amount
                    ? 'border-[#DC2626] focus:border-[#DC2626]'
                    : 'border-slate-200 focus:border-[#2563EB]'
                }`}
              />
            </div>
            {errors.amount && (
              <p className="mt-1 text-xs text-[#DC2626]">{errors.amount}</p>
            )}

            {/* Quick Amount Chips */}
            <div className="flex flex-wrap gap-2 mt-2.5">
              {quickAmounts.map(val => (
                <button
                  key={val}
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, amount: val.toString() });
                    if (errors.amount) setErrors({ ...errors, amount: null });
                  }}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#EFF6FF] text-[#2563EB] hover:bg-[#2563EB] hover:text-white transition-colors border border-[#BFDBFE]"
                >
                  +₹{val.toLocaleString('en-IN')}
                </button>
              ))}
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">
              Remarks (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Rent, Gift, Project Payment"
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-slate-200 text-sm text-[#0F172A] focus:outline-none focus:border-[#2563EB] transition-colors"
            />
          </div>

          {/* Security Notice */}
          <div className="p-3 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center gap-2.5 text-xs text-[#1E3A8A]">
            <FiShield className="w-4 h-4 text-[#2563EB] flex-shrink-0" />
            <span>Transfers are protected with end-to-end 256-bit encryption.</span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#2563EB] hover:bg-[#1E3A8A] text-white text-sm font-semibold shadow-md shadow-blue-600/20 active:scale-[0.99] transition-all"
          >
            <FiSend className="w-4 h-4" />
            <span>Transfer Money</span>
          </button>
        </form>
      )}

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => !isProcessing && setShowConfirmModal(false)}
        title="Confirm Money Transfer"
        footer={
          <>
            <button
              onClick={() => setShowConfirmModal(false)}
              disabled={isProcessing}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmPayment}
              disabled={isProcessing}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1E3A8A] text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-75"
            >
              {isProcessing ? (
                <>
                  <Spinner size="sm" className="border-white" />
                  <span>Processing Transfer...</span>
                </>
              ) : (
                <>
                  <FiCheckCircle className="w-4 h-4" />
                  <span>Confirm & Pay ₹{parseFloat(formData.amount || 0).toLocaleString('en-IN')}</span>
                </>
              )}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-xs text-[#64748B]">
            Please review the payment details before authorizing the transfer.
          </p>

          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#BFDBFE]/60 space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <span className="text-xs text-[#64748B]">Transfer Amount</span>
              <span className="text-xl font-mono font-extrabold text-[#2563EB]">
                ₹{parseFloat(formData.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-[#64748B]">Beneficiary Name</span>
              <span className="font-semibold text-[#0F172A]">{formData.beneficiaryName}</span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-[#64748B]">Account Number</span>
              <span className="font-mono text-[#0F172A]">{formData.accountNumber}</span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-[#64748B]">IFSC Code</span>
              <span className="font-mono uppercase text-[#0F172A]">{formData.ifsc}</span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-[#64748B]">Debit Account</span>
              <span className="font-mono text-[#0F172A]">{user?.accountNumber || 'XXXX XXXX 4521'}</span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-[#64748B]">Transfer Mode</span>
              <span className="font-semibold text-[#16A34A]">Instant IMPS / UPI (Free)</span>
            </div>

            {formData.remarks && (
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#64748B]">Remarks</span>
                <span className="text-[#0F172A]">{formData.remarks}</span>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PaymentForm;
