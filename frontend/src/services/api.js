// Central API client for the BankEase Spring Boot backend.
// Base URL defaults to the local backend; override with VITE_API_URL at build time.
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

const TOKEN_KEY = 'bankease_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t) => {
  if (t) localStorage.setItem(TOKEN_KEY, t);
  else localStorage.removeItem(TOKEN_KEY);
};

async function request(path, { method = 'GET', body, auth = true, params } = {}) {
  const url = new URL(API_BASE + path, window.location.origin);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null) url.searchParams.append(k, v);
    });
  }

  const headers = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  const token = getToken();
  if (auth && token) headers['Authorization'] = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(url.toString(), {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (networkErr) {
    const err = new Error('Cannot reach the BankEase server. Is the backend running on :8080?');
    err.network = true;
    throw err;
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    /* empty body */
  }

  if (!res.ok || (data && data.success === false)) {
    const err = new Error((data && data.message) || `Request failed (${res.status})`);
    err.status = res.status;
    err.errorCode = data && data.errorCode;
    err.payload = data;
    throw err;
  }
  return data;
}

// ---------- helpers / mappers ----------
const toNum = (v) => (v === null || v === undefined ? 0 : Number(v));

const ACCOUNT_TYPE_LABEL = {
  SAVINGS: 'Savings Account',
  CURRENT: 'Current Account',
  SALARY: 'Salary Account',
  FIXED_DEPOSIT: 'Fixed Deposit',
};

const maskAccount = (acct) => (acct ? `XXXX XXXX ${String(acct).slice(-4)}` : 'XXXX XXXX 0000');

function fmtDateTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fmtDisplayDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return `${d.getDate()} ${d.toLocaleString('default', { month: 'short' })} ${d.getFullYear()}, ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}

function timeAgo(iso) {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} mins ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs > 1 ? 's' : ''} ago`;
  const days = Math.round(hrs / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

export function mapUser(u) {
  if (!u) return null;
  const name = `${u.firstName || ''} ${u.lastName || ''}`.trim();
  const initials = `${(u.firstName || '')[0] || ''}${(u.lastName || '')[0] || ''}`.toUpperCase();
  return {
    id: u.id,
    name,
    firstName: u.firstName,
    lastName: u.lastName,
    customerId: `BE${String(u.id || '').padStart(6, '0')}`,
    email: u.email,
    phone: u.phone ? `+91 ${u.phone}` : '',
    rawPhone: u.phone,
    accountType: ACCOUNT_TYPE_LABEL[u.accountType] || 'Savings Account',
    accountNumber: maskAccount(u.accountNumber),
    rawAccountNumber: u.accountNumber,
    balance: toNum(u.balance),
    status: u.status,
    kycVerified: !!u.kycVerified,
    branch: 'Main Branch',
    ifsc: 'BKES0001024',
    address: u.address || '',
    joinedDate: u.createdAt ? fmtDisplayDate(u.createdAt).split(',')[0] : '',
    avatarInitials: initials || 'BE',
  };
}

const TXN_STATUS = { SUCCESS: 'Completed', PENDING: 'Pending', PROCESSING: 'Pending', FAILED: 'Failed', REVERSED: 'Reversed' };

function txnCategory(t) {
  switch (t.type) {
    case 'DEPOSIT': return 'Income';
    case 'REFUND': return 'Refund';
    case 'WITHDRAWAL': return 'Withdrawal';
    case 'PAYMENT': return 'Payment';
    case 'INTER_BANK_TRANSFER': return 'Transfer';
    case 'INTRA_BANK_TRANSFER': return 'Transfer';
    default: return 'Transfer';
  }
}

export function mapTransaction(t) {
  const isCredit = t.type === 'DEPOSIT' || t.type === 'REFUND';
  return {
    id: `TXN-${t.id}`,
    referenceNo: t.referenceNumber,
    date: fmtDateTime(t.createdAt),
    displayDate: fmtDisplayDate(t.createdAt),
    description: t.description || `${isCredit ? 'Credit' : 'Transfer'} • ${t.channel || ''}`.trim(),
    category: txnCategory(t),
    type: isCredit ? 'Credit' : 'Debit',
    amount: toNum(t.amount),
    status: TXN_STATUS[t.status] || t.status,
    account: maskAccount(t.senderAccountNumber),
    remarks: t.description || t.channel || '',
  };
}

const NOTIF_CATEGORY = {
  TRANSACTION_ALERT: 'Transaction',
  OTP: 'Security',
  ACCOUNT_ACTIVATION: 'Account',
  KYC_STATUS: 'Account',
  SECURITY_ALERT: 'Security',
  RECEIPT: 'Payment',
  PROMOTIONAL: 'Offers',
};
const NOTIF_SEVERITY = {
  TRANSACTION_ALERT: 'info',
  OTP: 'info',
  ACCOUNT_ACTIVATION: 'success',
  KYC_STATUS: 'success',
  SECURITY_ALERT: 'warning',
  RECEIPT: 'success',
  PROMOTIONAL: 'info',
};

export function mapNotification(n) {
  return {
    id: n.id,
    title: n.title || 'Notification',
    message: n.message || '',
    category: NOTIF_CATEGORY[n.type] || 'General',
    timestamp: timeAgo(n.createdAt),
    date: fmtDateTime(n.createdAt),
    read: !!n.read,
    severity: NOTIF_SEVERITY[n.type] || 'info',
    details: n.referenceId ? `Reference: ${n.referenceId}` : '',
  };
}

export function mapDispute(d) {
  return {
    id: d.ticketNumber,
    reportId: d.ticketNumber,
    ticketNumber: d.ticketNumber,
    status: d.status,
    priority: d.priority,
    type: d.disputeType,
    fraudType: d.disputeType,
    subject: d.subject,
    description: d.description,
    transactionId: d.transactionReference || '',
    submittedAt: d.createdAt,
  };
}

export function mapPayment(p) {
  return {
    id: `PAY-${p.id}`,
    orderId: p.orderId,
    referenceNo: p.gatewayTransactionId || p.orderId,
    date: fmtDateTime(p.createdAt),
    displayDate: fmtDisplayDate(p.createdAt),
    description: p.description || `Payment to ${p.beneficiaryName || ''}`.trim(),
    category: 'Payment',
    type: 'Debit',
    amount: toNum(p.amount),
    status: p.status === 'SUCCESS' ? 'Completed' : p.status === 'INITIATED' || p.status === 'PROCESSING' ? 'Pending' : p.status,
    account: maskAccount(p.accountNumber),
    remarks: `${p.paymentType || ''} • ${p.beneficiaryName || ''}`.trim(),
  };
}

// ---------- endpoint wrappers ----------
export const api = {
  // Auth
  register: (payload) => request('/auth/register', { method: 'POST', body: payload, auth: false }),
  login: (email, password) => request('/auth/login', { method: 'POST', body: { email, password }, auth: false }),

  // Account
  getProfile: () => request('/account/profile'),
  getByAccountNumber: (acct) => request(`/account/${acct}`),
  submitKyc: (payload) => request('/account/kyc', { method: 'POST', body: payload }),

  // Transactions
  transactionsHistory: (page = 0, size = 50) => request('/transactions/history', { params: { page, size } }),
  transfer: (payload) => request('/transactions/transfer', { method: 'POST', body: payload }),
  statement: (startDate, endDate) => request('/transactions/statement', { params: { startDate, endDate } }),

  // Payments
  paymentsHistory: (page = 0, size = 50) => request('/payments/history', { params: { page, size } }),
  interBank: (payload) => request('/payments/inter-bank', { method: 'POST', body: payload }),

  // Fraud
  createDispute: (payload) => request('/fraud/disputes', { method: 'POST', body: payload }),
  disputes: (page = 0, size = 50) => request('/fraud/disputes', { params: { page, size } }),

  // Notifications
  notifications: (page = 0, size = 50) => request('/notifications', { params: { page, size } }),
  unreadCount: () => request('/notifications/unread/count'),
  markNotificationRead: (id) => request(`/notifications/${id}/read`, { method: 'PUT' }),
  otpSend: (phone, purpose) => request('/notifications/otp/send', { method: 'POST', params: { phone, purpose } }),
};

export default api;
