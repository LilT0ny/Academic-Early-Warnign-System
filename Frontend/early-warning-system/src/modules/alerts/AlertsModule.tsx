import React, { useMemo, useState } from "react";
import { useApp } from "../../context/AppContext";

import {
  Search,
  Filter,
  AlertCircle,
  CheckCircle2,
  Clock,
  User,
  Tag,
  Eye,
  Mail,
  Download,
  X,
} from "lucide-react";

type AlertType = "academic" | "attendance" | "behavior";
type Severity = "low" | "medium" | "high" | "critical";
type Status = "pending" | "reviewing" | "resolved";

interface AlertItem {
  id: string;
  type: AlertType;
  title: string;
  description: string;
  student: string;
  course: string;
  severity: Severity;
  status: Status;
  createdAt: string;
  updatedAt?: string;
  assignedTo?: string;
  tags?: string[];
  evidenceCount?: number;
}

const MOCK_ALERTS: AlertItem[] = [
  {
    id: "a-101",
    type: "academic",
    title: "Bajo rendimiento en evaluaciones",
    description: "Promedio < 60% en las últimas 3 evaluaciones.",
    student: "Ana García Morales",
    course: "Cálculo I",
    severity: "high",
    status: "pending",
    createdAt: "2025-08-05T10:30:00Z",
    assignedTo: "Coordinación Académica",
    tags: ["rendimiento", "tutoría"],
    evidenceCount: 3,
  },
  {
    id: "a-102",
    type: "attendance",
    title: "Faltas injustificadas",
    description: "5 ausencias en el último mes.",
    student: "Carlos Rodríguez Silva",
    course: "Administración II",
    severity: "medium",
    status: "reviewing",
    createdAt: "2025-08-06T09:10:00Z",
    assignedTo: "Bienestar",
    tags: ["asistencia"],
    evidenceCount: 1,
  },
  {
    id: "a-103",
    type: "behavior",
    title: "Cambio en comportamiento",
    description: "Baja participación y desinterés en clase.",
    student: "María José López",
    course: "Psicología Social",
    severity: "low",
    status: "pending",
    createdAt: "2025-08-07T12:00:00Z",
    tags: ["seguimiento"],
    evidenceCount: 0,
  },
  {
    id: "a-104",
    type: "academic",
    title: "Riesgo crítico de reprobación",
    description: "2 parciales reprobados.",
    student: "Juan Pablo Martínez",
    course: "Derecho Constitucional",
    severity: "critical",
    status: "pending",
    createdAt: "2025-08-07T08:45:00Z",
    assignedTo: "Docencia",
    tags: ["reprobación", "prioritario"],
    evidenceCount: 2,
  },
];

const badgeBySeverity: Record<Severity, string> = {
  low: "bg-blue-100 text-blue-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-orange-100 text-orange-800",
  critical: "bg-red-100 text-red-800",
};

const badgeByStatus: Record<Status, string> = {
  pending: "bg-gray-100 text-gray-800",
  reviewing: "bg-indigo-100 text-indigo-800",
  resolved: "bg-green-100 text-green-800",
};

const statusIcon: Record<Status, React.ElementType> = {
  pending: Clock,
  reviewing: AlertCircle,
  resolved: CheckCircle2,
};

