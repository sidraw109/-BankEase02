import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BankingProvider } from './context/BankingContext';
import ProtectedRoute from './components/ProtectedRoute';

// Layout & Reusable Components
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import MobileNavbar from './components/MobileNavbar';
import Toast from './components/Toast';

// Pages
import Login from './pages/Login';
import Account from './pages/Account';
import Transactions from './pages/Transactions';
import Payments from './pages/Payments';
import Notifications from './pages/Notifications';
import FraudHelp from './pages/FraudHelp';
import Profile from './pages/Profile';

// Authenticated Layout Wrapper
const DashboardLayout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* Toast notifications container */}
      <Toast />

      {/* Desktop & Tablet Sidebar */}
      <Sidebar
        isMobileOpen={isMobileMenuOpen}
        setIsMobileOpen={setIsMobileMenuOpen}
      />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col flex-1 min-w-0 transition-all">
        {/* Top Navbar */}
        <Navbar onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 lg:pb-12">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNavbar />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <BankingProvider>
        <Router>
          <Routes>
            {/* Public Login Route */}
            <Route path="/login" element={<Login />} />

            {/* Default Route redirect */}
            <Route path="/" element={<Navigate to="/account" replace />} />

            {/* Protected Banking Routes */}
            <Route
              path="/account"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Account />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/transactions"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Transactions />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/payments"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Payments />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Notifications />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/fraud-help"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <FraudHelp />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Profile />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/account" replace />} />
          </Routes>
        </Router>
      </BankingProvider>
    </AuthProvider>
  );
}

export default App;
