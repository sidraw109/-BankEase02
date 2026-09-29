export const initialNotifications = [
  {
    id: "NOTIF-001",
    title: "Transfer Successful",
    message: "₹5,000 transferred successfully to Rahul Sharma (A/c XXXX 4521).",
    category: "Transaction",
    timestamp: "10 mins ago",
    date: "2026-09-28 14:15",
    read: false,
    severity: "info",
    details: "Reference ID: UPI/628109482103. IMPS Immediate Payment Services."
  },
  {
    id: "NOTIF-002",
    title: "Security Alert: New Login",
    message: "New login detected on your account from Chrome on Windows 11 (Bengaluru, IN).",
    category: "Security",
    timestamp: "2 hours ago",
    date: "2026-09-28 12:20",
    read: false,
    severity: "warning",
    details: "IP Address: 103.21.244.12. If this was not you, please lock your account immediately."
  },
  {
    id: "NOTIF-003",
    title: "Utility Bill Paid",
    message: "Electricity bill payment successful. ₹1,250 debited for BESCOM account.",
    category: "Payment",
    timestamp: "1 day ago",
    date: "2026-09-27 18:40",
    read: true,
    severity: "success",
    details: "Biller ID: BESCOM-KA. Consumer No: 109283741. Transaction ID: BBPS/BES/9182371."
  },
  {
    id: "NOTIF-004",
    title: "Security Warning",
    message: "Multiple failed login attempts detected on your internet banking portal.",
    category: "Warning",
    timestamp: "2 days ago",
    date: "2026-09-26 09:12",
    read: false,
    severity: "danger",
    details: "3 consecutive invalid password entries from unrecognized device. Two-factor challenge triggered."
  },
  {
    id: "NOTIF-005",
    title: "Salary Credit Received",
    message: "Salary of ₹45,000 credited from Tech Corp Solutions Ltd.",
    category: "Transaction",
    timestamp: "3 days ago",
    date: "2026-09-25 10:15",
    read: true,
    severity: "success",
    details: "NEFT credit ref: NEFT/TECHCORP/SEP26. Available balance updated to ₹84,250.50."
  },
  {
    id: "NOTIF-006",
    title: "Biometric Authentication",
    message: "Biometric & Face ID login enabled successfully for mobile banking.",
    category: "Security",
    timestamp: "4 days ago",
    date: "2026-09-24 16:30",
    read: true,
    severity: "info",
    details: "Configured on authorized device: Pixel 8 Pro."
  },
  {
    id: "NOTIF-007",
    title: "Credit Card Bill Reminder",
    message: "BankEase Titanium Credit Card minimum payment of ₹3,420 due on Oct 05.",
    category: "Payment",
    timestamp: "5 days ago",
    date: "2026-09-23 11:00",
    read: true,
    severity: "warning",
    details: "Total outstanding: ₹24,800. Pay before due date to avoid finance charges."
  }
];
