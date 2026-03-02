import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PublicProfile from './components/PublicProfile';
import Dashboard from './components/Dashboard';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* System Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<div className="min-h-screen flex items-center justify-center bg-slate-50">Login Page Placeholder</div>} />
        
        {/* Dynamic User Profile Route */}
        <Route path="/:username" element={<PublicProfile />} />
        
        {/* Default Redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}
