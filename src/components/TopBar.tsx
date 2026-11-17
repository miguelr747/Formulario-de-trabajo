import { Plus, Menu, X } from 'lucide-react';

export type AppViewMode = 'form' | 'summary' | 'repository';

interface TopBarProps {
  activeView: AppViewMode;
  onChangeView: (view: AppViewMode) => void;
  onCreateNewInterview: () => void;
  savedCount: number;
  mobileSidebarOpen: boolean;
  onToggleMobileSidebar: () => void;
}

export function TopBar({
  activeView,
  onChangeView,
  onCreateNewInterview,
  savedCount,
  mobileSidebarOpen,
  onToggleMobileSidebar,
}: TopBarProps) {
  const navItems: { id: AppViewMode; label: string }[] = [
    { id: 'form', label: 'Formulario' },
    { id: 'summary', label: 'Resumen e informe' },
    { id: 'repository', label: `Entrevistas (${savedCount})` },
  ];

  return (
    <header className="no-print sticky top-0 z-30 h-14 bg-white border-b border-slate-200 px-4 lg:px-6 flex items-center justify-between gap-8">
      <div className="flex items-center gap-3 shrink-0">
        {activeView === 'form' && (
          <button
            type="button"
            onClick={onToggleMobileSidebar}
            aria-label={mobileSidebarOpen ? 'Cerrar índice' : 'Abrir índice'}
            className="lg:hidden inline-flex items-center justify-center w-9 h-9 rounded-md text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        )}
        <button
          type="button"
          onClick={() => onChangeView('form')}
          className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 cursor-pointer"
        >
          TrazaAudit
        </button>
      </div>

      <nav className="hidden md:flex items-center gap-6" aria-label="Navegación principal">
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChangeView(item.id)}
              className={`relative py-4 text-sm font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer tabular-nums ${
                isActive ? 'text-blue-700' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {item.label}
              {isActive && (
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-700"
                />
              )}
            </button>
          );
        })}
      </nav>

      <div className="flex items-center shrink-0">
        <button
          type="button"
          onClick={onCreateNewInterview}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4 shrink-0" />
          <span>Nueva entrevista</span>
        </button>
      </div>
    </header>
  );
}
