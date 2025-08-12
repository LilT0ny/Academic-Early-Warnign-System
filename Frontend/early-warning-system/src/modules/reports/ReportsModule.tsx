import React, { useMemo, useState, useRef } from "react";
import { Download, FileText, Link as LinkIcon, Plus, Trash2, Clock, CheckCircle2 } from "lucide-react";

type Format = "pdf" | "csv";
type Frequency = "once" | "weekly" | "monthly";

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  recommendedFormat: Format;
}

interface GeneratedReport {
  id: string;
  name: string;
  templateId: string;
  createdAt: string;
  format: Format;
  status: "completed" | "processing" | "failed";
  sizeKB: number;
}

interface Schedule {
  id: string;
  templateId: string;
  name: string;
  frequency: Frequency;
  day?: number;        // 1..31 (para monthly)
  weekday?: number;    // 0..6 (para weekly)
  hour: string;        // "08:00"
  format: Format;
  active: boolean;
}

const TEMPLATES: ReportTemplate[] = [
  { id: "t-1", name: "Resumen semanal", description: "Métricas generales y alertas recientes.", recommendedFormat: "pdf" },
  { id: "t-2", name: "Alumnos en alto riesgo", description: "Listado de estudiantes con riesgo alto/crítico.", recommendedFormat: "csv" },
  { id: "t-3", name: "Asistencia mensual", description: "Registro de ausentismo y puntualidad.", recommendedFormat: "pdf" },
  { id: "t-4", name: "Historial de alertas", description: "Alertas por tipo y severidad.", recommendedFormat: "csv" },
];

function nowISO() {
  return new Date().toISOString();
}

