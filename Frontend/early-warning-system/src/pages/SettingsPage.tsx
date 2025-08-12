import React, { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { useAuth } from "../context/AuthContext";
import { ToggleLeft, ToggleRight, Save } from "lucide-react";

const SettingsPage: React.FC = () => {
  const { hasPermission } = useAuth();
  const [dark, setDark] = useState(false);
  const [emailReports, setEmailReports] = useState(true);
  const [language, setLanguage] = useState("es");

  const save = () => {
    if (!hasPermission("settings.update")) { alert("No tienes permisos"); return; }
    alert("(mock) Configuraciones guardadas");
  };

  return (
    <MainLayout currentPage="settings">
      {/* Skip link for accessibility */}
      <a href="#settings-main-content" className="sr-only focus:not-sr-only absolute top-2 left-2 bg-white text-blue-700 px-3 py-2 rounded shadow z-50">
        Saltar al contenido principal
      </a>
      <main id="settings-main-content" tabIndex={-1} className="space-y-6 outline-none" aria-label="Configuraciones">
        <h1 className="text-2xl font-bold text-gray-900">Configuraciones</h1>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Preferencias */}
          <section className="rounded-xl border bg-white p-4 shadow-sm sm:p-6" aria-labelledby="settings-preferences-heading">
            <h2 id="settings-preferences-heading" className="mb-4 text-base font-semibold text-gray-900">Preferencias</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span id="theme-label">Tema oscuro</span>
                <button
                  onClick={() => setDark(v => !v)}
                  className="rounded-md border px-2.5 py-1.5 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"
                  aria-pressed={dark}
                  aria-labelledby="theme-label"
                >
                  {dark ? <ToggleRight className="inline h-5 w-5 text-indigo-600"/> : <ToggleLeft className="inline h-5 w-5 text-gray-400"/>}
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span id="email-reports-label">Enviar reportes por email</span>
                <button
                  onClick={() => setEmailReports(v => !v)}
                  className="rounded-md border px-2.5 py-1.5 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"
                  aria-pressed={emailReports}
                  aria-labelledby="email-reports-label"
                >
                  {emailReports ? <ToggleRight className="inline h-5 w-5 text-indigo-600"/> : <ToggleLeft className="inline h-5 w-5 text-gray-400"/>}
                </button>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium" htmlFor="settings-language">Idioma</label>
                <select
                  id="settings-language"
                  value={language}
                  onChange={e => setLanguage(e.target.value)}
                  className="w-full rounded-md border px-3 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"
                  aria-label="Seleccionar idioma"
                >
                  <option value="es">Español</option>
                  <option value="en">English</option>
                </select>
              </div>
              <button
                onClick={save}
                className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"
              >
                <Save className="mr-2 h-4 w-4" /> Guardar
              </button>
            </div>
          </section>

          {/* Seguridad */}
          <section className="rounded-xl border bg-white p-4 shadow-sm sm:p-6" aria-labelledby="settings-security-heading">
            <h2 id="settings-security-heading" className="mb-4 text-base font-semibold text-gray-900">Seguridad</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium" htmlFor="settings-password">Contraseña (mock)</label>
                <input
                  id="settings-password"
                  type="password"
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  placeholder="••••••••"
                  aria-label="Contraseña"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Autenticación 2FA (mock)</label>
                <p className="text-sm text-gray-500">Próximamente con Supabase Auth.</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </MainLayout>
  );
};

export default SettingsPage;
