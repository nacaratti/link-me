import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import PublicProfile from './components/PublicProfile';
import Dashboard from './components/Dashboard';
import AuthPage from './components/AuthPage';
import AdminPanel from './components/AdminPanel';
import UsernameSetup from './components/UsernameSetup';
import AuthCallback from './components/AuthCallback';
import TermsOfService from './components/TermsOfService';
import PrivacyPolicy from './components/PrivacyPolicy';
import { Loader2 } from 'lucide-react';

function Spinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, hasUsername } = useAuth();
  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/entrar" replace />;
  if (!hasUsername) return <Navigate to="/setup" replace />;
  return <>{children}</>;
}

function GuestRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, hasUsername } = useAuth();
  if (loading) return <Spinner />;
  if (user && hasUsername) return <Navigate to="/dashboard" replace />;
  if (user && !hasUsername) return <Navigate to="/setup" replace />;
  return <>{children}</>;
}

function SetupRoute() {
  const { user, loading, hasUsername } = useAuth();
  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/entrar" replace />;
  if (hasUsername) return <Navigate to="/dashboard" replace />;
  return <UsernameSetup />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
      <Route path="/entrar" element={<GuestRoute><AuthPage /></GuestRoute>} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/setup" element={<SetupRoute />} />
      <Route path="/termos" element={<TermsOfService />} />
      <Route path="/privacidade" element={<PrivacyPolicy />} />
      <Route path="/:username" element={<PublicProfile />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}
