import React, { useState } from "react";
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  Eye,
  Edit,
  Download,
  Mail,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Users,
  GraduationCap,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

// Tipos
type Status = "active" | "inactive" | "at_risk" | "graduated";
type Risk = "low" | "medium" | "high" | "critical";
type FilterKey = "all" | "active" | "at_risk" | "high_risk" | "low_gpa";

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  studentId: string;
  program: string;
  semester: number;
  enrollmentDate: string;
  gpa: number;
  credits: number;
  status: Status;
  riskLevel: Risk;
  lastActivity: string;
  avatar?: string;
  totalCourses: number;
  completedCourses: number;
  alerts: number;
}

const StudentsModule: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<FilterKey>("all");
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  // const [currentPage] = useState(1); // placeholder

  // Datos simulados
  const students: Student[] = [
    {
      id: "1",
      name: "Ana García Morales",
      email: "ana.garcia@estudiante.edu",
      phone: "+57 300 123 4567",
      studentId: "2021001234",
      program: "Ingeniería de Sistemas",
      semester: 6,
      enrollmentDate: "2021-02-15",
      gpa: 4.2,
      credits: 120,
      status: "active",
      riskLevel: "low",
      lastActivity: "2024-01-15T14:30:00Z",
      totalCourses: 8,
      completedCourses: 6,
      alerts: 0,
    },
    {
      id: "2",
      name: "Carlos Rodríguez Silva",
      email: "carlos.rodriguez@estudiante.edu",
      phone: "+57 301 987 6543",
      studentId: "2020005678",
      program: "Administración de Empresas",
      semester: 8,
      enrollmentDate: "2020-08-10",
      gpa: 3.1,
      credits: 145,
      status: "at_risk",
      riskLevel: "high",
      lastActivity: "2024-01-12T09:15:00Z",
      totalCourses: 10,
      completedCourses: 7,
      alerts: 3,
    },
    {
      id: "3",
      name: "María José López",
      email: "maria.lopez@estudiante.edu",
      phone: "+57 302 456 7890",
      studentId: "2022009876",
      program: "Psicología",
      semester: 4,
      enrollmentDate: "2022-01-20",
      gpa: 3.8,
      credits: 80,
      status: "active",
      riskLevel: "medium",
      lastActivity: "2024-01-14T16:45:00Z",
      totalCourses: 6,
      completedCourses: 5,
      alerts: 1,
    },
    {
      id: "4",
      name: "Juan Pablo Martínez",
      email: "juan.martinez@estudiante.edu",
      phone: "+57 303 789 1234",
      studentId: "2019002468",
      program: "Derecho",
      semester: 10,
      enrollmentDate: "2019-08-05",
      gpa: 4.5,
      credits: 180,
      status: "active",
      riskLevel: "low",
      lastActivity: "2024-01-15T11:20:00Z",
      totalCourses: 12,
      completedCourses: 11,
      alerts: 0,
    },
  ];

  const filters = [
    { value: "all", label: "Todos los estudiantes", count: students.length },
    {
      value: "active",
      label: "Activos",
      count: students.filter((s) => s.status === "active").length,
    },
    {
      value: "at_risk",
      label: "En riesgo",
      count: students.filter((s) => s.status === "at_risk").length,
    },
    {
      value: "high_risk",
      label: "Riesgo alto",
      count: students.filter(
        (s) => s.riskLevel === "high" || s.riskLevel === "critical"
      ).length,
    },
    {
      value: "low_gpa",
      label: "Promedio bajo",
      count: students.filter((s) => s.gpa < 3.5).length,
    },
  ] as const;

  const getStatusColor = (status: Status) => {
    const colors: Record<Status, string> = {
      active: "bg-green-100 text-green-800 border-green-200",
      inactive: "bg-gray-100 text-gray-800 border-gray-200",
      at_risk: "bg-red-100 text-red-800 border-red-200",
      graduated: "bg-blue-100 text-blue-800 border-blue-200",
    };
    return colors[status];
  };

  const getRiskLevelColor = (riskLevel: Risk) => {
    const colors: Record<Risk, string> = {
      low: "bg-green-100 text-green-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-orange-100 text-orange-800",
      critical: "bg-red-100 text-red-800",
    };
    return colors[riskLevel];
  };

  const getStatusIcon = (status: Status) => {
    const icons: Record<Status, React.ElementType> = {
      active: CheckCircle,
      inactive: XCircle,
      at_risk: AlertTriangle,
      graduated: GraduationCap,
    };
    return icons[status];
  };

  const filteredStudents = students.filter((student) => {
    const s = searchTerm.toLowerCase();
    const matchesSearch =
      student.name.toLowerCase().includes(s) ||
      student.email.toLowerCase().includes(s) ||
      student.studentId.includes(searchTerm) ||
      student.program.toLowerCase().includes(s);

    const matchesFilter =
      selectedFilter === "all" ||
      (selectedFilter === "active" && student.status === "active") ||
      (selectedFilter === "at_risk" && student.status === "at_risk") ||
      (selectedFilter === "high_risk" &&
        (student.riskLevel === "high" || student.riskLevel === "critical")) ||
      (selectedFilter === "low_gpa" && student.gpa < 3.5);

    return matchesSearch && matchesFilter;
  });

  const handleSelectStudent = (studentId: string) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSelectAll = () => {
    setSelectedStudents(
      selectedStudents.length === filteredStudents.length
        ? []
        : filteredStudents.map((s) => s.id)
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Estudiantes
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestiona y monitorea el progreso académico
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-gray-50">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </button>
          <button className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Estudiante
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="p-5">
            <div className="flex items-center">
              <Users className="h-6 w-6 text-blue-600" />
              <div className="ml-5">
                <dl>
                  <dt className="text-sm font-medium text-gray-500">
                    Total Estudiantes
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {students.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="p-5">
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <div className="ml-5">
                <dl>
                  <dt className="text-sm font-medium text-gray-500">Activos</dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {students.filter((s) => s.status === "active").length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="p-5">
            <div className="flex items-center">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <div className="ml-5">
                <dl>
                  <dt className="text-sm font-medium text-gray-500">
                    En riesgo
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {students.filter((s) => s.status === "at_risk").length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="p-5">
            <div className="flex items-center">
              <TrendingUp className="h-6 w-6 text-purple-600" />
              <div className="ml-5">
                <dl>
                  <dt className="text-sm font-medium text-gray-500">
                    Promedio general
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {(
                      students.reduce((acc, s) => acc + s.gpa, 0) /
                      students.length
                    ).toFixed(1)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Search */}
            <div className="max-w-lg flex-1">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 leading-5 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Buscar estudiantes…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Filters toggle */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters((v) => !v)}
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <Filter className="mr-2 h-4 w-4" />
                Filtros
              </button>

              {selectedStudents.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700">
                    {selectedStudents.length} seleccionados
                  </span>
                  <button className="inline-flex items-center text-xs font-medium text-blue-600 hover:text-blue-500">
                    <Mail className="mr-1 h-3 w-3" />
                    Enviar email
                  </button>
                </div>
              )}
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 border-t border-gray-200 pt-4">
              <div className="flex flex-wrap gap-2">
                {filters.map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => setSelectedFilter(filter.value)}
                    className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium transition-colors ${
                      selectedFilter === filter.value
                        ? "border-blue-200 bg-blue-100 text-blue-800"
                        : "border-transparent bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {filter.label}
                    <span className="ml-1 text-xs">({filter.count})</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={
                        selectedStudents.length === filteredStudents.length &&
                        filteredStudents.length > 0
                      }
                      onChange={handleSelectAll}
                      aria-label="Seleccionar todos los estudiantes"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Estudiante
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Programa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Promedio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Riesgo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Alertas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredStudents.map((student) => {
                  const StatusIcon = getStatusIcon(student.status);
                  return (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-6 py-4">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          checked={selectedStudents.includes(student.id)}
                          onChange={() => handleSelectStudent(student.id)}
                          title={`Seleccionar estudiante ${student.name}`}
                        />
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
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
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {student.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {student.studentId}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {student.program}
                        </div>
                        <div className="text-sm text-gray-500">
                          Semestre {student.semester}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-900">
                            {student.gpa.toFixed(1)}
                          </span>
                          {student.gpa >= 4.0 ? (
                            <TrendingUp className="ml-1 h-4 w-4 text-green-500" />
                          ) : student.gpa < 3.0 ? (
                            <TrendingDown className="ml-1 h-4 w-4 text-red-500" />
                          ) : null}
                        </div>
                        <div className="text-xs text-gray-500">
                          {student.credits} créditos
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
                            student.status
                          )}`}
                        >
                          <StatusIcon className="mr-1 h-3 w-3" />
                          {student.status === "active"
                            ? "Activo"
                            : student.status === "inactive"
                            ? "Inactivo"
                            : student.status === "at_risk"
                            ? "En Riesgo"
                            : "Graduado"}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getRiskLevelColor(
                            student.riskLevel
                          )}`}
                        >
                          {student.riskLevel === "low"
                            ? "Bajo"
                            : student.riskLevel === "medium"
                            ? "Medio"
                            : student.riskLevel === "high"
                            ? "Alto"
                            : "Crítico"}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {student.alerts > 0 ? (
                          <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                            <AlertTriangle className="mr-1 h-3 w-3" />
                            {student.alerts}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">
                            Sin alertas
                          </span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            className="text-blue-600 hover:text-blue-900"
                            title="Ver detalles"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            className="text-gray-600 hover:text-gray-900"
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            className="text-blue-600 hover:text-blue-900"
                            title="Enviar email"
                          >
                            <Mail className="h-4 w-4" />
                          </button>
                          <button
                            className="text-gray-400 hover:text-gray-600"
                            title="Más opciones"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination (placeholder) */}
          <div className="border-t border-gray-200 bg-gray-50 px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Mostrando <span className="font-medium">1</span> a{" "}
                <span className="font-medium">{filteredStudents.length}</span>{" "}
                de{" "}
                <span className="font-medium">{filteredStudents.length}</span>{" "}
                estudiantes
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700"
                  disabled
                >
                  Anterior
                </button>
                <span className="rounded-md bg-blue-50 px-3 py-1 text-sm text-blue-600">
                  1
                </span>
                <button
                  className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700"
                  disabled
                >
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentsModule;
