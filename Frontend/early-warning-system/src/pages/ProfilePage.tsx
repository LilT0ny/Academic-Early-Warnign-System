import React, { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { useAuth } from "../context/AuthContext";
import { Save } from "lucide-react";

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email] = useState(user?.email || "");

  const save = () => {
    alert("(mock) Perfil actualizado");
  };

  return (
    <MainLayout currentPage="settings">
      <main className="space-y-6" aria-label="Perfil de usuario">
        <a href="#profileform" className="sr-only focus:not-sr-only absolute top-2 left-2 bg-white text-blue-700 px-3 py-2 rounded shadow z-50">Saltar al formulario de perfil</a>
        <h1 className="text-2xl font-bold text-gray-900">Perfil</h1>
        <section className="rounded-xl border bg-white p-4 shadow-sm sm:p-6 max-w-xl" aria-labelledby="profileform-title">
          <form id="profileform" className="space-y-4" onSubmit={e => { e.preventDefault(); save(); }} autoComplete="on">
            <h2 id="profileform-title" className="sr-only">Editar perfil</h2>
            <div>
              <label htmlFor="name" className="mb-1 block text-sm font-medium">Nombre</label>
              <input
                id="name"
                name="name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                aria-required="true"
                autoComplete="name"
              />
            </div>
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium">Correo</label>
              <input
                id="email"
                name="email"
                value={email}
                disabled
                className="w-full rounded-md border bg-gray-50 px-3 py-2 text-sm"
                aria-readonly="true"
                autoComplete="email"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"
            >
              <Save className="mr-2 h-4 w-4" aria-hidden="true" /> Guardar cambios
            </button>
          </form>
        </section>
      </main>
    </MainLayout>
  );
};

export default ProfilePage;
