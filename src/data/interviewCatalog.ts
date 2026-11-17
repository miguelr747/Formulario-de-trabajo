import type { InterviewRecord, ProcessStage, SectionId } from '../types/interview';

export interface SectionDefinition {
  id: SectionId;
  numero: string;
  titulo: string;
  tituloCorto: string;
  descripcion: string;
  preguntasGuia: string[];
}

export const SECTIONS: SectionDefinition[] = [
  {
    id: 'contexto',
    numero: '01',
    titulo: 'Contexto de la Empresa y Entrevistado',
    tituloCorto: 'Contexto y Alcance',
    descripcion:
      'Datos generales de la operación, rol del entrevistado y alcance del levantamiento de trazabilidad.',
    preguntasGuia: [
      '¿Qué líneas de producto o plantas están dentro del alcance de este diagnóstico?',
      '¿Cuántos lotes, órdenes o despachos diarios manejan en temporada normal y pico?',
    ],
  },
  {
    id: 'proceso',
    numero: '02',
    titulo: 'Mapa de Procesos Operativos',
    tituloCorto: 'Mapa de Procesos',
    descripcion:
      'Secuencia real desde la recepción de insumos hasta el despacho, identificando cómo se transforma la unidad trazable y dónde se pierde el rastro.',
    preguntasGuia: [
      'Si tomamos un producto terminado hoy, ¿por qué áreas pasó exactamente desde que entró la materia prima?',
      '¿En qué momento cambia el código de lote o se mezclan varios lotes en uno nuevo?',
    ],
  },
  {
    id: 'sistemas',
    numero: '03',
    titulo: 'Sistemas, Hardware y Captura de Datos',
    tituloCorto: 'Sistemas y Captura',
    descripcion:
      'Inventario de software (ERP, WMS, MES, Excel, papel), tecnologías de identificación y nivel de integración entre plataformas.',
    preguntasGuia: [
      '¿Quién digita el dato en el sistema y cuánto tiempo pasa desde que ocurre el evento físico en planta?',
      '¿Qué información sigue viviendo únicamente en planillas Excel o formatos impresos?',
    ],
  },
  {
    id: 'trazabilidad',
    numero: '04',
    titulo: 'Cobertura de Trazabilidad y Normativas',
    tituloCorto: 'Cobertura y Recall',
    descripcion:
      'Evaluación de trazabilidad hacia atrás, interna y hacia adelante, tiempos de respuesta en simulacros de retiro y exigencias regulatorias.',
    preguntasGuia: [
      'Si un proveedor reporta un insumo contaminado o defectuoso, ¿en cuántos minutos saben qué clientes recibieron ese lote?',
      '¿Qué auditorías externas o clientes les exigen trazabilidad estricta hoy?',
    ],
  },
  {
    id: 'brechas',
    numero: '05',
    titulo: 'Puntos Críticos, Brechas y Dolor Operativo',
    tituloCorto: 'Brechas y Hallazgos',
    descripcion:
      'Registro de quiebres de trazabilidad, cuellos de botella, retrabajos y errores frecuentes identificados durante la conversación.',
    preguntasGuia: [
      '¿Cuál es el error más costoso o frecuente cuando intentan reconstruir la historia de un lote?',
      '¿Qué pasa si falta una persona clave de calidad o bodega el día de una auditoría?',
    ],
  },
  {
    id: 'cierre',
    numero: '06',
    titulo: 'Prioridades, Restricciones y Cierre',
    tituloCorto: 'Prioridades y Cierre',
    descripcion:
      'Expectativas de mejora, limitaciones técnicas o físicas en planta, documentación solicitada y acuerdos de seguimiento.',
    preguntasGuia: [
      'Si solo pudieran resolver un problema de trazabilidad en los próximos 90 días, ¿cuál elegirían?',
      '¿Existen zonas sin Wi-Fi, cámaras frías, humedad o maquinaria antigua que condicionen la captura?',
    ],
  },
];

export const SECTORES_EMPRESA = [
  'Alimentos y Bebidas',
  'Agroindustria y Cárnicos',
  'Farmacéutico y Cosmético',
  'Manufactura Discreta / Autopartes',
  'Químico y Plásticos',
  'Logística, 3PL y Distribución',
  'Retail y Comercio',
  'Otro',
];

