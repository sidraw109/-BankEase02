import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useBanking } from '../context/BankingContext';
import PaymentCard from '../components/PaymentCard';
import PaymentForm from '../components/PaymentForm';
import BeneficiaryCard from '../components/BeneficiaryCard';
import Modal from '../components/Modal';
import { Spinner } from '../components/Loading';
import {
  FiSend,
  FiSmartphone,
  FiZap,
  FiDroplet,
  FiWifi,
  FiPhoneCall,
  FiSun,
  FiCreditCard,
  FiPlus,
  FiCheckCircle,
  FiAlertCircle
} from 'react-icons/fi';

const paymentServices = [
  { id: 'transfer', title: 'Money Transfer', subtitle: 'IMPS & NEFT', icon: FiSend, category: 'Transfer', badge: 'Popular' },
  { id: 'upi', title: 'UPI Payment', subtitle: 'Instant VPA', icon: FiSmartphone, category: 'Transfer' },
  { id: 'electricity', title: 'Electricity', subtitle: 'State Boards', icon: FiZap, category: 'Utilities' },
  { id: 'water', title: 'Water', subtitle: 'Municipal Corp', icon: FiDroplet, category: 'Utilities' },
  { id: 'internet', title: 'Internet', subtitle: 'Fiber & Broadband', icon: FiWifi, category: 'Utilities' },
  { id: 'recharge', title: 'Mobile Recharge', subtitle: 'Prepaid & Postpaid', icon: FiPhoneCall, category: 'Utilities' },
  { id: 'gas', title: 'Gas', subtitle: 'Piped & Cylinder', icon: FiSun, category: 'Utilities' },
  { id: 'creditcard', title: 'Credit Card', subtitle: 'Bill Payment', icon: FiCreditCard, category: 'Payment' }
];

const Payments = () => {
  const location = useLocation();
  const { 
    beneficiaries, 
    addBeneficiary, 
    editBeneficiary, 
    deleteBeneficiary,
    executeTransfer,
    balance
  } = useBanking();

  // Active selected option
  const [selectedService, setSelectedService] = useState('transfer');
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);

  // Beneficiary Modal State
  const [isBenModalOpen, setIsBenModalOpen] = useState(false);
  const [editingBen, setEditingBen] = useState(null);
  const [benFormData, setBenFormData] = useState({
    name: '',
    accountNumber: '',
    ifsc: 'BKES0001024',
    bankName: 'BankEase'
  });
  const [benError, setBenError] = useState('');

  // Bill Payment Modal State
  const [isBillModalOpen, setIsBillModalOpen] = useState(false);
  const [billService, setBillService] = useState(null);
  const [billForm, setBillForm] = useState({
    consumerNumber: '',
    provider: '',
    amount: ''
  });
  const [billProcessing, setBillProcessing] = useState(false);
  const [billSuccess, setBillSuccess] = useState(null);

  // Check URL queries (e.g. from BalanceCard or QuickAction)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab === 'bills') {
      setSelectedService('electricity');
    } else if (tab === 'transfer') {
      setSelectedService('transfer');
    }
  }, [location.search]);

  // Handle service card click
  const handleServiceClick = (service) => {
    setSelectedService(service.id);
    if (service.id !== 'transfer' && service.id !== 'upi') {
      // Open Bill payment modal
      setBillService(service);
      setBillForm({
        consumerNumber: '',
        provider: service.title + ' Provider',
        amount: ''
      });
      setBillSuccess(null);
      setIsBillModalOpen(true);
    }
  };

  // Beneficiary Form Actions
  const handleOpenAddBeneficiary = () => {
    setEditingBen(null);
    setBenFormData({
      name: '',
      accountNumber: '',
      ifsc: 'BKES0001024',
      bankName: 'BankEase'
    });
    setBenError('');
    setIsBenModalOpen(true);
  };

  const handleOpenEditBeneficiary = (ben) => {
    setEditingBen(ben);
    setBenFormData({
      name: ben.name,
      accountNumber: ben.accountNumber,
      ifsc: ben.ifsc,
      bankName: ben.bankName
    });
    setBenError('');
    setIsBenModalOpen(true);
  };

  const handleSaveBeneficiary = (e) => {
    e.preventDefault();
    if (!benFormData.name || !benFormData.accountNumber || !benFormData.ifsc) {
      setBenError('Please fill in all mandatory fields.');
      return;
    }

    if (editingBen) {
      editBeneficiary(editingBen.id, {
        name: benFormData.name,
        accountNumber: benFormData.accountNumber,
        ifsc: benFormData.ifsc.toUpperCase(),
        bankName: benFormData.bankName
      });
    } else {
      addBeneficiary({
        name: benFormData.name,
        accountNumber: benFormData.accountNumber,
        ifsc: benFormData.ifsc.toUpperCase(),
        bankName: benFormData.bankName
      });
    }
    setIsBenModalOpen(false);
  };

  // Bill Pay Submit
  const handleBillPayment = async (e) => {
    e.preventDefault();
    const numAmount = parseFloat(billForm.amount);
    if (!billForm.consumerNumber || isNaN(numAmount) || numAmount <= 0) {
      return;
    }

    setBillProcessing(true);
    const res = await executeTransfer({
      beneficiaryName: billService.title,
      accountNumber: '998877665544',
      amount: numAmount,
      remarks: `${billService.title} for ID: ${billForm.consumerNumber}`,
      category: 'Utilities',
      biller: billService.title
    });

    setBillProcessing(false);
    if (res.success) {
      setBillSuccess(res.transaction);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
          Payments & Transfers
        </h2>
        <p className="text-sm text-[#64748B] mt-1">
          Instant money transfers, bill settlements, and beneficiary management
        </p>
      </div>

      {/* Payment Options Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-[#0F172A]">
            Payment Options
          </h3>
          <span className="text-xs text-[#64748B]">Click any service to initiate</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {paymentServices.map((service) => (
            <PaymentCard
              key={service.id}
              icon={service.icon}
              title={service.title}
              subtitle={service.subtitle}
              badge={service.badge}
              isSelected={selectedService === service.id}
              onClick={() => handleServiceClick(service)}
            />
          ))}
        </div>
      </div>

      {/* Main Payment Section: Transfer Form & Saved Beneficiaries */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Money Transfer Form (7 cols) */}
        <div className="lg:col-span-7">
          <PaymentForm
            selectedBeneficiary={selectedBeneficiary}
            onTransferComplete={() => {
              setSelectedBeneficiary(null);
            }}
          />
        </div>

        {/* Right Column: Beneficiaries Management (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#FFFFFF] rounded-2xl border border-slate-200/90 shadow-card p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-bold text-[#0F172A]">
                  Beneficiaries
                </h3>
                <p className="text-xs text-[#64748B]">
                  {beneficiaries.length} registered payees
                </p>
              </div>

              <button
                onClick={handleOpenAddBeneficiary}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EFF6FF] hover:bg-[#2563EB] text-[#2563EB] hover:text-white text-xs font-semibold transition-all border border-[#BFDBFE]"
              >
                <FiPlus className="w-3.5 h-3.5" />
                <span>Add Beneficiary</span>
              </button>
            </div>

            {/* Beneficiaries List */}
            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {beneficiaries.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#64748B]">
                  No beneficiaries added yet. Click &quot;Add Beneficiary&quot; above to create one.
                </div>
              ) : (
                beneficiaries.map((ben) => (
                  <BeneficiaryCard
                    key={ben.id}
                    beneficiary={ben}
                    selected={selectedBeneficiary?.id === ben.id}
                    onSelect={(b) => setSelectedBeneficiary(b)}
                    onEdit={handleOpenEditBeneficiary}
                    onDelete={deleteBeneficiary}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add / Edit Beneficiary Modal */}
      <Modal
        isOpen={isBenModalOpen}
        onClose={() => setIsBenModalOpen(false)}
        title={editingBen ? 'Edit Beneficiary Details' : 'Register New Beneficiary'}
        footer={
          <>
            <button
              onClick={() => setIsBenModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#64748B] hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveBeneficiary}
              className="px-5 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1E3A8A] text-white text-xs font-semibold shadow-sm"
            >
              {editingBen ? 'Save Changes' : 'Confirm & Add'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSaveBeneficiary} className="space-y-3.5">
          {benError && (
            <div className="p-2.5 rounded-lg bg-red-50 text-xs text-[#DC2626] font-medium border border-red-200">
              {benError}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1">
              Payee Full Name
            </label>
            <input
              type="text"
              placeholder="e.g. Rahul Sharma"
              value={benFormData.name}
              onChange={(e) => setBenFormData({ ...benFormData, name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-slate-200 text-sm focus:outline-none focus:border-[#2563EB]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1">
              Account Number
            </label>
            <input
              type="text"
              placeholder="e.g. 987654324521"
              value={benFormData.accountNumber}
              onChange={(e) => setBenFormData({ ...benFormData, accountNumber: e.target.value.replace(/\D/g, '') })}
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
                value={benFormData.ifsc}
                onChange={(e) => setBenFormData({ ...benFormData, ifsc: e.target.value.toUpperCase() })}
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
                value={benFormData.bankName}
                onChange={(e) => setBenFormData({ ...benFormData, bankName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-slate-200 text-sm focus:outline-none focus:border-[#2563EB]"
              />
            </div>
          </div>
        </form>
      </Modal>

      {/* Bill Payment Modal */}
      <Modal
        isOpen={isBillModalOpen}
        onClose={() => {
          setIsBillModalOpen(false);
          setBillSuccess(null);
        }}
        title={billSuccess ? 'Bill Payment Receipt' : `Pay ${billService?.title || 'Bill'}`}
        footer={
          billSuccess ? (
            <button
              onClick={() => {
                setIsBillModalOpen(false);
                setBillSuccess(null);
              }}
              className="px-5 py-2 rounded-xl bg-[#2563EB] text-white text-xs font-semibold hover:bg-[#1E3A8A]"
            >
              Done
            </button>
          ) : (
            <>
              <button
                onClick={() => setIsBillModalOpen(false)}
                disabled={billProcessing}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#64748B] hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleBillPayment}
                disabled={billProcessing}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1E3A8A] text-white text-xs font-semibold shadow-sm transition-all"
              >
                {billProcessing ? (
                  <>
                    <Spinner size="sm" className="border-white" />
                    <span>Processing Payment...</span>
                  </>
                ) : (
                  <>
                    <FiCheckCircle className="w-4 h-4" />
                    <span>Pay ₹{parseFloat(billForm.amount || 0).toLocaleString('en-IN')}</span>
                  </>
                )}
              </button>
            </>
          )
        }
      >
        {billSuccess ? (
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#16A34A]/10 text-[#16A34A] flex items-center justify-center mx-auto">
              <FiCheckCircle className="w-10 h-10" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-[#0F172A]">Payment Successful!</h4>
              <p className="text-xs text-[#64748B]">
                Your {billService?.title} bill payment has been processed instantly.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-[#64748B]">Biller</span>
                <span className="font-semibold text-[#0F172A]">{billService?.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Transaction ID</span>
                <span className="font-mono font-bold text-[#0F172A]">{billSuccess.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Amount Paid</span>
                <span className="font-mono font-bold text-[#16A34A]">₹{billSuccess.amount}</span>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleBillPayment} className="space-y-4">
            <div className="p-3 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-between text-xs">
              <span className="text-[#1E3A8A] font-medium">Biller Service:</span>
              <span className="font-bold text-[#2563EB]">{billService?.title}</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                Consumer / Account / Card Number
              </label>
              <input
                type="text"
                placeholder="e.g. 109283741 or card digits"
                value={billForm.consumerNumber}
                onChange={(e) => setBillForm({ ...billForm, consumerNumber: e.target.value })}
                required
                className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-slate-200 text-sm font-mono focus:outline-none focus:border-[#2563EB]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                Bill Amount (₹)
              </label>
              <input
                type="number"
                placeholder="e.g. 1250"
                value={billForm.amount}
                onChange={(e) => setBillForm({ ...billForm, amount: e.target.value })}
                required
                className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-slate-200 text-sm font-bold font-mono focus:outline-none focus:border-[#2563EB]"
              />
              <span className="text-[11px] text-[#64748B] mt-1 block">
                Available: ₹{balance.toLocaleString('en-IN')}
              </span>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default Payments;
