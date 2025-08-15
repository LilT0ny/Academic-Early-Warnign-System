import React, { useState } from "react";
import { Filter } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";

type FilterState = {
  periodo: string;
  nivel: string;
  facultad: string;
  carrera: string;
  pensum: string;
};

// --- Mock data (ajústalo cuando conectes API) ---
const mockData = {
  evolutionData: [
    { period: "2020-1", students: 6852, total: 8000 },
    { period: "2020-2", students: 6853, total: 8100 },
    { period: "2021-1", students: 6767, total: 8200 },
    { period: "2021-2", students: 6739, total: 8150 },
    { period: "2022-1", students: 6668, total: 8300 },
    { period: "2022-2", students: 6560, total: 8250 },
    { period: "2023-1", students: 6561, total: 8400 },
    { period: "2023-2", students: 6465, total: 8350 },
    { period: "2024-1", students: 6937, total: 8500 },
    { period: "2024-2", students: 7755, total: 8600 },
  ],
  careerData: [
    { career: "MECÁNICA", students: 25545, percentage: 24.2 },
    {
      career: "ELECTRÓNICA Y AUTOMATIZACIÓN",
      students: 17141,
      percentage: 16.3,
    },
    { career: "COMPUTACIÓN", students: 15150, percentage: 14.4 },
    { career: "TELECOMUNICACIONES", students: 14440, percentage: 13.7 },
    { career: "ELECTRICIDAD", students: 14211, percentage: 13.5 },
    { career: "INGENIERÍA CIVIL", students: 12459, percentage: 11.8 },
  ],
  facultyDistribution: [
    { name: "CIENCIAS", value: 45, color: "#8884d8" },
    { name: "INGENIERÍA", value: 35, color: "#82ca9d" },
    { name: "HUMANIDADES", value: 20, color: "#ffc658" },
  ],
  monthlyTrends: [
    { month: "Ene", nuevos: 1200, graduados: 800, activos: 7500 },
    { month: "Feb", nuevos: 1100, graduados: 750, activos: 7850 },
    { month: "Mar", nuevos: 1300, graduados: 900, activos: 8250 },
    { month: "Abr", nuevos: 1000, graduados: 850, activos: 8400 },
    { month: "May", nuevos: 1150, graduados: 700, activos: 8850 },
    { month: "Jun", nuevos: 950, graduados: 1200, activos: 8600 },
  ],
  pensumData: [
    { pensum: "RRA20", count: 1234, percentage: 45.2 },
    { pensum: "RRA19", count: 876, percentage: 32.1 },
    { pensum: "RRA18", count: 432, percentage: 15.8 },
    { pensum: "RRA17", count: 189, percentage: 6.9 },
  ],
  performanceMetrics: [
    { metric: "Excelente (9-10)", value: 25, color: "#22c55e" },
    { metric: "Bueno (8-8.9)", value: 35, color: "#84cc16" },
    { metric: "Regular (7-7.9)", value: 28, color: "#eab308" },
    { metric: "Deficiente (< 7)", value: 12, color: "#ef4444" },
  ],
};

