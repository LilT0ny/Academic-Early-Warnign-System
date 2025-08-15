import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./components/common/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";

// Páginas
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import UploadPage from "./pages/UploadPage";
import AlertsPage from "./pages/AlertsPage"; 
import InsightsPage from "./pages/InsightsPage";

export default function App() {
  return (
    <Routes>
      {/* Ruta pública de login */}
      <Route path="/login" element={<LoginPage />} />
      {/* Rutas protegidas: requieren autenticación */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        {/* Dashboard principal */}
        <Route path="/dashboard" element={<DashboardPage />} />
        {/* Página de Alertas */}
        <Route path="/alerts" element={<AlertsPage />} />
        {/* Subida de datos */}
        <Route path="/upload" element={<UploadPage />} />
        {/* Página de Insights */}
        <Route path="/insights" element={<InsightsPage />} />
      </Route>
      {/* Redirecciones */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
