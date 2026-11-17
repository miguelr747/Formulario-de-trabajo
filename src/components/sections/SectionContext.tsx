import { AREAS_EMPRESA, SECTORES_EMPRESA } from '../../data/interviewCatalog';
import type { InterviewContextData } from '../../types/interview';
import { FieldWrapper, SelectInput, TextArea, TextInput } from '../FormField';

interface SectionContextProps {
  data: InterviewContextData;
  onChange: (next: InterviewContextData) => void;
  followUpKeys: string[];
  onToggleFlag: (key: string) => void;
}

export function SectionContext({
  data,
  onChange,
  followUpKeys,
  onToggleFlag,
}: SectionContextProps) {
  const update = <K extends keyof InterviewContextData>(
    key: K,
    value: InterviewContextData[K]
  ) => {
    onChange({ ...data, [key]: value });
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FieldWrapper
          id="ctx-empresa"
          label="Nombre de la empresa"
          fieldKey="contexto.empresa"
          isFlagged={followUpKeys.includes('contexto.empresa')}
          onToggleFlag={onToggleFlag}
        >
          <TextInput
            id="ctx-empresa"
            value={data.empresa}
            onChange={(e) => update('empresa', e.target.value)}
            placeholder="Ej. Alimentos Andinos S.A."
          />
        </FieldWrapper>

        <FieldWrapper
          id="ctx-planta"
          label="Planta, centro de distribución o sede"
          fieldKey="contexto.plantaOSede"
          isFlagged={followUpKeys.includes('contexto.plantaOSede')}
          onToggleFlag={onToggleFlag}
        >
          <TextInput
            id="ctx-planta"
            value={data.plantaOSede}
            onChange={(e) => update('plantaOSede', e.target.value)}
            placeholder="Ej. Planta Central — Línea Secos"
          />
        </FieldWrapper>

        <FieldWrapper
          id="ctx-sector"
          label="Sector o industria"
          fieldKey="contexto.sector"
          isFlagged={followUpKeys.includes('contexto.sector')}
          onToggleFlag={onToggleFlag}
        >
          <SelectInput
            id="ctx-sector"
            value={data.sector}
            onChange={(e) => update('sector', e.target.value)}
          >
            <option value="">Seleccionar sector...</option>
            {SECTORES_EMPRESA.map((sec) => (
              <option key={sec} value={sec}>
                {sec}
              </option>
            ))}
          </SelectInput>
        </FieldWrapper>

        <FieldWrapper
          id="ctx-volumen"
          label="Volumen operativo estimado"
          hint="Lotes, órdenes de producción, SKUs activos o despachos por día/mes."
          fieldKey="contexto.volumenOperacion"
          isFlagged={followUpKeys.includes('contexto.volumenOperacion')}
          onToggleFlag={onToggleFlag}
        >
          <TextInput
            id="ctx-volumen"
            value={data.volumenOperacion}
            onChange={(e) => update('volumenOperacion', e.target.value)}
            placeholder="Ej. 40 lotes/día · 120 SKUs · 2 turnos"
          />
        </FieldWrapper>
      </div>

      <div className="pt-6 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-6">
        <FieldWrapper
          id="ctx-entrevistado-nombre"
          label="Nombre del entrevistado"
          fieldKey="contexto.entrevistadoNombre"
          isFlagged={followUpKeys.includes('contexto.entrevistadoNombre')}
          onToggleFlag={onToggleFlag}
        >
          <TextInput
            id="ctx-entrevistado-nombre"
            value={data.entrevistadoNombre}
            onChange={(e) => update('entrevistadoNombre', e.target.value)}
            placeholder="Ej. Ing. Carolina Mendoza"
          />
        </FieldWrapper>

        <FieldWrapper
          id="ctx-entrevistado-cargo"
          label="Cargo o rol"
          fieldKey="contexto.entrevistadoCargo"
          isFlagged={followUpKeys.includes('contexto.entrevistadoCargo')}
          onToggleFlag={onToggleFlag}
        >
          <TextInput
            id="ctx-entrevistado-cargo"
            value={data.entrevistadoCargo}
            onChange={(e) => update('entrevistadoCargo', e.target.value)}
            placeholder="Ej. Jefe de Calidad / Coordinador Logístico"
          />
        </FieldWrapper>

        <FieldWrapper
          id="ctx-entrevistado-area"
          label="Área funcional"
          fieldKey="contexto.entrevistadoArea"
          isFlagged={followUpKeys.includes('contexto.entrevistadoArea')}
          onToggleFlag={onToggleFlag}
        >
          <SelectInput
            id="ctx-entrevistado-area"
            value={data.entrevistadoArea}
            onChange={(e) => update('entrevistadoArea', e.target.value)}
          >
            <option value="">Seleccionar área...</option>
            {AREAS_EMPRESA.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </SelectInput>
        </FieldWrapper>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FieldWrapper
            id="ctx-entrevistador"
            label="Entrevistador"
          >
            <TextInput
              id="ctx-entrevistador"
              value={data.entrevistador}
              onChange={(e) => update('entrevistador', e.target.value)}
              placeholder="Tu nombre"
            />
          </FieldWrapper>

          <FieldWrapper
            id="ctx-fecha"
            label="Fecha de entrevista"
          >
            <TextInput
              id="ctx-fecha"
              type="date"
              className="tabular-nums"
              value={data.fechaEntrevista}
              onChange={(e) => update('fechaEntrevista', e.target.value)}
            />
          </FieldWrapper>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-200 space-y-6">
        <FieldWrapper
          id="ctx-alcance"
          label="Alcance de la entrevista"
          hint="Especificar qué líneas de negocio, plantas, bodegas o procesos abarca este levantamiento."
          fieldKey="contexto.alcanceEntrevista"
          isFlagged={followUpKeys.includes('contexto.alcanceEntrevista')}
          onToggleFlag={onToggleFlag}
        >
          <TextInput
            id="ctx-alcance"
            value={data.alcanceEntrevista}
            onChange={(e) => update('alcanceEntrevista', e.target.value)}
            placeholder="Ej. Desde recepción de materia prima hasta despacho a distribuidores nacionales"
          />
        </FieldWrapper>

        <FieldWrapper
          id="ctx-objetivo"
          label="Objetivo principal declarado por la empresa"
          hint="¿Por qué están evaluando o revisando su sistema de trazabilidad hoy?"
          fieldKey="contexto.objetivoEspecifico"
          isFlagged={followUpKeys.includes('contexto.objetivoEspecifico')}
          onToggleFlag={onToggleFlag}
        >
          <TextArea
            id="ctx-objetivo"
            rows={3}
            value={data.objetivoEspecifico}
            onChange={(e) => update('objetivoEspecifico', e.target.value)}
            placeholder="Ej. Reducir tiempos de respuesta en auditorías de clientes y eliminar registros manuales en planta..."
          />
        </FieldWrapper>
      </div>
    </div>
  );
}
