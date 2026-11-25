import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Circle,
  Search,
  Workflow,
  X,
} from 'lucide-react';
import { RAG_STEPS, getStepsByPhase } from '../data/curriculum';
import { useProgress } from '../context/ProgressContext';
import { RagBrandLogo } from './BrandIcons';
import { ThemeToggle } from './ThemeToggle';

export function Sidebar({
  drawerOpen,
  onCloseDrawer,
}: {
  drawerOpen: boolean;
  onCloseDrawer: () => void;
}) {
  const { pathname } = useLocation();
  const { completedIds, isComplete } = useProgress();
  const phases = getStepsByPhase();

  const [openPhases, setOpenPhases] = useState<Record<string, boolean>>({
    'Phase 1 · Offline Indexing': true,
    'Phase 2 · Live Query & Answer': true,
  });

  if (!drawerOpen) return null;

  const togglePhase = (phase: string) => {
    setOpenPhases((prev) => ({ ...prev, [phase]: !prev[phase] }));
  };

  const completedCount = RAG_STEPS.filter((s) => completedIds.includes(s.slug)).length;
  const pct = Math.round((completedCount / RAG_STEPS.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex">
      <aside
        aria-label="RAG process navigation"
        className="w-[300px] max-w-[85vw] h-full flex flex-col bg-[var(--bg-surface)] border-r border-[var(--border-subtle)] text-[var(--text-body)] shadow-2xl"
      >
        <div className="p-4 border-b border-[var(--border-subtle)] flex items-center justify-between gap-2">
          <Link
            to="/"
            onClick={onCloseDrawer}
            className="inline-flex items-center gap-2.5 min-w-0 font-bold text-[15px] text-[var(--text-heading)]"
          >
            <RagBrandLogo className="w-7 h-7" />
            <span className="truncate">RAG Process</span>
          </Link>

          <button
            type="button"
            onClick={onCloseDrawer}
            aria-label="Close stage navigation"
            className="p-1.5 rounded-lg border border-[var(--border-subtle)] text-[var(--text-muted)] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3 border-b border-[var(--border-subtle)] space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <ThemeToggle />
            <Link
              to="/search"
              onClick={onCloseDrawer}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[var(--border-subtle)] text-xs text-[var(--text-muted)] hover:border-[#73C5F1] hover:text-[var(--text-body)] transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search</span>
            </Link>
          </div>

          <div className="rounded-lg bg-[var(--bg-page)] border border-[var(--border-subtle)] px-3 py-2">
            <div className="flex items-center justify-between text-[11px] font-mono mb-1">
              <span className="text-[var(--text-muted)]">Stages Viewed</span>
              <span className="text-[#F1A15C] font-semibold">
                {completedCount}/{RAG_STEPS.length} ({pct}%)
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-[var(--bg-surface-muted)] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#73C5F1] to-[#F1A15C] transition-all duration-300"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </div>

        <nav aria-label="RAG process stages" className="flex-1 overflow-y-auto p-3 space-y-2.5">
          <Link
            to="/"
            onClick={onCloseDrawer}
            className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors ${
              pathname === '/'
                ? 'bg-[#73C5F1]/15 text-[var(--text-heading)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-body)]'
            }`}
          >
            <Workflow className="w-3.5 h-3.5 shrink-0" />
            <span>Visual Slide Deck</span>
          </Link>

          {phases.map(({ phase, steps }) => {
            const isOpen = openPhases[phase] ?? true;
            return (
              <div key={phase} className="pt-1">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => togglePhase(phase)}
                  className="w-full flex items-center justify-between px-2 py-1 text-[11px] font-mono uppercase tracking-wider text-[var(--text-subtle)] hover:text-[var(--text-body)] cursor-pointer"
                >
                  <span>{phase}</span>
                  {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                </button>

                {isOpen && (
                  <ul className="mt-1 space-y-1 border-l border-[var(--border-subtle)] ml-2 pl-2">
                    {steps.map((s) => {
                      const active = pathname === s.path;
                      const done = isComplete(s.slug);
                      return (
                        <li key={s.slug}>
                          <Link
                            to={s.path}
                            onClick={onCloseDrawer}
                            className={`flex items-center justify-between gap-2 px-2.5 py-2 rounded-md text-xs leading-snug transition-colors ${
                              active
                                ? 'bg-[#73C5F1]/15 text-[var(--text-heading)] font-semibold border-l-2 border-[#F1A15C]'
                                : 'text-[var(--text-muted)] hover:text-[var(--text-body)] hover:bg-[var(--bg-page)]'
                            }`}
                          >
                            <span className="truncate">{s.shortTitle}</span>
                            {done ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#73C5F1] shrink-0" aria-label="Viewed" />
                            ) : (
                              <Circle className="w-3 h-3 text-[var(--border-subtle)] shrink-0" aria-hidden="true" />
                            )}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
        </nav>
      </aside>

      <div
        className="flex-1 bg-black/50 backdrop-blur-[1px]"
        onClick={onCloseDrawer}
        aria-hidden="true"
      />
    </div>
  );
}
