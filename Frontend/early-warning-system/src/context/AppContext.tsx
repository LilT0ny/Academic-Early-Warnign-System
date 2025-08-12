import React, { createContext, useContext, useEffect, useState } from "react";

export type ScaleKey = "PHQ9" | "GAD7" | "PSS14" | "RSES";

export interface ScaleThresholds {
  low: number;      // inclusive
  medium: number;   // inclusive
  high: number;     // inclusive
  critical: number; // inclusive
}

export interface AlertRules {
  // Cuándo crear alerta automática según puntajes
  thresholds: Record<ScaleKey, ScaleThresholds>;
  // Si dos o más escalas están en high/critical -> escalar
  autoEscalate: boolean;
  // Días para seguimiento automático
  followUpDays: number;
  // Canales de notificación
  notifyEmail: boolean;
  notifyInApp: boolean;
  // Asignación por defecto
  defaultAssignee: "Docencia" | "Bienestar" | "Coordinación Académica";
}

interface AppContextValue {
  alertRules: AlertRules;
  setAlertRules: (next: AlertRules) => void;
}

const DEFAULT_RULES: AlertRules = {
  thresholds: {
    // Valores recomendados comunes (ajústalos a tu proyecto)
    // PHQ-9 depresión: 0–4 none, 5–9 mild, 10–14 moderate, 15–19 moderately severe, 20–27 severe
    PHQ9: { low: 5, medium: 10, high: 15, critical: 20 },
    // GAD-7 ansiedad: 0–4 none, 5–9 mild, 10–14 moderate, 15–21 severe
    GAD7: { low: 5, medium: 10, high: 15, critical: 18 },
    // PSS-14 estrés: 0–18 low, 19–37 moderate, 38–56 high (rango 0–56)
    PSS14: { low: 19, medium: 38, high: 46, critical: 52 },
    // RSES autoestima (0–30; menor es peor). Aquí invertimos: valores bajos son críticos
    // Para simplificar, trataremos RSES como “puntaje de riesgo invertido”: umbrales de corte
    RSES: { low: 20, medium: 17, high: 14, critical: 10 },
  },
  autoEscalate: true,
  followUpDays: 7,
  notifyEmail: true,
  notifyInApp: true,
  defaultAssignee: "Bienestar",
};

const AppContext = createContext<AppContextValue | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alertRules, setAlertRules] = useState<AlertRules>(() => {
    const raw = localStorage.getItem("alert_rules");
    return raw ? JSON.parse(raw) : DEFAULT_RULES;
  });

  useEffect(() => {
    localStorage.setItem("alert_rules", JSON.stringify(alertRules));
  }, [alertRules]);

  return (
    <AppContext.Provider value={{ alertRules, setAlertRules }}>
      {children}
    </AppContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};
