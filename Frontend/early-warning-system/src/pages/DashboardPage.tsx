import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import {
  Users,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Clock,
  ChevronRight,
  FileText,
  UserCheck,
  AlertCircle,
  CheckCircle2,
  Target,
} from "lucide-react";

// —— Tipos auxiliares ——
type ColorKey = "blue" | "green" | "purple" | "yellow";
type Severity = "low" | "medium" | "high";
type AlertStatus = "pending" | "reviewing" | "resolved";

interface Stat {
  title: string;
  value: string | number;
  change: number; // en %
  changeType: "increase" | "decrease";
  color: ColorKey;
  icon: React.ElementType;
}

interface RecentAlert {
  id: string;
  title: string;
  description: string;
  student: string;
  severity: Severity;
  status: AlertStatus;
  createdAt: string; // ISO
}

interface StudentRisk {
  id: string;
  name: string;
  course: string;
  grade: number;
  status: "critical" | "warning" | "normal";
}

// —— Utilidades de estilo ——
const getColorClass = (color: ColorKey, mode: "bg" | "text" = "bg") => {
  const map: Record<ColorKey, { bg: string; text: string }> = {
    blue: { bg: "bg-blue-600", text: "text-blue-600" },
    green: { bg: "bg-green-600", text: "text-green-600" },
    purple: { bg: "bg-purple-600", text: "text-purple-600" },
    yellow: { bg: "bg-yellow-500", text: "text-yellow-600" },
  };
  return map[color][mode];
};

const getStatusColor = (status: "normal" | "warning" | "critical" | AlertStatus) => {
  const colors: Record<string, string> = {
    normal: "border-green-200 text-green-700 bg-green-50",
    warning: "border-yellow-200 text-yellow-700 bg-yellow-50",
    critical: "border-red-200 text-red-700 bg-red-50",
    pending: "border-yellow-200 text-yellow-700 bg-yellow-50",
    reviewing: "border-blue-200 text-blue-700 bg-blue-50",
    resolved: "border-emerald-200 text-emerald-700 bg-emerald-50",
  };
  return colors[status];
};

const getSeverityColor = (severity: Severity) => {
  const colors: Record<Severity, string> = {
    low: "bg-blue-100 text-blue-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800",
  };
  return colors[severity];
};

