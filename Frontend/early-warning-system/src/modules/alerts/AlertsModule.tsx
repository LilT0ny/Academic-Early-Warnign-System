import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  AlertCircle,
  Clock,
  CheckCircle2,
  Filter,
  Search,
  Download,
  Eye,
  User,
  Calendar,
  BookOpen,
  Bell,
  X,
  Target
} from 'lucide-react';

// Tipos
type AlertSeverity = 'critical' | 'high' | 'medium' | 'low';
type AlertStatus = 'active' | 'reviewing' | 'resolved' | 'dismissed';
type AlertCategory = 'academic' | 'attendance' | 'behavioral' | 'financial';

interface Alert {
  id: string;
  studentId: string;
  studentName: string;
  studentAvatar?: string;
  title: string;
  description: string;
  category: AlertCategory;
  severity: AlertSeverity;
  status: AlertStatus;
  createdAt: string;
  updatedAt: string;
  course: string;
  assignedTo?: string;
  metrics?: {
    currentGrade?: number;
    previousGrade?: number;
    attendanceRate?: number;
    missedClasses?: number;
  };
  actions?: string[];
}

interface AlertFilters {
  severity: AlertSeverity | 'all';
  status: AlertStatus | 'all';
  category: AlertCategory | 'all';
  dateRange: '24h' | '7d' | '30d' | 'all';
  assignedTo: string;
}

// Mock data
const mockAlerts: Alert[] = [
  {
    id: '1',
    studentId: 'EST001',
    studentName: 'María González Pérez',
    title: 'Bajo rendimiento académico crítico',
    description: 'El estudiante ha obtenido calificaciones por debajo de 6.0 en los últimos 3 exámenes consecutivos',
    category: 'academic',
    severity: 'critical',
    status: 'active',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    course: 'Matemática Aplicada III',
    assignedTo: 'Prof. Juan Rodríguez',
    metrics: {
      currentGrade: 5.2,
      previousGrade: 7.8,
      attendanceRate: 85
    },
    actions: ['Tutoría personalizada', 'Reunión con padres', 'Plan de recuperación']
  },
  {
    id: '2',
    studentId: 'EST002',
    studentName: 'Carlos Mendoza Silva',
    title: 'Ausentismo recurrente',
    description: 'Ha faltado a 8 clases en las últimas 2 semanas sin justificación',
    category: 'attendance',
    severity: 'high',
    status: 'reviewing',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    course: 'Ingeniería de Software',
    assignedTo: 'Coord. Ana López',
    metrics: {
      attendanceRate: 62,
      missedClasses: 8
    },
    actions: ['Contactar estudiante', 'Verificar situación personal']
  },
  {
    id: '3',
    studentId: 'EST003',
    studentName: 'Luisa Ramírez Torres',
    title: 'Cambio drástico en comportamiento',
    description: 'Reportes de profesores sobre cambios significativos en participación y actitud',
    category: 'behavioral',
    severity: 'medium',
    status: 'active',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    course: 'Múltiples materias',
    assignedTo: 'Psicóloga Educativa',
    metrics: {
      currentGrade: 7.5,
      previousGrade: 8.2
    },
    actions: ['Evaluación psicológica', 'Entrevista personal']
  },
  {
    id: '4',
    studentId: 'EST004',
    studentName: 'Roberto Vásquez León',
    title: 'Mora en pagos académicos',
    description: 'Tiene pendientes de pago que pueden afectar su continuidad académica',
    category: 'financial',
    severity: 'high',
    status: 'active',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    course: 'N/A',
    assignedTo: 'Bienestar Estudiantil',
    actions: ['Reestructuración de pagos', 'Beca de emergencia']
  },
  {
    id: '5',
    studentId: 'EST005',
    studentName: 'Andrea Morales Castro',
    title: 'Riesgo de deserción',
    description: 'Múltiples factores de riesgo detectados: bajo rendimiento + ausentismo + problemas familiares',
    category: 'academic',
    severity: 'critical',
    status: 'reviewing',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    course: 'Carrera: Ingeniería Civil',
    assignedTo: 'Director de Carrera',
    metrics: {
      currentGrade: 5.8,
      attendanceRate: 68
    },
    actions: ['Intervención inmediata', 'Plan integral de apoyo']
  }
];

