import { Link } from 'react-router-dom';

export function PrevNextNav({
  prev,
  next,
}: {
  prev?: { title: string; path: string };
  next?: { title: string; path: string };
}) {
  if (!prev && !next) return null;

  return (
    <nav
      aria-label="Chapter navigation"
      className="mt-12 pt-8 border-t border-[var(--border-subtle)] grid grid-cols-1 sm:grid-cols-2 gap-[14px]"
    >
      {prev && (
        <Link
          to={prev.path}
          className="block bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[12px] px-5 py-4 hover:border-[#73C5F1] transition-colors"
        >
          <span className="block text-[11px] font-semibold tracking-[0.06em] uppercase text-[#F1A15C]">
            PREVIOUS
          </span>
          <span className="mt-1 block text-[15px] font-semibold text-[var(--text-heading)]">
            {prev.title}
          </span>
        </Link>
      )}

      {next && (
        <Link
          to={next.path}
          className={`block bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[12px] px-5 py-4 text-right hover:border-[#73C5F1] transition-colors ${
            !prev ? 'sm:col-start-2' : ''
          }`}
        >
          <span className="block text-[11px] font-semibold tracking-[0.06em] uppercase text-[#F1A15C]">
            NEXT
          </span>
          <span className="mt-1 block text-[15px] font-semibold text-[var(--text-heading)]">
            {next.title}
          </span>
        </Link>
      )}
    </nav>
  );
}