export const AREAS_EMPRESA = [
  'Operaciones / Planta',
  'Calidad e Inocuidad',
  'Logística y Bodega',
  'TI / Sistemas',
  'Producción',
  'Cadena de Suministro / Compras',
  'Gerencia General',
  'Otro',
];

export const SISTEMAS_DISPONIBLES = [
  'ERP (SAP / Oracle / Dynamics / Odoo)',
  'WMS (Gestión de Almacenes)',
  'MES (Ejecución de Manufactura)',
  'LIMS (Control de Calidad / Laboratorio)',
  'SCADA / PLC / Automatización',
  'Sistema propio / desarrollo interno',
  'Hojas de cálculo (Excel / Google Sheets)',
  'Registros en papel / carpetas físicas',
];

export const TECNOLOGIAS_IDENTIFICACION = [
  'Código de barras 1D (EAN / Code 128)',
  'Código 2D (QR / DataMatrix / GS1-128)',
  'Etiquetas RFID / NFC',
  'Lectores portátiles / Handhelds / PDA',
  'Tablets o terminales fijas en línea',
  'Balanzas o sensores conectados (IoT)',
  'Marcado láser / Inkjet en línea',
  'Etiquetado manual / digitación en PC',
];

export const NORMATIVAS_DISPONIBLES = [
  'ISO 9001 (Gestión de Calidad)',
  'ISO 22000 / FSSC 22000 / HACCP',
  'BPM / GMP (Buenas Prácticas de Manufactura)',
  'Estándares GS1 (GTIN / SSCC)',
  'FDA / FSMA 204',
  'Autoridad sanitaria local (INVIMA / COFEPRIS / SENASA / SAG)',
  'Requisitos de exportación o retail',
];

export const IDENTIFICADORES_ETAPA = [
  'Lote proveedor',
  'Lote interno',
  'Orden de producción (OP)',
  'Número de serie',
  'Pallet / SSCC',
  'Código de caja / bulto',
  'Guía / Remisión',
  'Sin identificador formal',
];

export function generateId(prefix = 'id'): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

export function getDefaultProcessStages(): ProcessStage[] {
  return [
    {
      id: generateId('stg'),
      nombre: 'Recepción de Materias Primas e Insumos',
      areaResponsable: 'Logística y Bodega',
      sistemaORegistro: '',
      identificadorUsado: 'Lote proveedor',
      datosCapturados: '',
      tienePuntoQuiebre: false,
      detalleQuiebre: '',
    },
    {
      id: generateId('stg'),
      nombre: 'Inspección y Control de Calidad de Ingreso',
      areaResponsable: 'Calidad e Inocuidad',
      sistemaORegistro: '',
      identificadorUsado: 'Lote interno',
      datosCapturados: '',
      tienePuntoQuiebre: false,
      detalleQuiebre: '',
    },
    {
      id: generateId('stg'),
      nombre: 'Almacenamiento y Surtido a Planta',
      areaResponsable: 'Logística y Bodega',
      sistemaORegistro: '',
      identificadorUsado: 'Lote interno',
      datosCapturados: '',
      tienePuntoQuiebre: false,
      detalleQuiebre: '',
    },
    {
      id: generateId('stg'),
      nombre: 'Transformación / Producción',
      areaResponsable: 'Producción',
      sistemaORegistro: '',
      identificadorUsado: 'Orden de producción (OP)',
      datosCapturados: '',
      tienePuntoQuiebre: false,
      detalleQuiebre: '',
    },
    {
      id: generateId('stg'),
      nombre: 'Empaque, Paletizado y Etiquetado',
      areaResponsable: 'Producción',
      sistemaORegistro: '',
      identificadorUsado: 'Pallet / SSCC',
      datosCapturados: '',
      tienePuntoQuiebre: false,
      detalleQuiebre: '',
    },
    {
      id: generateId('stg'),
      nombre: 'Despacho y Distribución a Clientes',
      areaResponsable: 'Logística y Bodega',
      sistemaORegistro: '',
      identificadorUsado: 'Guía / Remisión',
      datosCapturados: '',
      tienePuntoQuiebre: false,
      detalleQuiebre: '',
    },
  ];
}

