import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  X,
  BookOpen,
  LayoutDashboard,
  Users,
  AlertTriangle,
  FileText,
  FileSpreadsheet,
  Settings,
  LogOut,
  Bell,
  Search,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";



interface MainLayoutProps {
  children: React.ReactNode;
  currentPage: "dashboard" | "students" | "alerts" | "reports" | "settings" | "appointments" | "upload";
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, currentPage }) => {
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);
  const { user, logout, isRole, hasPermission } = useAuth();

  // Datos de usuario simulados si no hay datos reales
  const displayName = user?.name || user?.email || "Usuario";
  const displayEmail = user?.email || "user@universidad.edu";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const displayRole = (user as any)?.role || "Coordinación Académica";
  // Get initials from displayName
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase();
  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, key: "dashboard" },
    // NUEVO: Procesar Encuesta (Excel)
    { name: "Procesar Encuesta", href: "/upload", icon: FileSpreadsheet, key: "upload",
      show: isRole("teacher","specialist","admin") },
    { name: "Estudiantes", href: "/students", icon: Users, key: "students", show: hasPermission("students.read") },
    { name: "Alertas", href: "/alerts", icon: AlertTriangle, key: "alerts", show: hasPermission("alerts.read") },
    { name: "Reportes", href: "/reports", icon: FileText, key: "reports", show: hasPermission("reports.read") },
    { name: "Configuración", href: "/settings", icon: Settings, key: "settings", show: hasPermission("settings.read") },
  ].filter(i => i.show !== false);

  // Notificaciones simuladas
  const notifications = [
    { id: 1, message: "3 estudiantes con riesgo alto de deserción", type: "warning", time: "5 min" },
    { id: 2, message: "Reporte mensual generado exitosamente", type: "success", time: "1 hora" },
    { id: 3, message: "Nueva alerta académica pendiente", type: "danger", time: "2 horas" },
  ];

  const handleLogout = async () => {
    await logout();
  };

  

  // Keyboard skip to main content
  const handleSkipToContent = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (mainRef.current) {
      mainRef.current.focus();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Skip link for accessibility */}
      <a
        href="#main-content"
        onClick={handleSkipToContent}
        className="sr-only focus:not-sr-only absolute left-2 top-2 z-50 rounded bg-blue-700 px-3 py-2 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        Saltar al contenido principal
      </a>
      {/* Sidebar desplegable (móvil y escritorio) */}
      <div className={`fixed inset-0 z-40 flex ${sidebarOpen ? "" : "hidden"}`}>
        {/* Fondo oscuro */}
        <div
          className="fixed inset-0 bg-gray-600/75"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
        {/* Contenedor sidebar */}
        <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white">
          {/* Botón cerrar */}
          <div className="absolute right-0 top-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
              onClick={() => setSidebarOpen(false)}
              aria-label="Cerrar menú"
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>

          {/* Logo */}
          <div className="h-16 flex items-center gap-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600">
            <BookOpen className="h-8 w-8 text-white" />
            <h1 className="text-xl font-bold text-white">Academic EWS</h1>
          </div>

          {/* Navegación */}
          <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1" aria-label="Navegación principal" role="navigation">
            {navigation.map((item) => {
              const active = currentPage === item.key;
              const Icon = item.icon;
              return (
                <Link
                  key={item.key}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center rounded-md px-2 py-2 text-base font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                    active
                      ? "bg-blue-100 text-blue-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon
                    className={`mr-4 h-6 w-6 ${
                      active ? "text-blue-500" : "text-gray-400 group-hover:text-gray-500"
                    }`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Botón cerrar sesión */}
          <div className="border-t p-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center text-gray-600 hover:text-red-600 transition-colors"
            >
              <LogOut className="mr-2 h-5 w-5" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
  <div className="flex flex-1 flex-col">
        {/* Header */}
  <div className="relative z-10 flex h-16 flex-shrink-0 items-center justify-between border-b bg-white px-4 shadow-sm" role="banner">
          {/* Botón abrir sidebar */}
          <button
            type="button"
            className="mr-2 rounded-md p-2 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onClick={() => setSidebarOpen(true)}
            aria-label="Abrir menú"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Búsqueda */}
          <div className="flex flex-1 items-center">
            <div className="relative mx-auto w-full max-w-lg text-gray-400 focus-within:text-gray-600">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
                <Search className="h-5 w-5" />
              </div>
              <input
                type="search"
                placeholder="Buscar estudiantes, alertas…"
                className="block w-full rounded-md border border-transparent py-2 pl-8 pr-3 text-gray-900 placeholder-gray-500 focus:border-transparent focus:outline-none focus:ring-0"
              />
            </div>
          </div>

          {/* Notificaciones y perfil */}
          <div className="ml-4 flex items-center gap-4">
            {/* Bell */}
            <button
              className="relative rounded-full p-1 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Ver notificaciones"
              title="Notificaciones"
              aria-haspopup="true"
              aria-expanded={notifications.length ? "true" : "false"}
            >
              <Bell className="h-6 w-6" aria-hidden="true" />
              {!!notifications.length && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white" aria-label={`${notifications.length} notificaciones nuevas`}>
                  {notifications.length}
                </span>
              )}
            </button>

            {/* Perfil */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileDropdownOpen((v) => !v)}
                className="flex items-center rounded-full bg-white text-left focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                aria-haspopup="menu"
                aria-expanded={profileDropdownOpen ? "true" : "false"}
                aria-label="Abrir menú de perfil"
              >
                <div className="grid h-8 w-8 place-items-center rounded-full bg-indigo-600 text-xs font-semibold text-white">
                  {initials}
                </div>
                <div className="ml-3 hidden md:block">
                  <div className="text-sm font-medium text-gray-800">{displayName}</div>
                  <div className="text-xs font-medium text-gray-500">{displayRole}</div>
                </div>
                <ChevronDown className="ml-2 hidden h-4 w-4 text-gray-400 md:block" aria-hidden="true" />
              </button>

              {profileDropdownOpen && (
                <div
                  role="menu"
                  aria-label="Menú de perfil"
                  className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none"
                >
                  <div className="border-b px-4 py-2">
                    <p className="text-sm font-medium text-gray-900">{displayName}</p>
                    <p className="text-xs text-gray-500">{displayEmail}</p>
                  </div>
                  <Link to="/profile" role="menuitem" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Perfil
                  </Link>
                  <Link to="/settings" role="menuitem" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Configuración
                  </Link>
                  <button
                    role="menuitem"
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Contenido dinámico */}
        <main
          id="main-content"
          ref={mainRef}
          className="flex-1 overflow-y-auto outline-none"
          tabIndex={-1}
          role="main"
        >
          <div className="p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
