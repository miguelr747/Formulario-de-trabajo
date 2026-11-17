import type {
  CoverageState,
  IntegrationLevel,
  InterviewRecord,
  InterviewStatus,
  RecallResponseTime,
  SectionId,
  SeverityLevel,
} from '../types/interview';

const STORAGE_KEY_INTERVIEWS = 'trazaaudit_interviews_v1';
const STORAGE_KEY_ACTIVE_ID = 'trazaaudit_active_interview_v1';

export interface SectionProgress {
  filled: number;
  total: number;
  percent: number;
}

function isNonEmpty(val?: string | null): boolean {
  return Boolean(val && val.trim().length > 0);
}

export function getSectionProgress(
  interview: InterviewRecord,
  sectionId: SectionId
): SectionProgress {
  switch (sectionId) {
    case 'contexto': {
      const c = interview.contexto;
      const checks = [
        isNonEmpty(c.empresa),
        isNonEmpty(c.sector),
        isNonEmpty(c.entrevistadoNombre),
        isNonEmpty(c.entrevistadoCargo),
        isNonEmpty(c.fechaEntrevista),
        isNonEmpty(c.alcanceEntrevista),
      ];
      const filled = checks.filter(Boolean).length;
      return { filled, total: checks.length, percent: Math.round((filled / checks.length) * 100) };
    }
    case 'proceso': {
      const p = interview.proceso;
      const stageWithDetails = p.etapas.some(
        (e) => isNonEmpty(e.sistemaORegistro) || isNonEmpty(e.datosCapturados)
      );
      const checks = [
        p.etapas.length > 0,
        stageWithDetails,
        isNonEmpty(p.unidadMinimaTrazable),
        isNonEmpty(p.manejoMezclasYFraccionamiento),
        isNonEmpty(p.manejoReprocesosYDevoluciones),
      ];
      const filled = checks.filter(Boolean).length;
      return { filled, total: checks.length, percent: Math.round((filled / checks.length) * 100) };
    }
    case 'sistemas': {
      const s = interview.sistemas;
      const checks = [
        s.sistemasActivos.length > 0,
        s.tecnologiasIdentificacion.length > 0,
        isNonEmpty(s.puntoDeCaptura),
        isNonEmpty(s.nivelIntegracion),
        isNonEmpty(s.frecuenciaActualizacion),
        isNonEmpty(s.dependenciaPapelOExcel),
      ];
      const filled = checks.filter(Boolean).length;
      return { filled, total: checks.length, percent: Math.round((filled / checks.length) * 100) };
    }
    case 'trazabilidad': {
      const t = interview.trazabilidad;
      const checks = [
        isNonEmpty(t.trazabilidadAtrasEstado),
        isNonEmpty(t.trazabilidadInternaEstado),
        isNonEmpty(t.trazabilidadAdelanteEstado),
        isNonEmpty(t.tiempoSimulacroRecall),
        t.normativasAplicables.length > 0 || isNonEmpty(t.otrasNormativas),
      ];
      const filled = checks.filter(Boolean).length;
      return { filled, total: checks.length, percent: Math.round((filled / checks.length) * 100) };
    }
    case 'brechas': {
      const b = interview.brechas;
      const checks = [
        b.hallazgos.length > 0,
        isNonEmpty(b.cuellosDeBotella),
        isNonEmpty(b.erroresFrecuentesCaptura),
        isNonEmpty(b.dependenciaPersonasClave),
      ];
      const filled = checks.filter(Boolean).length;
      return { filled, total: checks.length, percent: Math.round((filled / checks.length) * 100) };
    }
    case 'cierre': {
      const f = interview.cierre;
      const checks = [
        isNonEmpty(f.objetivosPrincipales),
        isNonEmpty(f.restriccionesPisoYTecnicas),
        isNonEmpty(f.documentosSolicitados),
        isNonEmpty(f.proximosPasos),
      ];
      const filled = checks.filter(Boolean).length;
      return { filled, total: checks.length, percent: Math.round((filled / checks.length) * 100) };
    }
  }
}