const getStatusIcon = (status: AlertStatus) => {
  const icons: Record<AlertStatus, React.ElementType> = {
    pending: AlertCircle,
    reviewing: Clock,
    resolved: CheckCircle2,
  };
  return icons[status];
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// —— Mock de datos (reemplaza por tus fetch/queries) ——
const useMockData = () => {
  const stats: Stat[] = [
    { title: "Alertas Activas", value: 32, change: 12, changeType: "increase", color: "blue", icon: AlertTriangle },
    { title: "Estudiantes en Riesgo", value: 14, change: 5, changeType: "decrease", color: "purple", icon: Users },
    { title: "Citas Programadas", value: 21, change: 8, changeType: "increase", color: "green", icon: Clock },
    { title: "Intervenciones", value: 9, change: 3, changeType: "increase", color: "yellow", icon: Target },
  ];

  const recentAlerts: RecentAlert[] = [
    {
      id: "a1",
      title: "Ausencias repetidas",
      description: "3 inasistencias en la última semana",
      student: "María Gómez",
      severity: "high",
      status: "pending",
      createdAt: new Date().toISOString(),
    },
    {
      id: "a2",
      title: "Bajo rendimiento",
      description: "Promedio < 7.0 en Matemática",
      student: "Luis Pineda",
      severity: "medium",
      status: "reviewing",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    },
    {
      id: "a3",
      title: "Riesgo socioemocional",
      description: "Reporte del tutor",
      student: "Ana Ruiz",
      severity: "low",
      status: "resolved",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
  ];

  const studentsAtRisk: StudentRisk[] = [
    { id: "s1", name: "Carlos Pérez", course: "8°A", grade: 6.5, status: "critical" },
    { id: "s2", name: "Daniela López", course: "9°B", grade: 7.1, status: "warning" },
    { id: "s3", name: "Juan Torres", course: "10°A", grade: 8.2, status: "normal" },
  ];

  return { stats, recentAlerts, studentsAtRisk };
};

// —— Componente principal ——
const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { stats, recentAlerts, studentsAtRisk } = useMockData();
  const [selectedTimeRange, setSelectedTimeRange] = useState<"7d" | "30d" | "3m" | "1y">("7d");

  // (Opcional) recalcular métricas por rango de tiempo
  const timeRangeLabel = useMemo(() => {
    return (
      {
        "7d": "Últimos 7 días",
        "30d": "Últimos 30 días",
        "3m": "Últimos 3 meses",
        "1y": "Último año",
      } as const
    )[selectedTimeRange];
  }, [selectedTimeRange]);

  return (
    <MainLayout currentPage="dashboard">
      <main className="space-y-8" aria-label="Panel principal">
        {/* Link de salto de accesibilidad */}
        <a
          href="#dashboard-content"
          className="sr-only focus:not-sr-only absolute top-2 left-2 bg-white text-blue-700 px-3 py-2 rounded shadow z-50"
        >
          Saltar al contenido principal
        </a>

        {/* Encabezado */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500">
              Resumen general del sistema de alerta temprana académica — {timeRangeLabel}
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <label htmlFor="dashboard-time-range" className="sr-only">
              Seleccionar rango de tiempo
            </label>
            <select
              id="dashboard-time-range"
              aria-label="Seleccionar rango de tiempo"
              value={selectedTimeRange}
              onChange={(e) =>
                setSelectedTimeRange(e.target.value as typeof selectedTimeRange)
              }
              className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="7d">Últimos 7 días</option>
              <option value="30d">Últimos 30 días</option>
              <option value="3m">Últimos 3 meses</option>
              <option value="1y">Último año</option>
            </select>
          </div>
        </header>

        {/* ===== Contenido principal ===== */}
        <section id="dashboard-content" className="space-y-8">
          {/* Tarjetas de estadísticas */}
          <section aria-label="Estadísticas" className="mb-2">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.title}
                    className="rounded-lg border bg-white p-6 shadow-sm flex items-center gap-4"
                    aria-label={stat.title}
                  >
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-full ${getColorClass(
                        stat.color,
                        "bg"
                      )}`}
                    >
                      <Icon className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-500">{stat.title}</div>
                      <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                      <div className="flex items-center gap-1 mt-1">
                        {stat.changeType === "increase" ? (
                          <TrendingUp className="h-4 w-4 text-green-500" aria-hidden="true" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-500" aria-hidden="true" />
                        )}
                        <span
                          className={`text-xs font-medium ${
                            stat.changeType === "increase"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {stat.change > 0 ? "+" : ""}
                          {stat.change}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Grid principal: Alertas y Estudiantes */}
          <section
            className="grid grid-cols-1 gap-6 lg:grid-cols-2"
            aria-label="Alertas y estudiantes en riesgo"
          >
            {/* Alertas recientes */}
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-200 px-4 py-5 sm:px-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium leading-6 text-gray-900">
                    Alertas recientes
                  </h2>
                  <Link
                    to="/alerts"
                    className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
                    aria-label="Ver todas las alertas"
                  >
                    Ver todas
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {recentAlerts.map((alert) => {
                  const StatusIcon = getStatusIcon(alert.status);
                  return (
                    <div key={alert.id} className="px-4 py-4 hover:bg-gray-50 sm:px-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0">
                            <div
                              className={`flex h-10 w-10 items-center justify-center rounded-full ${getSeverityColor(
                                alert.severity
                              )}`}
                            >
                              <AlertTriangle className="h-5 w-5 text-white" aria-hidden="true" />
                            </div>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                            <p className="mt-1 text-sm text-gray-500">{alert.description}</p>
                            <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                              <span>{alert.student}</span>
                              <span className="text-gray-400">•</span>
                              <span>{formatDate(alert.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <span
                            className={`inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium ${getStatusColor(
                              alert.status
                            )}`}
                          >
                            <StatusIcon className="mr-1 h-4 w-4" aria-hidden />
                            {alert.status === "pending"
                              ? "Pendiente"
                              : alert.status === "reviewing"
                              ? "En revisión"
                              : "Resuelta"}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Estudiantes en riesgo */}
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-200 px-4 py-5 sm:px-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium leading-6 text-gray-900">Estudiantes en riesgo</h2>
                  <Link
                    to="/students?filter=risk"
                    className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
                    aria-label="Ver todos los estudiantes en riesgo"
                  >
                    Ver todos
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {studentsAtRisk.map((student) => (
                  <div key={student.id} className="px-4 py-4 hover:bg-gray-50 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                            <span className="text-sm font-medium text-gray-600">
                              {student.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .substring(0, 2)}
                            </span>
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-gray-900">{student.name}</p>
                          <p className="truncate text-sm text-gray-500">{student.course}</p>
                          <div className="mt-1 flex items-center space-x-2">
                            <span className="text-sm text-gray-600">Promedio: {student.grade}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        <span
                          className={`inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium ${getStatusColor(
                            student.status
                          )}`}
                        >
                          {student.status === "critical"
                            ? "Crítico"
                            : student.status === "warning"
                            ? "Alerta"
                            : "Normal"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Acciones rápidas */}
          <section className="rounded-lg border border-gray-200 bg-white shadow-sm" aria-label="Acciones rápidas">
            <div className="border-b border-gray-200 px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Acciones Rápidas</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <button
                  onClick={() => navigate("/reports/new")}
                  className="flex items-center rounded-lg border border-gray-200 p-4 transition-colors hover:border-blue-300 hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"
                >
                  <FileText className="h-6 w-6 text-blue-600" aria-hidden="true" />
                  <span className="ml-3 text-sm font-medium text-gray-900">Generar Reporte</span>
                </button>

                <button
                  onClick={() => navigate("/alerts?status=pending")}
                  className="flex items-center rounded-lg border border-gray-200 p-4 transition-colors hover:border-green-300 hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-600"
                >
                  <UserCheck className="h-6 w-6 text-green-600" aria-hidden="true" />
                  <span className="ml-3 text-sm font-medium text-gray-900">Revisar Alertas</span>
                </button>

                <Link
                  to="/students"
                  className="flex items-center rounded-lg border border-gray-200 p-4 transition-colors hover:border-purple-300 hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-purple-600"
                >
                  <Users className="h-6 w-6 text-purple-600" aria-hidden="true" />
                  <span className="ml-3 text-sm font-medium text-gray-900">Ver Estudiantes</span>
                </Link>

                <Link
                  to="/settings/alerts"
                  className="flex items-center rounded-lg border border-gray-200 p-4 transition-colors hover:border-yellow-300 hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow-600"
                >
                  <Target className="h-6 w-6 text-yellow-600" aria-hidden="true" />
                  <span className="ml-3 text-sm font-medium text-gray-900">Configurar Alertas</span>
                </Link>
              </div>
            </div>
          </section>
        </section>
      </main>
    </MainLayout>
  );
};

export default DashboardPage;
