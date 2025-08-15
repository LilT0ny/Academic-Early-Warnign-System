import React, { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  FileText,
  AlertCircle,
  CheckCircle2,
  X,
  FileSpreadsheet,
  AlertTriangle,
  TrendingUp,
  Eye,
  Loader2,
  Info,
} from "lucide-react";

// Tipos
type FileStatus = "idle" | "uploading" | "validating" | "valid" | "invalid" | "processing" | "processed";

interface UploadedFile {
  file: File;
  id: string;
  status: FileStatus;
  validationErrors?: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  processedData?: any;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
  totalRows?: number;
  validRows?: number;
}

interface ProcessingResult {
  alertsCount: number;
  insightsGenerated: boolean;
  processedAt: string;
  summary: {
    totalRecords: number;
    studentsAffected: number;
    criticalAlerts: number;
    warnings: number;
  };
}

const FileUploadModule: React.FC = () => {
  const navigate = useNavigate();

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [currentFile, setCurrentFile] = useState<UploadedFile | null>(null);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [processingResult, setProcessingResult] = useState<ProcessingResult | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Simulación de validación del backend
  const mockValidateFile = async (file: File): Promise<ValidationResult> => {
    await new Promise((resolve) => setTimeout(resolve, 1200)); // Simula tiempo

    const fileName = file.name.toLowerCase();

    if (!fileName.endsWith(".csv") && !fileName.endsWith(".xlsx") && !fileName.endsWith(".xls")) {
      return {
        isValid: false,
        errors: ["Formato no soportado. Solo CSV, XLS y XLSX."],
      };
    }

    if (fileName.includes("error") || fileName.includes("mal")) {
      return {
        isValid: false,
        errors: [
          'Columna "nombre_estudiante" no encontrada',
          "Formato de fecha inválido en fila 15",
          'Valores duplicados en "id_estudiante"',
          "Caracteres especiales no permitidos en fila 23",
        ],
      };
    }

    if (fileName.includes("warning") || fileName.includes("alerta")) {
      return {
        isValid: true,
        errors: [],
        warnings: ["Campos opcionales vacíos", "3 registros con fechas futuras"],
        totalRows: 1250,
        validRows: 1247,
      };
    }

    return {
      isValid: true,
      errors: [],
      totalRows: 1500,
      validRows: 1500,
    };
  };

  // Simulación de procesamiento
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const mockProcessFile = async (_file: UploadedFile): Promise<ProcessingResult> => {
    await new Promise((resolve) => setTimeout(resolve, 1600)); // Simula tiempo
    return {
      alertsCount: Math.floor(Math.random() * 50) + 10,
      insightsGenerated: true,
      processedAt: new Date().toISOString(),
      summary: {
        totalRecords: 1500,
        studentsAffected: Math.floor(Math.random() * 300) + 100,
        criticalAlerts: Math.floor(Math.random() * 15) + 5,
        warnings: Math.floor(Math.random() * 25) + 10,
      },
    };
  };

  const generateFileId = () => Date.now().toString(36) + Math.random().toString(36).slice(2);

  const handleFileSelect = (files: FileList) => {
    const newFiles: UploadedFile[] = Array.from(files).map((file) => ({
      file,
      id: generateFileId(),
      status: "idle",
    }));
    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) handleFileSelect(files);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const validateFile = async (fileId: string) => {
    const fileIndex = uploadedFiles.findIndex((f) => f.id === fileId);
    if (fileIndex === -1) return;

    setUploadedFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, status: "validating" } : f)));

    try {
      const file = uploadedFiles[fileIndex];
      const result = await mockValidateFile(file.file);
      setValidationResult(result);
      setUploadedFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? { ...f, status: result.isValid ? "valid" : "invalid", validationErrors: result.errors }
            : f
        )
      );
      setCurrentFile(uploadedFiles[fileIndex]);
    } catch {
      setUploadedFiles((prev) =>
        prev.map((f) =>
          f.id === fileId ? { ...f, status: "invalid", validationErrors: ["Error de conexión con el servidor"] } : f
        )
      );
    }
  };

  const processFile = async (fileId: string) => {
    const fileIndex = uploadedFiles.findIndex((f) => f.id === fileId);
    if (fileIndex === -1) return;

    setUploadedFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, status: "processing" } : f)));

    try {
      const file = uploadedFiles[fileIndex];
      const result = await mockProcessFile(file);
      setProcessingResult(result);
      setUploadedFiles((prev) =>
        prev.map((f) => (f.id === fileId ? { ...f, status: "processed", processedData: result } : f))
      );
    } catch {
      setUploadedFiles((prev) =>
        prev.map((f) =>
          f.id === fileId ? { ...f, status: "invalid", validationErrors: ["Error durante el procesamiento"] } : f
        )
      );
    }
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
    if (currentFile && currentFile.id === fileId) {
      setCurrentFile(null);
      setValidationResult(null);
      setProcessingResult(null);
    }
  };

  const getStatusColor = (status: FileStatus) => {
    const colors: Record<FileStatus, string> = {
      idle: "text-gray-500 bg-gray-100",
      uploading: "text-blue-500 bg-blue-100",
      validating: "text-yellow-500 bg-yellow-100",
      valid: "text-green-500 bg-green-100",
      invalid: "text-red-500 bg-red-100",
      processing: "text-purple-500 bg-purple-100",
      processed: "text-emerald-500 bg-emerald-100",
    };
    return colors[status];
  };

  const getStatusText = (status: FileStatus) => {
    const texts: Record<FileStatus, string> = {
      idle: "Pendiente",
      uploading: "Subiendo...",
      validating: "Validando...",
      valid: "Válido",
      invalid: "Inválido",
      processing: "Procesando...",
      processed: "Procesado",
    };
    return texts[status];
  };

  const getFileIcon = (fileName: string) =>
    fileName.toLowerCase().endsWith(".csv") ? (
      <FileText className="w-8 h-8 text-green-500" />
    ) : (
      <FileSpreadsheet className="w-8 h-8 text-blue-500" />
    );

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  // Navegación real con react-router
  const navigateToAlerts = () => navigate("/alerts");
  // No tienes página de insights aún: lo mando al dashboard
  const navigateToInsights = () => navigate("/insights");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Contenido */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Panel de carga */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Subir Archivo</h2>

              {/* Zona de drop */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragOver ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-gray-400"
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                // Remove role="button" and tabIndex={0} to avoid making the div an interactive control
              >
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-sm text-gray-600 mb-2">
                  Arrastra archivos aquí o{" "}
                  <span
                    onClick={() => fileInputRef.current?.click()}
                    className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer underline"
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click();
                    }}
                  >
                    selecciona archivos
                  </span>
                </p>
                <p className="text-xs text-gray-500">CSV, XLS, XLSX hasta 10MB</p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".csv,.xlsx,.xls"
                multiple
                onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
              />

              {/* Info de formato */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start">
                  <Info className="w-5 h-5 text-blue-500 mt-0.5 mr-2" />
                  <div>
                    <h3 className="text-sm font-medium text-blue-900 mb-2">Formato requerido</h3>
                    <ul className="text-xs text-blue-700 space-y-1">
                      <li>• "id_estudiante" (requerida)</li>
                      <li>• "nombre_estudiante" (requerida)</li>
                      <li>• "fecha" (DD/MM/YYYY)</li>
                      <li>• "promedio" (numérico)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Panel principal */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {/* Lista de archivos */}
              {uploadedFiles.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Archivos Cargados</h3>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {uploadedFiles.map((file) => (
                      <div key={file.id} className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            {getFileIcon(file.file.name)}
                            <div>
                              <p className="text-sm font-medium text-gray-900">{file.file.name}</p>
                              <p className="text-sm text-gray-500">
                                {formatFileSize(file.file.size)} • {file.file.type || "Tipo desconocido"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(file.status)}`}>
                              {["validating", "processing"].includes(file.status) && (
                                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                              )}
                              {getStatusText(file.status)}
                            </span>

                            {file.status === "idle" && (
                              <button
                                onClick={() => validateFile(file.id)}
                                className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                              >
                                Validar
                              </button>
                            )}

                            {file.status === "valid" && (
                              <button
                                onClick={() => processFile(file.id)}
                                className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
                              >
                                Procesar
                              </button>
                            )}

                            <button onClick={() => removeFile(file.id)} className="p-1 text-gray-400 hover:text-red-500">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Errores de validación */}
                        {file.status === "invalid" && file.validationErrors && (
                          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-start">
                              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-2" />
                              <div className="flex-1">
                                <h4 className="text-sm font-medium text-red-900 mb-2">Errores de validación:</h4>
                                <ul className="text-sm text-red-700 space-y-1">
                                  {file.validationErrors.map((error, index) => (
                                    <li key={index}>• {error}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Advertencias */}
                        {file.status === "valid" && validationResult?.warnings && (
                          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <div className="flex items-start">
                              <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5 mr-2" />
                              <div className="flex-1">
                                <h4 className="text-sm font-medium text-yellow-900 mb-2">Advertencias:</h4>
                                <ul className="text-sm text-yellow-700 space-y-1">
                                  {validationResult.warnings.map((warning, index) => (
                                    <li key={index}>• {warning}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Validación OK sin warnings */}
                        {file.status === "valid" && validationResult && !validationResult.warnings && (
                          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-start">
                              <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 mr-2" />
                              <div>
                                <h4 className="text-sm font-medium text-green-900">¡Archivo válido!</h4>
                                <p className="text-sm text-green-700 mt-1">
                                  {validationResult.totalRows} filas procesadas correctamente
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Resultados del procesamiento */}
              {processingResult && (
                <div className="bg-white rounded-lg shadow-sm border">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Resultado del Procesamiento</h3>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-center">
                          <FileText className="w-8 h-8 text-blue-500" />
                          <div className="ml-3">
                            <p className="text-sm font-medium text-blue-900">Total Registros</p>
                            <p className="text-2xl font-bold text-blue-600">{processingResult.summary.totalRecords}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex items-center">
                          <TrendingUp className="w-8 h-8 text-green-500" />
                          <div className="ml-3">
                            <p className="text-sm font-medium text-green-900">Estudiantes Afectados</p>
                            <p className="text-2xl font-bold text-green-600">{processingResult.summary.studentsAffected}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-red-50 p-4 rounded-lg">
                        <div className="flex items-center">
                          <AlertTriangle className="w-8 h-8 text-red-500" />
                          <div className="ml-3">
                            <p className="text-sm font-medium text-red-900">Alertas Críticas</p>
                            <p className="text-2xl font-bold text-red-600">{processingResult.summary.criticalAlerts}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <div className="flex items-center">
                          <AlertCircle className="w-8 h-8 text-yellow-500" />
                          <div className="ml-3">
                            <p className="text-sm font-medium text-yellow-900">Advertencias</p>
                            <p className="text-2xl font-bold text-yellow-600">{processingResult.summary.warnings}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button
                        onClick={navigateToAlerts}
                        className="flex items-center justify-center px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700"
                      >
                        <AlertTriangle className="w-5 h-5 mr-2" />
                        Ver Alertas ({processingResult.alertsCount})
                      </button>

                      <button
                        onClick={navigateToInsights}
                        className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
                      >
                        <TrendingUp className="w-5 h-5 mr-2" />
                        Ver Insights
                      </button>

                      <button
                        onClick={() => setShowPreview(true)}
                        className="flex items-center justify-center px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700"
                      >
                        <Eye className="w-5 h-5 mr-2" />
                        Vista Previa
                      </button>
                    </div>

                    <p className="text-xs text-gray-500 mt-4">
                      Procesado el{" "}
                      {new Date(processingResult.processedAt).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              )}

              {/* Mensaje cuando no hay archivos */}
              {uploadedFiles.length === 0 && (
                <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                  <FileText className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No hay archivos cargados</h3>
                  <p className="text-gray-500">Sube un archivo CSV o Excel para comenzar.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal de vista previa (simple placeholder) */}
        {showPreview && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b">
                <h4 className="font-semibold">Vista previa</h4>
                <button onClick={() => setShowPreview(false)} className="p-1 rounded hover:bg-gray-100">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 text-sm text-gray-600">
                Aquí podrías mostrar las primeras filas del archivo o el resumen validado.
              </div>
              <div className="px-4 py-3 border-t flex justify-end gap-2">
                <button onClick={() => setShowPreview(false)} className="px-4 py-2 border rounded-md hover:bg-gray-50">
                  Cerrar
                </button>
                <button onClick={navigateToAlerts} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                  Ir a Alertas
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploadModule;
