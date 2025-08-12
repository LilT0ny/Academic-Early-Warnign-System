import type { AlertRules } from "../context/AppContext";
import type { ScaleKey } from "../context/AppContext";

// Detecta columnas por prefijo
const PREFIXES: Record<ScaleKey, string> = {
  PHQ9: "PHQ",
  GAD7: "GAD",
  PSS14: "PSS",
  RSES: "RSES",
};

export type ScoreOutput = {
  Cedula: string | number;
  PHQ9_total: number;
  PHQ9_level: "bajo" | "medio" | "alto" | "critico";
  GAD7_total: number;
  GAD7_level: "bajo" | "medio" | "alto" | "critico";
  PSS14_total: number;
  PSS14_level: "bajo" | "medio" | "alto" | "critico";
  RSES_total: number;
  RSES_level: "bajo" | "medio" | "alto" | "critico"; // aquí "bajo" es mejor, ojo
  RiskFlag: "normal" | "alerta" | "critico";
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toNum = (v: any) => (v === "" || v == null ? 0 : Number(v) || 0);

// devuelve suma de columnas que empiezan con el prefijo
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sumByPrefix(row: Record<string, any>, prefix: string) {
  return Object.entries(row)
    .filter(([k]) => k.toUpperCase().startsWith(prefix.toUpperCase()))
    .reduce((acc, [, v]) => acc + toNum(v), 0);
}

function interpretStraight(total: number, th: { low: number; medium: number; high: number; critical: number }) {
  if (total >= th.critical) return "critico";
  if (total >= th.high) return "alto";
  if (total >= th.medium) return "medio";
  if (total >= th.low) return "bajo";
  return "bajo"; // por debajo de low
}

// RSES: puntaje bajo es peor; interpretamos de forma inversa:
function interpretRSES(total: number, th: { low: number; medium: number; high: number; critical: number }) {
  // critical <= X < high <= X ... (cortes invertidos)
  if (total <= th.critical) return "critico";
  if (total <= th.high) return "alto";
  if (total <= th.medium) return "medio";
  // total >= low -> bajo (mejor)
  return "bajo";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function scoreRow(row: Record<string, any>, rules: AlertRules): ScoreOutput {
  const phq = sumByPrefix(row, PREFIXES.PHQ9);
  const gad = sumByPrefix(row, PREFIXES.GAD7);
  const pss = sumByPrefix(row, PREFIXES.PSS14);
  const rses = sumByPrefix(row, PREFIXES.RSES);

  const PHQ9_level = interpretStraight(phq, rules.thresholds.PHQ9) as ScoreOutput["PHQ9_level"];
  const GAD7_level = interpretStraight(gad, rules.thresholds.GAD7) as ScoreOutput["GAD7_level"];
  const PSS14_level = interpretStraight(pss, rules.thresholds.PSS14) as ScoreOutput["PSS14_level"];
  const RSES_level = interpretRSES(rses, rules.thresholds.RSES) as ScoreOutput["RSES_level"];

  const levels = [PHQ9_level, GAD7_level, PSS14_level, RSES_level];
  const highOrCritical = levels.filter((l) => l === "alto" || l === "critico").length;

  let RiskFlag: ScoreOutput["RiskFlag"] = "normal";
  if (levels.includes("critico")) RiskFlag = "critico";
  else if (levels.includes("alto") || levels.includes("medio")) RiskFlag = "alerta";

  // auto-escalado (regla):
  if (rules.autoEscalate && highOrCritical >= 2) RiskFlag = "critico";

  const Cedula = row["Cedula"] ?? row["Cédula"] ?? row["cedula"] ?? row["ID"] ?? "";

  return {
    Cedula,
    PHQ9_total: phq,
    PHQ9_level,
    GAD7_total: gad,
    GAD7_level,
    PSS14_total: pss,
    PSS14_level,
    RSES_total: rses,
    RSES_level,
    RiskFlag,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function toCSV(rows: Record<string, any>[]): string {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const lines = [
    headers.join(";"),
    ...rows.map((r) => headers.map((h) => r[h]).join(";")),
  ];
  return lines.join("\n");
}
