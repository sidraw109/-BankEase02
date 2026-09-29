import React, { useState } from 'react';
import { useBanking } from '../context/BankingContext';
import {
  FiShield,
  FiLock,
  FiAlertTriangle,
  FiSlash,
  FiSettings,
  FiCheckCircle,
  FiChevronDown,
  FiChevronUp,
  FiPhone,
  FiMail,
  FiLifeBuoy,
  FiFileText,
  FiCreditCard
} from 'react-icons/fi';
import Modal from '../components/Modal';

const faqs = [
  {
    q: 'How do I reset my password?',
    a: 'You can reset your Net Banking password by clicking on the "Forgot Password" link on the login screen or navigating to your Profile > Security Settings. You will need to verify an OTP sent to your registered mobile number.'
  },
  {
    q: 'How do I transfer money?',
    a: 'Navigate to Payments > Money Transfer. Select a saved beneficiary or choose "Enter New Beneficiary Details", enter the transfer amount and remarks, review the summary, and confirm to execute an instant IMPS transfer.'
  },
  {
    q: 'How do I add a beneficiary?',
    a: 'Under the Payments or Account Dashboard section, click on "Add Beneficiary". Enter the payee’s full name, bank account number, and IFSC code. The beneficiary is validated instantly with zero cooling period in this demo.'
  },
  {
    q: 'How do I report fraud?',
    a: 'Use the "Report Fraud Form" on this page. Enter the suspicious Transaction ID, date, amount, fraud type, and description. You will immediately receive a registered incident reference number, and our cyber fraud team will freeze affected channels.'
  },
  {
    q: 'How do I block my card?',
    a: 'Click on the "Block Card" emergency card located at the top of the Fraud Protection section. Toggling this will immediately disable all POS, ATM, and online transactions on your debit card.'
  },
  {
    q: 'How do I download my statement?',
    a: 'Go to the Transactions page and click the "Download Statement" button at the top-right. You can choose from PDF or Excel formats for periods up to the previous 12 months.'
  }
];

