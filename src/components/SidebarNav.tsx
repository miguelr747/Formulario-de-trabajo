import { CheckCircle2, FileText, Sparkles } from 'lucide-react';
import { SECTIONS } from '../data/interviewCatalog';
import type {
  InterviewRecord,
  InterviewStatus,
  SectionId,
} from '../types/interview';
import { getOverallProgress, getSectionProgress } from '../utils/interviewMetrics';

interface SidebarNavProps {
  interview: InterviewRecord;
  activeSection: SectionId;
  onSelectSection: (section: SectionId) => void;
  onUpdateStatus: (status: InterviewStatus) => void;
  onUpdateNotes: (notes: string) => void;
  onLoadSample: () => void;
  onOpenSummary: () => void;
}

export function SidebarNav({
  interview,
  activeSection,
  onSelectSection,
  onUpdateStatus,
  onUpdateNotes,
  onLoadSample,
  onOpenSummary,
}: SidebarNavProps) {
  const overall = getOverallProgress(interview);
  const isVirtuallyEmpty = overall.filled === 0 && !interview.contexto.empresa;

  return (
    <aside className="w-full lg:w-[272px] shrink-0 bg-white border-r border-slate-200 flex flex-col h-full">
      <div className="p-5 border-b border-slate-200 space-y-3">
        <div>
          <p className="text-xs font-medium text-slate-500">
            Entrevista activa
          </p>
          <h2 className="text-sm font-bold text-slate-900 truncate mt-0.5">
            {interview.contexto.empresa || 'Empresa sin especificar'}
          </h2>
          <p className="text-xs text-slate-500 truncate mt-0.5">
            {interview.contexto.entrevistadoNombre
              ? `${interview.contexto.entrevistadoNombre}${
                  interview.contexto.entrevistadoCargo
                    ? ` · ${interview.contexto.entrevistadoCargo}`
                    : ''
                }`
              : 'Sin entrevistado asignado'}
          </p>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">Avance general</span>
            <span className="font-mono font-semibold text-slate-900 tabular-nums">
              {overall.percent}% ({overall.filled}/{overall.total})
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-700 transition-all duration-200"
              style={{ width: `${overall.percent}%` }}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="sidebar-status"
            className="block text-xs font-medium text-slate-500 mb-1"
          >
            Estado de la sesión
          </label>
          <select
            id="sidebar-status"
            value={interview.status}
            onChange={(e) => onUpdateStatus(e.target.value as InterviewStatus)}
            className="w-full h-9 px-2.5 text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:border-blue-600"
          >
            <option value="en_curso">En curso</option>
            <option value="revision">En revisión</option>
            <option value="completada">Completada</option>
          </select>
        </div>
      </div>

      <nav className="p-3 space-y-1 flex-1 overflow-y-auto" aria-label="Secciones de entrevista">
        {SECTIONS.map((sec) => {
          const progress = getSectionProgress(interview, sec.id);
          const isActive = activeSection === sec.id;
          const isComplete = progress.filled === progress.total && progress.total > 0;

          return (
            <button
              key={sec.id}
              type="button"
              onClick={() => onSelectSection(sec.id)}
              className={`w-full text-left px-3 py-2.5 rounded-md flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                isActive
                  ? 'bg-blue-50 text-blue-800 font-semibold'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-medium'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className={`font-mono text-xs tabular-nums shrink-0 ${
                    isActive ? 'text-blue-700' : 'text-slate-400'
                  }`}
                >
                  {sec.numero}
                </span>
                <span className="text-xs truncate">{sec.tituloCorto}</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {isComplete && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                )}
                <span
                  className={`font-mono text-[11px] tabular-nums ${
                    isActive ? 'text-blue-700' : 'text-slate-400'
                  }`}
                >
                  {progress.filled}/{progress.total}
                </span>
              </div>
            </button>
          );
        })}

        <div className="pt-4 mt-4 border-t border-slate-200 px-1 space-y-2">
          <label
            htmlFor="quick-notes"
            className="block text-xs font-semibold text-slate-700"
          >
            Notas rápidas de campo
          </label>
          <textarea
            id="quick-notes"
            rows={4}
            value={interview.notasRapidas}
            onChange={(e) => onUpdateNotes(e.target.value)}
            placeholder="Apuntes sueltos durante la conversación que luego quieras clasificar..."
            className="w-full p-2.5 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-md placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 leading-relaxed"
          />
        </div>
      </nav>

      <div className="p-4 border-t border-slate-200 space-y-2 bg-slate-50/60">
        <button
          type="button"
          onClick={onOpenSummary}
          className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-slate-800 bg-white hover:bg-slate-100 border border-slate-200 rounded-md transition-colors cursor-pointer"
        >
          <FileText className="w-3.5 h-3.5 text-slate-600" />
          <span>Ver resumen e informe</span>
        </button>

        {isVirtuallyEmpty && (
          <button
            type="button"
            onClick={onLoadSample}
            className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-blue-700 hover:bg-blue-50 rounded-md transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Cargar entrevista de ejemplo</span>
          </button>
        )}
      </div>
    </aside>
  );
}
