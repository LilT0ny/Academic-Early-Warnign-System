// src/pages/HomePage.tsx
import React from "react";
import MainLayout from "../layouts/MainLayout";
import { AlertTriangle } from "lucide-react";

const kpiCard =
  "rounded-xl border bg-white p-4 shadow-sm hover:shadow-md transition-shadow";

const HomePage: React.FC = () => {
  return (
    <MainLayout currentPage="dashboard">
      {/* Greeting */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Hola 👋</h2>
        <p className="text-gray-600">
          Bienvenido al Sistema de Alerta Temprana Académica.
        </p>
      </section>

      {/* KPIs */}
      <section className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className={kpiCard}>
          <p className="text-sm text-gray-500">Estudiantes cargados</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">0</p>
        </div>
        <div className={kpiCard}>
          <p className="text-sm text-gray-500">Casos críticos</p>
          <div className="mt-1 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <p className="text-2xl font-bold text-gray-900">0</p>
          </div>
        </div>
        <div className={kpiCard}>
          <p className="text-sm text-gray-500">Última importación</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">—</p>
        </div>
        <div className={kpiCard}>
          <p className="text-sm text-gray-500">Notificaciones enviadas</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">0</p>
        </div>
      </section>

      {/* Placeholder */}
      <section className="rounded-2xl border bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900">Resumen</h3>
          <span className="text-sm text-gray-500">Aún sin datos</span>
        </div>
        <div className="grid place-items-center rounded-lg border border-dashed p-8 text-center text-gray-500">
          Sube un archivo CSV para ver métricas y registros aquí.
        </div>
      </section>
    </MainLayout>
  );
};

export default HomePage;
