import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Bookmark,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  FileText,
  Printer,
  XCircle,
} from 'lucide-react';
import type { CoverageState, InterviewRecord } from '../types/interview';
import {
  exportInterviewAsCsv,
  exportInterviewAsJson,
  exportInterviewAsMarkdown,
  formatCoverageState,
  formatDateEs,
  formatIntegrationLevel,
  formatRecallTime,
  formatSeverity,
  formatStatus,
  getOverallProgress,
} from '../utils/interviewMetrics';

interface InterviewSummaryProps {
  interview: InterviewRecord;
  onBackToForm: () => void;
}

const FOLLOW_UP_LABELS: Record<string, string> = {
  'contexto.empresa': 'Nombre de la empresa',
  'contexto.plantaOSede': 'Planta o sede',
  'contexto.sector': 'Sector industrial',
  'contexto.volumenOperacion': 'Volumen operativo',
  'contexto.entrevistadoNombre': 'Nombre del entrevistado',
  'contexto.entrevistadoCargo': 'Cargo del entrevistado',
  'contexto.entrevistadoArea': 'Área funcional',
  'contexto.alcanceEntrevista': 'Alcance de la entrevista',
  'contexto.objetivoEspecifico': 'Objetivo declarado',
  'proceso.unidadMinimaTrazable': 'Unidad mínima trazable',
  'proceso.manejoMezclasYFraccionamiento': 'Mezclas y fraccionamiento',
  'proceso.manejoReprocesosYDevoluciones': 'Reprocesos y devoluciones',
  'sistemas.sistemasActivos': 'Sistemas activos',
  'sistemas.tecnologiasIdentificacion': 'Tecnologías de identificación',
  'sistemas.puntoDeCaptura': 'Punto y momento de captura',
  'sistemas.frecuenciaActualizacion': 'Frecuencia de actualización',
  'sistemas.nivelIntegracion': 'Nivel de integración',
  'sistemas.dependenciaPapelOExcel': 'Dependencia de papel o Excel',
  'trazabilidad.trazabilidadAtrasEstado': 'Trazabilidad hacia atrás',
  'trazabilidad.trazabilidadInternaEstado': 'Trazabilidad interna',
  'trazabilidad.trazabilidadAdelanteEstado': 'Trazabilidad hacia adelante',
  'trazabilidad.tiempoSimulacroRecall': 'Tiempo de simulacro Recall',
  'trazabilidad.normativasAplicables': 'Normativas aplicables',
  'brechas.cuellosDeBotella': 'Cuellos de botella',
  'brechas.erroresFrecuentesCaptura': 'Errores frecuentes de captura',
  'brechas.dependenciaPersonasClave': 'Dependencia de personas clave',
  'cierre.objetivosPrincipales': 'Objetivos principales de mejora',
  'cierre.restriccionesPisoYTecnicas': 'Restricciones de piso y técnicas',
  'cierre.documentosSolicitados': 'Documentos solicitados',
  'cierre.proximosPasos': 'Próximos pasos acordados',
};

function CoverageBadgeIcon({ state }: { state: CoverageState }) {
  if (state === 'completo') {
    return <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />;
  }
  if (state === 'parcial') {
    return <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />;
  }
  if (state === 'inexistente') {
    return <XCircle className="w-4 h-4 text-red-600 shrink-0" />;
  }
  return <span className="w-4 h-4 inline-block rounded-full border border-slate-300 shrink-0" />;
}