export function getOverallProgress(interview: InterviewRecord): SectionProgress {
  const sections: SectionId[] = [
    'contexto',
    'proceso',
    'sistemas',
    'trazabilidad',
    'brechas',
    'cierre',
  ];
  const totals = sections.reduce(
    (acc, sec) => {
      const p = getSectionProgress(interview, sec);
      return { filled: acc.filled + p.filled, total: acc.total + p.total };
    },
    { filled: 0, total: 0 }
  );
  return {
    filled: totals.filled,
    total: totals.total,
    percent: totals.total > 0 ? Math.round((totals.filled / totals.total) * 100) : 0,
  };
}

export function formatIntegrationLevel(val: IntegrationLevel): string {
  switch (val) {
    case 'tiempo_real':
      return 'Integrado en tiempo real (API / interfaz directa)';
    case 'lotes_batch':
      return 'Sincronización programada por lotes (batch)';
    case 'doble_digitacion':
      return 'Carga manual / doble digitación entre sistemas';
    case 'aislados':
      return 'Sistemas aislados sin comunicación';
    default:
      return 'Sin especificar';
  }
}

export function formatRecallTime(val: RecallResponseTime): string {
  switch (val) {
    case 'menos_1h':
      return 'Menos de 1 hora';
    case '1_a_4h':
      return 'Entre 1 y 4 horas';
    case '4_a_24h':
      return 'Entre 4 y 24 horas';
    case 'mas_24h':
      return 'Más de 24 horas';
    case 'no_probado':
      return 'Nunca se ha realizado simulacro';
    default:
      return 'Sin especificar';
  }
}

export function formatCoverageState(val: CoverageState): string {
  switch (val) {
    case 'completo':
      return 'Completa y digitalizada';
    case 'parcial':
      return 'Parcial / mixta (papel y sistema)';
    case 'inexistente':
      return 'Inexistente o no trazable';
    default:
      return 'Sin evaluar';
  }
}

export function formatStatus(status: InterviewStatus): string {
  switch (status) {
    case 'en_curso':
      return 'En curso';
    case 'revision':
      return 'En revisión';
    case 'completada':
      return 'Completada';
  }
}

export function formatSeverity(sev: SeverityLevel): string {
  switch (sev) {
    case 'critica':
      return 'Crítica';
    case 'alta':
      return 'Alta';
    case 'media':
      return 'Media';
    case 'baja':
      return 'Baja';
  }
}

export function formatDateEs(isoDate?: string): string {
  if (!isoDate) return '—';
  const parsed = new Date(isoDate.length === 10 ? `${isoDate}T12:00:00` : isoDate);
  if (Number.isNaN(parsed.getTime())) return isoDate;
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(parsed);
}

export function formatTimeEs(isoDate?: string): string {
  if (!isoDate) return '—';
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) return '—';
  return new Intl.DateTimeFormat('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(parsed);
}

function sanitizeFilename(name: string): string {
  return (
    name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '') || 'entrevista_trazabilidad'
  );
}

