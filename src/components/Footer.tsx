import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-[var(--border-subtle)] py-10 text-sm text-[var(--text-muted)]">
      <div className="max-w-[1152px] mx-auto px-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="font-semibold text-[var(--text-heading)]">The Process of RAG</span>
          <span className="mx-2">·</span>
          <span>Visualized by R Mahesh Babu</span>
        </div>
        <div className="flex items-center gap-5 text-xs">
          <Link to="/" className="hover:text-[var(--text-heading)] transition-colors">
            Process Deck
          </Link>
          <Link to="/step/08" className="hover:text-[var(--text-heading)] transition-colors">
            Full Simulator
          </Link>
          <Link to="/search" className="hover:text-[var(--text-heading)] transition-colors">
            Search
          </Link>
        </div>
      </div>
    </footer>
  );
}