export function createBlankInterview(): InterviewRecord {
  const now = new Date().toISOString();
  const today = now.slice(0, 10);

  return {
    id: generateId('ent'),
    status: 'en_curso',
    createdAt: now,
    updatedAt: now,
    contexto: {
      empresa: '',
      plantaOSede: '',
      sector: '',
      volumenOperacion: '',
      entrevistadoNombre: '',
      entrevistadoCargo: '',
      entrevistadoArea: '',
      entrevistador: '',
      fechaEntrevista: today,
      alcanceEntrevista: '',
      objetivoEspecifico: '',
    },
    proceso: {
      etapas: getDefaultProcessStages(),
      unidadMinimaTrazable: '',
      manejoMezclasYFraccionamiento: '',
      manejoReprocesosYDevoluciones: '',
      notasProceso: '',
    },
    sistemas: {
      sistemasActivos: [],
      detalleOtrosSistemas: '',
      tecnologiasIdentificacion: [],
      puntoDeCaptura: '',
      nivelIntegracion: '',
      frecuenciaActualizacion: '',
      dependenciaPapelOExcel: '',
      notasSistemas: '',
    },
    trazabilidad: {
      trazabilidadAtrasEstado: '',
      trazabilidadAtrasDetalle: '',
      trazabilidadInternaEstado: '',
      trazabilidadInternaDetalle: '',
      trazabilidadAdelanteEstado: '',
      trazabilidadAdelanteDetalle: '',
      tiempoSimulacroRecall: '',
      ultimoSimulacroFechaYResultado: '',
      normativasAplicables: [],
      otrasNormativas: '',
    },
    brechas: {
      hallazgos: [],
      cuellosDeBotella: '',
      erroresFrecuentesCaptura: '',
      dependenciaPersonasClave: '',
    },
    cierre: {
      objetivosPrincipales: '',
      restriccionesPisoYTecnicas: '',
      presupuestoYHorizonte: '',
      documentosSolicitados: '',
      proximosPasos: '',
      observacionesEntrevistador: '',
    },
    followUpKeys: [],
    notasRapidas: '',
  };
}

