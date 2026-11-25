import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import { RAG_STEPS } from '../data/curriculum';
import { Layout } from '../components/Layout';

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') ?? '');

  useEffect(() => {
    document.title = 'Search — The Process of RAG';
  }, []);

  const handleChange = (val: string) => {
    setQuery(val);
    if (val.trim()) setSearchParams({ q: val }, { replace: true });
    else setSearchParams({}, { replace: true });
  };

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    return RAG_STEPS.filter((step) => {
      const hay = [
        step.title,
        step.phase,
        step.tagline,
        step.description,
        step.inputLabel,
        step.actionLabel,
        step.outputLabel,
        ...step.keyPoints,
      ]
        .join(' ')
        .toLowerCase();
      return hay.includes(q);
    });
  }, [query]);

  return (
    <Layout>
      <main className="max-w-[704px] mx-auto pb-20">
        <div className="px-6 pt-8">
          <h1 className="text-[32px] font-bold tracking-tight mb-5">Search</h1>

        <form
          role="search"
          onSubmit={(e) => e.preventDefault()}
          className="flex items-center rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3.5 h-11 focus-within:border-[#73C5F1]"
        >
          <SearchIcon className="w-4 h-4 text-[var(--text-subtle)] shrink-0" />
          <input
            type="search"
            aria-label="Search RAG process stages"
            placeholder="Search RAG stages..."
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            className="ml-2.5 w-full bg-transparent text-sm text-[var(--text-body)] placeholder:text-[var(--text-subtle)] focus:outline-none"
          />
        </form>

        {!query.trim() ? (
          <div className="mt-6">
            <p className="text-xs font-mono uppercase text-[var(--text-subtle)] mb-3">
              Popular stages
            </p>
            <div className="flex flex-wrap gap-2">
              {['Chunking', 'Embedding', 'HNSW', 'Hybrid', 'Rerank', 'Citations'].map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => handleChange(term)}
                  className="px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs hover:border-[#73C5F1] cursor-pointer"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-8">
            <p className="text-xs font-mono text-[var(--text-subtle)] mb-3">
              {results.length} matching stage{results.length === 1 ? '' : 's'}
            </p>
            <ul className="space-y-3">
              {results.map((r) => (
                <li key={r.slug}>
                  <Link
                    to={r.path}
                    className="block rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 hover:border-[#73C5F1] transition-colors"
                  >
                    <span className="text-[11px] font-mono uppercase text-[#F1A15C]">
                      Stage {r.num} · {r.phase}
                    </span>
                    <p className="mt-1 text-base font-bold text-[var(--text-heading)]">{r.title}</p>
                    <p className="mt-1 text-xs text-[var(--text-muted)]">{r.tagline}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        </div>
      </main>
    </Layout>
  );
}
