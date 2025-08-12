import React, { useRef, useState } from "react";
import { X, UploadCloud } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  onProcessed?: (rows: number) => void; // callback mock
}

const UploadCSVModal: React.FC<Props> = ({ open, onClose, onProcessed }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>("");

  if (!open) return null;

  const handleFile = () => {
    const f = inputRef.current?.files?.[0];
    if (!f) return;
    setFileName(f.name);
  };

  const process = () => {
    // MOCK: simulamos procesamiento
    setTimeout(() => {
      onProcessed?.(Math.floor(Math.random() * 250 + 50));
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h3 className="text-lg font-semibold text-gray-900">Subir CSV</h3>
          <button className="rounded p-1 text-gray-400 hover:bg-gray-100" onClick={onClose} aria-label="Cerrar">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-4 px-5 py-5">
          <div className="rounded-lg border border-dashed p-6 text-center">
            <UploadCloud className="mx-auto mb-2 h-8 w-8 text-gray-500" />
            <p className="text-sm text-gray-700">Selecciona tu archivo CSV (delimitado por ;)</p>
            <input ref={inputRef} type="file" accept=".csv" onChange={handleFile} className="mt-3" />
            {fileName && <p className="mt-2 text-xs text-gray-500">Archivo: {fileName}</p>}
          </div>
          <button
            disabled={!fileName}
            onClick={process}
            className="w-full rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            Procesar archivo
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadCSVModal;
