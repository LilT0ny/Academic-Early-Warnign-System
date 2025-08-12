import React, { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { ProtectedRoute } from "../components/common/ProtectedRoute";
import { Calendar, Clock, User, Plus, X } from "lucide-react";

interface Appt { id: string; student: string; date: string; time: string; notes?: string; }

const AppointmentsInner: React.FC = () => {
  const [items, setItems] = useState<Appt[]>([
    { id: "a1", student: "Ana García", date: "2025-08-15", time: "09:00", notes: "Seguimiento rendimiento" },
  ]);
  const [student, setStudent] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const add = () => {
    if (!student || !date || !time) return;
    setItems(prev => [{ id: crypto.randomUUID(), student, date, time }, ...prev]);
    setStudent(""); setDate(""); setTime("");
  };
  const cancel = (id: string) => setItems(prev => prev.filter(i => i.id !== id));

  return (
    <MainLayout currentPage="appointments">
      {/* Skip link for accessibility */}
      <a href="#appointments-main-content" className="sr-only focus:not-sr-only absolute top-2 left-2 bg-white text-blue-700 px-3 py-2 rounded shadow z-50">
        Saltar al contenido principal
      </a>
      <main id="appointments-main-content" tabIndex={-1} className="space-y-6 outline-none" aria-label="Gestión de citas">
        <header>
          <h1 className="text-2xl font-bold text-gray-900">Citas</h1>
          <p className="text-sm text-gray-500">Programa y gestiona citas con estudiantes en riesgo.</p>
        </header>

        <section className="rounded-xl border bg-white shadow-sm" aria-label="Formulario de nueva cita y lista de citas">
          <form
            className="grid gap-4 p-4 sm:grid-cols-4"
            onSubmit={e => { e.preventDefault(); add(); }}
            aria-label="Formulario para agendar cita"
          >
            <input
              className="rounded-md border px-3 py-2 text-sm sm:col-span-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"
              placeholder="Estudiante"
              value={student}
              onChange={e => setStudent(e.target.value)}
              aria-label="Nombre del estudiante"
              required
            />
            <input
              type="date"
              className="rounded-md border px-3 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"
              value={date}
              onChange={e => setDate(e.target.value)}
              aria-label="Fecha de la cita"
              required
            />
            <input
              type="time"
              className="rounded-md border px-3 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"
              value={time}
              onChange={e => setTime(e.target.value)}
              aria-label="Hora de la cita"
              required
            />
            <button
              type="submit"
              className="sm:col-span-4 inline-flex items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"
              aria-label="Agendar cita"
            >
              <Plus className="mr-2 h-4 w-4" /> Agendar
            </button>
          </form>

          <ul className="divide-y" aria-label="Lista de citas">
            {items.map(i => (
              <li key={i.id} className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-4">
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-700"><User className="mr-1 h-3 w-3" />{i.student}</span>
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs text-blue-700"><Calendar className="mr-1 h-3 w-3" />{i.date}</span>
                  <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs text-indigo-700"><Clock className="mr-1 h-3 w-3" />{i.time}</span>
                </div>
                <button
                  onClick={() => cancel(i.id)}
                  className="rounded-md border px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-600"
                  aria-label={`Cancelar cita con ${i.student} el ${i.date} a las ${i.time}`}
                >
                  <X className="mr-1 inline h-3.5 w-3.5" /> Cancelar
                </button>
              </li>
            ))}
            {items.length === 0 && <li className="px-6 py-10 text-center text-sm text-gray-500">No hay citas.</li>}
          </ul>
        </section>
      </main>
    </MainLayout>
  );
};

const AppointmentsPage: React.FC = () => (
  <ProtectedRoute roles={["teacher","specialist","admin"]}>
    <AppointmentsInner />
  </ProtectedRoute>
);

export default AppointmentsPage;
