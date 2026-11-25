import { useEffect, useState, type ReactNode } from 'react';
import { Menu, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { ThemeToggle } from './ThemeToggle';

export function Layout({ children }: { children: ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - doc.clientHeight;
      if (total > 0) {
        setScrollPct(Math.min(100, Math.max(0, (window.scrollY / total) * 100)));
      } else {
        setScrollPct(0);
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-page)] text-[var(--text-body)]">
      {/* Thin Reading Progress Bar (no top header bar) */}
      <div
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 h-[3px] z-40 bg-transparent pointer-events-none"
      >
        <div
          className="h-full bg-gradient-to-r from-[#73C5F1] to-[#F1A15C] transition-[width] duration-150"
          style={{ width: `${scrollPct}%` }}
        />
      </div>

      {/* Expandable Slide-Over Stage Navigator */}
      <Sidebar drawerOpen={drawerOpen} onCloseDrawer={() => setDrawerOpen(false)} />

      {/* Compact Floating Corner Controls (no full-width top bar) */}
      <div className="max-w-[1408px] w-full mx-auto px-4 lg:px-6 pt-4 flex items-center justify-between gap-3">
        <nav aria-label="Stage navigation controls" className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open RAG stage index"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs font-medium text-[var(--text-body)] hover:border-[#73C5F1] transition-colors cursor-pointer"
          >
            <Menu className="w-4 h-4 text-[#73C5F1]" />
            <span>8 Stages</span>
          </button>

          <Link
            to="/search"
            aria-label="Search RAG stages"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs text-[var(--text-muted)] hover:border-[#73C5F1] hover:text-[var(--text-body)] transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search</span>
          </Link>
        </nav>

        <ThemeToggle />
      </div>

      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