function formatDate(s: string) {
  const d = new Date(s);
  return d.toLocaleString("es-ES", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

const AlertsModule: React.FC = () => {
  const { alertRules } = useApp();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | AlertType>("all");
  const [severityFilter, setSeverityFilter] = useState<"all" | Severity>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | Status>("all");
  const [selected, setSelected] = useState<string[]>([]);
  const [detail, setDetail] = useState<AlertItem | null>(null);

  const filtered = useMemo(() => {
    const s = search.toLowerCase();
    return MOCK_ALERTS.filter((a) => {
      const matchesSearch =
        a.title.toLowerCase().includes(s) ||
        a.description.toLowerCase().includes(s) ||
        a.student.toLowerCase().includes(s) ||
        a.course.toLowerCase().includes(s) ||
        a.tags?.some((t) => t.toLowerCase().includes(s));
      const matchesType = typeFilter === "all" || a.type === typeFilter;
      const matchesSeverity = severityFilter === "all" || a.severity === severityFilter;
      const matchesStatus = statusFilter === "all" || a.status === statusFilter;
      return matchesSearch && matchesType && matchesSeverity && matchesStatus;
    });
  }, [search, typeFilter, severityFilter, statusFilter]);

  const toggleSelect = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const toggleAll = () =>
    setSelected((prev) => (prev.length === filtered.length ? [] : filtered.map((a) => a.id)));

  const bulkResolve = () => {
    alert(`(mock) Marcando ${selected.length} alerta(s) como resueltas`);
    setSelected([]);
  };

  const exportCSV = () => {
    const lines = [
      ["id", "tipo", "titulo", "estudiante", "curso", "severidad", "estado", "creado"].join(";"),
      ...filtered.map((a) =>
        [a.id, a.type, a.title, a.student, a.course, a.severity, a.status, a.createdAt].join(";")
      ),
    ].join("\n");
    const blob = new Blob([lines], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "alertas.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Alertas</h1>
          <p className="mt-1 text-sm text-gray-500">Monitorea y gestiona las alertas del sistema</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium shadow-sm hover:bg-gray-50"
          >
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </button>
          {selected.length > 0 && (
            <button
              onClick={bulkResolve}
              className="inline-flex items-center rounded-md bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700"
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Marcar resueltas ({selected.length})
            </button>
          )}
        </div>
      </div>

{alertRules.autoEscalate && (
  <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
    Regla activa: se escalarán casos con ≥2 escalas en Alto/Crítico.
  </div>
)}
      {/* Filtros y búsqueda */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            {/* Buscador */}
            <div className="max-w-xl flex-1">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar por título, estudiante, curso o etiqueta…"
                  className="block w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 leading-5 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Selectores */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="hidden items-center gap-2 text-sm text-gray-500 md:inline-flex">
                <Filter className="h-4 w-4" /> Filtros
              </span>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as "all" | AlertType)}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="all">Tipo: Todos</option>
                <option value="academic">Académica</option>
                <option value="attendance">Asistencia</option>
                <option value="behavior">Comportamiento</option>
              </select>

              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value as "all" | Severity)}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="all">Severidad: Todas</option>
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
                <option value="critical">Crítica</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as "all" | Status)}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="all">Estado: Todos</option>
                <option value="pending">Pendiente</option>
                <option value="reviewing">En revisión</option>
                <option value="resolved">Resuelta</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    onChange={toggleAll}
                    checked={selected.length === filtered.length && filtered.length > 0}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Alerta
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Estudiante
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Severidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Creado
                </th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filtered.map((a) => {
                const Icon = statusIcon[a.status];
                return (
                  <tr key={a.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={selected.includes(a.id)}
                        onChange={() => toggleSelect(a.id)}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{a.title}</div>
                      <div className="text-sm text-gray-500">{a.course}</div>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {a.tags?.map((t) => (
                          <span key={t} className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
                            <Tag className="mr-1 h-3 w-3" />
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <User className="h-4 w-4 text-gray-400" />
                        {a.student}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeBySeverity[a.severity]}`}>
                        {a.severity === "critical" ? "Crítica" : a.severity === "high" ? "Alta" : a.severity === "medium" ? "Media" : "Baja"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeByStatus[a.status]}`}>
                        <Icon className="h-3 w-3" />
                        {a.status === "pending" ? "Pendiente" : a.status === "reviewing" ? "En revisión" : "Resuelta"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{formatDate(a.createdAt)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          className="text-blue-600 hover:text-blue-800"
                          title="Ver detalle"
                          onClick={() => setDetail(a)}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900" title="Notificar">
                          <Mail className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-sm text-gray-500">
                    No hay alertas que coincidan con los filtros.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal detalle */}
      {detail && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
          <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <h3 className="text-lg font-semibold text-gray-900">Detalle de alerta</h3>
              <button
                className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                onClick={() => setDetail(null)}
                aria-label="Cerrar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 px-5 py-5">
              <div>
                <p className="text-base font-medium text-gray-900">{detail.title}</p>
                <p className="mt-1 text-sm text-gray-600">{detail.description}</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <InfoRow label="Estudiante" value={detail.student} />
                <InfoRow label="Curso" value={detail.course} />
                <InfoRow label="Tipo" value={detail.type === "academic" ? "Académica" : detail.type === "attendance" ? "Asistencia" : "Comportamiento"} />
                <InfoRow label="Severidad" value={detail.severity} />
                <InfoRow label="Estado" value={detail.status} />
                <InfoRow label="Asignado a" value={detail.assignedTo || "—"} />
                <InfoRow label="Creado" value={formatDate(detail.createdAt)} />
                {detail.updatedAt && <InfoRow label="Actualizado" value={formatDate(detail.updatedAt)} />}
              </div>

              {detail.tags && detail.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {detail.tags.map((t) => (
                    <span key={t} className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-700">
                      <Tag className="mr-1 h-3 w-3" />
                      {t}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                  onClick={() => {
                    alert("(mock) Marcada como en revisión");
                    setDetail({ ...detail, status: "reviewing" });
                  }}
                >
                  Pasar a revisión
                </button>
                <button
                  className="rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700"
                  onClick={() => {
                    alert("(mock) Marcada como resuelta");
                    setDetail({ ...detail, status: "resolved" });
                  }}
                >
                  Resolver
                </button>
                <button
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => alert("(mock) Asignada a Bienestar")}
                >
                  Asignar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const InfoRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div>
    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
    <p className="mt-0.5 text-sm text-gray-900">{value}</p>
  </div>
);

export default AlertsModule;
