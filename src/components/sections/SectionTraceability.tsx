import { NORMATIVAS_DISPONIBLES } from '../../data/interviewCatalog';
import type {
  CoverageState,
  RecallResponseTime,
  TraceabilityCoverageData,
} from '../../types/interview';
import {
  CheckboxOptionGrid,
  FieldWrapper,
  TextArea,
  TextInput,
} from '../FormField';

interface SectionTraceabilityProps {
  data: TraceabilityCoverageData;
  onChange: (next: TraceabilityCoverageData) => void;
  followUpKeys: string[];
  onToggleFlag: (key: string) => void;
}

const COVERAGE_STATES: {
  value: CoverageState;
  label: string;
  activeClass: string;
}[] = [
  {
    value: 'completo',
    label: 'Completa y digital',
    activeClass: 'bg-emerald-50 border-emerald-600 text-emerald-900',
  },
  {
    value: 'parcial',
    label: 'Parcial / mixta',
    activeClass: 'bg-amber-50 border-amber-600 text-amber-900',
  },
  {
    value: 'inexistente',
    label: 'Inexistente / manual',
    activeClass: 'bg-red-50 border-red-600 text-red-900',
  },
];

const RECALL_OPTIONS: { value: RecallResponseTime; label: string }[] = [
  { value: 'menos_1h', label: 'Menos de 1 hora' },
  { value: '1_a_4h', label: '1 a 4 horas' },
  { value: '4_a_24h', label: '4 a 24 horas' },
  { value: 'mas_24h', label: 'Más de 24 horas' },
  { value: 'no_probado', label: 'Nunca probado' },
];

