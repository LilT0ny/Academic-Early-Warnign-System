import * as XLSX from "xlsx";

/**
 * Lee la primera fila como encabezados y devuelve un array de objetos {col: valor}
 */
export async function readExcelFile(file: File): Promise<{ rows: Record<string, unknown>[]; sheetNames: string[]; workbook: XLSX.WorkBook; }> {
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });
  return { rows, sheetNames: workbook.SheetNames, workbook };
}

export function readSheet(workbook: XLSX.WorkBook, sheetName: string) {
  const sheet = workbook.Sheets[sheetName];
  return XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });
}
