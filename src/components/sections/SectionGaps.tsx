import { Plus, Trash2 } from 'lucide-react';
import { generateId } from '../../data/interviewCatalog';
import type {
  GapFinding,
  GapsPainPointsData,
  ProcessStage,
  SeverityLevel,
} from '../../types/interview';
import {
  FieldWrapper,
  SelectInput,
  TextArea,
  TextInput,
} from '../FormField';

interface SectionGapsProps {
  data: GapsPainPointsData;
  stages: ProcessStage[];
  onChange: (next: GapsPainPointsData) => void;
  followUpKeys: string[];
  onToggleFlag: (key: string) => void;
}

const SEVERITIES: { value: SeverityLevel; label: string }[] = [
  { value: 'critica', label: 'Crítica' },
  { value: 'alta', label: 'Alta' },
  { value: 'media', label: 'Media' },
  { value: 'baja', label: 'Baja' },
];

export function SectionGaps({
  data,
  stages,
  onChange,
  followUpKeys,
  onToggleFlag,
}: SectionGapsProps) {
  const addFinding = () => {
    const next: GapFinding = {
      id: generateId('gap'),
      titulo: '',
      etapaAfectada: stages[0]?.nombre || 'General',
      severidad: 'alta',
      impactoOperativo: '',
      citaONota: '',
    };
    onChange({ ...data, hallazgos: [...data.hallazgos, next] });
  };

  const updateFinding = (id: string, patch: Partial<GapFinding>) => {
    onChange({
      ...data,
      hallazgos: data.hallazgos.map((h) =>
        h.id === id ? { ...h, ...patch } : h
      ),
    });
  };

  const removeFinding = (id: string) => {
    onChange({
      ...data,
      hallazgos: data.hallazgos.filter((h) => h.id !== id),
    });
  };

  const stageNames = Array.from(
    new Set(
      [...stages.map((s) => s.nombre).filter(Boolean), 'General / Transversal']
    )
  );

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Registro de brechas y hallazgos críticos
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Documenta cada punto de dolor, quiebre de información o riesgo mencionado durante la entrevista.
            </p>
          </div>
          <button
            type="button"
            onClick={addFinding}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar hallazgo</span>
          </button>
        </div>

        {data.hallazgos.length === 0 ? (
          <div className="border border-dashed border-slate-300 rounded-lg p-8 text-center bg-slate-50/50">
            <p className="text-sm font-medium text-slate-700">
              Aún no se han registrado hallazgos en esta entrevista.
            </p>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              A medida que el entrevistado mencione fallas de registro, retrabajos o pérdidas de lote, agrégalos aquí.
            </p>
            <button
              type="button"
              onClick={addFinding}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-blue-700 hover:bg-blue-800 rounded-md transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Registrar primer hallazgo</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg bg-white overflow-hidden">
            {data.hallazgos.map((h, idx) => (
              <div key={h.id} className="p-4 sm:p-5 space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-xs font-semibold text-slate-500 tabular-nums">
                    Hallazgo {String(idx + 1).padStart(2, '0')}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFinding(h.id)}
                    aria-label="Eliminar hallazgo"
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                  <div className="md:col-span-2">
                    <label
                      htmlFor={`gap-title-${h.id}`}
                      className="block text-xs font-medium text-slate-600 mb-1"
                    >
                      Título del problema o brecha
                    </label>
                    <TextInput
                      id={`gap-title-${h.id}`}
                      value={h.titulo}
                      onChange={(e) =>
                        updateFinding(h.id, { titulo: e.target.value })
                      }
                      placeholder="Ej. Despacho sin escaneo de lote por cliente"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor={`gap-sev-${h.id}`}
                      className="block text-xs font-medium text-slate-600 mb-1"
                    >
                      Severidad
                    </label>
                    <SelectInput
                      id={`gap-sev-${h.id}`}
                      value={h.severidad}
                      onChange={(e) =>
                        updateFinding(h.id, {
                          severidad: e.target.value as SeverityLevel,
                        })
                      }
                    >
                      {SEVERITIES.map((sev) => (
                        <option key={sev.value} value={sev.value}>
                          {sev.label}
                        </option>
                      ))}
                    </SelectInput>
                  </div>

                  <div>
                    <label
                      htmlFor={`gap-stage-${h.id}`}
                      className="block text-xs font-medium text-slate-600 mb-1"
                    >
                      Etapa del proceso afectada
                    </label>
                    <SelectInput
                      id={`gap-stage-${h.id}`}
                      value={h.etapaAfectada}
                      onChange={(e) =>
                        updateFinding(h.id, { etapaAfectada: e.target.value })
                      }
                    >
                      {stageNames.map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                    </SelectInput>
                  </div>

                  <div className="md:col-span-2">
                    <label
                      htmlFor={`gap-imp-${h.id}`}
                      className="block text-xs font-medium text-slate-600 mb-1"
                    >
                      Impacto operativo o financiero
                    </label>
                    <TextInput
                      id={`gap-imp-${h.id}`}
                      value={h.impactoOperativo}
                      onChange={(e) =>
                        updateFinding(h.id, {
                          impactoOperativo: e.target.value,
                        })
                      }
                      placeholder="Ej. Retraso en auditorías, retiros masivos innecesarios, pérdida de stock..."
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label
                      htmlFor={`gap-note-${h.id}`}
                      className="block text-xs font-medium text-slate-600 mb-1"
                    >
                      Evidencia o cita textual del entrevistado
                    </label>
                    <TextArea
                      id={`gap-note-${h.id}`}
                      rows={2}
                      value={h.citaONota}
                      onChange={(e) =>
                        updateFinding(h.id, { citaONota: e.target.value })
                      }
                      placeholder="Anota frases clave o ejemplos concretos que mencionó el entrevistado..."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="pt-6 border-t border-slate-200 space-y-6">
        <FieldWrapper
          id="gap-cuellos"
          label="Principales cuellos de botella en el registro de información"
          fieldKey="brechas.cuellosDeBotella"
          isFlagged={followUpKeys.includes('brechas.cuellosDeBotella')}
          onToggleFlag={onToggleFlag}
        >
          <TextArea
            id="gap-cuellos"
            rows={3}
            value={data.cuellosDeBotella}
            onChange={(e) =>
              onChange({ ...data, cuellosDeBotella: e.target.value })
            }
            placeholder="Ej. Espera de liberación de calidad antes de poder facturar o consolidación de planillas al final del día..."
          />
        </FieldWrapper>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FieldWrapper
            id="gap-errores"
            label="Errores frecuentes en captura o etiquetado"
            fieldKey="brechas.erroresFrecuentesCaptura"
            isFlagged={followUpKeys.includes('brechas.erroresFrecuentesCaptura')}
            onToggleFlag={onToggleFlag}
          >
            <TextArea
              id="gap-errores"
              rows={3}
              value={data.erroresFrecuentesCaptura}
              onChange={(e) =>
                onChange({ ...data, erroresFrecuentesCaptura: e.target.value })
              }
              placeholder="Ej. Dígitos invertidos al teclear lotes, etiquetas dañadas por humedad, omisión de mermas..."
            />
          </FieldWrapper>

          <FieldWrapper
            id="gap-personas"
            label="Dependencia de personas clave o conocimiento tácito"
            fieldKey="brechas.dependenciaPersonasClave"
            isFlagged={followUpKeys.includes('brechas.dependenciaPersonasClave')}
            onToggleFlag={onToggleFlag}
          >
            <TextArea
              id="gap-personas"
              rows={3}
              value={data.dependenciaPersonasClave}
              onChange={(e) =>
                onChange({ ...data, dependenciaPersonasClave: e.target.value })
              }
              placeholder="Ej. Solo una persona en calidad sabe cruzar las planillas de los últimos 6 meses..."
            />
          </FieldWrapper>
        </div>
      </div>
    </div>
  );
}
