import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Mail,
  Lock,
  User,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  Shield,
} from "lucide-react";
import { Input } from "../components/common/Input";
import { Button } from "../components/common/Button";

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirm: string;
  acceptTerms: boolean;
}

interface RegisterErrors {
  name?: string;
  email?: string;
  password?: string;
  confirm?: string;
  acceptTerms?: string;
  general?: string;
}

const validateEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// al menos 8, 1 mayús, 1 minús, 1 número
const strongPassword = (pwd: string) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(pwd);

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<RegisterForm>({
    name: "",
    email: "",
    password: "",
    confirm: "",
    acceptTerms: false,
  });
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [okMsg, setOkMsg] = useState<string | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
    if (errors[name as keyof RegisterErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const e: RegisterErrors = {};
    if (!form.name.trim()) e.name = "Tu nombre es requerido";
    if (!form.email) e.email = "El correo es requerido";
    else if (!validateEmail(form.email)) e.email = "Correo no válido";
    if (!form.password) e.password = "La contraseña es requerida";
    else if (!strongPassword(form.password))
      e.password = "Mínimo 8 caracteres, 1 mayúscula, 1 minúscula y 1 número";
    if (!form.confirm) e.confirm = "Confirma tu contraseña";
    else if (form.confirm !== form.password)
      e.confirm = "Las contraseñas no coinciden";
    if (!form.acceptTerms) e.acceptTerms = "Debes aceptar los términos";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setErrors({});
    setOkMsg(null);

    try {
      // TODO: integrar con Supabase:
      // const { data, error } = await supabase.auth.signUp({
      //   email: form.email,
      //   password: form.password,
      //   options: { data: { name: form.name } }
      // });
      // if (error) throw error;

      // Simulación
      await new Promise((r) => setTimeout(r, 1200));

      setOkMsg(
        "Cuenta creada correctamente. Te redirigimos al inicio de sesión…"
      );
      setTimeout(() => navigate("/login"), 1400);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setErrors({ general: "No se pudo crear la cuenta. Intenta nuevamente." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex items-center justify-center px-4 py-8" aria-label="Página de registro">
      <a href="#registerform" className="sr-only focus:not-sr-only absolute top-2 left-2 bg-white text-blue-700 px-3 py-2 rounded shadow z-50">Saltar al formulario de registro</a>
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <header className="text-center">
          <div className="mx-auto mb-4 w-fit rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-3 shadow-lg">
            <Shield className="h-7 w-7 text-white" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Crear cuenta</h1>
          <p className="mt-1 text-gray-600 text-sm">Academic EWS — Registro</p>
        </header>

        {/* Card */}
        <section aria-labelledby="registerform-title" className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xl">
          <form
            id="registerform"
            onSubmit={onSubmit}
            className="space-y-4"
            noValidate
            aria-describedby={errors.general ? "registerform-error" : undefined}
          >
            {errors.general && (
              <div id="registerform-error" className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700" aria-live="assertive" role="alert">
                <AlertCircle className="mt-0.5 h-4 w-4" aria-hidden="true" />
                <span>{errors.general}</span>
              </div>
            )}
            {okMsg && (
              <div className="flex items-start gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700" aria-live="polite" role="status">
                <CheckCircle className="mt-0.5 h-4 w-4" aria-hidden="true" />
                <span>{okMsg}</span>
              </div>
            )}

            {/* Name */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="name">Nombre completo</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <Input
                  id="name"
                  name="name"
                  placeholder="Nombre y apellido"
                  value={form.name}
                  onChange={onChange}
                  className="pl-10"
                  error={errors.name}
                  required
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "name-error" : undefined}
                />
              </div>
              {errors.name && (
                <p id="name-error" className="text-sm text-red-600 mt-1" aria-live="polite">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="email">Correo institucional</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="usuario@universidad.edu"
                  value={form.email}
                  onChange={onChange}
                  className="pl-10"
                  error={errors.email}
                  required
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
              </div>
              {errors.email && (
                <p id="email-error" className="text-sm text-red-600 mt-1" aria-live="polite">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="password">Contraseña</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <Input
                  id="password"
                  name="password"
                  type={showPwd ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={onChange}
                  className="pl-10 pr-10"
                  error={errors.password}
                  helperText="Mín. 8 caracteres, 1 mayúscula, 1 minúscula y 1 número"
                  required
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? "password-error" : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 focus:underline"
                  aria-label={showPwd ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPwd ? (
                    <EyeOff className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <Eye className="h-5 w-5" aria-hidden="true" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p id="password-error" className="text-sm text-red-600 mt-1" aria-live="polite">{errors.password}</p>
              )}
            </div>

            {/* Confirm */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="confirm">Confirmar contraseña</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <Input
                  id="confirm"
                  name="confirm"
                  type={showConfirm ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.confirm}
                  onChange={onChange}
                  className="pl-10 pr-10"
                  error={errors.confirm}
                  required
                  aria-invalid={!!errors.confirm}
                  aria-describedby={errors.confirm ? "confirm-error" : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 focus:underline"
                  aria-label={showConfirm ? "Ocultar confirmación" : "Mostrar confirmación"}
                >
                  {showConfirm ? (
                    <EyeOff className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <Eye className="h-5 w-5" aria-hidden="true" />
                  )}
                </button>
              </div>
              {errors.confirm && (
                <p id="confirm-error" className="text-sm text-red-600 mt-1" aria-live="polite">{errors.confirm}</p>
              )}
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2">
              <input
                id="acceptTerms"
                name="acceptTerms"
                type="checkbox"
                checked={form.acceptTerms}
                onChange={onChange}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                required
                aria-invalid={!!errors.acceptTerms}
                aria-describedby={errors.acceptTerms ? "acceptTerms-error" : undefined}
              />
              <label htmlFor="acceptTerms" className="text-sm text-gray-700">Acepto los términos y la política de privacidad</label>
            </div>
            {errors.acceptTerms && (
              <p id="acceptTerms-error" className="text-sm text-red-600 -mt-2" aria-live="polite">{errors.acceptTerms}</p>
            )}

            {/* Submit */}
            <Button type="submit" isLoading={loading} className="w-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600">
              Crear cuenta
            </Button>

            {/* Link to login */}
            <p className="pt-1 text-center text-sm text-gray-600">
              ¿Ya tienes cuenta?{" "}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 focus:underline">Inicia sesión</Link>
            </p>
          </form>
        </section>

        {/* Footer */}
        <footer className="text-center mt-6" aria-label="Pie de página">
          <p className="text-xs text-gray-500">Sistema de Alerta Temprana Académica v0.1</p>
        </footer>
      </div>
    </main>
  );
};

export default RegisterPage;
