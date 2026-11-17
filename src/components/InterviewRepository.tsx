import React, { useRef, useState } from 'react';
import {
  Copy,
  FileText,
  FolderOpen,
  Plus,
  Search,
  Sparkles,
  Trash2,
  Upload,
} from 'lucide-react';
import type { InterviewRecord, InterviewStatus } from '../types/interview';
import {
  formatDateEs,
  formatStatus,
  getOverallProgress,
  parseImportedInterviewJson,
} from '../utils/interviewMetrics';

interface InterviewRepositoryProps {
  interviews: InterviewRecord[];
  activeInterviewId: string;
  onSelectInterview: (id: string) => void;
  onViewSummary: (id: string) => void;
  onDuplicateInterview: (id: string) => void;
  onDeleteInterview: (id: string) => void;
  onCreateNew: () => void;
  onLoadSampleNew: () => void;
  onImportInterview: (record: InterviewRecord) => void;
}

export function InterviewRepository({
  interviews,
  activeInterviewId,
  onSelectInterview,
  onViewSummary,
  onDuplicateInterview,
  onDeleteInterview,
  onCreateNew,
  onLoadSampleNew,
  onImportInterview,
}: InterviewRepositoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'todas' | InterviewStatus>('todas');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = interviews.filter((item) => {
    const matchesStatus = statusFilter === 'todas' || item.status === statusFilter;
    const q = searchQuery.trim().toLowerCase();
    if (!q) return matchesStatus;
    const haystack = [
      item.contexto.empresa,
      item.contexto.entrevistadoNombre,
      item.contexto.sector,
      item.contexto.plantaOSede,
    ]
      .join(' ')
      .toLowerCase();
    return matchesStatus && haystack.includes(q);
  });

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportError(null);
    try {
      const text = await file.text();
      const parsed = parseImportedInterviewJson(text);
      if (!parsed) {
        setImportError(
          'El archivo no corresponde a una entrevista exportada de TrazaAudit.'
        );
      } else {
        onImportInterview(parsed);
      }
    } catch {
      setImportError('No se pudo leer el archivo seleccionado.');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Entrevistas guardadas
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Historial local de levantamientos de trazabilidad y procesos en este navegador.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleFileImport}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-md transition-colors whitespace-nowrap cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Importar JSON</span>
          </button>
          <button
            type="button"
            onClick={onLoadSampleNew}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-md transition-colors whitespace-nowrap cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Crear ejemplo completo</span>
          </button>
          <button
            type="button"
            onClick={onCreateNew}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-md transition-colors whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nueva entrevista</span>
          </button>
        </div>
      </div>

      {importError && (
        <div className="p-3 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-md">
          {importError}
        </div>
      )}

      {/* Search and filter bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por empresa, entrevistado o sector..."
            className="w-full h-10 pl-9 pr-3 text-sm bg-white border border-slate-200 rounded-md placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15"
          />
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-md self-start">
          {(
            [
              { id: 'todas', label: 'Todas' },
              { id: 'en_curso', label: 'En curso' },
              { id: 'revision', label: 'En revisión' },
              { id: 'completada', label: 'Completadas' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg p-12 text-center space-y-3">
          <p className="text-sm font-semibold text-slate-800">
            {interviews.length === 0
              ? 'No hay entrevistas guardadas todavía.'
              : 'Ninguna entrevista coincide con la búsqueda actual.'}
          </p>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Crea una nueva entrevista en blanco para comenzar el levantamiento o carga un ejemplo completo para revisar la estructura del informe.
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={onCreateNew}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-md transition-colors cursor-pointer"
            >
              Iniciar entrevista
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-lg overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
                <th className="py-3 px-4">Empresa y sede</th>
                <th className="py-3 px-4">Entrevistado</th>
                <th className="py-3 px-4">Sector</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4 text-right">Avance</th>
                <th className="py-3 px-4 text-right">Hallazgos</th>
                <th className="py-3 px-4 text-right">Fecha</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.map((item) => {
                const progress = getOverallProgress(item);
                const isCurrent = item.id === activeInterviewId;
                const isConfirmingDelete = confirmDeleteId === item.id;

                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      isCurrent ? 'bg-blue-50/30' : ''
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">
                        {item.contexto.empresa || 'Empresa sin especificar'}
                      </div>
                      <div className="text-xs text-slate-500">
                        {item.contexto.plantaOSede || 'Sin sede'}
                        {isCurrent && ' · Activa'}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-slate-800">
                        {item.contexto.entrevistadoNombre || '—'}
                      </div>
                      <div className="text-xs text-slate-500">
                        {item.contexto.entrevistadoCargo || ''}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-600">
                      {item.contexto.sector || '—'}
                    </td>
                    <td className="py-3 px-4 text-xs font-medium">
                      <span
                        className={
                          item.status === 'completada'
                            ? 'text-emerald-700'
                            : item.status === 'revision'
                            ? 'text-amber-700'
                            : 'text-blue-700'
                        }
                      >
                        {formatStatus(item.status)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-xs text-slate-800 tabular-nums">
                      {progress.percent}%
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-xs text-slate-800 tabular-nums">
                      {item.brechas.hallazgos.length}
                    </td>
                    <td className="py-3 px-4 text-right text-xs text-slate-600 tabular-nums whitespace-nowrap">
                      {formatDateEs(item.contexto.fechaEntrevista)}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      {isConfirmingDelete ? (
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              onDeleteInterview(item.id);
                              setConfirmDeleteId(null);
                            }}
                            className="px-2 py-1 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded cursor-pointer"
                          >
                            Confirmar
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(null)}
                            className="px-2 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => onSelectInterview(item.id)}
                            title="Abrir en formulario"
                            className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                          >
                            <FolderOpen className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onViewSummary(item.id)}
                            title="Ver resumen"
                            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDuplicateInterview(item.id)}
                            title="Duplicar entrevista"
                            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(item.id)}
                            title="Eliminar entrevista"
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
