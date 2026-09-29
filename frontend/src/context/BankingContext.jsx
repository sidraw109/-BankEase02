import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import {
  api,
  mapTransaction,
  mapPayment,
  mapNotification,
  mapDispute,
} from '../services/api';
import { initialBeneficiaries } from '../data/beneficiaries';

const BankingContext = createContext(null);

const genIdemKey = () => `idem-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

const DISPUTE_TYPE_MAP = {
  'Unauthorized Charge': 'UNAUTHORIZED_TRANSACTION',
  'Wrong Amount': 'WRONG_AMOUNT',
  'Not Received': 'TRANSACTION_NOT_RECEIVED',
  'Account Hacked': 'ACCOUNT_HACKED',
  'Duplicate Charge': 'DUPLICATE_CHARGE',
};

export const BankingProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [fraudReports, setFraudReports] = useState([]);
  const [loading, setLoading] = useState(false);

  // Beneficiaries & lock toggles have no backend counterpart -> persisted locally.
  const [beneficiaries, setBeneficiaries] = useState(() => {
    const saved = localStorage.getItem('bankease_beneficiaries');
    return saved ? JSON.parse(saved) : initialBeneficiaries;
  });
  const [isCardBlocked, setIsCardBlocked] = useState(() => localStorage.getItem('bankease_card_blocked') === 'true');
  const [isAccountBlocked, setIsAccountBlocked] = useState(() => localStorage.getItem('bankease_account_blocked') === 'true');

  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    localStorage.setItem('bankease_beneficiaries', JSON.stringify(beneficiaries));
  }, [beneficiaries]);
  useEffect(() => {
    localStorage.setItem('bankease_card_blocked', isCardBlocked ? 'true' : 'false');
  }, [isCardBlocked]);
  useEffect(() => {
    localStorage.setItem('bankease_account_blocked', isAccountBlocked ? 'true' : 'false');
  }, [isAccountBlocked]);

  // ---- Toasts ----
  const removeToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));
  const addToast = (message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    if (duration > 0) setTimeout(() => removeToast(id), duration);
    return id;
  };

  // ---- Data loading ----
  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [profileRes, txnRes, payRes, notifRes, disputeRes] = await Promise.allSettled([
        api.getProfile(),
        api.transactionsHistory(0, 50),
        api.paymentsHistory(0, 50),
        api.notifications(0, 50),
        api.disputes(0, 50),
      ]);

      if (profileRes.status === 'fulfilled') {
        setBalance(Number(profileRes.value.data?.balance ?? 0));
      }

      const mappedTxns = txnRes.status === 'fulfilled' ? (txnRes.value.data?.content || []).map(mapTransaction) : [];
      const mappedPays = payRes.status === 'fulfilled' ? (payRes.value.data?.content || []).map(mapPayment) : [];
      const merged = [...mappedTxns, ...mappedPays].sort((a, b) => (a.date < b.date ? 1 : -1));
      setTransactions(merged);

      if (notifRes.status === 'fulfilled') {
        setNotifications((notifRes.value.data?.content || []).map(mapNotification));
      }
      if (disputeRes.status === 'fulfilled') {
        setFraudReports((disputeRes.value.data?.content || []).map(mapDispute));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadAll();
    } else {
      setBalance(0);
      setTransactions([]);
      setNotifications([]);
      setFraudReports([]);
    }
  }, [isAuthenticated, loadAll]);

  // ---- Transfers ----
  const executeTransfer = async ({ beneficiaryName, accountNumber, ifsc, amount, remarks = 'Transfer', category = 'Transfer', biller = null }) => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      addToast('Please enter a valid transfer amount.', 'danger');
      return { success: false, error: 'Invalid amount' };
    }

    const isInterBank = ifsc && !ifsc.toUpperCase().startsWith('BKES');
    try {
      let res;
      if (isInterBank) {
        res = await api.interBank({
          beneficiaryAccountNumber: accountNumber,
          beneficiaryName: beneficiaryName || biller || 'Beneficiary',
          beneficiaryIfsc: ifsc,
          beneficiaryBankName: 'Beneficiary Bank',
          amount: numAmount,
          paymentType: 'INTER_BANK_IMPS',
          idempotencyKey: genIdemKey(),
          description: remarks,
        });
      } else {
        res = await api.transfer({
          receiverAccountNumber: accountNumber,
          amount: numAmount,
          description: biller ? `${biller} Payment` : remarks,
          idempotencyKey: genIdemKey(),
          channel: 'NETBANKING',
        });
      }

      const txn = res.data ? (res.data.orderId ? mapPayment(res.data) : mapTransaction(res.data)) : null;
      addToast(res.message || `₹${numAmount.toLocaleString('en-IN')} transferred successfully!`, 'success');
      await loadAll();
      return { success: true, transaction: txn };
    } catch (err) {
      addToast(err.message || 'Transfer failed.', 'danger');
      return { success: false, error: err.message };
    }
  };

  // ---- Beneficiaries (local only) ----
  const addBeneficiary = (data) => {
    const masked = `XXXX XXXX ${String(data.accountNumber).slice(-4)}`;
    const newBen = {
      id: `BEN-${Math.floor(100 + Math.random() * 900)}`,
      ...data,
      maskedAccount: masked,
      bankName: data.bankName || 'Partner Bank',
    };
    setBeneficiaries((prev) => [...prev, newBen]);
    addToast(`Beneficiary "${data.name}" added successfully.`, 'success');
    return newBen;
  };

  const editBeneficiary = (id, updatedData) => {
    setBeneficiaries((prev) =>
      prev.map((ben) => {
        if (ben.id === id) {
          const masked = updatedData.accountNumber ? `XXXX XXXX ${String(updatedData.accountNumber).slice(-4)}` : ben.maskedAccount;
          return { ...ben, ...updatedData, maskedAccount: masked };
        }
        return ben;
      })
    );
    addToast('Beneficiary updated successfully.', 'success');
  };

  const deleteBeneficiary = (id) => {
    const ben = beneficiaries.find((b) => b.id === id);
    setBeneficiaries((prev) => prev.filter((b) => b.id !== id));
    addToast(`Beneficiary "${ben?.name || ''}" removed.`, 'info');
  };

  // ---- Notifications ----
  const markNotificationRead = async (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    try {
      await api.markNotificationRead(id);
    } catch {
      /* optimistic; ignore backend miss for locally-added items */
    }
  };

  const markAllNotificationsRead = async () => {
    const unread = notifications.filter((n) => !n.read);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    await Promise.allSettled(unread.map((n) => api.markNotificationRead(n.id)));
    addToast('All notifications marked as read.', 'info');
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    addToast('Notification removed.', 'info');
  };

  // ---- Fraud report -> dispute ticket ----
  const submitFraudReport = async (reportData) => {
    const disputeType = DISPUTE_TYPE_MAP[reportData.fraudType] || 'OTHER';
    const subject = `${reportData.fraudType || 'Fraud'} report`.slice(0, 100);
    let description = (reportData.description || '').trim();
    if (description.length < 20) {
      description = `${description} (Amount: ₹${reportData.amount || 'NA'}, Txn: ${reportData.transactionId || 'NA'})`.padEnd(20, '.');
    }
    try {
      const res = await api.createDispute({
        disputeType,
        subject,
        description,
        transactionReference: reportData.transactionId || null,
      });
      const ticket = res.data?.ticketNumber || 'DISPUTE';
      addToast(`Fraud report #${ticket} submitted successfully.`, 'success');
      await loadAll();
      return ticket;
    } catch (err) {
      addToast(err.message || 'Could not submit fraud report.', 'danger');
      return null;
    }
  };

  const toggleBlockCard = () => {
    setIsCardBlocked((prev) => {
      const next = !prev;
      addToast(next ? 'Debit Card has been blocked.' : 'Debit Card unblocked.', next ? 'warning' : 'success');
      return next;
    });
  };

  const toggleBlockAccount = () => {
    setIsAccountBlocked((prev) => {
      const next = !prev;
      addToast(next ? 'Net Banking account temporarily locked.' : 'Net Banking account unlocked.', next ? 'danger' : 'success');
      return next;
    });
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <BankingContext.Provider
      value={{
        balance,
        transactions,
        beneficiaries,
        notifications,
        unreadCount,
        toasts,
        isCardBlocked,
        isAccountBlocked,
        fraudReports,
        loading,
        refresh: loadAll,
        addToast,
        removeToast,
        executeTransfer,
        addBeneficiary,
        editBeneficiary,
        deleteBeneficiary,
        markNotificationRead,
        markAllNotificationsRead,
        deleteNotification,
        submitFraudReport,
        toggleBlockCard,
        toggleBlockAccount,
      }}
    >
      {children}
    </BankingContext.Provider>
  );
};

export const useBanking = () => {
  const context = useContext(BankingContext);
  if (!context) {
    throw new Error('useBanking must be used within a BankingProvider');
  }
  return context;
};
