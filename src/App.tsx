import { useEffect, useMemo, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  FileText,
} from 'lucide-react';
import {
  SECTIONS,
  createBlankInterview,
  createSampleInterview,
  generateId,
} from './data/interviewCatalog';
import type {
  InterviewRecord,
  InterviewStatus,
  SectionId,
} from './types/interview';
import {
  formatTimeEs,
  loadActiveInterviewId,
  loadStoredInterviews,
  saveActiveInterviewId,
  saveStoredInterviews,
} from './utils/interviewMetrics';
import { TopBar, type AppViewMode } from './components/TopBar';
import { SidebarNav } from './components/SidebarNav';
import { SectionContext } from './components/sections/SectionContext';
import { SectionProcessMap } from './components/sections/SectionProcessMap';
import { SectionSystems } from './components/sections/SectionSystems';
import { SectionTraceability } from './components/sections/SectionTraceability';
import { SectionGaps } from './components/sections/SectionGaps';
import { SectionClosure } from './components/sections/SectionClosure';
import { InterviewSummary } from './components/InterviewSummary';
import { InterviewRepository } from './components/InterviewRepository';

function initializeState(): {
  interviews: InterviewRecord[];
  activeId: string;
} {
  const stored = loadStoredInterviews();
  if (stored.length > 0) {
    const savedActiveId = loadActiveInterviewId();
    const exists = stored.some((i) => i.id === savedActiveId);
    return {
      interviews: stored,
      activeId: exists && savedActiveId ? savedActiveId : stored[0].id,
    };
  }
  const initial = createBlankInterview();
  return {
    interviews: [initial],
    activeId: initial.id,
  };
}