export function createSampleInterview(): InterviewRecord {
  const now = new Date().toISOString();
  return {
    id: generateId('ent'),
    status: 'completada',
    createdAt: now,
    updatedAt: now,
    contexto: {
      empresa: 'Alimentos Andinos del Sur S.A.',
      plantaOSede: 'Planta Central — Zona Industrial Norte',
      sector: 'Alimentos y Bebidas',
      volumenOperacion: '45 lotes diarios · ~18,000 cajas/día en 2 turnos',
      entrevistadoNombre: 'Ing. Carolina Mendoza',
      entrevistadoCargo: 'Jefa de Aseguramiento de Calidad',
      entrevistadoArea: 'Calidad e Inocuidad',
      entrevistador: 'Equipo de Consultoría de Procesos',
      fechaEntrevista: now.slice(0, 10),
      alcanceEntrevista: 'Líneas 1 y 2 de Salsas y Conservas + Bodega Central',
      objetivoEspecifico:
        'Diagnosticar brechas actuales entre el registro en planta y el ERP para reducir el tiempo de simulacro de retiro por debajo de 2 horas.',
    },
    proceso: {
      etapas: [
        {
          id: generateId('stg'),
          nombre: 'Recepción de Materias Primas e Insumos',
          areaResponsable: 'Logística y Bodega',
          sistemaORegistro: 'SAP Business One + Planilla recepción papel',
          identificadorUsado: 'Lote proveedor',
          datosCapturados: 'Proveedor, fecha recepción, lote externo, peso bruto, temperatura',
          tienePuntoQuiebre: false,
          detalleQuiebre: '',
        },
        {
          id: generateId('stg'),
          nombre: 'Inspección y Control de Calidad de Ingreso',
          areaResponsable: 'Calidad e Inocuidad',
          sistemaORegistro: 'Excel de Calidad (carpeta compartida)',
          identificadorUsado: 'Lote interno',
          datosCapturados: 'Brix, pH, certificado COA adjunto, estado Liberado/Cuarentena',
          tienePuntoQuiebre: true,
          detalleQuiebre:
            'El código de lote interno se asigna en Excel y no siempre queda vinculado al documento de entrada en SAP hasta el cierre del turno.',
        },
        {
          id: generateId('stg'),
          nombre: 'Dosificación y Mezclado en Calderas',
          areaResponsable: 'Producción',
          sistemaORegistro: 'Bitácora impresa por operador',
          identificadorUsado: 'Orden de producción (OP)',
          datosCapturados: 'Kilos consumidos por ingrediente, hora inicio/fin, operador',
          tienePuntoQuiebre: true,
          detalleQuiebre:
            'Cuando se fracciona un saco abierto entre dos turnos, el remanente pierde la etiqueta original del lote.',
        },
        {
          id: generateId('stg'),
          nombre: 'Envasado, Codificado Inkjet y Empaque',
          areaResponsable: 'Producción',
          sistemaORegistro: 'Codificador Inkjet + Reporte fin de turno',
          identificadorUsado: 'Lote interno',
          datosCapturados: 'Lote juliano, fecha vencimiento, merma de envases',
          tienePuntoQuiebre: false,
          detalleQuiebre: '',
        },
        {
          id: generateId('stg'),
          nombre: 'Paletizado y Despacho a Clientes',
          areaResponsable: 'Logística y Bodega',
          sistemaORegistro: 'SAP Business One (Guía de remisión)',
          identificadorUsado: 'Guía / Remisión',
          datosCapturados: 'SKU, cantidad de cajas, cliente destino',
          tienePuntoQuiebre: true,
          detalleQuiebre:
            'La factura/guía registra el SKU y cantidad total, pero no captura qué lotes específicos subieron a cada camión cuando salen lotes mezclados.',
        },
      ],
      unidadMinimaTrazable:
        'Caja master (12 unidades) con lote juliano impreso; el pallet aún no lleva etiqueta SSCC única.',
      manejoMezclasYFraccionamiento:
        'En mezclado se consumen múltiples lotes de especias por bachada; si sobra material en bolsa abierta, se guarda sin re-etiquetado formal.',
      manejoReprocesosYDevoluciones:
        'El reproceso por falla de sellado se reincorpora en la siguiente bachada anotando "reproceso" en la hoja física, sin trazabilidad de origen en el ERP.',
      notasProceso:
        'Los operadores de turno nocturno reportan al día siguiente, generando desfases de 12 a 18 horas en el inventario teórico.',
    },
    sistemas: {
      sistemasActivos: [
        'ERP (SAP / Oracle / Dynamics / Odoo)',
        'Hojas de cálculo (Excel / Google Sheets)',
        'Registros en papel / carpetas físicas',
      ],
      detalleOtrosSistemas: 'SAP Business One v10 (módulo inventarios y facturación) + 14 archivos Excel departamentales.',
      tecnologiasIdentificacion: [
        'Marcado láser / Inkjet en línea',
        'Etiquetado manual / digitación en PC',
      ],
      puntoDeCaptura:
        'Oficina de supervisión al finalizar cada turno de 8 horas (digitación diferida).',
      nivelIntegracion: 'doble_digitacion',
      frecuenciaActualizacion: 'Al cierre de cada turno o al final del día hábil.',
      dependenciaPapelOExcel:
        'Alta: toda la formulación real de planta, controles de temperatura y liberación de calidad nacen en papel y se transcriben a Excel.',
      notasSistemas:
        'Existe interés de TI en usar lectores de código de barras en bodega, pero no hay cobertura Wi-Fi estable en la zona de cámaras frías.',
    },
    trazabilidad: {
      trazabilidadAtrasEstado: 'parcial',
      trazabilidadAtrasDetalle:
        'Se conserva la factura del proveedor y COA en carpeta física, pero cruzar qué saco específico entró en qué bachada toma revisar planillas manuscritas.',
      trazabilidadInternaEstado: 'parcial',
      trazabilidadInternaDetalle:
        'La receta teórica está en SAP, pero el consumo real de lotes alternos y reprocesos solo consta en papel.',
      trazabilidadAdelanteEstado: 'inexistente',
      trazabilidadAdelanteDetalle:
        'Despacho registra cantidades por SKU en la guía, pero no escanea ni asocia los lotes despachados por cliente.',
      tiempoSimulacroRecall: '4_a_24h',
      ultimoSimulacroFechaYResultado:
        'Agosto 2026: tomó 9 horas y 40 minutos reconstruir el rastro completo con 3 personas dedicadas revisando archivadores.',
      normativasAplicables: [
        'ISO 22000 / FSSC 22000 / HACCP',
        'BPM / GMP (Buenas Prácticas de Manufactura)',
        'Autoridad sanitaria local (INVIMA / COFEPRIS / SENASA / SAG)',
      ],
      otrasNormativas: 'Auditoría anual de supermercados (exigen respuesta de traza en máximo 4 horas).',
    },
    brechas: {
      hallazgos: [
        {
          id: generateId('gap'),
          titulo: 'Despacho sin registro de lote por cliente',
          etapaAfectada: 'Paletizado y Despacho a Clientes',
          severidad: 'critica',
          impactoOperativo: 'Riesgo normativo y retiros masivos innecesarios',
          citaONota:
            '"Cuando un cliente llama por un lote específico, tenemos que asumir que pudo haber salido en cualquiera de los 3 camiones de esa semana."',
        },
        {
          id: generateId('gap'),
          titulo: 'Pérdida de identificación en insumos fraccionados',
          etapaAfectada: 'Dosificación y Mezclado en Calderas',
          severidad: 'alta',
          impactoOperativo: 'Quiebre de trazabilidad interna y descuadre de inventario',
          citaONota:
            'Los sacos abiertos de aditivos pasan de un turno a otro sin etiqueta de lote interno.',
        },
        {
          id: generateId('gap'),
          titulo: 'Doble digitación entre papel, Excel y SAP',
          etapaAfectada: 'Inspección y Control de Calidad de Ingreso',
          severidad: 'media',
          impactoOperativo: 'Retraso de 12–18h en visibilidad de stock y errores de transcripción',
          citaONota:
            'Calidad libera en Excel pero bodega a veces despacha antes de que el dato llegue a SAP.',
        },
      ],
      cuellosDeBotella:
        'Consolidación manual de planillas de producción al cierre del turno y búsqueda física de lotes en cámara de producto terminado.',
      erroresFrecuentesCaptura:
        'Transposición de dígitos en el código juliano al transcribir de hoja de turno a Excel; omisión del lote de envase secundario.',
      dependenciaPersonasClave:
        'Dos supervisores antiguos conocen de memoria qué estiba corresponde a qué día de producción cuando falla el rótulo.',
    },
    cierre: {
      objetivosPrincipales:
        '1) Capturar lote en despacho por cliente mediante escaneo. 2) Eliminar la transcripción manual en dosificación. 3) Cumplir auditorías retail (<4h recall).',
      restriccionesPisoYTecnicas:
        'Humedad y lavado a presión en zona de calderas; señal Wi-Fi débil en bodega de producto terminado; operarios con baja familiaridad con tablets.',
      presupuestoYHorizonte: 'Implementación por fases en Q1–Q2; prioridad inicial en Bodega y Despacho.',
      documentosSolicitados:
        'Diagrama de flujo de Línea 1, formato actual de bitácora de dosificación, catálogo maestro de SKUs y último informe de simulacro de recall.',
      proximosPasos:
        'Validar flujo físico en recorrido de planta el próximo martes y entrevistar al Jefe de Bodega para levantar ubicaciones.',
      observacionesEntrevistador:
        'Alta disposición del equipo de Calidad. El mayor retorno rápido está en incorporar escaneo de lote en despacho y re-etiquetado de saldos.',
    },
    followUpKeys: ['sistemas.nivelIntegracion', 'proceso.manejoReprocesosYDevoluciones'],
    notasRapidas:
      'Confirmar con TI si la licencia actual de SAP Business One permite carga vía Service Layer desde colectores Android.',
  };
}
