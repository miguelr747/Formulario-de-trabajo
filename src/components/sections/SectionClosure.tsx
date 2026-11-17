import type { ClosurePrioritiesData } from '../../types/interview';
import { FieldWrapper, TextArea, TextInput } from '../FormField';

interface SectionClosureProps {
  data: ClosurePrioritiesData;
  onChange: (next: ClosurePrioritiesData) => void;
  followUpKeys: string[];
  onToggleFlag: (key: string) => void;
}

export function SectionClosure({
  data,
  onChange,
  followUpKeys,
  onToggleFlag,
}: SectionClosureProps) {
  const update = <K extends keyof ClosurePrioritiesData>(
    key: K,
    value: ClosurePrioritiesData[K]
  ) => {
    onChange({ ...data, [key]: value });
  };

  return (
    <div className="space-y-6">
      <FieldWrapper
        id="cie-objetivos"
        label="Prioridades de mejora declaradas para los próximos meses"
        hint="¿Qué impacto esperan lograr primero si intervienen su sistema de trazabilidad?"
        fieldKey="cierre.objetivosPrincipales"
        isFlagged={followUpKeys.includes('cierre.objetivosPrincipales')}
        onToggleFlag={onToggleFlag}
      >
        <TextArea
          id="cie-objetivos"
          rows={3}
          value={data.objetivosPrincipales}
          onChange={(e) => update('objetivosPrincipales', e.target.value)}
          placeholder="Ej. 1) Trazabilidad de despacho por lote. 2) Digitalizar consumo en planta. 3) Reducir tiempo de auditoría..."
        />
      </FieldWrapper>

      <FieldWrapper
        id="cie-restricciones"
        label="Restricciones físicas, operativas o de infraestructura"
        hint="Conectividad Wi-Fi en bodegas, cuartos fríos, lavado a presión, turnos nocturnos, resistencia al cambio o sistemas legados."
        fieldKey="cierre.restriccionesPisoYTecnicas"
        isFlagged={followUpKeys.includes('cierre.restriccionesPisoYTecnicas')}
        onToggleFlag={onToggleFlag}
      >
        <TextArea
          id="cie-restricciones"
          rows={3}
          value={data.restriccionesPisoYTecnicas}
          onChange={(e) =>
            update('restriccionesPisoYTecnicas', e.target.value)
          }
          placeholder="Ej. Baja señal Wi-Fi en zona de despacho, ambiente húmedo en planta, ERP cerrado sin API..."
        />
      </FieldWrapper>

      <FieldWrapper
        id="cie-horizonte"
        label="Horizonte de tiempo, presupuesto o hitos de auditoría"
      >
        <TextInput
          id="cie-horizonte"
          value={data.presupuestoYHorizonte}
          onChange={(e) => update('presupuestoYHorizonte', e.target.value)}
          placeholder="Ej. Auditoría FSSC 22000 en 5 meses · Implementación por fases"
        />
      </FieldWrapper>

      <div className="pt-6 border-t border-slate-200 space-y-6">
        <FieldWrapper
          id="cie-documentos"
          label="Evidencias y documentos solicitados al entrevistado"
          hint="Diagramas de flujo, formatos físicos en uso, catálogo de SKUs, estructura de código de lote o reportes actuales."
          fieldKey="cierre.documentosSolicitados"
          isFlagged={followUpKeys.includes('cierre.documentosSolicitados')}
          onToggleFlag={onToggleFlag}
        >
          <TextArea
            id="cie-documentos"
            rows={2}
            value={data.documentosSolicitados}
            onChange={(e) => update('documentosSolicitados', e.target.value)}
            placeholder="Ej. Formato de orden de producción, etiqueta actual de caja, reporte último simulacro de recall..."
          />
        </FieldWrapper>

        <FieldWrapper
          id="cie-proximos"
          label="Próximos pasos y personas adicionales a entrevistar"
          fieldKey="cierre.proximosPasos"
          isFlagged={followUpKeys.includes('cierre.proximosPasos')}
          onToggleFlag={onToggleFlag}
        >
          <TextArea
            id="cie-proximos"
            rows={2}
            value={data.proximosPasos}
            onChange={(e) => update('proximosPasos', e.target.value)}
            placeholder="Ej. Recorrido físico en planta el jueves · Entrevista con Jefe de Bodega y TI..."
          />
        </FieldWrapper>

        <FieldWrapper
          id="cie-observaciones"
          label="Síntesis y observaciones personales del entrevistador"
        >
          <TextArea
            id="cie-observaciones"
            rows={3}
            value={data.observacionesEntrevistador}
            onChange={(e) =>
              update('observacionesEntrevistador', e.target.value)
            }
            placeholder="Impresión general sobre madurez operativa, apertura del equipo, riesgos percibidos..."
          />
        </FieldWrapper>
      </div>
    </div>
  );
}
