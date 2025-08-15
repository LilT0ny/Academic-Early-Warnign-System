import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  Target,
  CheckCircle2,
  Download,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Minus,
  Lightbulb,
  Brain,
  Zap
} from 'lucide-react';
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
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';

// Tipos
interface InsightMetric {
  id: string;
  title: string;
  value: number;
  previousValue?: number;
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
  category: 'academic' | 'behavioral' | 'attendance' | 'risk';
  description: string;
}

interface PredictiveInsight {
  id: string;
  type: 'risk_prediction' | 'performance_forecast' | 'intervention_recommendation';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  timeframe: string;
  affectedStudents: number;
  recommendedActions: string[];
}

interface Pattern {
  id: string;
  name: string;
  description: string;
  frequency: number;
  severity: 'high' | 'medium' | 'low';
  categories: string[];
  examples: string[];
}

interface TimeSeriesData {
  period: string;
  academicPerformance: number;
  attendanceRate: number;
  riskScore: number;
  alertsGenerated: number;
}

// Mock data
const mockMetrics: InsightMetric[] = [
  {
    id: '1',
    title: 'Promedio General',
    value: 7.8,
    previousValue: 7.6,
    trend: 'up',
    trendPercentage: 2.6,
    category: 'academic',
    description: 'Mejora sostenida en el rendimiento académico general'
  },
  {
    id: '2',
    title: 'Tasa de Retención',
    value: 89.3,
    previousValue: 91.2,
    trend: 'down',
    trendPercentage: -2.1,
    category: 'risk',
    description: 'Ligera disminución en la retención estudiantil'
  },
  {
    id: '3',
    title: 'Asistencia Promedio',
    value: 82.7,
    previousValue: 81.9,
    trend: 'up',
    trendPercentage: 0.98,
    category: 'attendance',
    description: 'Incremento en los índices de asistencia'
  },
  {
    id: '4',
    title: 'Alertas Resueltas',
    value: 74.2,
    previousValue: 69.8,
    trend: 'up',
    trendPercentage: 6.3,
    category: 'behavioral',
    description: 'Mayor efectividad en la resolución de alertas'
  }
];

const mockPredictiveInsights: PredictiveInsight[] = [
  {
    id: '1',
    type: 'risk_prediction',
    title: 'Riesgo de Deserción - Próximos 3 Meses',
    description: 'Se identificaron 23 estudiantes con alto riesgo de abandono académico basado en patrones de comportamiento actuales.',
    confidence: 87.3,
    impact: 'high',
    timeframe: '3 meses',
    affectedStudents: 23,
    recommendedActions: [
      'Implementar programa de tutoría personalizada',
      'Contacto inmediato con padres/tutores',
      'Evaluación psicopedagógica',
      'Plan de apoyo financiero si es necesario'
    ]
  },
  {
    id: '2',
    type: 'performance_forecast',
    title: 'Proyección de Rendimiento - Fin de Semestre',
    description: 'El 68% de estudiantes mantendrá o mejorará su rendimiento actual. Se proyecta una mejora del 3.2% en el promedio general.',
    confidence: 91.7,
    impact: 'medium',
    timeframe: '2 meses',
    affectedStudents: 847,
    recommendedActions: [
      'Reforzar metodologías exitosas',
      'Identificar y replicar mejores prácticas',
      'Programa de reconocimiento académico'
    ]
  },
  {
    id: '3',
    type: 'intervention_recommendation',
    title: 'Optimización de Horarios de Clase',
    description: 'Los datos sugieren que clases después de las 4 PM tienen 23% menos asistencia. Recomendar redistribución horaria.',
    confidence: 79.8,
    impact: 'medium',
    timeframe: 'Inmediato',
    affectedStudents: 312,
    recommendedActions: [
      'Reubicar clases críticas en horarios matutinos',
      'Implementar clases híbridas para horarios tardíos',
      'Encuesta de preferencias horarias'
    ]
  }
];

