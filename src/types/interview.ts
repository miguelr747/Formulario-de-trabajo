export type InterviewStatus = 'en_curso' | 'completada' | 'revision';

export type SeverityLevel = 'critica' | 'alta' | 'media' | 'baja';

export type IntegrationLevel =
  | 'tiempo_real'
  | 'lotes_batch'
  | 'doble_digitacion'
  | 'aislados'
  | '';

export type RecallResponseTime =
  | 'menos_1h'
  | '1_a_4h'
  | '4_a_24h'
  | 'mas_24h'
  | 'no_probado'
  | '';

export type CoverageState = 'completo' | 'parcial' | 'inexistente' | '';

export interface ProcessStage {
  id: string;
  nombre: string;
  areaResponsable: string;
  sistemaORegistro: string;
  identificadorUsado: string;
  datosCapturados: string;
  tienePuntoQuiebre: boolean;
  detalleQuiebre: string;
}

export interface GapFinding {
  id: string;
  titulo: string;
  etapaAfectada: string;
  severidad: SeverityLevel;
  impactoOperativo: string;
  citaONota: string;
}

export interface InterviewContextData {
  empresa: string;
  plantaOSede: string;
  sector: string;
  volumenOperacion: string;
  entrevistadoNombre: string;
  entrevistadoCargo: string;
  entrevistadoArea: string;
  entrevistador: string;
  fechaEntrevista: string;
  alcanceEntrevista: string;
  objetivoEspecifico: string;
}

export interface ProcessMapData {
  etapas: ProcessStage[];
  unidadMinimaTrazable: string;
  manejoMezclasYFraccionamiento: string;
  manejoReprocesosYDevoluciones: string;
  notasProceso: string;
}

export interface SystemsCaptureData {
  sistemasActivos: string[];
  detalleOtrosSistemas: string;
  tecnologiasIdentificacion: string[];
  puntoDeCaptura: string;
  nivelIntegracion: IntegrationLevel;
  frecuenciaActualizacion: string;
  dependenciaPapelOExcel: string;
  notasSistemas: string;
}

export interface TraceabilityCoverageData {
  trazabilidadAtrasEstado: CoverageState;
  trazabilidadAtrasDetalle: string;
  trazabilidadInternaEstado: CoverageState;
  trazabilidadInternaDetalle: string;
  trazabilidadAdelanteEstado: CoverageState;
  trazabilidadAdelanteDetalle: string;
  tiempoSimulacroRecall: RecallResponseTime;
  ultimoSimulacroFechaYResultado: string;
  normativasAplicables: string[];
  otrasNormativas: string;
}

export interface GapsPainPointsData {
  hallazgos: GapFinding[];
  cuellosDeBotella: string;
  erroresFrecuentesCaptura: string;
  dependenciaPersonasClave: string;
}

export interface ClosurePrioritiesData {
  objetivosPrincipales: string;
  restriccionesPisoYTecnicas: string;
  presupuestoYHorizonte: string;
  documentosSolicitados: string;
  proximosPasos: string;
  observacionesEntrevistador: string;
}

export interface InterviewRecord {
  id: string;
  status: InterviewStatus;
  createdAt: string;
  updatedAt: string;
  contexto: InterviewContextData;
  proceso: ProcessMapData;
  sistemas: SystemsCaptureData;
  trazabilidad: TraceabilityCoverageData;
  brechas: GapsPainPointsData;
  cierre: ClosurePrioritiesData;
  followUpKeys: string[];
  notasRapidas: string;
}

export type SectionId =
  | 'contexto'
  | 'proceso'
  | 'sistemas'
  | 'trazabilidad'
  | 'brechas'
  | 'cierre';
