import React, { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { ProtectedRoute } from "../components/common/ProtectedRoute";
import { Plus, Trash2, Shield, Mail } from "lucide-react";
import { useAuth } from "../context/AuthContext";

type Role = "admin" | "teacher" | "specialist";

interface Row { id: string; name: string; email: string; role: Role; }

const AdminUsersInner: React.FC = () => {
  const { hasPermission } = useAuth();
  const [rows, setRows] = useState<Row[]>([
    { id: "1", name: "admin", email: "admin@uni.edu", role: "admin" },
    { id: "2", name: "docente1", email: "docente1@uni.edu", role: "teacher" },
    { id: "3", name: "esp1", email: "esp1@uni.edu", role: "specialist" },
  ]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("teacher");

  const addUser = () => {
    if (!hasPermission("user.create")) return;
    setRows(prev => [{ id: crypto.randomUUID(), name: email.split("@")[0], email, role }, ...prev]);
    setEmail("");
  };
  const remove = (id: string) => {
    if (!hasPermission("user.delete")) return;
    setRows(prev => prev.filter(r => r.id !== id));
  };

  return (
    <MainLayout currentPage="settings">
      {/* Skip link for accessibility */}
      <a href="#admin-users-main-content" className="sr-only focus:not-sr-only absolute top-2 left-2 bg-white text-blue-700 px-3 py-2 rounded shadow z-50">
        Saltar al contenido principal
      </a>
      <main id="admin-users-main-content" tabIndex={-1} className="space-y-6 outline-none" aria-label="Gestión de usuarios">
        <header>
          <h1 className="text-2xl font-bold text-gray-900">Usuarios</h1>
          <p className="text-sm text-gray-500">Crear/eliminar usuarios y asignar roles.</p>
        </header>

        <section className="rounded-xl border bg-white shadow-sm" aria-label="Formulario de nuevo usuario y lista de usuarios">
          <form
            className="grid gap-4 p-4 sm:grid-cols-3"
            onSubmit={e => { e.preventDefault(); addUser(); }}
            aria-label="Formulario para crear usuario"
          >
            <input
              type="email"
              placeholder="email@uni.edu"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="rounded-md border px-3 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"
              aria-label="Correo electrónico del usuario"
              required
            />
            <select
              value={role}
              onChange={e => setRole(e.target.value as Role)}
              className="rounded-md border px-3 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"
              aria-label="Rol del usuario"
              required
            >
              <option value="teacher">Docente</option>
              <option value="specialist">Especialista</option>
              <option value="admin">Administrador</option>
            </select>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"
              aria-label="Crear usuario"
            >
              <Plus className="mr-2 h-4 w-4" /> Crear usuario
            </button>
          </form>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200" aria-label="Lista de usuarios">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rol</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {rows.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{r.name}</div>
                      <div className="text-sm text-gray-500">{r.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-800">
                        <Shield className="mr-1 h-3 w-3" /> {r.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          className="rounded-md border px-2.5 py-1.5 text-xs hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"
                          aria-label={`Invitar a ${r.name} (${r.email})`}
                        >
                          <Mail className="mr-1 inline h-3.5 w-3.5" /> Invitar
                        </button>
                        <button
                          onClick={() => remove(r.id)}
                          className="rounded-md border px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-600"
                          aria-label={`Eliminar usuario ${r.name} (${r.email})`}
                        >
                          <Trash2 className="mr-1 inline h-3.5 w-3.5" /> Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr><td colSpan={3} className="px-6 py-10 text-center text-sm text-gray-500">Sin usuarios.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </MainLayout>
  );
};

const AdminUsersPage: React.FC = () => (
  <ProtectedRoute roles={["admin"]}>
    <AdminUsersInner />
  </ProtectedRoute>
);

export default AdminUsersPage;