const mockPatterns: Pattern[] = [
  {
    id: '1',
    name: 'Patrón de Ausentismo Post-Examen',
    description: 'Los estudiantes tienden a faltar 2-3 días después de exámenes importantes',
    frequency: 67.8,
    severity: 'medium',
    categories: ['Asistencia', 'Comportamiento'],
    examples: [
      'Matemática Aplicada III - 72% de ausentismo post-parcial',
      'Física Cuántica - 61% de ausentismo post-final'
    ]
  },
  {
    id: '2',
    name: 'Correlación Rendimiento-Participación',
    description: 'Estudiantes con baja participación en clase tienen 3.2x más probabilidad de bajo rendimiento',
    frequency: 84.3,
    severity: 'high',
    categories: ['Académico', 'Comportamental'],
    examples: [
      'Identificados 34 estudiantes con patrón de riesgo',
      'Correlación estadísticamente significativa (p<0.01)'
    ]
  },
  {
    id: '3',
    name: 'Efecto Día de la Semana',
    description: 'Los viernes muestran 28% menos asistencia y 15% menor rendimiento en evaluaciones',
    frequency: 91.2,
    severity: 'low',
    categories: ['Asistencia', 'Académico'],
    examples: [
      'Asistencia viernes: 71.3% vs promedio semanal: 89.1%',
      'Rendimiento evaluaciones viernes: 7.1 vs promedio: 8.3'
    ]
  }
];

const mockTimeSeriesData: TimeSeriesData[] = [
  { period: 'Ene', academicPerformance: 7.2, attendanceRate: 85.3, riskScore: 23.1, alertsGenerated: 45 },
  { period: 'Feb', academicPerformance: 7.4, attendanceRate: 83.7, riskScore: 25.8, alertsGenerated: 52 },
  { period: 'Mar', academicPerformance: 7.6, attendanceRate: 87.2, riskScore: 21.3, alertsGenerated: 38 },
  { period: 'Abr', academicPerformance: 7.8, attendanceRate: 82.1, riskScore: 28.4, alertsGenerated: 61 },
  { period: 'May', academicPerformance: 7.9, attendanceRate: 85.9, riskScore: 19.7, alertsGenerated: 34 },
  { period: 'Jun', academicPerformance: 8.1, attendanceRate: 88.4, riskScore: 16.2, alertsGenerated: 28 }
];

const performanceByCategory = [
  { category: 'Matemáticas', performance: 7.8, students: 234, improvement: 12.3 },
  { category: 'Ciencias', performance: 8.2, students: 189, improvement: 8.7 },
  { category: 'Humanidades', performance: 8.4, students: 156, improvement: 5.2 },
  { category: 'Ingeniería', performance: 7.6, students: 287, improvement: 15.8 },
  { category: 'Tecnología', performance: 8.0, students: 198, improvement: 9.4 }
];

const riskDistribution = [
  { name: 'Bajo Riesgo', value: 68.3, color: '#22c55e' },
  { name: 'Riesgo Medio', value: 23.7, color: '#eab308' },
  { name: 'Alto Riesgo', value: 8.0, color: '#ef4444' }
];

