import { ArrowDown, ArrowUp, Plus, Trash2, AlertTriangle } from 'lucide-react';
import {
  AREAS_EMPRESA,
  IDENTIFICADORES_ETAPA,
  generateId,
} from '../../data/interviewCatalog';
import type { ProcessMapData, ProcessStage } from '../../types/interview';
import { FieldWrapper, SelectInput, TextArea, TextInput } from '../FormField';

interface SectionProcessMapProps {
  data: ProcessMapData;
  onChange: (next: ProcessMapData) => void;
  followUpKeys: string[];
  onToggleFlag: (key: string) => void;
}

export function SectionProcessMap({
  data,
  onChange,
  followUpKeys,
  onToggleFlag,
}: SectionProcessMapProps) {
  const updateStage = (id: string, patch: Partial<ProcessStage>) => {
    onChange({
      ...data,
      etapas: data.etapas.map((etapa) =>
        etapa.id === id ? { ...etapa, ...patch } : etapa
      ),
    });
  };

  const addStage = () => {
    const newStage: ProcessStage = {
      id: generateId('stg'),
      nombre: '',
      areaResponsable: '',
      sistemaORegistro: '',
      identificadorUsado: 'Lote interno',
      datosCapturados: '',
      tienePuntoQuiebre: false,
      detalleQuiebre: '',
    };
    onChange({ ...data, etapas: [...data.etapas, newStage] });
  };

  const removeStage = (id: string) => {
    onChange({
      ...data,
      etapas: data.etapas.filter((etapa) => etapa.id !== id),
    });
  };

  const moveStage = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= data.etapas.length) return;
    const next = [...data.etapas];
    const [moved] = next.splice(index, 1);
    next.splice(target, 0, moved);
    onChange({ ...data, etapas: next });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Cadena de etapas del proceso
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Documenta el flujo real paso a paso. Ajusta, reordena o agrega etapas según lo descrito en la entrevista.
            </p>
          </div>
          <button
            type="button"
            onClick={addStage}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar etapa</span>
          </button>
        </div>

        {data.etapas.length === 0 ? (
          <div className="border border-dashed border-slate-300 rounded-lg p-8 text-center bg-slate-50/50">
            <p className="text-sm font-medium text-slate-700">
              No hay etapas registradas en el flujo.
            </p>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Agrega la primera etapa operativa (por ejemplo, Recepción de Materia Prima).
            </p>
            <button
              type="button"
              onClick={addStage}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-blue-700 hover:bg-blue-800 rounded-md transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Agregar primera etapa</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg bg-white overflow-hidden">
            {data.etapas.map((etapa, idx) => (
              <div
                key={etapa.id}
                className={`p-4 sm:p-5 transition-colors ${
                  etapa.tienePuntoQuiebre ? 'bg-red-50/30' : 'bg-white'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-semibold text-slate-500 tabular-nums">
                      Etapa {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className="text-slate-300" aria-hidden="true">
                      /
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateStage(etapa.id, {
                          tienePuntoQuiebre: !etapa.tienePuntoQuiebre,
                        })
                      }
                      aria-pressed={etapa.tienePuntoQuiebre}
                      className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded border transition-colors cursor-pointer ${
                        etapa.tienePuntoQuiebre
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>
                        {etapa.tienePuntoQuiebre
                          ? 'Punto de quiebre marcado'
                          : 'Marcar quiebre de traza'}
                      </span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveStage(idx, -1)}
                      disabled={idx === 0}
                      aria-label="Subir etapa"
                      className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveStage(idx, 1)}
                      disabled={idx === data.etapas.length - 1}
                      aria-label="Bajar etapa"
                      className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeStage(etapa.id)}
                      aria-label="Eliminar etapa"
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  <div className="lg:col-span-2">
                    <label
                      htmlFor={`stage-name-${etapa.id}`}
                      className="block text-xs font-medium text-slate-600 mb-1"
                    >
                      Nombre de la etapa
                    </label>
                    <TextInput
                      id={`stage-name-${etapa.id}`}
                      value={etapa.nombre}
                      onChange={(e) =>
                        updateStage(etapa.id, { nombre: e.target.value })
                      }
                      placeholder="Ej. Recepción de materia prima"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor={`stage-area-${etapa.id}`}
                      className="block text-xs font-medium text-slate-600 mb-1"
                    >
                      Área responsable
                    </label>
                    <SelectInput
                      id={`stage-area-${etapa.id}`}
                      value={etapa.areaResponsable}
                      onChange={(e) =>
                        updateStage(etapa.id, { areaResponsable: e.target.value })
                      }
                    >
                      <option value="">Seleccionar...</option>
                      {AREAS_EMPRESA.map((area) => (
                        <option key={area} value={area}>
                          {area}
                        </option>
                      ))}
                    </SelectInput>
                  </div>

                  <div>
                    <label
                      htmlFor={`stage-id-${etapa.id}`}
                      className="block text-xs font-medium text-slate-600 mb-1"
                    >
                      Identificador usado
                    </label>
                    <SelectInput
                      id={`stage-id-${etapa.id}`}
                      value={etapa.identificadorUsado}
                      onChange={(e) =>
                        updateStage(etapa.id, {
                          identificadorUsado: e.target.value,
                        })
                      }
                    >
                      <option value="">Seleccionar...</option>
                      {IDENTIFICADORES_ETAPA.map((ident) => (
                        <option key={ident} value={ident}>
                          {ident}
                        </option>
                      ))}
                    </SelectInput>
                  </div>

                  <div className="lg:col-span-2">
                    <label
                      htmlFor={`stage-sys-${etapa.id}`}
                      className="block text-xs font-medium text-slate-600 mb-1"
                    >
                      ¿Dónde se registra hoy? (Sistema, Excel o papel)
                    </label>
                    <TextInput
                      id={`stage-sys-${etapa.id}`}
                      value={etapa.sistemaORegistro}
                      onChange={(e) =>
                        updateStage(etapa.id, {
                          sistemaORegistro: e.target.value,
                        })
                      }
                      placeholder="Ej. SAP + bitácora física de operador"
                    />
                  </div>

                  <div className="lg:col-span-2">
                    <label
                      htmlFor={`stage-data-${etapa.id}`}
                      className="block text-xs font-medium text-slate-600 mb-1"
                    >
                      Datos clave capturados en esta etapa
                    </label>
                    <TextInput
                      id={`stage-data-${etapa.id}`}
                      value={etapa.datosCapturados}
                      onChange={(e) =>
                        updateStage(etapa.id, {
                          datosCapturados: e.target.value,
                        })
                      }
                      placeholder="Ej. Lote, peso neto, temperatura, operario, hora"
                    />
                  </div>
                </div>

                {etapa.tienePuntoQuiebre && (
                  <div className="mt-3.5 pt-3.5 border-t border-red-200/80">
                    <label
                      htmlFor={`stage-break-${etapa.id}`}
                      className="block text-xs font-semibold text-red-800 mb-1"
                    >
                      ¿Qué provoca la pérdida de trazabilidad en esta etapa?
                    </label>
                    <TextInput
                      id={`stage-break-${etapa.id}`}
                      value={etapa.detalleQuiebre}
                      onChange={(e) =>
                        updateStage(etapa.id, { detalleQuiebre: e.target.value })
                      }
                      placeholder="Ej. No se vincula el lote proveedor con la orden de producción o se re-envasa sin etiqueta"
                      className="border-red-200 focus:border-red-500 focus:ring-red-500/15"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="pt-6 border-t border-slate-200 space-y-6">
        <FieldWrapper
          id="proc-unidad"
          label="Unidad mínima trazable actual"
          hint="¿Hasta qué nivel llegan hoy? (pieza individual / número de serie, unidad de consumo, caja, lote de producción, pallet)."
          fieldKey="proceso.unidadMinimaTrazable"
          isFlagged={followUpKeys.includes('proceso.unidadMinimaTrazable')}
          onToggleFlag={onToggleFlag}
        >
          <TextInput
            id="proc-unidad"
            value={data.unidadMinimaTrazable}
            onChange={(e) =>
              onChange({ ...data, unidadMinimaTrazable: e.target.value })
            }
            placeholder="Ej. Lote de producción por turno impreso en caja master"
          />
        </FieldWrapper>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FieldWrapper
            id="proc-mezclas"
            label="Manejo de mezclas, baches y fraccionamiento"
            hint="¿Qué ocurre cuando un lote de insumo se divide en varios turnos o varios lotes se mezclan en un tanque/lote?"
            fieldKey="proceso.manejoMezclasYFraccionamiento"
            isFlagged={followUpKeys.includes(
              'proceso.manejoMezclasYFraccionamiento'
            )}
            onToggleFlag={onToggleFlag}
          >
            <TextArea
              id="proc-mezclas"
              rows={3}
              value={data.manejoMezclasYFraccionamiento}
              onChange={(e) =>
                onChange({
                  ...data,
                  manejoMezclasYFraccionamiento: e.target.value,
                })
              }
              placeholder="Describir cómo conservan o pierden la relación padre-hijo en mezclas y saldos..."
            />
          </FieldWrapper>

          <FieldWrapper
            id="proc-reprocesos"
            label="Manejo de reprocesos, mermas y devoluciones"
            hint="¿Cómo se identifica un producto reprocesado o devuelto por cliente que vuelve al flujo?"
            fieldKey="proceso.manejoReprocesosYDevoluciones"
            isFlagged={followUpKeys.includes(
              'proceso.manejoReprocesosYDevoluciones'
            )}
            onToggleFlag={onToggleFlag}
          >
            <TextArea
              id="proc-reprocesos"
              rows={3}
              value={data.manejoReprocesosYDevoluciones}
              onChange={(e) =>
                onChange({
                  ...data,
                  manejoReprocesosYDevoluciones: e.target.value,
                })
              }
              placeholder="Ej. Se reincorpora en la siguiente orden anotado en papel sin código nuevo..."
            />
          </FieldWrapper>
        </div>

        <FieldWrapper
          id="proc-notas"
          label="Observaciones adicionales del flujo operativo"
        >
          <TextArea
            id="proc-notas"
            rows={2}
            value={data.notasProceso}
            onChange={(e) =>
              onChange({ ...data, notasProceso: e.target.value })
            }
            placeholder="Particularidades de turnos, maquilas externas, almacenamiento temporal, etc."
          />
        </FieldWrapper>
      </div>
    </div>
  );
}
