import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  AlertCircle,
  BookOpen,
  Shield,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginErrors {
  email?: string;
  password?: string;
  general?: string;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<LoginErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Validación de email
  const validateEmail = (email: string): boolean =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Manejar cambios en los inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Limpiar errores cuando el usuario empiece a escribir
    if (errors[name as keyof LoginErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Validar formulario
  const validateForm = (): boolean => {
    const newErrors: LoginErrors = {};

    if (!formData.email) newErrors.email = "El email es requerido";
    else if (!validateEmail(formData.email))
      newErrors.email = "Por favor ingresa un email válido";

    if (!formData.password) newErrors.password = "La contraseña es requerida";
    else if (formData.password.length < 6)
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});
    try {
      // lee el checkbox "remember-me"
      const remember = (document.getElementById("remember-me") as HTMLInputElement)?.checked ?? true;
      await login(formData.email, formData.password, remember);
      navigate("/dashboard", { replace: true }); // <<— envía al dashboard
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_err) {
      setErrors({ general: "Credenciales inválidas" });
    } finally {
      setIsLoading(false);
    }
  };


  

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8" aria-label="Página de inicio de sesión">
      <a href="#loginform" className="sr-only focus:not-sr-only absolute top-2 left-2 bg-white text-blue-700 px-3 py-2 rounded shadow z-50">Saltar al formulario de inicio de sesión</a>
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <header className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 sm:p-3 rounded-xl sm:rounded-2xl shadow-lg">
              <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-white" aria-hidden="true" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Academic EWS</h1>
          <p className="text-sm sm:text-base text-gray-600 px-4">Early Warning System Academic</p>
        </header>

        {/* Login Form */}
        <section aria-labelledby="loginform-title" className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
          <form id="loginform" onSubmit={handleSubmit} autoComplete="on" aria-describedby={errors.general ? "loginform-error" : undefined}>
            <div className="flex items-center mb-4 sm:mb-6">
              <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mr-2" aria-hidden="true" />
              <h2 id="loginform-title" className="text-lg sm:text-xl font-semibold text-gray-900">Iniciar Sesión</h2>
            </div>

            {errors.general && (
              <div id="loginform-error" className="mb-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg flex items-start sm:items-center" aria-live="assertive" role="alert">
                <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5 sm:mt-0" aria-hidden="true" />
                <span className="text-red-700 text-xs sm:text-sm leading-relaxed">{errors.general}</span>
              </div>
            )}

            <div className="space-y-4 sm:space-y-6">
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Correo Electrónico</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`block w-full pl-9 sm:pl-10 pr-3 py-2.5 sm:py-3 text-sm sm:text-base border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${errors.email ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-gray-400"}`}
                    placeholder="ejemplo@universidad.edu"
                    disabled={isLoading}
                    required
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                </div>
                {errors.email && (
                  <p id="email-error" className="mt-1 text-xs sm:text-sm text-red-600 flex items-start" aria-live="polite">
                    <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <span className="leading-tight">{errors.email}</span>
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Contraseña</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`block w-full pl-9 sm:pl-10 pr-10 py-2.5 sm:py-3 text-sm sm:text-base border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${errors.password ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-gray-400"}`}
                    placeholder="••••••••"
                    disabled={isLoading}
                    required
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? "password-error" : undefined}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-blue-600 transition-colors touch-manipulation"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" aria-hidden="true" />
                    ) : (
                      <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" aria-hidden="true" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p id="password-error" className="mt-1 text-xs sm:text-sm text-red-600 flex items-start" aria-live="polite">
                    <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <span className="leading-tight">{errors.password}</span>
                  </p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-xs sm:text-sm text-gray-700">Recordarme</label>
                </div>
                <button
                  type="button"
                  className="text-xs sm:text-sm text-blue-600 hover:text-blue-500 font-medium transition-colors text-left sm:text-right focus:underline"
                  tabIndex={0}
                  aria-label="¿Olvidaste tu contraseña?"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-2.5 sm:py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center text-sm sm:text-base touch-manipulation focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2" aria-hidden="true"></div>
                    <span className="text-xs sm:text-sm">Iniciando sesión...</span>
                  </>
                ) : (
                  "Iniciar Sesión"
                )}
              </button>
            </div>

            {/* Additional Links */}
            <div className="mt-4 sm:mt-6 text-center">
              <p className="text-xs sm:text-sm text-gray-600 px-4">
                ¿No tienes cuenta?{" "}
                <button className="text-blue-600 hover:text-blue-500 font-medium transition-colors focus:underline" tabIndex={0} aria-label="Contacta al administrador">Contacta al administrador</button>
              </p>
            </div>
          </form>
        </section>

        {/* Footer */}
        <footer className="mt-6 sm:mt-8 text-center" aria-label="Pie de página">
          <p className="text-xs text-gray-500">Sistema de Alerta Temprana Académica v0.1</p>
        </footer>
      </div>
    </main>
  );
};

export default LoginPage;