function formatDate(s: string) {
  const d = new Date(s);
  return d.toLocaleString("es-ES", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

const ReportsModule: React.FC = () => {

  // Generación on-demand
  const [templateId, setTemplateId] = useState<string>(TEMPLATES[0].id);
  const [format, setFormat] = useState<Format>(TEMPLATES[0].recommendedFormat);
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");

  // Historial / programaciones
  const [history, setHistory] = useState<GeneratedReport[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [statusMsg, setStatusMsg] = useState("");
  const mainRef = useRef<HTMLDivElement>(null);

  const selectedTemplate = useMemo(() => TEMPLATES.find((t) => t.id === templateId)!, [templateId]);

  const generateReport = () => {
    // mock: “procesa” y agrega al historial como completado
    const id = crypto.randomUUID();
    const item: GeneratedReport = {
      id,
      name: `${selectedTemplate.name} (${format.toUpperCase()})`,
      templateId,
      createdAt: nowISO(),
      format,
      status: "completed",
      sizeKB: Math.floor(Math.random() * 900 + 100),
    };
    setHistory((prev) => [item, ...prev]);
    setStatusMsg("Reporte generado correctamente.");
    setTimeout(() => setStatusMsg(""), 3000);
  };

  const download = (r: GeneratedReport) => {
    // mock: crea un archivo de texto con metadatos
    const content = `Reporte: ${r.name}\nGenerado: ${r.createdAt}\nFormato: ${r.format.toUpperCase()}\nTamaño: ~${r.sizeKB}KB\n\n(Contenido de prueba)`;
    const blob = new Blob([content], { type: r.format === "csv" ? "text/csv;charset=utf-8" : "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = r.format === "csv" ? "reporte.csv" : "reporte.txt";
    a.click();
    URL.revokeObjectURL(url);
    setStatusMsg("Descarga iniciada.");
    setTimeout(() => setStatusMsg(""), 2000);
  };

  const share = (r: GeneratedReport) => {
    navigator.clipboard?.writeText(`https://example.com/reports/${r.id}`);
    setStatusMsg("Enlace copiado al portapapeles.");
    setTimeout(() => setStatusMsg(""), 2000);
  };

  const addSchedule = () => {
    const t = selectedTemplate;
    const sc: Schedule = {
      id: crypto.randomUUID(),
      templateId: t.id,
      name: `${t.name} programado`,
      frequency: "weekly",
      weekday: 1,
      hour: "08:00",
      format,
      active: true,
    };
    setSchedules((prev) => [sc, ...prev]);
    setStatusMsg("Programación agregada.");
    setTimeout(() => setStatusMsg(""), 2000);
  };

  const removeSchedule = (id: string) => {
    setSchedules((prev) => prev.filter((s) => s.id !== id));
    setStatusMsg("Programación eliminada.");
    setTimeout(() => setStatusMsg(""), 2000);
  };

  // Keyboard skip to main content
  const handleSkipToContent = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (mainRef.current) {
      mainRef.current.focus();
    }
  };

  return (
    <div className="space-y-6">
      {/* Skip link for accessibility */}
      <a
        href="#reports-main-content"
        onClick={handleSkipToContent}
        className="sr-only focus:not-sr-only absolute left-2 top-2 z-50 rounded bg-blue-700 px-3 py-2 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        Saltar al contenido principal
      </a>
      <div
        id="reports-main-content"
        ref={mainRef}
        tabIndex={-1}
        className="space-y-6 outline-none"
        role="main"
        aria-label="Módulo de reportes"
      >
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900" tabIndex={-1} aria-label="Reportes">Reportes</h1>
          <p className="mt-1 text-sm text-gray-500">Genera informes, programa envíos automáticos y consulta el historial.</p>
        </div>
        {/* ARIA live region for status messages */}
        <div aria-live="polite" role="status" className="min-h-[1.5em] text-green-700 text-sm">{statusMsg}</div>

        {/* Generación on-demand */}
        <section className="rounded-xl border border-gray-200 bg-white shadow-sm" aria-labelledby="nuevo-reporte-heading">
          <div className="border-b border-gray-200 px-4 py-4 sm:px-6">
            <h2 id="nuevo-reporte-heading" className="text-base font-semibold text-gray-900">Nuevo reporte</h2>
          </div>
        <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-6 lg:grid-cols-4">
          <div>
            <label htmlFor="template-select" className="mb-1 block text-sm font-medium text-gray-700">Plantilla</label>
            <select
              id="template-select"
              value={templateId}
              onChange={(e) => {
                const val = e.target.value;
                setTemplateId(val);
                const rec = TEMPLATES.find((t) => t.id === val)?.recommendedFormat || "pdf";
                setFormat(rec);
              }}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-label="Seleccionar plantilla de reporte"
            >
              {TEMPLATES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-500">{selectedTemplate.description}</p>
          </div>

          <div>
            <label htmlFor="format-select" className="mb-1 block text-sm font-medium text-gray-700">Formato</label>
            <select
              id="format-select"
              value={format}
              onChange={(e) => setFormat(e.target.value as Format)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-label="Seleccionar formato de reporte"
            >
              <option value="pdf">PDF</option>
              <option value="csv">CSV</option>
            </select>
          </div>

          <div>
            <label htmlFor="date-from" className="mb-1 block text-sm font-medium text-gray-700">Desde</label>
            <input
              id="date-from"
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-label="Fecha desde"
            />
          </div>

          <div>
            <label htmlFor="date-to" className="mb-1 block text-sm font-medium text-gray-700">Hasta</label>
            <input
              id="date-to"
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-label="Fecha hasta"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t px-4 py-3 sm:px-6">
          <button
            onClick={addSchedule}
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium shadow-sm hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label="Programar reporte"
          >
            <Clock className="mr-2 h-4 w-4" />
            Programar (mock)
          </button>
          <button
            onClick={generateReport}
            className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label="Generar reporte"
          >
            <FileText className="mr-2 h-4 w-4" />
            Generar
          </button>
        </div>
      </section>

  {/* Historial */}
  <section className="rounded-xl border border-gray-200 bg-white shadow-sm" aria-labelledby="historial-heading">
          <div className="flex items-center justify-between border-b px-4 py-4 sm:px-6">
            <h2 id="historial-heading" className="text-base font-semibold text-gray-900">Historial de reportes</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200" role="table" aria-label="Historial de reportes">
            <thead className="bg-gray-50" role="rowgroup">
              <tr role="row">
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Reporte</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Fecha</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Formato</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Estado</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white" role="rowgroup">
              {history.length === 0 && (
                <tr role="row">
                  <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-500">
                    Aún no has generado reportes.
                  </td>
                </tr>
              )}
              {history.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50" role="row">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{r.name}</div>
                    <div className="text-xs text-gray-500">Plantilla: {TEMPLATES.find((t) => t.id === r.templateId)?.name}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{formatDate(r.createdAt)}</td>
                  <td className="px-6 py-4 text-sm uppercase text-gray-700">{r.format}</td>
                  <td className="px-6 py-4">
                    {r.status === "completed" ? (
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        Completado
                      </span>
                    ) : r.status === "processing" ? (
                      <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                        Procesando…
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                        Error
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="inline-flex items-center rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                        onClick={() => download(r)}
                        aria-label={`Descargar reporte ${r.name}`}
                      >
                        <Download className="mr-1 h-3.5 w-3.5" />
                        Descargar
                      </button>
                      <button
                        className="inline-flex items-center rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                        onClick={() => share(r)}
                        aria-label={`Compartir reporte ${r.name}`}
                      >
                        <LinkIcon className="mr-1 h-3.5 w-3.5" />
                        Compartir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

  {/* Programaciones */}
  <section className="rounded-xl border border-gray-200 bg-white shadow-sm" aria-labelledby="programaciones-heading">
          <div className="flex items-center justify-between border-b px-4 py-4 sm:px-6">
            <h2 id="programaciones-heading" className="text-base font-semibold text-gray-900">Programaciones automáticas</h2>
            <button
              onClick={addSchedule}
              className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-label="Nueva programación"
            >
              <Plus className="mr-2 h-4 w-4" />
              Nueva programación
            </button>
          </div>

        <ul className="divide-y divide-gray-200">
          {schedules.length === 0 && (
            <li className="px-6 py-8 text-center text-sm text-gray-500">Aún no hay programaciones.</li>
          )}
          {schedules.map((s) => (
            <li key={s.id} className="flex items-center justify-between px-6 py-4">
              <div>
                <p className="font-medium text-gray-900">{s.name}</p>
                <p className="text-sm text-gray-600">
                  {s.frequency === "weekly"
                    ? `Semanal (día ${s.weekday})`
                    : s.frequency === "monthly"
                    ? `Mensual (día ${s.day})`
                    : "Una sola vez"}{" "}
                  · {s.hour} · {s.format.toUpperCase()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    s.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {s.active ? "Activo" : "Inactivo"}
                </span>
                <button
                  className="rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  onClick={() => setSchedules((prev) => prev.map((x) => (x.id === s.id ? { ...x, active: !x.active } : x)))}
                  aria-label={s.active ? `Pausar programación ${s.name}` : `Activar programación ${s.name}`}
                >
                  {s.active ? "Pausar" : "Activar"}
                </button>
                <button
                  className="rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  onClick={() => removeSchedule(s.id)}
                  aria-label={`Eliminar programación ${s.name}`}
                >
                  <Trash2 className="mr-1 inline-block h-3.5 w-3.5" />
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
      </div>
    </div>
  );
};

export default ReportsModule;
