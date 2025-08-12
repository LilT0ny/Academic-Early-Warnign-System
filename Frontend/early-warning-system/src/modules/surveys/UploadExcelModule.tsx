import React, { useMemo, useRef, useState } from "react";
import { readExcelFile, readSheet } from "../../utils/excel";
import { scoreRow, toCSV } from "../../utils/scoring";
import { useApp } from "../../context/AppContext";
import { UploadCloud, FileSpreadsheet, Download, Search } from "lucide-react";

type ProcessedRow = ReturnType<typeof scoreRow>;

const badgeRisk: Record<ProcessedRow["RiskFlag"], string> = {
  normal: "bg-green-100 text-green-800",
  alerta: "bg-yellow-100 text-yellow-800",
  critico: "bg-red-100 text-red-800",
};

const UploadExcelModule: React.FC = () => {
  const { alertRules } = useApp();
  const fileRef = useRef<HTMLInputElement>(null);

  const [workbookState, setWorkbookState] = useState<{
    fileName?: string;
    sheetNames: string[];
    activeSheet: string | null;
    rawRows: Record<string, unknown>[];
  }>({ sheetNames: [], activeSheet: null, rawRows: [] });

  const [processed, setProcessed] = useState<ProcessedRow[]>([]);
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState<ProcessedRow["RiskFlag"] | "all">("all");

  const onFile = async () => {
    const f = fileRef.current?.files?.[0];
    if (!f) return;
    const { rows, sheetNames, workbook } = await readExcelFile(f);
    setWorkbookState({
      fileName: f.name,
      sheetNames,
      activeSheet: sheetNames[0] ?? null,
      rawRows: rows,
    });
    setProcessed([]); // hasta que presione procesar
    // guardamos wb en un prop? no: leeremos por nombre releyendo el buffer, más simple
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).__xlsx_wb = workbook; // truco simple para no re-leer buffer
  };

  const switchSheet = (name: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const wb = (window as any).__xlsx_wb;
    if (!wb) return;
    const rows = readSheet(wb, name);
    setWorkbookState((s) => ({ ...s, activeSheet: name, rawRows: rows }));
    setProcessed([]);
  };

  const process = () => {
    if (!workbookState.rawRows.length) return;
    const out = workbookState.rawRows.map((r) => scoreRow(r, alertRules));
    setProcessed(out);
  };

  const filtered = useMemo(() => {
    const s = search.toLowerCase();
    return processed.filter((r) => {
      const matches =
        String(r.Cedula).toLowerCase().includes(s) ||
        Object.values(r).some((v) => String(v).toLowerCase().includes(s));
      const riskOk = riskFilter === "all" || r.RiskFlag === riskFilter;
      return matches && riskOk;
    });
  }, [processed, search, riskFilter]);

  const downloadCSV = () => {
    const csv = toCSV(filtered);
    const blob = new Blob([csv], { type: "text/csv;charset=latin1" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resultados_encuesta.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const summary = useMemo(() => {
    const total = processed.length;
    const byRisk = {
      normal: processed.filter((p) => p.RiskFlag === "normal").length,
      alerta: processed.filter((p) => p.RiskFlag === "alerta").length,
      critico: processed.filter((p) => p.RiskFlag === "critico").length,
    };
    return { total, ...byRisk };
  }, [processed]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Procesar Encuesta (Excel)</h1>
        <p className="text-sm text-gray-500">Carga un archivo Excel, procesa puntajes e interpreta resultados.</p>
      </div>

      {/* Uploader */}
      <section className="rounded-xl border bg-white p-4 shadow-sm sm:p-6">
        <div className="grid gap-4 sm:grid-cols-4">
          <div className="sm:col-span-3">
            <div className="rounded-lg border border-dashed p-4 text-center">
              <UploadCloud className="mx-auto mb-2 h-8 w-8 text-gray-500" />
              <p className="text-sm text-gray-700">
                Selecciona un archivo <strong>.xlsx</strong> / <strong>.xls</strong> con encabezados.
              </p>
              <input ref={fileRef} type="file" accept=".xlsx,.xls" onChange={onFile} className="mt-3" />
              {workbookState.fileName && (
                <p className="mt-2 text-xs text-gray-500">Archivo: {workbookState.fileName}</p>
              )}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Hoja</label>
            <select
              disabled={!workbookState.sheetNames.length}
              value={workbookState.activeSheet ?? ""}
              onChange={(e) => switchSheet(e.target.value)}
              className="w-full rounded-md border px-3 py-2 text-sm"
            >
              {!workbookState.sheetNames.length ? (
                <option>—</option>
              ) : (
                workbookState.sheetNames.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))
              )}
            </select>

            <button
              onClick={process}
              disabled={!workbookState.rawRows.length}
              className="mt-3 inline-flex w-full items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Procesar archivo
            </button>
          </div>
        </div>
      </section>

      {/* Resumen */}
      {processed.length > 0 && (
        <section className="rounded-xl border bg-white p-4 shadow-sm sm:p-6">
          <h2 className="mb-3 text-base font-semibold text-gray-900">Resumen</h2>
          <div className="grid gap-3 sm:grid-cols-4">
            <div className="rounded-lg border p-3">
              <p className="text-sm text-gray-500">Registros</p>
              <p className="text-2xl font-bold">{summary.total}</p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-sm text-gray-500">Normal</p>
              <p className="text-2xl font-bold text-green-600">{summary.normal}</p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-sm text-gray-500">Alerta</p>
              <p className="text-2xl font-bold text-amber-600">{summary.alerta}</p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-sm text-gray-500">Crítico</p>
              <p className="text-2xl font-bold text-red-600">{summary.critico}</p>
            </div>
          </div>
        </section>
      )}

      {/* Filtros / acciones */}
      {processed.length > 0 && (
        <section className="rounded-xl border bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-md flex-1">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar por cédula o valores…"
                  className="block w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={riskFilter}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(e) => setRiskFilter(e.target.value as any)}
                className="rounded-md border px-3 py-2 text-sm"
              >
                <option value="all">Todos</option>
                <option value="normal">Normal</option>
                <option value="alerta">Alerta</option>
                <option value="critico">Crítico</option>
              </select>
              <button
                onClick={downloadCSV}
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium hover:bg-gray-50"
              >
                <Download className="mr-2 h-4 w-4" />
                Descargar CSV
              </button>
            </div>
          </div>

          {/* Tabla */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    "Cédula",
                    "PHQ9 total",
                    "PHQ9 nivel",
                    "GAD7 total",
                    "GAD7 nivel",
                    "PSS14 total",
                    "PSS14 nivel",
                    "RSES total",
                    "RSES nivel",
                    "Riesgo",
                  ].map((h) => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filtered.map((r, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm text-gray-900">{r.Cedula}</td>
                    <td className="px-6 py-3 text-sm">{r.PHQ9_total}</td>
                    <td className="px-6 py-3 text-sm capitalize">{r.PHQ9_level}</td>
                    <td className="px-6 py-3 text-sm">{r.GAD7_total}</td>
                    <td className="px-6 py-3 text-sm capitalize">{r.GAD7_level}</td>
                    <td className="px-6 py-3 text-sm">{r.PSS14_total}</td>
                    <td className="px-6 py-3 text-sm capitalize">{r.PSS14_level}</td>
                    <td className="px-6 py-3 text-sm">{r.RSES_total}</td>
                    <td className="px-6 py-3 text-sm capitalize">{r.RSES_level}</td>
                    <td className="px-6 py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeRisk[r.RiskFlag]}`}>
                        {r.RiskFlag}
                      </span>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={10} className="px-6 py-10 text-center text-sm text-gray-500">
                      No hay registros que coincidan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
};

export default UploadExcelModule;
