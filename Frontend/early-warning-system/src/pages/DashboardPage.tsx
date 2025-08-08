import React, { useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import {
  Users,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  BookOpen,
  Clock,
  Target,
  ChevronRight,
  FileText,
  UserCheck,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

// --- Tipos ---
type ColorKey = "blue" | "red" | "green" | "purple";
type ChangeType = "increase" | "decrease";
type StudentStatus = "normal" | "warning" | "critical";
type AlertType = "academic" | "attendance" | "behavior";
type Severity = "low" | "medium" | "high";
type AlertStatus = "pending" | "reviewing" | "resolved";

interface StatCard {
  title: string;
  value: string | number;
  change: number;
  changeType: ChangeType;
  icon: React.ElementType;
  color: ColorKey;
}

interface Student {
  id: string;
  name: string;
  email: string;
  grade: number;
  status: StudentStatus;
  lastActivity: string;
  course: string;
}

interface Alert {
  id: string;
  type: AlertType;
  title: string;
  description: string;
  student: string;
  severity: Severity;
  createdAt: string;
  status: AlertStatus;
}

const DashboardPage: React.FC = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState<
    "7d" | "30d" | "3m" | "1y"
  >("7d");

  // --- Datos simulados ---
  const stats: StatCard[] = [
    {
      title: "Total Estudiantes",
      value: 1245,
      change: 5.2,
      changeType: "increase",
      icon: Users,
      color: "blue",
    },
    {
      title: "Alertas Activas",
      value: 23,
      change: -12.5,
      changeType: "decrease",
      icon: AlertTriangle,
      color: "red",
    },
    {
      title: "Tasa de Retención",
      value: "94.2%",
      change: 2.1,
      changeType: "increase",
      icon: TrendingUp,
      color: "green",
    },
    {
      title: "Promedio General",
      value: "8.4",
      change: 0.3,
      changeType: "increase",
      icon: BookOpen,
      color: "purple",
    },
  ];

  const recentAlerts: Alert[] = [
    {
      id: "1",
      type: "academic",
      title: "Bajo rendimiento académico",
      description:
        "Calificaciones por debajo del promedio en las últimas 3 evaluaciones",
      student: "Ana García Morales",
      severity: "high",
      createdAt: "2024-01-15T10:30:00Z",
      status: "pending",
    },
    {
      id: "2",
      type: "attendance",
      title: "Ausentismo frecuente",
      description: "Más de 5 faltas sin justificar en el último mes",
      student: "Carlos Rodríguez Silva",
      severity: "medium",
      createdAt: "2024-01-15T09:15:00Z",
      status: "reviewing",
    },
    {
      id: "3",
      type: "behavior",
      title: "Cambio en comportamiento",
      description: "Reportes de desinterés y falta de participación",
      student: "María José López",
      severity: "medium",
      createdAt: "2024-01-15T08:45:00Z",
      status: "pending",
    },
  ];

  const studentsAtRisk: Student[] = [
    {
      id: "1",
      name: "Ana García Morales",
      email: "ana.garcia@estudiante.edu",
      grade: 6.2,
      status: "critical",
      lastActivity: "2024-01-14T14:30:00Z",
      course: "Ingeniería de Sistemas",
    },
    {
      id: "2",
      name: "Carlos Rodríguez Silva",
      email: "carlos.rodriguez@estudiante.edu",
      grade: 7.1,
      status: "warning",
      lastActivity: "2024-01-13T16:20:00Z",
      course: "Administración de Empresas",
    },
    {
      id: "3",
      name: "María José López",
      email: "maria.lopez@estudiante.edu",
      grade: 7.5,
      status: "warning",
      lastActivity: "2024-01-15T11:15:00Z",
      course: "Psicología",
    },
  ];

  // --- Helpers de estilos/íconos ---
  const getColorClass = (color: ColorKey, type: "bg" | "text" | "border") => {
    const colors: Record<
      ColorKey,
      { bg: string; text: string; border: string }
    > = {
      blue: {
        bg: "bg-blue-500",
        text: "text-blue-600",
        border: "border-blue-200",
      },
      red: { bg: "bg-red-500", text: "text-red-600", border: "border-red-200" },
      green: {
        bg: "bg-green-500",
        text: "text-green-600",
        border: "border-green-200",
      },
      purple: {
        bg: "bg-purple-500",
        text: "text-purple-600",
        border: "border-purple-200",
      },
    };
    return colors[color][type];
  };

  const getStatusColor = (status: StudentStatus) => {
    const colors: Record<StudentStatus, string> = {
      normal: "bg-green-100 text-green-800 border-green-200",
      warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
      critical: "bg-red-100 text-red-800 border-red-200",
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

  return (
    <MainLayout currentPage="dashboard">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Dashboard
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Resumen general del sistema de alerta temprana académica
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
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="p-4 lg:p-6">
                <div className="flex items-center">
                  <div
                    className={`flex-shrink-0 rounded-md p-3 ${getColorClass(
                      stat.color,
                      "bg"
                    )}`}
                  >
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="truncate text-sm font-medium text-gray-500">
                          {stat.title}
                        </p>
                        <p className="text-2xl font-semibold text-gray-900">
                          {stat.value}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center">
                      {stat.changeType === "increase" ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      )}
                      <span
                        className={`ml-1 text-sm font-medium ${
                          stat.changeType === "increase"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {Math.abs(stat.change)}%
                      </span>
                      <span className="ml-1 text-sm text-gray-500">
                        vs mes anterior
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Recent Alerts */}
          <div className="lg:col-span-2">
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-200 px-4 py-5 sm:px-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Alertas Recientes
                  </h3>
                  <Link
                    to="/alerts"
                    className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
                  >
                    Ver todas
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
              <div className="divide-y divide-gray-200">
                {recentAlerts.map((alert) => {
                  const StatusIcon = getStatusIcon(alert.status);
                  return (
                    <div
                      key={alert.id}
                      className="px-4 py-4 hover:bg-gray-50 sm:px-6"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <StatusIcon className="mt-1 h-5 w-5 text-gray-400" />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {alert.title}
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                              {alert.description}
                            </p>
                            <div className="mt-2 flex items-center space-x-4">
                              <span className="text-sm text-gray-500">
                                {alert.student}
                              </span>
                              <span className="text-sm text-gray-400">•</span>
                              <span className="text-sm text-gray-500">
                                {formatDate(alert.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getSeverityColor(
                              alert.severity
                            )}`}
                          >
                            {alert.severity === "high"
                              ? "Alta"
                              : alert.severity === "medium"
                              ? "Media"
                              : "Baja"}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Students at Risk */}
          <div className="lg:col-span-1">
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-200 px-4 py-5 sm:px-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Estudiantes en Riesgo
                  </h3>
                  <Link
                    to="/students?filter=risk"
                    className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
                  >
                    Ver todos
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
              <div className="divide-y divide-gray-200">
                {studentsAtRisk.map((student) => (
                  <div
                    key={student.id}
                    className="px-4 py-4 hover:bg-gray-50 sm:px-6"
                  >
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
                          <p className="truncate text-sm font-medium text-gray-900">
                            {student.name}
                          </p>
                          <p className="truncate text-sm text-gray-500">
                            {student.course}
                          </p>
                          <div className="mt-1 flex items-center space-x-2">
                            <span className="text-sm text-gray-600">
                              Promedio: {student.grade}
                            </span>
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
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-4 py-5 sm:px-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Acciones Rápidas
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <button className="flex items-center rounded-lg border border-gray-200 p-4 transition-colors hover:border-blue-300 hover:bg-gray-50">
                <FileText className="h-6 w-6 text-blue-600" />
                <span className="ml-3 text-sm font-medium text-gray-900">
                  Generar Reporte
                </span>
              </button>
              <button className="flex items-center rounded-lg border border-gray-200 p-4 transition-colors hover:border-green-300 hover:bg-gray-50">
                <UserCheck className="h-6 w-6 text-green-600" />
                <span className="ml-3 text-sm font-medium text-gray-900">
                  Revisar Alertas
                </span>
              </button>
              <Link
                to="/students"
                className="flex items-center rounded-lg border border-gray-200 p-4 transition-colors hover:border-purple-300 hover:bg-gray-50"
              >
                <Users className="h-6 w-6 text-purple-600" />
                <span className="ml-3 text-sm font-medium text-gray-900">
                  Ver Estudiantes
                </span>
              </Link>
              <Link
                to="/settings"
                className="flex items-center rounded-lg border border-gray-200 p-4 transition-colors hover:border-yellow-300 hover:bg-gray-50"
              >
                <Target className="h-6 w-6 text-yellow-600" />
                <span className="ml-3 text-sm font-medium text-gray-900">
                  Configurar Alertas
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DashboardPage;
