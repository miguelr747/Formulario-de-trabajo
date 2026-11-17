import {
  SISTEMAS_DISPONIBLES,
  TECNOLOGIAS_IDENTIFICACION,
} from '../../data/interviewCatalog';
import type { IntegrationLevel, SystemsCaptureData } from '../../types/interview';
import {
  CheckboxOptionGrid,
  FieldWrapper,
  TextArea,
  TextInput,
} from '../FormField';

interface SectionSystemsProps {
  data: SystemsCaptureData;
  onChange: (next: SystemsCaptureData) => void;
  followUpKeys: string[];
  onToggleFlag: (key: string) => void;
}

const INTEGRATION_OPTIONS: { value: IntegrationLevel; label: string; desc: string }[] = [
  {
    value: 'tiempo_real',
    label: 'Tiempo real',
    desc: 'Integración automática vía API / base de datos compartida.',
  },
  {
    value: 'lotes_batch',
    label: 'Por lotes (Batch)',
    desc: 'Sincronización programada (ej. cada hora o cierre nocturno).',
  },
  {
    value: 'doble_digitacion',
    label: 'Doble digitación',
    desc: 'Alguien exporta o transcribe datos manualmente entre sistemas.',
  },
  {
    value: 'aislados',
    label: 'Sistemas aislados',
    desc: 'Cada área opera en islas sin cruce automático de datos.',
  },
];

export function SectionSystems({
  data,
  onChange,
  followUpKeys,
  onToggleFlag,
}: SectionSystemsProps) {
  return (
    <div className="space-y-8">
      <FieldWrapper
        id="sys-activos"
        label="Sistemas y herramientas donde residen datos de trazabilidad"
        hint="Selecciona todas las plataformas o formatos que intervienen hoy en la operación."
        fieldKey="sistemas.sistemasActivos"
        isFlagged={followUpKeys.includes('sistemas.sistemasActivos')}
        onToggleFlag={onToggleFlag}
      >
        <CheckboxOptionGrid
          options={SISTEMAS_DISPONIBLES}
          selected={data.sistemasActivos}
          onChange={(next) => onChange({ ...data, sistemasActivos: next })}
        />
      </FieldWrapper>

      <FieldWrapper
        id="sys-detalle"
        label="Nombres, versiones y módulos utilizados"
        hint="Ej. SAP Business One v10 (módulo inventarios), Odoo 16, desarrollo interno en SQL Server, etc."
      >
        <TextInput
          id="sys-detalle"
          value={data.detalleOtrosSistemas}
          onChange={(e) =>
            onChange({ ...data, detalleOtrosSistemas: e.target.value })
          }
          placeholder="Especificar software exacto y qué área administra cada uno"
        />
      </FieldWrapper>

      <div className="pt-6 border-t border-slate-200 space-y-6">
        <FieldWrapper
          id="sys-tecnologias"
          label="Tecnologías de identificación y captura en piso"
          hint="¿Cómo leen o registran los códigos físicos en recepción, planta y bodega?"
          fieldKey="sistemas.tecnologiasIdentificacion"
          isFlagged={followUpKeys.includes('sistemas.tecnologiasIdentificacion')}
          onToggleFlag={onToggleFlag}
        >
          <CheckboxOptionGrid
            options={TECNOLOGIAS_IDENTIFICACION}
            selected={data.tecnologiasIdentificacion}
            onChange={(next) =>
              onChange({ ...data, tecnologiasIdentificacion: next })
            }
          />
        </FieldWrapper>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FieldWrapper
            id="sys-punto-captura"
            label="¿En qué momento y lugar se captura el dato?"
            hint="Ej. En línea en tiempo real, o en oficina al final del turno."
            fieldKey="sistemas.puntoDeCaptura"
            isFlagged={followUpKeys.includes('sistemas.puntoDeCaptura')}
            onToggleFlag={onToggleFlag}
          >
            <TextInput
              id="sys-punto-captura"
              value={data.puntoDeCaptura}
              onChange={(e) =>
                onChange({ ...data, puntoDeCaptura: e.target.value })
              }
              placeholder="Ej. Supervisores digitan en oficina al terminar el turno"
            />
          </FieldWrapper>

          <FieldWrapper
            id="sys-frecuencia"
            label="Frecuencia de actualización en el sistema principal"
            hint="¿Cuánto tarda un movimiento físico en verse reflejado en el ERP o sistema central?"
            fieldKey="sistemas.frecuenciaActualizacion"
            isFlagged={followUpKeys.includes('sistemas.frecuenciaActualizacion')}
            onToggleFlag={onToggleFlag}
          >
            <TextInput
              id="sys-frecuencia"
              value={data.frecuenciaActualizacion}
              onChange={(e) =>
                onChange({ ...data, frecuenciaActualizacion: e.target.value })
              }
              placeholder="Ej. Inmediato / Cada 4 horas / Al día siguiente"
            />
          </FieldWrapper>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-200 space-y-6">
        <FieldWrapper
          id="sys-integracion"
          label="Nivel de integración entre sistemas"
          fieldKey="sistemas.nivelIntegracion"
          isFlagged={followUpKeys.includes('sistemas.nivelIntegracion')}
          onToggleFlag={onToggleFlag}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {INTEGRATION_OPTIONS.map((opt) => {
              const selected = data.nivelIntegracion === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() =>
                    onChange({
                      ...data,
                      nivelIntegracion: selected ? '' : opt.value,
                    })
                  }
                  aria-pressed={selected}
                  className={`p-3 text-left rounded-md border transition-colors cursor-pointer ${
                    selected
                      ? 'bg-blue-50/70 border-blue-600'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="text-sm font-semibold text-slate-900">
                    {opt.label}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5 leading-snug">
                    {opt.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </FieldWrapper>

        <FieldWrapper
          id="sys-papel"
          label="Dependencia de papel, planillas físicas o Excel"
          hint="Detalla qué procesos críticos dependen todavía de transcripción manual o archivos locales."
          fieldKey="sistemas.dependenciaPapelOExcel"
          isFlagged={followUpKeys.includes('sistemas.dependenciaPapelOExcel')}
          onToggleFlag={onToggleFlag}
        >
          <TextArea
            id="sys-papel"
            rows={3}
            value={data.dependenciaPapelOExcel}
            onChange={(e) =>
              onChange({ ...data, dependenciaPapelOExcel: e.target.value })
            }
            placeholder="Ej. Formatos impresos de control en proceso y 5 hojas Excel de calidad..."
          />
        </FieldWrapper>

        <FieldWrapper
          id="sys-notas"
          label="Notas técnicas adicionales (infraestructura, hardware disponible, APIs)"
        >
          <TextArea
            id="sys-notas"
            rows={2}
            value={data.notasSistemas}
            onChange={(e) =>
              onChange({ ...data, notasSistemas: e.target.value })
            }
            placeholder="Ej. Disponibilidad de red Wi-Fi, impresoras Zebra existentes, soporte TI interno..."
          />
        </FieldWrapper>
      </div>
    </div>
  );
}
