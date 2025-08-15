import React, { useEffect, useState } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  BookOpen,
  LayoutDashboard,
  AlertTriangle,
  FileText,
  LogOut,
  Bell,
  Search,
  ChevronDown,
  BarChart3,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const MainLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const location = useLocation();
  const { theme, toggle } = useTheme();
  const { user, logout } = useAuth();

  useEffect(() => {
    setSidebarOpen(false);
    setProfileDropdownOpen(false);
  }, [location.pathname]);

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Cargar Datos", href: "/upload", icon: FileText },
    { name: "Alertas", href: "/alerts", icon: AlertTriangle },
    { name: "Insights", href: "/insights", icon: BarChart3 },
  ];

  const baseLink =
    "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors";
  const inactive = "text-gray-600 hover:bg-gray-50 hover:text-gray-900";
  const active = "bg-blue-100 text-blue-900";

  const userUi = {
    name: user?.name ?? "Usuario",
    email: user?.email ?? "user@example.com",
    role: "Coordinadora Académica",
    avatar: "/api/placeholder/40/40",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar móvil (usado SIEMPRE) */}
      <div className={`fixed inset-0 flex z-40 ${sidebarOpen ? "" : "hidden"}`}>
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75"
          onClick={() => setSidebarOpen(false)}
        />
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-gray-900">Academic EWS</h1>
              </div>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      `${baseLink} ${isActive ? active : inactive}`
                    }
                    onClick={() => setSidebarOpen(false)}
                  >
                    {({ isActive }) => (
                      <>
                        <Icon
                          className={`mr-3 h-5 w-5 ${
                            isActive
                              ? "text-blue-500"
                              : "text-gray-400 group-hover:text-gray-500"
                          }`}
                        />
                        {item.name}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <button
              onClick={logout}
              className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      {/* Contenido principal (sin padding para sidebar de escritorio) */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <header className="sticky top-0 z-20 flex-shrink-0 h-16 bg-white border-b border-gray-200 shadow-sm flex items-center">
          <button
            type="button"
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            onClick={() => setSidebarOpen(true)} // SIEMPRE visible
            aria-label="Abrir menú"
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex-1 px-4 flex justify-between items-center">
            {/* Búsqueda */}
            <div className="flex-1 flex">
              <div className="w-full flex">
                <div className="relative w-full text-gray-400 focus-within:text-gray-600 max-w-lg">
                  <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none pl-2">
                    <Search className="h-5 w-5" />
                  </div>
                  <input
                    className="block w-full h-10 pl-8 pr-3 py-2 rounded-md border border-transparent placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-indigo-500"
                    placeholder="Buscar..."
                    type="search"
                  />
                </div>
              </div>
            </div>

            {/* Notificaciones y perfil */}
            <div className="ml-4 flex items-center space-x-4">
              <button onClick={toggle} className="px-2 py-1 text-sm border rounded">
                {theme === "dark" ? "Modo claro" : "Modo oscuro"}
              </button>

              <div className="relative">
                <button
                  className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  aria-label="Abrir notificaciones"
                >
                  <Bell className="h-6 w-6" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-medium">3</span>
                  </span>
                </button>
              </div>

              <div className="relative">
                <button
                  type="button"
                  className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={() => setProfileDropdownOpen((v) => !v)}
                  aria-haspopup="menu"
                  aria-expanded={profileDropdownOpen}
                >
                  <img className="h-8 w-8 rounded-full" src={userUi.avatar} alt="Avatar" />
                  <div className="hidden sm:block ml-3 text-left">
                    <div className="text-base font-medium text-gray-800">{userUi.name}</div>
                    <div className="text-sm font-medium text-gray-500">{userUi.role}</div>
                  </div>
                  <ChevronDown className="hidden sm:block ml-2 h-4 w-4 text-gray-400" />
                </button>

                {profileDropdownOpen && (
                  <div
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                    role="menu"
                  >
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm text-gray-900 font-medium">{userUi.name}</p>
                      <p className="text-sm text-gray-500">{userUi.email}</p>
                    </div>
                    <NavLink to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                      Mi Perfil
                    </NavLink>
                    <NavLink to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                      Configuración
                    </NavLink>
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main id="main-content" className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