const AlertsModule: React.FC = () => {
  const [alerts] = useState<Alert[]>(mockAlerts);
  const [filters, setFilters] = useState<AlertFilters>({
    severity: 'all',
    status: 'all',
    category: 'all',
    dateRange: '7d',
    assignedTo: 'all'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Filtrado de alertas
  const filteredAlerts = useMemo(() => {
    return alerts.filter(alert => {
      // Filtro por texto de búsqueda
      if (searchTerm && !alert.studentName.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !alert.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !alert.description.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Filtros por categorías
      if (filters.severity !== 'all' && alert.severity !== filters.severity) return false;
      if (filters.status !== 'all' && alert.status !== filters.status) return false;
      if (filters.category !== 'all' && alert.category !== filters.category) return false;

      // Filtro por fecha
      if (filters.dateRange !== 'all') {
        const now = new Date();
        const alertDate = new Date(alert.createdAt);
        const diffHours = (now.getTime() - alertDate.getTime()) / (1000 * 60 * 60);
        
        switch (filters.dateRange) {
          case '24h':
            if (diffHours > 24) return false;
            break;
          case '7d':
            if (diffHours > 168) return false;
            break;
          case '30d':
            if (diffHours > 720) return false;
            break;
        }
      }

      return true;
    });
  }, [alerts, filters, searchTerm]);

  // Estadísticas de alertas
  const alertStats = useMemo(() => {
    const total = filteredAlerts.length;
    const critical = filteredAlerts.filter(a => a.severity === 'critical').length;
    const active = filteredAlerts.filter(a => a.status === 'active').length;
    const resolved = filteredAlerts.filter(a => a.status === 'resolved').length;
    
    return { total, critical, active, resolved };
  }, [filteredAlerts]);

  // Funciones de utilidad
  const getSeverityColor = (severity: AlertSeverity) => {
    const colors = {
      critical: 'bg-red-100 text-red-800 border-red-200',
      high: 'bg-orange-100 text-orange-800 border-orange-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-blue-100 text-blue-800 border-blue-200'
    };
    return colors[severity];
  };

  const getStatusColor = (status: AlertStatus) => {
    const colors = {
      active: 'bg-red-100 text-red-800',
      reviewing: 'bg-yellow-100 text-yellow-800',
      resolved: 'bg-green-100 text-green-800',
      dismissed: 'bg-gray-100 text-gray-800'
    };
    return colors[status];
  };

  const getCategoryIcon = (category: AlertCategory) => {
    const icons = {
      academic: BookOpen,
      attendance: Clock,
      behavioral: User,
      financial: Target
    };
    return icons[category];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `Hace ${diffMins} minutos`;
    } else if (diffHours < 24) {
      return `Hace ${diffHours} horas`;
    } else {
      return `Hace ${diffDays} días`;
    }
  };

  const updateAlertStatus = (alertId: string, newStatus: AlertStatus) => {
    // Aquí implementarías la llamada al backend
    console.log(`Actualizando alerta ${alertId} a estado: ${newStatus}`);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFilterChange = (key: keyof AlertFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      severity: 'all',
      status: 'all',
      category: 'all',
      dateRange: '7d',
      assignedTo: 'all'
    });
    setSearchTerm('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <Bell className="w-8 h-8 text-red-500 mr-3" />
                Sistema de Alertas Académicas
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Gestión y seguimiento de alertas estudiantiles
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </button>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-100">
                <AlertTriangle className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Alertas</p>
                <p className="text-2xl font-bold text-gray-900">{alertStats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-red-100">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Críticas</p>
                <p className="text-2xl font-bold text-red-600">{alertStats.critical}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-yellow-100">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Activas</p>
                <p className="text-2xl font-bold text-yellow-600">{alertStats.active}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-100">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Resueltas</p>
                <p className="text-2xl font-bold text-green-600">{alertStats.resolved}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Barra de búsqueda y filtros */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Búsqueda */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar por estudiante, título o descripción..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Filtros rápidos */}
              <div className="flex flex-wrap gap-2">
                <select
                  value={filters.severity}
                  onChange={(e) => handleFilterChange('severity', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Todas las severidades</option>
                  <option value="critical">Crítica</option>
                  <option value="high">Alta</option>
                  <option value="medium">Media</option>
                  <option value="low">Baja</option>
                </select>

                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Todos los estados</option>
                  <option value="active">Activas</option>
                  <option value="reviewing">En revisión</option>
                  <option value="resolved">Resueltas</option>
                  <option value="dismissed">Descartadas</option>
                </select>

                <button
                  onClick={clearFilters}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700
                      text-white font-semibold px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transform
                      hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                      disabled:transform-none flex items-center justify-center text-sm sm:text-base
                      touch-manipulation focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"
                  >
                    Limpiar
                </button>

              </div>
            </div>
          </div>
        </div>

        {/* Lista de alertas */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Alertas Activas ({filteredAlerts.length})
            </h3>
          </div>
          
          <div className="divide-y divide-gray-200">
            {filteredAlerts.map((alert) => {
              const CategoryIcon = getCategoryIcon(alert.category);
              return (
                <div key={alert.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      {/* Avatar e ícono de categoría */}
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center relative">
                          <User className="w-6 h-6 text-gray-500" />
                          <div className="absolute -bottom-1 -right-1">
                            <CategoryIcon className="w-5 h-5 text-gray-600 bg-white rounded-full p-1" />
                          </div>
                        </div>
                      </div>

                      {/* Información principal */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-lg font-semibold text-gray-900">{alert.title}</h4>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getSeverityColor(alert.severity)}`}>
                            {alert.severity === 'critical' && '🔴'}
                            {alert.severity === 'high' && '🟠'}
                            {alert.severity === 'medium' && '🟡'}
                            {alert.severity === 'low' && '🔵'}
                            {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(alert.status)}`}>
                            {alert.status}
                          </span>
                        </div>

                        <p className="text-gray-600 mb-2">{alert.description}</p>

                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                          <span className="flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            {alert.studentName}
                          </span>
                          <span className="flex items-center">
                            <BookOpen className="w-4 h-4 mr-1" />
                            {alert.course}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(alert.createdAt)}
                          </span>
                        </div>

                        {/* Métricas */}
                        {alert.metrics && (
                          <div className="flex items-center space-x-4 mb-3">
                            {alert.metrics.currentGrade && (
                              <div className="flex items-center text-sm">
                                <span className="text-gray-500 mr-2">Calificación:</span>
                                <span className={`font-medium ${alert.metrics.currentGrade < 7 ? 'text-red-600' : 'text-green-600'}`}>
                                  {alert.metrics.currentGrade}
                                </span>
                                {alert.metrics.previousGrade && (
                                  <span className="ml-1 text-xs text-gray-400">
                                    (ant: {alert.metrics.previousGrade})
                                  </span>
                                )}
                              </div>
                            )}
                            {alert.metrics.attendanceRate && (
                              <div className="flex items-center text-sm">
                                <span className="text-gray-500 mr-2">Asistencia:</span>
                                <span className={`font-medium ${alert.metrics.attendanceRate < 75 ? 'text-red-600' : 'text-green-600'}`}>
                                  {alert.metrics.attendanceRate}%
                                </span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Acciones recomendadas */}
                        {alert.actions && alert.actions.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {alert.actions.map((action, index) => (
                              <span 
                                key={index}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                {action}
                              </span>
                            ))}
                          </div>
                        )}

                        {alert.assignedTo && (
                          <p className="text-sm text-gray-500">
                            Asignado a: <span className="font-medium">{alert.assignedTo}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Acciones */}
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => setSelectedAlert(alert)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Ver detalles"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      
                      {alert.status === 'active' && (
                        <button
                          onClick={() => updateAlertStatus(alert.id, 'reviewing')}
                          className="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700 transition-colors"
                        >
                          En revisión
                        </button>
                      )}
                      
                      {alert.status === 'reviewing' && (
                        <button
                          onClick={() => updateAlertStatus(alert.id, 'resolved')}
                          className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                        >
                          Resolver
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredAlerts.length === 0 && (
            <div className="p-12 text-center">
              <AlertTriangle className="mx-auto h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron alertas</h3>
              <p className="text-gray-500">
                No hay alertas que coincidan con los filtros seleccionados.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de detalles (básico) */}
      {selectedAlert && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Detalles de la Alerta</h3>
              <button
                onClick={() => setSelectedAlert(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900">{selectedAlert.title}</h4>
                <p className="text-gray-600 mt-1">{selectedAlert.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Estudiante:</span> {selectedAlert.studentName}
                </div>
                <div>
                  <span className="font-medium">Curso:</span> {selectedAlert.course}
                </div>
                <div>
                  <span className="font-medium">Severidad:</span> {selectedAlert.severity}
                </div>
                <div>
                  <span className="font-medium">Estado:</span> {selectedAlert.status}
                </div>
              </div>

              {selectedAlert.actions && (
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Acciones recomendadas:</h5>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    {selectedAlert.actions.map((action, index) => (
                      <li key={index}>{action}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertsModule;