import React, { useState, useRef } from "react";
import MainLayout from "../layouts/MainLayout";
import { useApp } from "../context/AppContext";
import { Save } from "lucide-react";

const Field: React.FC<{
  label: string;
  value: number;
  onChange: (n: number) => void;
  id: string;
}> = ({ label, value, onChange, id }) => (
  <div>
    <label htmlFor={id} className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
    <input
      id={id}
      type="number"
      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      aria-label={label}
    />
  </div>
);

const AlertSettingsPage: React.FC = () => {
  const { alertRules, setAlertRules } = useApp();
  const [draft, setDraft] = useState(alertRules);
  const [saveMsg, setSaveMsg] = useState("");
  const mainRef = useRef<HTMLDivElement>(null);

  const save = () => {
    setAlertRules(draft);
    setSaveMsg("Configuración de alertas guardada.");
    setTimeout(() => setSaveMsg(""), 3000);
    // Focus the main heading for context
    if (mainRef.current) {
      const h1 = mainRef.current.querySelector("h1");
      if (h1) (h1 as HTMLElement).focus();
    }
  };

  const TH = draft.thresholds;

  return (
    <MainLayout currentPage="settings">
      {/* Skip link for accessibility */}
      <a href="#alert-settings-main" className="sr-only focus:not-sr-only absolute left-2 top-2 z-50 rounded bg-blue-700 px-3 py-2 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
        Saltar al contenido principal
      </a>
      <div ref={mainRef} id="alert-settings-main" tabIndex={-1} className="space-y-6 outline-none">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" tabIndex={-1} aria-label="Configuración de Alertas">
            Configuración de Alertas
          </h1>
          <p className="text-sm text-gray-500">Define umbrales, notificaciones y reglas de escalamiento.</p>
        </div>

        {/* Umbrales */}
        <section className="rounded-xl border bg-white p-4 shadow-sm sm:p-6" aria-labelledby="thresholds-heading">
          <h2 id="thresholds-heading" className="mb-4 text-base font-semibold text-gray-900">Umbrales por escala</h2>
          <div className="grid gap-6 lg:grid-cols-2">
            {[
              ["PHQ-9 (depresión)", "PHQ9"] as const,
              ["GAD-7 (ansiedad)", "GAD7"] as const,
              ["PSS-14 (estrés)", "PSS14"] as const,
              ["RSES (autoestima, menor es peor)*", "RSES"] as const,
            ].map(([label, key]) => (
              <div key={key} className="rounded-lg border p-4" aria-labelledby={`label-${key}`}>
                <p id={`label-${key}`} className="mb-3 text-sm font-medium text-gray-900">{label}</p>
                <div className="grid grid-cols-2 gap-3">
                  <Field
                    label="Bajo (>=)"
                    id={`low-${key}`}
                    value={TH[key].low}
                    onChange={(n) =>
                      setDraft((d) => ({ ...d, thresholds: { ...d.thresholds, [key]: { ...d.thresholds[key], low: n } } }))
                    }
                  />
                  <Field
                    label="Medio (>=)"
                    id={`medium-${key}`}
                    value={TH[key].medium}
                    onChange={(n) =>
                      setDraft((d) => ({ ...d, thresholds: { ...d.thresholds, [key]: { ...d.thresholds[key], medium: n } } }))
                    }
                  />
                  <Field
                    label="Alto (>=)"
                    id={`high-${key}`}
                    value={TH[key].high}
                    onChange={(n) =>
                      setDraft((d) => ({ ...d, thresholds: { ...d.thresholds, [key]: { ...d.thresholds[key], high: n } } }))
                    }
                  />
                  <Field
                    label="Crítico (>=)"
                    id={`critical-${key}`}
                    value={TH[key].critical}
                    onChange={(n) =>
                      setDraft((d) => ({ ...d, thresholds: { ...d.thresholds, [key]: { ...d.thresholds[key], critical: n } } }))
                    }
                  />
                </div>
                {key === "RSES" && (
                  <p className="mt-2 text-xs text-gray-500">
                    * En RSES los puntajes más bajos indican mayor riesgo; usa estos cortes como “≤” en tu lógica de evaluación.
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Reglas y notificaciones */}
        <section className="rounded-xl border bg-white p-4 shadow-sm sm:p-6" aria-labelledby="rules-heading">
          <h2 id="rules-heading" className="mb-4 text-base font-semibold text-gray-900">Reglas</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <span className="text-sm" id="auto-escalate-label">Escalar si ≥2 escalas en Alto/Crítico</span>
              <input
                type="checkbox"
                aria-labelledby="auto-escalate-label"
                checked={draft.autoEscalate}
                onChange={(e) => setDraft((d) => ({ ...d, autoEscalate: e.target.checked }))}
                className="focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              />
            </div>

            <div className="rounded-lg border p-4">
              <label htmlFor="follow-up-days" className="mb-1 block text-sm font-medium">Días para seguimiento</label>
              <input
                id="follow-up-days"
                type="number"
                className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                value={draft.followUpDays}
                onChange={(e) => setDraft((d) => ({ ...d, followUpDays: Number(e.target.value) }))}
                aria-label="Días para seguimiento"
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <span className="text-sm" id="notify-email-label">Notificar por Email</span>
              <input
                type="checkbox"
                aria-labelledby="notify-email-label"
                checked={draft.notifyEmail}
                onChange={(e) => setDraft((d) => ({ ...d, notifyEmail: e.target.checked }))}
                className="focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <span className="text-sm" id="notify-inapp-label">Notificación In-App</span>
              <input
                type="checkbox"
                aria-labelledby="notify-inapp-label"
                checked={draft.notifyInApp}
                onChange={(e) => setDraft((d) => ({ ...d, notifyInApp: e.target.checked }))}
                className="focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              />
            </div>

            <div className="rounded-lg border p-4 md:col-span-2">
              <label htmlFor="default-assignee" className="mb-1 block text-sm font-medium">Asignación por defecto</label>
              <select
                id="default-assignee"
                className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                value={draft.defaultAssignee}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, defaultAssignee: e.target.value as typeof draft.defaultAssignee }))
                }
                aria-label="Asignación por defecto"
              >
                <option>Docencia</option>
                <option>Bienestar</option>
                <option>Coordinación Académica</option>
              </select>
            </div>
          </div>
        </section>

        <div>
          <button
            onClick={save}
            className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label="Guardar configuración de alertas"
          >
            <Save className="mr-2 h-4 w-4" aria-hidden="true" />
            Guardar configuración
          </button>
          <span
            role="status"
            aria-live="polite"
            className="ml-4 text-green-700 text-sm min-h-[1.5em]"
          >
            {saveMsg}
          </span>
        </div>
      </div>
    </MainLayout>
  );
};

export default AlertSettingsPage;
