// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/common/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import StudentsPage from "./pages/StudentsPage";
import AlertsPage from "./pages/AlertsPage";
import ReportsPage from "./pages/ReportsPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import AlertSettingsPage from "./pages/AlertSettingsPage";
import UploadPage from "./pages/UploadPage";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/students" element={<ProtectedRoute><StudentsPage /></ProtectedRoute>} />
        <Route path="/alerts" element={<ProtectedRoute><AlertsPage /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
        <Route path="/appointments" element={<ProtectedRoute roles={["teacher","specialist","admin"]}><AppointmentsPage /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute roles={["admin"]}><AdminUsersPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        <Route path="/settings/alerts" element={<ProtectedRoute><AlertSettingsPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/upload" element={ <ProtectedRoute> <UploadPage /></ProtectedRoute> } />
      </Routes>
    </AuthProvider>
  );
}
