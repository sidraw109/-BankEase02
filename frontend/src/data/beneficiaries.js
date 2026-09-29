// Demo beneficiaries. The first two point at real, ACTIVE BankEase accounts that
// are seeded in the backend database, so intra-bank transfers succeed end-to-end.
// The last two are external banks and exercise the inter-bank (NEFT/RTGS/IMPS) path.
export const initialBeneficiaries = [
  {
    id: "BEN-101",
    name: "Bob Sharma",
    accountNumber: "BKE202609294846247417",
    maskedAccount: "XXXX XXXX 7417",
    ifsc: "BKES0001024",
    bankName: "BankEase Main",
    phone: "+91 98100 00002",
    email: "bob@bankease.test",
    nickname: "Bob (BankEase)",
    type: "Savings Account"
  },
  {
    id: "BEN-102",
    name: "John Doe",
    accountNumber: "BKE202609298176291673",
    maskedAccount: "XXXX XXXX 1673",
    ifsc: "BKES0001024",
    bankName: "BankEase Main",
    phone: "+91 98100 00004",
    email: "johndoe@example.com",
    nickname: "John (BankEase)",
    type: "Savings Account"
  },
  {
    id: "BEN-103",
    name: "Amit Patel",
    accountNumber: "543210983390",
    maskedAccount: "XXXX XXXX 3390",
    ifsc: "SBIN0004512",
    bankName: "State Bank of India",
    phone: "+91 97234 56789",
    email: "amit.patel@example.com",
    nickname: "Landlord",
    type: "Current Account"
  },
  {
    id: "BEN-104",
    name: "Sneha Verma",
    accountNumber: "432109876104",
    maskedAccount: "XXXX XXXX 6104",
    ifsc: "ICIC0001234",
    bankName: "ICICI Bank",
    phone: "+91 99345 67890",
    email: "sneha.v@example.com",
    nickname: "Sneha Work",
    type: "Savings Account"
  }
];