const InsightsModule: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1m' | '3m' | '6m' | '1y'>('3m');
  // const [selectedCategory, setSelectedCategory] = useState<'all' | 'academic' | 'behavioral' | 'attendance' | 'risk'>('all');

  const filteredMetrics = useMemo(() => {
    return mockMetrics;
  }, []);

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <ArrowUp className="w-4 h-4 text-green-500" />;
      case 'down': return <ArrowDown className="w-4 h-4 text-red-500" />;
      case 'stable': return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      case 'stable': return 'text-gray-600';
    }
  };

  const getImpactColor = (impact: 'high' | 'medium' | 'low') => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getSeverityColor = (severity: 'high' | 'medium' | 'low') => {
    switch (severity) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <Brain className="w-8 h-8 text-blue-500 mr-3" />
                Analytics & Insights Académicos
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Análisis predictivo y patrones de comportamiento estudiantil
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value as '1m' | '3m' | '6m' | '1y')}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="1m">Último mes</option>
                <option value="3m">Últimos 3 meses</option>
                <option value="6m">Últimos 6 meses</option>
                <option value="1y">Último año</option>
              </select>
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="w-4 h-4 mr-2" />
                Exportar Reporte
              </button>
              <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualizar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {filteredMetrics.map((metric) => (
            <div key={metric.id} className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-blue-100">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
                {getTrendIcon(metric.trend)}
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">{metric.title}</p>
                <p className="text-2xl font-bold text-gray-900">{metric.value.toFixed(1)}</p>
                
                <div className="flex items-center space-x-2">
                  <span className={`text-sm font-medium ${getTrendColor(metric.trend)}`}>
                    {metric.trend === 'up' ? '+' : metric.trend === 'down' ? '-' : ''}
                    {Math.abs(metric.trendPercentage)}%
                  </span>
                  {metric.previousValue && (
                    <span className="text-xs text-gray-400">
                      vs {metric.previousValue.toFixed(1)} anterior
                    </span>
                  )}
                </div>
                
                <p className="text-xs text-gray-600 mt-2">{metric.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Insights Predictivos */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Zap className="w-5 h-5 text-yellow-500 mr-2" />
                  Insights Predictivos
                </h3>
                <span className="text-sm text-gray-500">Basado en IA y Machine Learning</span>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {mockPredictiveInsights.map((insight) => (
                <div key={insight.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Lightbulb className="w-5 h-5 text-blue-500" />
                        <h4 className="text-lg font-semibold text-gray-900">{insight.title}</h4>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getImpactColor(insight.impact)}`}>
                          {insight.impact.charAt(0).toUpperCase() + insight.impact.slice(1)} Impact
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-4">{insight.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="text-sm">
                          <span className="font-medium text-gray-700">Confianza:</span>
                          <div className="mt-1">
                            <div className="flex items-center space-x-2">
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-green-500 h-2 rounded-full" 
                                  style={{ width: `${insight.confidence}%` }}
                                ></div>
                              </div>
                              <span className="text-xs font-medium">{insight.confidence.toFixed(1)}%</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-sm">
                          <span className="font-medium text-gray-700">Plazo:</span>
                          <p className="text-gray-600">{insight.timeframe}</p>
                        </div>
                        
                        <div className="text-sm">
                          <span className="font-medium text-gray-700">Estudiantes Afectados:</span>
                          <p className="text-blue-600 font-semibold">{insight.affectedStudents}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Acciones Recomendadas:</h5>
                    <ul className="space-y-1">
                      {insight.recommendedActions.map((action, index) => (
                        <li key={index} className="flex items-start space-x-2 text-sm text-gray-600">
                          <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Gráficos de análisis */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          {/* Tendencias temporales */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendencias Temporales</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockTimeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="academicPerformance" stroke="#3b82f6" strokeWidth={2} name="Rendimiento" />
                <Line type="monotone" dataKey="attendanceRate" stroke="#10b981" strokeWidth={2} name="Asistencia %" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Distribución de riesgo */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución de Riesgo</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>

          {/* Rendimiento por categoría */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Rendimiento por Área</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceByCategory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="performance" fill="#8b5cf6" name="Promedio" />
                <Bar dataKey="improvement" fill="#f59e0b" name="Mejora %" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Alertas vs Riesgo */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Correlación Alertas-Riesgo</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={mockTimeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="alertsGenerated" stackId="1" stroke="#ef4444" fill="#ef4444" name="Alertas" />
                <Area type="monotone" dataKey="riskScore" stackId="2" stroke="#f59e0b" fill="#f59e0b" name="Score de Riesgo" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Patrones identificados */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Target className="w-5 h-5 text-purple-500 mr-2" />
              Patrones Identificados
            </h3>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockPatterns.map((pattern) => (
                <div key={pattern.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">{pattern.name}</h4>
                    <div className={`w-3 h-3 rounded-full ${getSeverityColor(pattern.severity)}`} title={`Severidad: ${pattern.severity}`}></div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{pattern.description}</p>
                  
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700">Frecuencia:</span>
                      <span className="font-semibold">{pattern.frequency}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${pattern.frequency}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex flex-wrap gap-1">
                      {pattern.categories.map((category, index) => (
                        <span 
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-xs font-medium text-gray-700 mb-1">Ejemplos:</p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {pattern.examples.slice(0, 2).map((example, index) => (
                        <li key={index}>• {example}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default InsightsModule;