const FraudHelp = () => {
  const { 
    isCardBlocked, 
    toggleBlockCard, 
    isAccountBlocked, 
    toggleBlockAccount,
    submitFraudReport,
    addToast
  } = useBanking();

  // Fraud Report Form State
  const [reportForm, setReportForm] = useState({
    transactionId: '',
    transactionDate: new Date().toISOString().split('T')[0],
    amount: '',
    fraudType: 'Unauthorized Charge',
    description: ''
  });

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submittedCaseId, setSubmittedCaseId] = useState('');
  const [formErrors, setFormErrors] = useState({});

  // FAQ open/close state
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // Ticket Modal State
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('Account Inquiry');
  const [ticketMsg, setTicketMsg] = useState('');

  // Security Settings Modal State
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [smsAlertsEnabled, setSmsAlertsEnabled] = useState(true);
  const [dailyLimit, setDailyLimit] = useState('100000');

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!reportForm.transactionId.trim()) errs.transactionId = 'Transaction ID is required';
    if (!reportForm.amount || parseFloat(reportForm.amount) <= 0) errs.amount = 'Valid transaction amount is required';
    if (!reportForm.description.trim()) errs.description = 'Please describe the incident';

    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }

    const caseId = await submitFraudReport(reportForm);
    if (!caseId) return;
    setSubmittedCaseId(caseId);
    setFormSubmitted(true);
  };

  const handleResetReportForm = () => {
    setReportForm({
      transactionId: '',
      transactionDate: new Date().toISOString().split('T')[0],
      amount: '',
      fraudType: 'Unauthorized Charge',
      description: ''
    });
    setFormSubmitted(false);
    setSubmittedCaseId('');
    setFormErrors({});
  };

  const handleRaiseTicket = (e) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMsg) return;
    addToast(`Support Ticket #${Math.floor(100000 + Math.random() * 900000)} created. Our representative will contact you.`, 'success');
    setIsTicketModalOpen(false);
    setTicketSubject('');
    setTicketMsg('');
  };

  return (
    <div className="space-y-10 animate-fade-in pb-12">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
          Fraud Protection & Help Desk
        </h2>
        <p className="text-sm text-[#64748B] mt-1">
          24x7 security controls, emergency blocking, incident reporting, and knowledge base
        </p>
      </div>

      {/* ======================================================== */}
      {/* SECTION 1: FRAUD PROTECTION                              */}
      {/* ======================================================== */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
          <div className="p-2 rounded-lg bg-[#EFF6FF] text-[#2563EB]">
            <FiShield className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-[#0F172A]">
            Fraud Protection
          </h3>
        </div>

        {/* Security Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* 1. Report Fraud */}
          <div
            onClick={() => {
              const el = document.getElementById('fraud-report-form');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="p-5 rounded-2xl bg-[#FFFFFF] border border-slate-200/90 shadow-subtle hover:border-[#BFDBFE] hover:shadow-card cursor-pointer transition-all flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-xl bg-red-50 text-[#DC2626] flex items-center justify-center mb-3">
              <FiAlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#0F172A]">Report Fraud</h4>
              <p className="text-xs text-[#64748B] mt-1">
                Lodge formal dispute for suspicious charges
              </p>
            </div>
            <span className="mt-4 text-xs font-semibold text-[#DC2626] hover:underline">
              Open Form &rarr;
            </span>
          </div>

          {/* 2. Block Card */}
          <div
            onClick={toggleBlockCard}
            className={`p-5 rounded-2xl border shadow-subtle cursor-pointer transition-all flex flex-col justify-between ${
              isCardBlocked
                ? 'bg-red-50/70 border-[#DC2626]'
                : 'bg-[#FFFFFF] border-slate-200/90 hover:border-[#BFDBFE]'
            }`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                isCardBlocked ? 'bg-[#DC2626] text-white' : 'bg-[#EFF6FF] text-[#2563EB]'
              }`}
            >
              <FiCreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-[#0F172A]">Block Card</h4>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isCardBlocked
                      ? 'bg-[#DC2626] text-white'
                      : 'bg-[#16A34A]/20 text-[#16A34A]'
                  }`}
                >
                  {isCardBlocked ? 'BLOCKED' : 'ACTIVE'}
                </span>
              </div>
              <p className="text-xs text-[#64748B] mt-1">
                Instantly freeze debit card transactions
              </p>
            </div>
            <span
              className={`mt-4 text-xs font-semibold ${
                isCardBlocked ? 'text-[#16A34A]' : 'text-[#DC2626]'
              }`}
            >
              {isCardBlocked ? 'Click to Unblock' : 'Click to Block'}
            </span>
          </div>

          {/* 3. Block Account */}
          <div
            onClick={toggleBlockAccount}
            className={`p-5 rounded-2xl border shadow-subtle cursor-pointer transition-all flex flex-col justify-between ${
              isAccountBlocked
                ? 'bg-red-50/70 border-[#DC2626]'
                : 'bg-[#FFFFFF] border-slate-200/90 hover:border-[#BFDBFE]'
            }`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                isAccountBlocked ? 'bg-[#DC2626] text-white' : 'bg-red-50 text-[#DC2626]'
              }`}
            >
              <FiSlash className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-[#0F172A]">Block Account</h4>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isAccountBlocked
                      ? 'bg-[#DC2626] text-white'
                      : 'bg-[#16A34A]/20 text-[#16A34A]'
                  }`}
                >
                  {isAccountBlocked ? 'LOCKED' : 'SECURE'}
                </span>
              </div>
              <p className="text-xs text-[#64748B] mt-1">
                Emergency freeze on all digital banking channels
              </p>
            </div>
            <span
              className={`mt-4 text-xs font-semibold ${
                isAccountBlocked ? 'text-[#16A34A]' : 'text-[#DC2626]'
              }`}
            >
              {isAccountBlocked ? 'Unlock Net Banking' : 'Freeze Account'}
            </span>
          </div>

          {/* 4. Suspicious Transaction */}
          <div
            onClick={() => {
              setReportForm({
                transactionId: 'TXN-894198',
                transactionDate: '2026-09-15',
                amount: '12000',
                fraudType: 'Unauthorized Wire Transfer',
                description: 'Unrecognized SWIFT wire transfer detected in pending status.'
              });
              const el = document.getElementById('fraud-report-form');
              el?.scrollIntoView({ behavior: 'smooth' });
              addToast('Prefilled form with recent pending international transfer.', 'info');
            }}
            className="p-5 rounded-2xl bg-[#FFFFFF] border border-slate-200/90 shadow-subtle hover:border-[#BFDBFE] hover:shadow-card cursor-pointer transition-all flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#F59E0B] flex items-center justify-center mb-3">
              <FiLock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#0F172A]">Suspicious Activity</h4>
              <p className="text-xs text-[#64748B] mt-1">
                Flag unusual logins or unexpected pending wires
              </p>
            </div>
            <span className="mt-4 text-xs font-semibold text-[#2563EB]">
              Flag Transaction &rarr;
            </span>
          </div>

          {/* 5. Security Settings */}
          <div
            onClick={() => setIsSecurityModalOpen(true)}
            className="p-5 rounded-2xl bg-[#FFFFFF] border border-slate-200/90 shadow-subtle hover:border-[#BFDBFE] hover:shadow-card cursor-pointer transition-all flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mb-3">
              <FiSettings className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#0F172A]">Security Settings</h4>
              <p className="text-xs text-[#64748B] mt-1">
                2FA, device binding, and daily transfer limits
              </p>
            </div>
            <span className="mt-4 text-xs font-semibold text-[#2563EB]">
              Configure &rarr;
            </span>
          </div>
        </div>

        {/* Report Fraud Form */}
        <div id="fraud-report-form" className="bg-[#FFFFFF] rounded-2xl border border-slate-200/90 shadow-card p-6 sm:p-8">
          <div className="pb-4 border-b border-slate-100 mb-6">
            <h3 className="text-lg font-bold text-[#0F172A]">
              Report Fraud Form
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              Submit dispute details for investigation by our cyber security department
            </p>
          </div>

          {formSubmitted ? (
            <div className="p-8 text-center space-y-4 rounded-2xl bg-[#EFF6FF]/60 border border-[#BFDBFE] animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-[#16A34A]/10 text-[#16A34A] flex items-center justify-center mx-auto">
                <FiCheckCircle className="w-10 h-10" />
              </div>

              <div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#16A34A]/20 text-[#16A34A]">
                  Incident Reference: #{submittedCaseId}
                </span>
                <h4 className="text-xl font-bold text-[#0F172A] mt-3">
                  Fraud report submitted successfully.
                </h4>
                <p className="text-sm font-medium text-[#64748B] mt-1">
                  Our support team will review your request.
                </p>
                <p className="text-xs text-[#94A3B8] mt-2 max-w-md mx-auto">
                  An investigator has been assigned. You will receive real-time updates via SMS and notifications.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleResetReportForm}
                  className="px-6 py-2.5 rounded-xl bg-[#2563EB] text-white text-xs font-semibold hover:bg-[#1E3A8A] transition-colors shadow-sm"
                >
                  Submit Another Report
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleReportSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Transaction ID */}
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                    Transaction ID
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. TXN-894210"
                    value={reportForm.transactionId}
                    onChange={(e) => {
                      setReportForm({ ...reportForm, transactionId: e.target.value });
                      if (formErrors.transactionId) setFormErrors({ ...formErrors, transactionId: null });
                    }}
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border text-sm font-mono focus:outline-none transition-colors ${
                      formErrors.transactionId
                        ? 'border-[#DC2626] focus:border-[#DC2626]'
                        : 'border-slate-200 focus:border-[#2563EB]'
                    }`}
                  />
                  {formErrors.transactionId && (
                    <p className="text-xs text-[#DC2626] mt-1">{formErrors.transactionId}</p>
                  )}
                </div>

                {/* Transaction Date */}
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                    Transaction Date
                  </label>
                  <input
                    type="date"
                    value={reportForm.transactionDate}
                    onChange={(e) => setReportForm({ ...reportForm, transactionDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-slate-200 text-sm focus:outline-none focus:border-[#2563EB]"
                  />
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 2499"
                    value={reportForm.amount}
                    onChange={(e) => {
                      setReportForm({ ...reportForm, amount: e.target.value });
                      if (formErrors.amount) setFormErrors({ ...formErrors, amount: null });
                    }}
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border text-sm font-mono focus:outline-none transition-colors ${
                      formErrors.amount
                        ? 'border-[#DC2626] focus:border-[#DC2626]'
                        : 'border-slate-200 focus:border-[#2563EB]'
                    }`}
                  />
                  {formErrors.amount && (
                    <p className="text-xs text-[#DC2626] mt-1">{formErrors.amount}</p>
                  )}
                </div>
              </div>

              {/* Fraud Type */}
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                  Fraud Type
                </label>
                <select
                  value={reportForm.fraudType}
                  onChange={(e) => setReportForm({ ...reportForm, fraudType: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-slate-200 text-sm text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
                >
                  <option value="Unauthorized Charge">Unauthorized Charge / Unknown Merchant</option>
                  <option value="Card Cloned / Skimmed">Card Cloned / Skimmed at ATM/POS</option>
                  <option value="Phishing Scam">Phishing Email / Fraudulent SMS Link</option>
                  <option value="Compromised OTP">Compromised OTP or SIM Swap</option>
                  <option value="Duplicate Debit">Double Debit for Single Purchase</option>
                  <option value="Account Takeover">Suspicious Login & Account Takeover</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Provide any additional details, including merchant name, time of SMS alert, or circumstances..."
                  value={reportForm.description}
                  onChange={(e) => {
                    setReportForm({ ...reportForm, description: e.target.value });
                    if (formErrors.description) setFormErrors({ ...formErrors, description: null });
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border text-sm focus:outline-none transition-colors ${
                    formErrors.description
                      ? 'border-[#DC2626] focus:border-[#DC2626]'
                      : 'border-slate-200 focus:border-[#2563EB]'
                  }`}
                />
                {formErrors.description && (
                  <p className="text-xs text-[#DC2626] mt-1">{formErrors.description}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#DC2626] hover:bg-red-700 text-white text-sm font-semibold shadow-md shadow-red-600/20 transition-all active:scale-[0.98]"
              >
                Submit Fraud Report
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION 2: HELP & SUPPORT                                */}
      {/* ======================================================== */}
      <section className="space-y-6 pt-6 border-t border-slate-200">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
          <div className="p-2 rounded-lg bg-[#EFF6FF] text-[#2563EB]">
            <FiLifeBuoy className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-[#0F172A]">
            Help & Support
          </h3>
        </div>

        {/* Support Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-slate-200/90 shadow-subtle flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mb-3">
                <FiPhone className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-[#0F172A]">Customer Support</h4>
              <p className="text-xs text-[#64748B] mt-1">
                Toll-free 24x7 phone assistance
              </p>
              <p className="text-xs font-bold text-[#2563EB] font-mono mt-2">
                1800-425-BANK (2265)
              </p>
            </div>
            <button
              onClick={() => addToast('Initiating call to 1800-425-2265...', 'info')}
              className="mt-4 text-xs font-semibold text-[#2563EB] text-left hover:underline"
            >
              Call Now &rarr;
            </button>
          </div>

          <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-slate-200/90 shadow-subtle flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#16A34A]/10 text-[#16A34A] flex items-center justify-center mb-3">
                <FiFileText className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-[#0F172A]">Raise a Ticket</h4>
              <p className="text-xs text-[#64748B] mt-1">
                Open a service request for account inquiries
              </p>
            </div>
            <button
              onClick={() => setIsTicketModalOpen(true)}
              className="mt-4 text-xs font-semibold text-[#16A34A] text-left hover:underline"
            >
              Create Ticket &rarr;
            </button>
          </div>

          <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-slate-200/90 shadow-subtle flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#1E3A8A]/10 text-[#1E3A8A] flex items-center justify-center mb-3">
                <FiLifeBuoy className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-[#0F172A]">Contact Bank</h4>
              <p className="text-xs text-[#64748B] mt-1">
                Main Branch: 104 Financial District
              </p>
              <p className="text-xs font-mono text-[#64748B] mt-1">
                Mon-Sat 10:00 AM - 4:00 PM
              </p>
            </div>
            <button
              onClick={() => addToast('Branch address: Main Branch, Bengaluru. IFSC: BKES0001024', 'info')}
              className="mt-4 text-xs font-semibold text-[#1E3A8A] text-left hover:underline"
            >
              View Branch Details &rarr;
            </button>
          </div>

          <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-slate-200/90 shadow-subtle flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-red-50 text-[#DC2626] flex items-center justify-center mb-3">
                <FiMail className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-[#0F172A]">Security Help</h4>
              <p className="text-xs text-[#64748B] mt-1">
                Dedicated urgent anti-phishing mailbox
              </p>
              <p className="text-xs font-mono text-[#DC2626] mt-2">
                fraud@bankease.com
              </p>
            </div>
            <button
              onClick={() => addToast('Copied security email: fraud@bankease.com', 'success')}
              className="mt-4 text-xs font-semibold text-[#DC2626] text-left hover:underline"
            >
              Copy Email &rarr;
            </button>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="bg-[#FFFFFF] rounded-2xl border border-slate-200/90 shadow-card p-6 sm:p-8">
          <div className="pb-4 border-b border-slate-100 mb-4">
            <h3 className="text-base font-bold text-[#0F172A]">
              Frequently Asked Questions
            </h3>
            <p className="text-xs text-[#64748B]">
              Quick answers to common questions about your BankEase account
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div key={index} className="py-3.5">
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full flex items-center justify-between text-left group"
                  >
                    <span className="text-sm font-semibold text-[#0F172A] group-hover:text-[#2563EB] transition-colors">
                      {faq.q}
                    </span>
                    <span className="p-1 rounded-md text-[#64748B] group-hover:text-[#2563EB]">
                      {isOpen ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
                    </span>
                  </button>

                  {isOpen && (
                    <p className="mt-2.5 text-xs sm:text-sm text-[#64748B] leading-relaxed pr-6 animate-fade-in">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Raise Ticket Modal */}
      <Modal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        title="Raise a Support Ticket"
        footer={
          <>
            <button
              onClick={() => setIsTicketModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#64748B] hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              onClick={handleRaiseTicket}
              className="px-5 py-2 rounded-xl bg-[#2563EB] text-white text-xs font-semibold hover:bg-[#1E3A8A]"
            >
              Submit Ticket
            </button>
          </>
        }
      >
        <form onSubmit={handleRaiseTicket} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1">
              Category
            </label>
            <select
              value={ticketCategory}
              onChange={(e) => setTicketCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-slate-200 text-sm focus:outline-none focus:border-[#2563EB]"
            >
              <option value="Account Inquiry">Account Inquiry</option>
              <option value="Transaction Dispute">Transaction Dispute</option>
              <option value="Card Replacement">Card Replacement</option>
              <option value="Technical Issue">Technical / App Issue</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1">
              Subject
            </label>
            <input
              type="text"
              placeholder="e.g. Statement discrepancy in September"
              value={ticketSubject}
              onChange={(e) => setTicketSubject(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-slate-200 text-sm focus:outline-none focus:border-[#2563EB]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1">
              Message Details
            </label>
            <textarea
              rows={3}
              placeholder="Explain the issue in detail..."
              value={ticketMsg}
              onChange={(e) => setTicketMsg(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-slate-200 text-sm focus:outline-none focus:border-[#2563EB]"
            />
          </div>
        </form>
      </Modal>

      {/* Security Settings Modal */}
      <Modal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
        title="Security & Authorization Settings"
        footer={
          <button
            onClick={() => {
              setIsSecurityModalOpen(false);
              addToast('Security settings updated successfully.', 'success');
            }}
            className="px-5 py-2 rounded-xl bg-[#2563EB] text-white text-xs font-semibold hover:bg-[#1E3A8A]"
          >
            Save Preferences
          </button>
        }
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAFC] border border-slate-200">
            <div>
              <p className="text-xs font-bold text-[#0F172A]">Two-Factor Authentication (2FA)</p>
              <p className="text-[11px] text-[#64748B]">Require SMS OTP on all new device logins</p>
            </div>
            <input
              type="checkbox"
              checked={twoFactorEnabled}
              onChange={(e) => setTwoFactorEnabled(e.target.checked)}
              className="w-4 h-4 text-[#2563EB] rounded focus:ring-[#2563EB]"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAFC] border border-slate-200">
            <div>
              <p className="text-xs font-bold text-[#0F172A]">Instant Transaction SMS Alerts</p>
              <p className="text-[11px] text-[#64748B]">Receive immediate SMS for transactions &gt; ₹100</p>
            </div>
            <input
              type="checkbox"
              checked={smsAlertsEnabled}
              onChange={(e) => setSmsAlertsEnabled(e.target.checked)}
              className="w-4 h-4 text-[#2563EB] rounded focus:ring-[#2563EB]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0F172A] mb-1">
              Daily Digital Transfer Limit (₹)
            </label>
            <input
              type="number"
              value={dailyLimit}
              onChange={(e) => setDailyLimit(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-slate-200 text-sm font-mono focus:outline-none focus:border-[#2563EB]"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default FraudHelp;