export default function App() {
  const initialState = useMemo(() => initializeState(), []);
  const [interviews, setInterviews] = useState<InterviewRecord[]>(
    initialState.interviews
  );
  const [activeInterviewId, setActiveInterviewId] = useState<string>(
    initialState.activeId
  );
  const [activeView, setActiveView] = useState<AppViewMode>('form');
  const [activeSection, setActiveSection] = useState<SectionId>('contexto');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showGuidePrompts, setShowGuidePrompts] = useState(true);

  useEffect(() => {
    saveStoredInterviews(interviews);
  }, [interviews]);

  useEffect(() => {
    saveActiveInterviewId(activeInterviewId);
  }, [activeInterviewId]);

  const activeInterview = useMemo(() => {
    return (
      interviews.find((i) => i.id === activeInterviewId) || interviews[0]
    );
  }, [interviews, activeInterviewId]);

  const updateActiveInterview = (
    updater: (prev: InterviewRecord) => InterviewRecord
  ) => {
    if (!activeInterview) return;
    setInterviews((prevList) =>
      prevList.map((item) =>
        item.id === activeInterview.id
          ? {
              ...updater(item),
              updatedAt: new Date().toISOString(),
            }
          : item
      )
    );
  };

  const handleToggleFollowUp = (key: string) => {
    updateActiveInterview((prev) => {
      const exists = prev.followUpKeys.includes(key);
      return {
        ...prev,
        followUpKeys: exists
          ? prev.followUpKeys.filter((k) => k !== key)
          : [...prev.followUpKeys, key],
      };
    });
  };

  const handleCreateNewInterview = () => {
    const blank = createBlankInterview();
    setInterviews((prev) => [blank, ...prev]);
    setActiveInterviewId(blank.id);
    setActiveSection('contexto');
    setActiveView('form');
    setMobileSidebarOpen(false);
  };

  const handleLoadSampleIntoCurrent = () => {
    const sample = createSampleInterview();
    setInterviews((prev) =>
      prev.map((item) =>
        item.id === activeInterview.id ? { ...sample, id: item.id } : item
      )
    );
    setActiveSection('contexto');
  };

  const handleLoadSampleAsNew = () => {
    const sample = createSampleInterview();
    setInterviews((prev) => [sample, ...prev]);
    setActiveInterviewId(sample.id);
    setActiveSection('contexto');
    setActiveView('summary');
  };

  const handleDuplicateInterview = (id: string) => {
    const source = interviews.find((i) => i.id === id);
    if (!source) return;
    const now = new Date().toISOString();
    const copy: InterviewRecord = {
      ...JSON.parse(JSON.stringify(source)),
      id: generateId('ent'),
      createdAt: now,
      updatedAt: now,
      status: 'en_curso',
      contexto: {
        ...source.contexto,
        empresa: source.contexto.empresa
          ? `${source.contexto.empresa} (Copia)`
          : 'Copia de entrevista',
      },
    };
    setInterviews((prev) => [copy, ...prev]);
    setActiveInterviewId(copy.id);
    setActiveView('form');
  };

  const handleDeleteInterview = (id: string) => {
    setInterviews((prev) => {
      const next = prev.filter((i) => i.id !== id);
      if (next.length === 0) {
        const fresh = createBlankInterview();
        setActiveInterviewId(fresh.id);
        return [fresh];
      }
      if (activeInterviewId === id) {
        setActiveInterviewId(next[0].id);
      }
      return next;
    });
  };

  const handleImportInterview = (record: InterviewRecord) => {
    setInterviews((prev) => [record, ...prev]);
    setActiveInterviewId(record.id);
    setActiveView('summary');
  };

  const currentSectionIndex = SECTIONS.findIndex((s) => s.id === activeSection);
  const currentSectionDef = SECTIONS[currentSectionIndex] || SECTIONS[0];

  const goToSection = (sectionId: SectionId) => {
    setActiveSection(sectionId);
    setMobileSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <TopBar
        activeView={activeView}
        onChangeView={(view) => {
          setActiveView(view);
          setMobileSidebarOpen(false);
        }}
        onCreateNewInterview={handleCreateNewInterview}
        savedCount={interviews.length}
        mobileSidebarOpen={mobileSidebarOpen}
        onToggleMobileSidebar={() => setMobileSidebarOpen((v) => !v)}
      />

      {/* Mobile compact view switcher */}
      <div className="no-print md:hidden bg-white border-b border-slate-200 px-4 py-2 flex items-center gap-2 overflow-x-auto">
        {(
          [
            { id: 'form', label: 'Formulario' },
            { id: 'summary', label: 'Resumen e informe' },
            { id: 'repository', label: `Entrevistas (${interviews.length})` },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveView(tab.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              activeView === tab.id
                ? 'bg-blue-50 text-blue-700'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeView === 'form' && activeInterview && (
        <div className="flex-1 flex flex-col lg:flex-row relative">
          {/* Sidebar Desktop & Mobile Drawer */}
          <div
            className={`${
              mobileSidebarOpen ? 'block' : 'hidden'
            } lg:block lg:sticky lg:top-14 lg:h-[calc(100vh-3.5rem)] z-20`}
          >
            <SidebarNav
              interview={activeInterview}
              activeSection={activeSection}
              onSelectSection={goToSection}
              onUpdateStatus={(status: InterviewStatus) =>
                updateActiveInterview((prev) => ({ ...prev, status }))
              }
              onUpdateNotes={(notasRapidas: string) =>
                updateActiveInterview((prev) => ({ ...prev, notasRapidas }))
              }
              onLoadSample={handleLoadSampleIntoCurrent}
              onOpenSummary={() => setActiveView('summary')}
            />
          </div>

          {/* Main Form Viewport */}
          <main className="flex-1 min-w-0">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 py-8 space-y-6">
              {/* Contextual Breadcrumb & Auto-Save Indicator */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                <div className="flex items-center gap-2 min-w-0">
                  <button
                    type="button"
                    onClick={() => setActiveView('repository')}
                    className="hover:text-slate-900 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Entrevistas
                  </button>
                  <span aria-hidden="true">/</span>
                  <span className="truncate max-w-[180px] sm:max-w-[260px] text-slate-700 font-medium">
                    {activeInterview.contexto.empresa || 'Nueva entrevista'}
                  </span>
                  <span aria-hidden="true">/</span>
                  <span className="text-slate-900 font-semibold whitespace-nowrap">
                    {currentSectionDef.numero}. {currentSectionDef.tituloCorto}
                  </span>
                </div>

                <span className="font-mono text-[11px] text-slate-400 tabular-nums whitespace-nowrap">
                  Guardado local · {formatTimeEs(activeInterview.updatedAt)}
                </span>
              </div>

              {/* Section Header */}
              <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 space-y-6">
                <div className="pb-6 border-b border-slate-200 space-y-3">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-1.5 max-w-2xl">
                      <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                        {currentSectionDef.numero}. {currentSectionDef.titulo}
                      </h1>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {currentSectionDef.descripcion}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowGuidePrompts((v) => !v)}
                      aria-expanded={showGuidePrompts}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>
                        {showGuidePrompts
                          ? 'Ocultar preguntas guía'
                          : 'Ver preguntas guía'}
                      </span>
                    </button>
                  </div>

                  {showGuidePrompts && (
                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-md space-y-1.5">
                      <div className="text-xs font-semibold text-slate-700">
                        Preguntas guía sugeridas para el entrevistador
                      </div>
                      <ul className="space-y-1 text-xs text-slate-600 list-disc list-inside leading-relaxed">
                        {currentSectionDef.preguntasGuia.map((q) => (
                          <li key={q}>{q}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Active Section Body */}
                {activeSection === 'contexto' && (
                  <SectionContext
                    data={activeInterview.contexto}
                    onChange={(contexto) =>
                      updateActiveInterview((prev) => ({ ...prev, contexto }))
                    }
                    followUpKeys={activeInterview.followUpKeys}
                    onToggleFlag={handleToggleFollowUp}
                  />
                )}

                {activeSection === 'proceso' && (
                  <SectionProcessMap
                    data={activeInterview.proceso}
                    onChange={(proceso) =>
                      updateActiveInterview((prev) => ({ ...prev, proceso }))
                    }
                    followUpKeys={activeInterview.followUpKeys}
                    onToggleFlag={handleToggleFollowUp}
                  />
                )}

                {activeSection === 'sistemas' && (
                  <SectionSystems
                    data={activeInterview.sistemas}
                    onChange={(sistemas) =>
                      updateActiveInterview((prev) => ({ ...prev, sistemas }))
                    }
                    followUpKeys={activeInterview.followUpKeys}
                    onToggleFlag={handleToggleFollowUp}
                  />
                )}

                {activeSection === 'trazabilidad' && (
                  <SectionTraceability
                    data={activeInterview.trazabilidad}
                    onChange={(trazabilidad) =>
                      updateActiveInterview((prev) => ({
                        ...prev,
                        trazabilidad,
                      }))
                    }
                    followUpKeys={activeInterview.followUpKeys}
                    onToggleFlag={handleToggleFollowUp}
                  />
                )}

                {activeSection === 'brechas' && (
                  <SectionGaps
                    data={activeInterview.brechas}
                    stages={activeInterview.proceso.etapas}
                    onChange={(brechas) =>
                      updateActiveInterview((prev) => ({ ...prev, brechas }))
                    }
                    followUpKeys={activeInterview.followUpKeys}
                    onToggleFlag={handleToggleFollowUp}
                  />
                )}

                {activeSection === 'cierre' && (
                  <SectionClosure
                    data={activeInterview.cierre}
                    onChange={(cierre) =>
                      updateActiveInterview((prev) => ({ ...prev, cierre }))
                    }
                    followUpKeys={activeInterview.followUpKeys}
                    onToggleFlag={handleToggleFollowUp}
                  />
                )}

                {/* Bottom Section Navigation */}
                <div className="pt-6 border-t border-slate-200 flex items-center justify-between gap-4">
                  <button
                    type="button"
                    disabled={currentSectionIndex === 0}
                    onClick={() => {
                      if (currentSectionIndex > 0) {
                        goToSection(SECTIONS[currentSectionIndex - 1].id);
                      }
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-md disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Anterior</span>
                  </button>

                  {currentSectionIndex < SECTIONS.length - 1 ? (
                    <button
                      type="button"
                      onClick={() =>
                        goToSection(SECTIONS[currentSectionIndex + 1].id)
                      }
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-md transition-colors cursor-pointer"
                    >
                      <span>
                        Siguiente: {SECTIONS[currentSectionIndex + 1].tituloCorto}
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setActiveView('summary')}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-md transition-colors cursor-pointer"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Ver resumen e informe</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      )}

      {activeView === 'summary' && activeInterview && (
        <main className="flex-1">
          <InterviewSummary
            interview={activeInterview}
            onBackToForm={() => setActiveView('form')}
          />
        </main>
      )}

      {activeView === 'repository' && (
        <main className="flex-1">
          <InterviewRepository
            interviews={interviews}
            activeInterviewId={activeInterview?.id || ''}
            onSelectInterview={(id) => {
              setActiveInterviewId(id);
              setActiveView('form');
            }}
            onViewSummary={(id) => {
              setActiveInterviewId(id);
              setActiveView('summary');
            }}
            onDuplicateInterview={handleDuplicateInterview}
            onDeleteInterview={handleDeleteInterview}
            onCreateNew={handleCreateNewInterview}
            onLoadSampleNew={handleLoadSampleAsNew}
            onImportInterview={handleImportInterview}
          />
        </main>
      )}
    </div>
  );
}