const DashboardModule: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>({
    periodo: "todos",
    nivel: "todos",
    facultad: "todos",
    carrera: "todos",
    pensum: "todos",
  });

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      periodo: "todos",
      nivel: "todos",
      facultad: "todos",
      carrera: "todos",
      pensum: "todos",
    });
  };

  return (
    <main
      className="min-h-screen bg-gray-50"
      aria-label="Panel principal de Dashboard Académico"
    >
      {/*Filtros*/}
      <section
        className="bg-white border-b border-gray-200 rounded-xl"
        aria-label="Filtros de búsqueda"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" aria-hidden="true" />
              <span className="font-medium text-gray-900" id="filtros-label">
                Filtros
              </span>
            </div>

            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white rounded"
            >
              Limpiar filtros
            </button>
          </div>

          <form
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
            aria-labelledby="filtros-label"
            role="search"
          >
            {/* Período */}
            <div>
              <label
                htmlFor="periodo"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Período Académico
              </label>
              <select
                id="periodo"
                className="w-full px-3 py-2 rounded-md text-sm bg-white border border-gray-300 text-gray-900
                     hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={filters.periodo}
                onChange={(e) => handleFilterChange("periodo", e.target.value)}
              >
                <option value="todos">Todos</option>
                <option value="2024-2">2024-2</option>
                <option value="2024-1">2024-1</option>
                <option value="2023-2">2023-2</option>
              </select>
            </div>

            {/* Nivel */}
            <div>
              <label
                htmlFor="nivel"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nivel
              </label>
              <select
                id="nivel"
                className="w-full px-3 py-2 rounded-md text-sm bg-white border border-gray-300 text-gray-900
                     hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={filters.nivel}
                onChange={(e) => handleFilterChange("nivel", e.target.value)}
              >
                <option value="todos">Todos</option>
                <option value="pregrado">Pregrado</option>
                <option value="posgrado">Posgrado</option>
              </select>
            </div>

            {/* Facultad */}
            <div>
              <label
                htmlFor="facultad"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Facultad
              </label>
              <select
                id="facultad"
                className="w-full px-3 py-2 rounded-md text-sm bg-white border border-gray-300 text-gray-900
                     hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={filters.facultad}
                onChange={(e) => handleFilterChange("facultad", e.target.value)}
              >
                <option value="todos">Todas</option>
                <option value="ciencias">Ciencias</option>
                <option value="ingenieria">Ingeniería</option>
                <option value="humanidades">Humanidades</option>
              </select>
            </div>

            {/* Carrera */}
            <div>
              <label
                htmlFor="carrera"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Carrera
              </label>
              <select
                id="carrera"
                className="w-full px-3 py-2 rounded-md text-sm bg-white border border-gray-300 text-gray-900
                     hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={filters.carrera}
                onChange={(e) => handleFilterChange("carrera", e.target.value)}
              >
                <option value="todos">Todas</option>
                <option value="mecanica">Mecánica</option>
                <option value="electronica">Electrónica</option>
                <option value="computacion">Computación</option>
              </select>
            </div>

            {/* Pénsum */}
            <div>
              <label
                htmlFor="pensum"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Pénsum
              </label>
              <select
                id="pensum"
                className="w-full px-3 py-2 rounded-md text-sm bg-white border border-gray-300 text-gray-900
                     hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={filters.pensum}
                onChange={(e) => handleFilterChange("pensum", e.target.value)}
              >
                <option value="todos">Todos</option>
                <option value="rra20">RRA20</option>
                <option value="rra19">RRA19</option>
                <option value="rra18">RRA18</option>
              </select>
            </div>
          </form>
        </div>
      </section>

      {/* Contenido principal: 3 columnas x 2 filas */}
      <section
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8"
        aria-label="Contenido principal"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* 1. Evolución */}
          <figure
            className="bg-white p-6 rounded-lg shadow-sm border"
            aria-labelledby="evolucion-label"
          >
            <figcaption
              id="evolucion-label"
              className="text-lg font-semibold text-gray-900 mb-4"
            >
              Evolución de Estudiantes por Período
            </figcaption>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockData.evolutionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="students"
                  stroke="#1d4ed8"
                  strokeWidth={3}
                  name="Estudiantes Activos"
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#059669"
                  strokeWidth={2}
                  name="Capacidad Total"
                />
              </LineChart>
            </ResponsiveContainer>
          </figure>

          {/* 2. Distribución facultad */}
          <figure
            className="bg-white p-6 rounded-lg shadow-sm border"
            aria-labelledby="facultad-label"
          >
            <figcaption
              id="facultad-label"
              className="text-lg font-semibold text-gray-900 mb-4"
            >
              Distribución por Facultad
            </figcaption>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={mockData.facultyDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent! * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  dataKey="value"
                >
                  {mockData.facultyDistribution.map((e, i) => (
                    <Cell key={i} fill={e.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </figure>

          {/* 3. Top carreras */}
          <figure
            className="bg-white p-6 rounded-lg shadow-sm border"
            aria-labelledby="carreras-label"
          >
            <figcaption
              id="carreras-label"
              className="text-lg font-semibold text-gray-900 mb-4"
            >
              Top Carreras por Estudiantes
            </figcaption>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockData.careerData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="career" type="category" width={150} />
                <Tooltip />
                <Bar dataKey="students" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </figure>

          {/* 4. Tendencias mensuales */}
          <figure
            className="bg-white p-6 rounded-lg shadow-sm border"
            aria-labelledby="tendencias-label"
          >
            <figcaption
              id="tendencias-label"
              className="text-lg font-semibold text-gray-900 mb-4"
            >
              Tendencias Mensuales
            </figcaption>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={mockData.monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="activos"
                  stackId="1"
                  stroke="#1d4ed8"
                  fill="#1d4ed8"
                  name="Activos"
                />
                <Area
                  type="monotone"
                  dataKey="nuevos"
                  stackId="2"
                  stroke="#059669"
                  fill="#059669"
                  name="Nuevos"
                />
                <Area
                  type="monotone"
                  dataKey="graduados"
                  stackId="3"
                  stroke="#f59e0b"
                  fill="#f59e0b"
                  name="Graduados"
                />
              </AreaChart>
            </ResponsiveContainer>
          </figure>

          {/* 5. Rendimiento */}
          <figure
            className="bg-white p-6 rounded-lg shadow-sm border"
            aria-labelledby="rendimiento-label"
          >
            <figcaption
              id="rendimiento-label"
              className="text-lg font-semibold text-gray-900 mb-4"
            >
              Rendimiento Académico
            </figcaption>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={mockData.performanceMetrics}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  dataKey="value"
                  label={({ value }) => `${value}%`}
                >
                  {mockData.performanceMetrics.map((e, i) => (
                    <Cell key={i} fill={e.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </figure>

          {/* 6. Tabla resumen */}
          <section
            className="bg-white rounded-lg shadow-sm border"
            aria-labelledby="resumen-label"
          >
            <div className="px-6 py-4 border-b border-gray-200">
              <h3
                id="resumen-label"
                className="text-lg font-semibold text-gray-900"
              >
                Resumen por Período Académico
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table
                className="min-w-full divide-y divide-gray-200"
                role="table"
              >
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase bg-gray-100">
                      Período
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase bg-gray-100">
                      Facultad
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase bg-gray-100">
                      Carrera
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase bg-gray-100">
                      Pénsum
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase bg-gray-100">
                      Estudiantes
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      2024-B
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      CIENCIAS
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ECONOMÍA
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      (RRA20) ECONOMÍA
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      249
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      2024-B
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      CIENCIAS
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      FÍSICA
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      (RRA20) FÍSICA
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      180
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      2024-B
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      CIENCIAS
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      MATEMÁTICA
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      (RRA20) MATEMÁTICA
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      74
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
};

export default DashboardModule;