export function InterviewSummary({
  interview,
  onBackToForm,
}: InterviewSummaryProps) {
  const { contexto, proceso, sistemas, trazabilidad, brechas, cierre } = interview;
  const overall = getOverallProgress(interview);
  const breakStagesCount = proceso.etapas.filter((e) => e.tienePuntoQuiebre).length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <button
          type="button"
          onClick={onBackToForm}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer self-start"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al formulario</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => exportInterviewAsMarkdown(interview)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-md transition-colors whitespace-nowrap cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Exportar Markdown</span>
          </button>
          <button
            type="button"
            onClick={() => exportInterviewAsCsv(interview)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-md transition-colors whitespace-nowrap cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Exportar CSV</span>
          </button>
          <button
            type="button"
            onClick={() => exportInterviewAsJson(interview)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-md transition-colors whitespace-nowrap cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Respaldo JSON</span>
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-md transition-colors whitespace-nowrap cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir / PDF</span>
          </button>
        </div>
      </div>

      {/* Header block */}
      <section className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 space-y-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 tabular-nums">
            <span>Informe de Entrevista de Trazabilidad</span>
            <span aria-hidden="true">·</span>
            <span>{formatDateEs(contexto.fechaEntrevista)}</span>
            <span aria-hidden="true">·</span>
            <span>Estado: {formatStatus(interview.status)}</span>
            <span aria-hidden="true">·</span>
            <span>Avance: {overall.percent}%</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            {contexto.empresa || 'Empresa sin especificar'}
          </h1>
          <p className="text-sm text-slate-600">
            {[contexto.sector, contexto.plantaOSede, contexto.volumenOperacion]
              .filter(Boolean)
              .join(' · ') || 'Sin detalles operativos registrados'}
          </p>
        </div>

        <div className="pt-5 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
          <div>
            <div className="text-xs font-medium text-slate-500">Entrevistado</div>
            <div className="font-semibold text-slate-900 mt-0.5">
              {contexto.entrevistadoNombre || '—'}
            </div>
            <div className="text-xs text-slate-600 mt-0.5">
              {[contexto.entrevistadoCargo, contexto.entrevistadoArea]
                .filter(Boolean)
                .join(' · ') || '—'}
            </div>
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500">Alcance</div>
            <div className="text-slate-800 mt-0.5 leading-relaxed">
              {contexto.alcanceEntrevista || '—'}
            </div>
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500">Entrevistador</div>
            <div className="text-slate-800 mt-0.5">
              {contexto.entrevistador || '—'}
            </div>
          </div>
        </div>

        {contexto.objetivoEspecifico && (
          <div className="pt-4 border-t border-slate-200">
            <div className="text-xs font-medium text-slate-500">
              Objetivo declarado
            </div>
            <p className="text-sm text-slate-800 mt-1 leading-relaxed">
              {contexto.objetivoEspecifico}
            </p>
          </div>
        )}
      </section>

      {/* Process Chain */}
      <section className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 space-y-5 print-break-inside-avoid">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-lg font-bold text-slate-900">
            01. Cadena de Procesos y Puntos de Quiebre
          </h2>
          <span className="text-xs text-slate-500 tabular-nums">
            {proceso.etapas.length} etapas mapeadas · {breakStagesCount} con quiebre de traza
          </span>
        </div>

        {proceso.etapas.length === 0 ? (
          <p className="text-sm text-slate-500">No se registraron etapas de proceso.</p>
        ) : (
          <div className="overflow-x-auto pb-2">
            <div className="flex items-stretch gap-2 min-w-max">
              {proceso.etapas.map((etapa, idx) => (
                <div key={etapa.id} className="flex items-center gap-2">
                  <div
                    className={`w-56 p-3.5 rounded-md border flex flex-col justify-between ${
                      etapa.tienePuntoQuiebre
                        ? 'bg-red-50/50 border-red-200'
                        : 'bg-slate-50/60 border-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 text-[11px] font-mono text-slate-500 tabular-nums">
                        <span>ETAPA {String(idx + 1).padStart(2, '0')}</span>
                        {etapa.tienePuntoQuiebre && (
                          <span className="font-sans font-semibold text-red-700">
                            Quiebre
                          </span>
                        )}
                      </div>
                      <div className="text-sm font-semibold text-slate-900 mt-1 leading-snug">
                        {etapa.nombre || 'Etapa sin nombre'}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {etapa.areaResponsable || 'Área sin definir'}
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-200/80 space-y-1 text-xs">
                      <div className="text-slate-700 truncate" title={etapa.sistemaORegistro}>
                        <span className="text-slate-400">Reg: </span>
                        {etapa.sistemaORegistro || '—'}
                      </div>
                      <div className="text-slate-700 truncate" title={etapa.identificadorUsado}>
                        <span className="text-slate-400">ID: </span>
                        {etapa.identificadorUsado || '—'}
                      </div>
                      {etapa.tienePuntoQuiebre && etapa.detalleQuiebre && (
                        <div className="text-red-700 text-[11px] leading-snug pt-1">
                          {etapa.detalleQuiebre}
                        </div>
                      )}
                    </div>
                  </div>
                  {idx < proceso.etapas.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-5 text-sm">
          <div>
            <div className="text-xs font-medium text-slate-500">
              Unidad mínima trazable
            </div>
            <p className="text-slate-800 mt-1 leading-relaxed">
              {proceso.unidadMinimaTrazable || '—'}
            </p>
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500">
              Mezclas y fraccionamiento
            </div>
            <p className="text-slate-800 mt-1 leading-relaxed">
              {proceso.manejoMezclasYFraccionamiento || '—'}
            </p>
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500">
              Reprocesos y devoluciones
            </div>
            <p className="text-slate-800 mt-1 leading-relaxed">
              {proceso.manejoReprocesosYDevoluciones || '—'}
            </p>
          </div>
        </div>
      </section>

      {/* Traceability Coverage & Systems */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white border border-slate-200 rounded-lg p-6 space-y-5 print-break-inside-avoid">
          <h2 className="text-lg font-bold text-slate-900">
            02. Cobertura de Trazabilidad y Recall
          </h2>

          <div className="divide-y divide-slate-200 border border-slate-200 rounded-md">
            {[
              {
                label: 'Hacia atrás (Proveedores)',
                state: trazabilidad.trazabilidadAtrasEstado,
                detail: trazabilidad.trazabilidadAtrasDetalle,
              },
              {
                label: 'Interna (Proceso)',
                state: trazabilidad.trazabilidadInternaEstado,
                detail: trazabilidad.trazabilidadInternaDetalle,
              },
              {
                label: 'Hacia adelante (Clientes)',
                state: trazabilidad.trazabilidadAdelanteEstado,
                detail: trazabilidad.trazabilidadAdelanteDetalle,
              },
            ].map((row) => (
              <div key={row.label} className="p-3.5 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-700">
                    {row.label}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-900">
                    <CoverageBadgeIcon state={row.state} />
                    <span>{formatCoverageState(row.state)}</span>
                  </span>
                </div>
                {row.detail && (
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {row.detail}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="space-y-3 text-sm pt-2">
            <div>
              <div className="text-xs font-medium text-slate-500">
                Tiempo estimado de simulacro de retiro (Recall)
              </div>
              <div className="font-semibold text-slate-900 mt-0.5">
                {formatRecallTime(trazabilidad.tiempoSimulacroRecall)}
              </div>
              {trazabilidad.ultimoSimulacroFechaYResultado && (
                <p className="text-xs text-slate-600 mt-0.5">
                  {trazabilidad.ultimoSimulacroFechaYResultado}
                </p>
              )}
            </div>

            <div>
              <div className="text-xs font-medium text-slate-500">
                Normativas y exigencias
              </div>
              <p className="text-xs text-slate-800 mt-1 leading-relaxed">
                {[...trazabilidad.normativasAplicables, trazabilidad.otrasNormativas]
                  .filter(Boolean)
                  .join(' · ') || '—'}
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white border border-slate-200 rounded-lg p-6 space-y-5 print-break-inside-avoid">
          <h2 className="text-lg font-bold text-slate-900">
            03. Arquitectura de Sistemas y Captura
          </h2>

          <div className="space-y-4 text-sm">
            <div>
              <div className="text-xs font-medium text-slate-500">
                Sistemas y formatos en uso
              </div>
              <p className="text-slate-800 mt-1 leading-relaxed">
                {sistemas.sistemasActivos.length
                  ? sistemas.sistemasActivos.join(' · ')
                  : '—'}
              </p>
              {sistemas.detalleOtrosSistemas && (
                <p className="text-xs text-slate-600 mt-1">
                  {sistemas.detalleOtrosSistemas}
                </p>
              )}
            </div>

            <div>
              <div className="text-xs font-medium text-slate-500">
                Tecnologías de identificación en planta
              </div>
              <p className="text-slate-800 mt-1 leading-relaxed">
                {sistemas.tecnologiasIdentificacion.length
                  ? sistemas.tecnologiasIdentificacion.join(' · ')
                  : '—'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200">
              <div>
                <div className="text-xs font-medium text-slate-500">
                  Nivel de integración
                </div>
                <p className="text-xs font-semibold text-slate-900 mt-1">
                  {formatIntegrationLevel(sistemas.nivelIntegracion)}
                </p>
              </div>
              <div>
                <div className="text-xs font-medium text-slate-500">
                  Frecuencia de actualización
                </div>
                <p className="text-xs text-slate-800 mt-1">
                  {sistemas.frecuenciaActualizacion || '—'}
                </p>
              </div>
            </div>

            <div>
              <div className="text-xs font-medium text-slate-500">
                Punto de captura y dependencia manual
              </div>
              <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                {[sistemas.puntoDeCaptura, sistemas.dependenciaPapelOExcel]
                  .filter(Boolean)
                  .join(' — ') || '—'}
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Findings Table */}
      <section className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 space-y-5 print-break-inside-avoid">
        <div className="flex items-baseline justify-between gap-2">
          <h2 className="text-lg font-bold text-slate-900">
            04. Brechas y Hallazgos Identificados
          </h2>
          <span className="text-xs text-slate-500 tabular-nums">
            {brechas.hallazgos.length} registrados
          </span>
        </div>

        {brechas.hallazgos.length === 0 ? (
          <p className="text-sm text-slate-500">No se registraron hallazgos específicos.</p>
        ) : (
          <div className="overflow-x-auto border border-slate-200 rounded-md">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
                  <th className="py-2.5 px-3.5">Hallazgo</th>
                  <th className="py-2.5 px-3.5">Etapa</th>
                  <th className="py-2.5 px-3.5">Severidad</th>
                  <th className="py-2.5 px-3.5">Impacto y evidencia</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {brechas.hallazgos.map((h) => (
                  <tr key={h.id} className="align-top">
                    <td className="py-3 px-3.5 font-medium text-slate-900">
                      {h.titulo || 'Sin título'}
                    </td>
                    <td className="py-3 px-3.5 text-xs text-slate-600">
                      {h.etapaAfectada || 'General'}
                    </td>
                    <td className="py-3 px-3.5 text-xs font-semibold whitespace-nowrap">
                      <span
                        className={
                          h.severidad === 'critica'
                            ? 'text-red-700'
                            : h.severidad === 'alta'
                            ? 'text-amber-700'
                            : 'text-slate-700'
                        }
                      >
                        {formatSeverity(h.severidad)}
                      </span>
                    </td>
                    <td className="py-3 px-3.5 text-xs text-slate-700 space-y-1">
                      {h.impactoOperativo && <div>{h.impactoOperativo}</div>}
                      {h.citaONota && (
                        <div className="text-slate-500 italic">{h.citaONota}</div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {(brechas.cuellosDeBotella ||
          brechas.erroresFrecuentesCaptura ||
          brechas.dependenciaPersonasClave) && (
          <div className="pt-4 border-t border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
            <div>
              <div className="font-medium text-slate-500">Cuellos de botella</div>
              <p className="text-slate-800 mt-1 leading-relaxed">
                {brechas.cuellosDeBotella || '—'}
              </p>
            </div>
            <div>
              <div className="font-medium text-slate-500">Errores frecuentes</div>
              <p className="text-slate-800 mt-1 leading-relaxed">
                {brechas.erroresFrecuentesCaptura || '—'}
              </p>
            </div>
            <div>
              <div className="font-medium text-slate-500">
                Dependencia de personas clave
              </div>
              <p className="text-slate-800 mt-1 leading-relaxed">
                {brechas.dependenciaPersonasClave || '—'}
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Closure, Follow-ups & Field Notes */}
      <section className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 space-y-6 print-break-inside-avoid">
        <h2 className="text-lg font-bold text-slate-900">
          05. Prioridades, Restricciones y Próximos Pasos
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <div className="text-xs font-medium text-slate-500">
              Prioridades de mejora
            </div>
            <p className="text-slate-800 mt-1 leading-relaxed">
              {cierre.objetivosPrincipales || '—'}
            </p>
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500">
              Restricciones físicas y técnicas
            </div>
            <p className="text-slate-800 mt-1 leading-relaxed">
              {cierre.restriccionesPisoYTecnicas || '—'}
            </p>
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500">
              Documentos solicitados
            </div>
            <p className="text-slate-800 mt-1 leading-relaxed">
              {cierre.documentosSolicitados || '—'}
            </p>
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500">
              Próximos pasos acordados
            </div>
            <p className="text-slate-800 mt-1 leading-relaxed">
              {cierre.proximosPasos || '—'}
            </p>
          </div>
        </div>

        {(interview.followUpKeys.length > 0 || interview.notasRapidas.trim()) && (
          <div className="pt-5 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            {interview.followUpKeys.length > 0 && (
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800">
                  <Bookmark className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
                  <span>Puntos marcados para validar luego</span>
                </div>
                <ul className="mt-2 space-y-1 text-xs text-slate-700 list-disc list-inside">
                  {interview.followUpKeys.map((key) => (
                    <li key={key}>{FOLLOW_UP_LABELS[key] || key}</li>
                  ))}
                </ul>
              </div>
            )}

            {interview.notasRapidas.trim() && (
              <div>
                <div className="text-xs font-medium text-slate-500">
                  Notas rápidas de campo
                </div>
                <p className="text-xs text-slate-800 mt-1.5 leading-relaxed whitespace-pre-wrap">
                  {interview.notasRapidas}
                </p>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