export function SectionTraceability({
  data,
  onChange,
  followUpKeys,
  onToggleFlag,
}: SectionTraceabilityProps) {
  const renderCoverageBlock = (
    title: string,
    description: string,
    stateKey:
      | 'trazabilidadAtrasEstado'
      | 'trazabilidadInternaEstado'
      | 'trazabilidadAdelanteEstado',
    detailKey:
      | 'trazabilidadAtrasDetalle'
      | 'trazabilidadInternaDetalle'
      | 'trazabilidadAdelanteDetalle',
    placeholder: string
  ) => {
    const currentState = data[stateKey];
    const currentDetail = data[detailKey];
    const flagKey = `trazabilidad.${stateKey}`;

    return (
      <div className="p-5 border border-slate-200 rounded-lg bg-white space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-semibold text-slate-900">{title}</h4>
            <p className="text-xs text-slate-500 mt-0.5">{description}</p>
          </div>
          <button
            type="button"
            onClick={() => onToggleFlag(flagKey)}
            className={`self-start text-xs font-medium px-2 py-1 rounded transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              followUpKeys.includes(flagKey)
                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            {followUpKeys.includes(flagKey) ? 'Pendiente de validar' : 'Marcar pendiente'}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {COVERAGE_STATES.map((opt) => {
            const active = currentState === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                aria-pressed={active}
                onClick={() =>
                  onChange({
                    ...data,
                    [stateKey]: active ? '' : opt.value,
                  })
                }
                className={`min-h-[40px] px-3 py-2 text-xs font-semibold rounded-md border transition-colors cursor-pointer ${
                  active
                    ? opt.activeClass
                    : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        <div>
          <label
            htmlFor={`cov-${detailKey}`}
            className="block text-xs font-medium text-slate-600 mb-1"
          >
            Evidencia y funcionamiento actual
          </label>
          <TextArea
            id={`cov-${detailKey}`}
            rows={2}
            value={currentDetail}
            onChange={(e) =>
              onChange({ ...data, [detailKey]: e.target.value })
            }
            placeholder={placeholder}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        {renderCoverageBlock(
          'Trazabilidad hacia atrás (Proveedores y Materias Primas)',
          '¿Cómo se vincula el lote, certificado de calidad y proveedor de origen con la recepción en planta?',
          'trazabilidadAtrasEstado',
          'trazabilidadAtrasDetalle',
          'Ej. Se registra lote proveedor al ingreso, pero los certificados COA quedan en archivador físico...'
        )}

        {renderCoverageBlock(
          'Trazabilidad interna (Transformación y Proceso)',
          '¿Se conoce con certeza qué lotes de insumos, máquinas, operadores y parámetros intervinieron en cada lote fabricado?',
          'trazabilidadInternaEstado',
          'trazabilidadInternaDetalle',
          'Ej. Se anota la orden de producción en papel; los cambios de lote a mitad de turno no siempre se registran...'
        )}

        {renderCoverageBlock(
          'Trazabilidad hacia adelante (Despacho y Clientes)',
          '¿Es posible saber exactamente qué clientes o puntos de entrega recibieron un lote específico?',
          'trazabilidadAdelanteEstado',
          'trazabilidadAdelanteDetalle',
          'Ej. La factura muestra el SKU y cantidad, pero no el número de lote despachado...'
        )}
      </div>

      <div className="pt-6 border-t border-slate-200 space-y-6">
        <FieldWrapper
          id="traz-recall-time"
          label="Tiempo real de respuesta ante un simulacro de retiro (Recall)"
          hint="¿Cuánto tarda hoy reconstruir el rastro completo desde materia prima hasta cliente final (o viceversa)?"
          fieldKey="trazabilidad.tiempoSimulacroRecall"
          isFlagged={followUpKeys.includes('trazabilidad.tiempoSimulacroRecall')}
          onToggleFlag={onToggleFlag}
        >
          <div className="flex flex-wrap gap-2">
            {RECALL_OPTIONS.map((opt) => {
              const active = data.tiempoSimulacroRecall === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() =>
                    onChange({
                      ...data,
                      tiempoSimulacroRecall: active ? '' : opt.value,
                    })
                  }
                  className={`min-h-[40px] px-3.5 py-2 text-xs font-semibold rounded-md border transition-colors whitespace-nowrap cursor-pointer ${
                    active
                      ? 'bg-blue-50 border-blue-600 text-blue-800'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </FieldWrapper>

        <FieldWrapper
          id="traz-ultimo-simulacro"
          label="Fecha y resultado del último simulacro o auditoría de trazabilidad"
        >
          <TextInput
            id="traz-ultimo-simulacro"
            value={data.ultimoSimulacroFechaYResultado}
            onChange={(e) =>
              onChange({
                ...data,
                ultimoSimulacroFechaYResultado: e.target.value,
              })
            }
            placeholder="Ej. Agosto 2026: tomó 8 horas con 3 personas revisando planillas"
          />
        </FieldWrapper>
      </div>

      <div className="pt-6 border-t border-slate-200 space-y-6">
        <FieldWrapper
          id="traz-normativas"
          label="Normativas, certificaciones y requisitos de clientes aplicables"
          fieldKey="trazabilidad.normativasAplicables"
          isFlagged={followUpKeys.includes('trazabilidad.normativasAplicables')}
          onToggleFlag={onToggleFlag}
        >
          <CheckboxOptionGrid
            options={NORMATIVAS_DISPONIBLES}
            selected={data.normativasAplicables}
            onChange={(next) =>
              onChange({ ...data, normativasAplicables: next })
            }
          />
        </FieldWrapper>

        <FieldWrapper
          id="traz-otras-normativas"
          label="Otras normativas o exigencias específicas de clientes"
        >
          <TextInput
            id="traz-otras-normativas"
            value={data.otrasNormativas}
            onChange={(e) =>
              onChange({ ...data, otrasNormativas: e.target.value })
            }
            placeholder="Ej. Exigencia de cadena retail de trazabilidad GS1-128 en menos de 4 horas"
          />
        </FieldWrapper>
      </div>
    </div>
  );
}