function triggerDownload(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportInterviewAsJson(interview: InterviewRecord): void {
  const baseName = sanitizeFilename(interview.contexto.empresa || 'entrevista');
  const datePart = interview.contexto.fechaEntrevista || new Date().toISOString().slice(0, 10);
  triggerDownload(
    JSON.stringify(interview, null, 2),
    `trazabilidad_${baseName}_${datePart}.json`,
    'application/json;charset=utf-8'
  );
}

export function exportInterviewAsMarkdown(interview: InterviewRecord): void {
  const c = interview.contexto;
  const p = interview.proceso;
  const s = interview.sistemas;
  const t = interview.trazabilidad;
  const b = interview.brechas;
  const f = interview.cierre;

  const lines: string[] = [
    `# Entrevista de Trazabilidad y Procesos: ${c.empresa || 'Empresa sin nombre'}`,
    '',
    `- **Fecha:** ${formatDateEs(c.fechaEntrevista)}`,
    `- **Planta / Sede:** ${c.plantaOSede || 'No especificada'}`,
    `- **Sector:** ${c.sector || 'No especificado'}`,
    `- **Volumen de operación:** ${c.volumenOperacion || 'No especificado'}`,
    `- **Entrevistado:** ${c.entrevistadoNombre || 'No especificado'} (${c.entrevistadoCargo || 'Cargo no especificado'} · ${c.entrevistadoArea || 'Área no especificada'})`,
    `- **Entrevistador:** ${c.entrevistador || 'No especificado'}`,
    `- **Estado:** ${formatStatus(interview.status)}`,
    '',
    '## 1. Alcance y Objetivo',
    `- **Alcance:** ${c.alcanceEntrevista || '—'}`,
    `- **Objetivo específico:** ${c.objetivoEspecifico || '—'}`,
    '',
    '## 2. Mapa de Procesos Operativos',
    '| # | Etapa | Área | Sistema / Registro | Identificador | Datos Capturados | Quiebre de Traza |',
    '|---|---|---|---|---|---|---|',
    ...p.etapas.map(
      (et, idx) =>
        `| ${idx + 1} | ${et.nombre || '—'} | ${et.areaResponsable || '—'} | ${et.sistemaORegistro || '—'} | ${et.identificadorUsado || '—'} | ${et.datosCapturados || '—'} | ${et.tienePuntoQuiebre ? `Sí: ${et.detalleQuiebre || 'Sin detalle'}` : 'No'} |`
    ),
    '',
    `- **Unidad mínima trazable:** ${p.unidadMinimaTrazable || '—'}`,
    `- **Mezclas y fraccionamiento:** ${p.manejoMezclasYFraccionamiento || '—'}`,
    `- **Reprocesos y devoluciones:** ${p.manejoReprocesosYDevoluciones || '—'}`,
    `- **Notas de proceso:** ${p.notasProceso || '—'}`,
    '',
    '## 3. Sistemas, Hardware y Captura de Datos',
    `- **Sistemas activos:** ${s.sistemasActivos.length ? s.sistemasActivos.join(', ') : 'Ninguno marcado'}`,
    `- **Detalle de sistemas:** ${s.detalleOtrosSistemas || '—'}`,
    `- **Tecnologías de identificación:** ${s.tecnologiasIdentificacion.length ? s.tecnologiasIdentificacion.join(', ') : 'Ninguna marcada'}`,
    `- **Punto de captura:** ${s.puntoDeCaptura || '—'}`,
    `- **Nivel de integración:** ${formatIntegrationLevel(s.nivelIntegracion)}`,
    `- **Frecuencia de actualización:** ${s.frecuenciaActualizacion || '—'}`,
    `- **Dependencia de papel o Excel:** ${s.dependenciaPapelOExcel || '—'}`,
    `- **Notas técnicas:** ${s.notasSistemas || '—'}`,
    '',
    '## 4. Cobertura de Trazabilidad y Normativas',
    `- **Trazabilidad hacia atrás (Proveedores):** ${formatCoverageState(t.trazabilidadAtrasEstado)} — ${t.trazabilidadAtrasDetalle || '—'}`,
    `- **Trazabilidad interna (Proceso):** ${formatCoverageState(t.trazabilidadInternaEstado)} — ${t.trazabilidadInternaDetalle || '—'}`,
    `- **Trazabilidad hacia adelante (Clientes):** ${formatCoverageState(t.trazabilidadAdelanteEstado)} — ${t.trazabilidadAdelanteDetalle || '—'}`,
    `- **Tiempo estimado en simulacro de retiro (Recall):** ${formatRecallTime(t.tiempoSimulacroRecall)}`,
    `- **Último simulacro / resultado:** ${t.ultimoSimulacroFechaYResultado || '—'}`,
    `- **Normativas aplicables:** ${t.normativasAplicables.length ? t.normativasAplicables.join(', ') : '—'} ${t.otrasNormativas ? `(${t.otrasNormativas})` : ''}`,
    '',
    '## 5. Puntos Críticos, Brechas y Hallazgos',
  ];

  if (b.hallazgos.length === 0) {
    lines.push('- Sin hallazgos registrados.');
  } else {
    b.hallazgos.forEach((h, i) => {
      lines.push(
        `### ${i + 1}. ${h.titulo || 'Hallazgo sin título'} [${formatSeverity(h.severidad)}]`,
        `- **Etapa afectada:** ${h.etapaAfectada || 'General'}`,
        `- **Impacto operativo:** ${h.impactoOperativo || '—'}`,
        `- **Nota / Cita:** ${h.citaONota || '—'}`,
        ''
      );
    });
  }

  lines.push(
    `- **Cuellos de botella:** ${b.cuellosDeBotella || '—'}`,
    `- **Errores frecuentes de captura:** ${b.erroresFrecuentesCaptura || '—'}`,
    `- **Dependencia de personas clave:** ${b.dependenciaPersonasClave || '—'}`,
    '',
    '## 6. Prioridades, Restricciones y Cierre',
    `- **Objetivos principales:** ${f.objetivosPrincipales || '—'}`,
    `- **Restricciones de piso y técnicas:** ${f.restriccionesPisoYTecnicas || '—'}`,
    `- **Horizonte / Presupuesto:** ${f.presupuestoYHorizonte || '—'}`,
    `- **Documentos solicitados:** ${f.documentosSolicitados || '—'}`,
    `- **Próximos pasos:** ${f.proximosPasos || '—'}`,
    `- **Observaciones del entrevistador:** ${f.observacionesEntrevistador || '—'}`,
    ''
  );

  if (interview.notasRapidas.trim()) {
    lines.push('## Notas Rápidas de Campo', interview.notasRapidas.trim(), '');
  }

  const baseName = sanitizeFilename(c.empresa || 'entrevista');
  const datePart = c.fechaEntrevista || new Date().toISOString().slice(0, 10);
  triggerDownload(
    lines.join('\n'),
    `informe_trazabilidad_${baseName}_${datePart}.md`,
    'text/markdown;charset=utf-8'
  );
}

function escapeCsvCell(val: string): string {
  const clean = val.replace(/\r?\n/g, ' ').replace(/"/g, '""');
  return `"${clean}"`;
}

export function exportInterviewAsCsv(interview: InterviewRecord): void {
  const c = interview.contexto;
  const p = interview.proceso;
  const s = interview.sistemas;
  const t = interview.trazabilidad;
  const b = interview.brechas;
  const f = interview.cierre;

  const rows: [string, string, string][] = [
    ['Sección', 'Campo', 'Valor'],
    ['01. Contexto', 'Empresa', c.empresa],
    ['01. Contexto', 'Planta o Sede', c.plantaOSede],
    ['01. Contexto', 'Sector', c.sector],
    ['01. Contexto', 'Volumen de operación', c.volumenOperacion],
    ['01. Contexto', 'Entrevistado', c.entrevistadoNombre],
    ['01. Contexto', 'Cargo', c.entrevistadoCargo],
    ['01. Contexto', 'Área', c.entrevistadoArea],
    ['01. Contexto', 'Entrevistador', c.entrevistador],
    ['01. Contexto', 'Fecha', c.fechaEntrevista],
    ['01. Contexto', 'Alcance', c.alcanceEntrevista],
    ['01. Contexto', 'Objetivo específico', c.objetivoEspecifico],
    ...p.etapas.map((et, idx): [string, string, string] => [
      '02. Proceso',
      `Etapa ${idx + 1}: ${et.nombre}`,
      `Área: ${et.areaResponsable} | Sistema: ${et.sistemaORegistro} | ID: ${et.identificadorUsado} | Datos: ${et.datosCapturados} | Quiebre: ${et.tienePuntoQuiebre ? `Sí (${et.detalleQuiebre})` : 'No'}`,
    ]),
    ['02. Proceso', 'Unidad mínima trazable', p.unidadMinimaTrazable],
    ['02. Proceso', 'Mezclas y fraccionamiento', p.manejoMezclasYFraccionamiento],
    ['02. Proceso', 'Reprocesos y devoluciones', p.manejoReprocesosYDevoluciones],
    ['03. Sistemas', 'Sistemas activos', s.sistemasActivos.join('; ')],
    ['03. Sistemas', 'Detalle sistemas', s.detalleOtrosSistemas],
    ['03. Sistemas', 'Tecnologías identificación', s.tecnologiasIdentificacion.join('; ')],
    ['03. Sistemas', 'Punto de captura', s.puntoDeCaptura],
    ['03. Sistemas', 'Nivel de integración', formatIntegrationLevel(s.nivelIntegracion)],
    ['03. Sistemas', 'Frecuencia actualización', s.frecuenciaActualizacion],
    ['03. Sistemas', 'Dependencia papel/Excel', s.dependenciaPapelOExcel],
    ['04. Trazabilidad', 'Hacia atrás (Proveedores)', `${formatCoverageState(t.trazabilidadAtrasEstado)} - ${t.trazabilidadAtrasDetalle}`],
    ['04. Trazabilidad', 'Interna (Proceso)', `${formatCoverageState(t.trazabilidadInternaEstado)} - ${t.trazabilidadInternaDetalle}`],
    ['04. Trazabilidad', 'Hacia adelante (Clientes)', `${formatCoverageState(t.trazabilidadAdelanteEstado)} - ${t.trazabilidadAdelanteDetalle}`],
    ['04. Trazabilidad', 'Tiempo de simulacro Recall', formatRecallTime(t.tiempoSimulacroRecall)],
    ['04. Trazabilidad', 'Último simulacro', t.ultimoSimulacroFechaYResultado],
    ['04. Trazabilidad', 'Normativas aplicables', [...t.normativasAplicables, t.otrasNormativas].filter(Boolean).join('; ')],
    ...b.hallazgos.map((h, idx): [string, string, string] => [
      '05. Brechas',
      `Hallazgo ${idx + 1} (${formatSeverity(h.severidad)})`,
      `${h.titulo} | Etapa: ${h.etapaAfectada} | Impacto: ${h.impactoOperativo} | Nota: ${h.citaONota}`,
    ]),
    ['05. Brechas', 'Cuellos de botella', b.cuellosDeBotella],
    ['05. Brechas', 'Errores frecuentes', b.erroresFrecuentesCaptura],
    ['05. Brechas', 'Dependencia personas clave', b.dependenciaPersonasClave],
    ['06. Cierre', 'Objetivos principales', f.objetivosPrincipales],
    ['06. Cierre', 'Restricciones piso/técnicas', f.restriccionesPisoYTecnicas],
    ['06. Cierre', 'Presupuesto y horizonte', f.presupuestoYHorizonte],
    ['06. Cierre', 'Documentos solicitados', f.documentosSolicitados],
    ['06. Cierre', 'Próximos pasos', f.proximosPasos],
    ['06. Cierre', 'Observaciones entrevistador', f.observacionesEntrevistador],
    ['Notas', 'Notas rápidas de campo', interview.notasRapidas],
  ];

  const csvContent =
    '\uFEFF' + rows.map((row) => row.map((cell) => escapeCsvCell(cell || '')).join(',')).join('\n');

  const baseName = sanitizeFilename(c.empresa || 'entrevista');
  const datePart = c.fechaEntrevista || new Date().toISOString().slice(0, 10);
  triggerDownload(
    csvContent,
    `trazabilidad_${baseName}_${datePart}.csv`,
    'text/csv;charset=utf-8'
  );
}

export function parseImportedInterviewJson(rawText: string): InterviewRecord | null {
  try {
    const parsed = JSON.parse(rawText);
    if (
      parsed &&
      typeof parsed === 'object' &&
      parsed.contexto &&
      parsed.proceso &&
      parsed.sistemas &&
      parsed.trazabilidad &&
      parsed.brechas &&
      parsed.cierre
    ) {
      return {
        ...parsed,
        id: `ent_${Date.now().toString(36)}_imp`,
        updatedAt: new Date().toISOString(),
        followUpKeys: Array.isArray(parsed.followUpKeys) ? parsed.followUpKeys : [],
        notasRapidas: typeof parsed.notasRapidas === 'string' ? parsed.notasRapidas : '',
      } as InterviewRecord;
    }
    return null;
  } catch {
    return null;
  }
}

export function loadStoredInterviews(): InterviewRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_INTERVIEWS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveStoredInterviews(interviews: InterviewRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_INTERVIEWS, JSON.stringify(interviews));
  } catch {
    // Ignore storage quota errors cleanly
  }
}

export function loadActiveInterviewId(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY_ACTIVE_ID);
  } catch {
    return null;
  }
}

export function saveActiveInterviewId(id: string): void {
  try {
    localStorage.setItem(STORAGE_KEY_ACTIVE_ID, id);
  } catch {
    // Ignore storage errors
  }
}
