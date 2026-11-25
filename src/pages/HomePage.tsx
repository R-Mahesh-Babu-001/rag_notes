import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { RAG_STEPS } from '../data/curriculum';
import { Layout } from '../components/Layout';
import { AuthorAvatar } from '../components/BrandIcons';
import { RagDiagram } from '../components/diagrams/RagDiagrams';
import {
  EndToEndProcessVisualizer,
  InteractiveLab,
} from '../components/interactive/RagInteractiveLabs';

function StageSlideNotes({
  title,
  inputLabel,
  actionLabel,
  outputLabel,
  keyPoints,
  path,
  num,
}: {
  title: string;
  inputLabel: string;
  actionLabel: string;
  outputLabel: string;
  keyPoints: string[];
  path: string;
  num: string;
}) {
  return (
    <details className="group mt-2.5">
      <summary className="list-none [&::-webkit-details-marker]:hidden inline-flex items-center gap-1.5 text-xs font-medium text-[#C2641A] dark:text-[#F1A15C] hover:underline cursor-pointer select-none">
        <ChevronRight className="w-3.5 h-3.5 transition-transform duration-150 group-open:rotate-90" />
        <span>Notes</span>
      </summary>

      <div className="mt-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 text-xs space-y-3">
        <div className="grid sm:grid-cols-3 gap-2.5">
          <div className="rounded-lg bg-[var(--bg-page)] border border-[var(--border-subtle)] p-2.5">
            <p className="font-mono text-[10px] uppercase text-[var(--text-subtle)]">Input</p>
            <p className="mt-0.5 font-medium text-[var(--text-body)]">{inputLabel}</p>
          </div>
          <div className="rounded-lg bg-[var(--bg-page)] border border-[#73C5F1]/40 p-2.5">
            <p className="font-mono text-[10px] uppercase text-[var(--text-heading)]">Action</p>
            <p className="mt-0.5 font-medium text-[var(--text-body)]">{actionLabel}</p>
          </div>
          <div className="rounded-lg bg-[var(--bg-page)] border border-[#F1A15C]/40 p-2.5">
            <p className="font-mono text-[10px] uppercase text-[#F1A15C]">Output</p>
            <p className="mt-0.5 font-medium text-[var(--text-body)]">{outputLabel}</p>
          </div>
        </div>

        <ul className="space-y-1 text-[var(--text-muted)] leading-relaxed">
          {keyPoints.map((pt) => (
            <li key={pt}>• {pt}</li>
          ))}
        </ul>

        <div className="pt-1">
          <Link
            to={path}
            aria-label={`Open interactive ${title} sandbox (Stage ${num})`}
            className="text-xs font-semibold text-[var(--text-heading)] hover:underline"
          >
            Open interactive {title} sandbox (Stage {num}) →
          </Link>
        </div>
      </div>
    </details>
  );
}

export function HomePage() {
  const tocItems = useMemo(
    () => [
      { id: 'overview', label: 'The Process of RAG' },
      ...RAG_STEPS.slice(0, 7).map((s) => ({
        id: `stage-${s.slug}`,
        label: `${s.num} · ${s.title}`,
      })),
      { id: 'compare', label: 'Without RAG vs With RAG' },
      { id: 'loop-summary', label: 'Complete Live Loop' },
    ],
    []
  );

  const [activeId, setActiveId] = useState(tocItems[0].id);

  useEffect(() => {
    document.title = 'The Process of RAG — Visual Walkthrough';
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const els = tocItems
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (els.length === 0) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-15% 0px -60% 0px', threshold: 0.1 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [tocItems]);

  const jumpTo = (id: string) => {
    setActiveId(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <Layout>
      <main className="max-w-[1408px] mx-auto pb-20">
        <div className="flex justify-center gap-12 px-4 lg:px-6 pt-4">
          {/* Center Presentation Deck Column */}
          <div className="w-full max-w-[780px] min-w-0">
            {/* Hero Intro */}
            <div className="mb-6">
              <Link
                to="/step/08"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs font-mono text-[var(--text-muted)] hover:border-[#73C5F1] transition-colors"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#F1A15C]" aria-hidden="true" />
                <span>Visual RAG Pipeline · 2 Phases · 8 Stages</span>
              </Link>

              <h1 className="mt-3 text-[30px] lg:text-[42px] font-bold tracking-tight leading-[1.15]">
                The Process of RAG
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-2.5 text-[13px] text-[var(--text-muted)]">
                <AuthorAvatar className="w-6 h-6" />
                <span className="font-semibold text-[var(--text-body)]">R Mahesh Babu</span>
                <span>·</span>
                <span>9 visual slides</span>
                <span>·</span>
                <span>4 min visual walkthrough</span>
              </div>
            </div>

            {/* Mobile / Tablet Native Collapsible "On this page" */}
            <details className="lg:hidden group mb-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
              <summary className="list-none [&::-webkit-details-marker]:hidden w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-[var(--text-body)] cursor-pointer select-none">
                <span>On this page</span>
                <ChevronDown className="w-4 h-4 text-[var(--text-muted)] transition-transform duration-150 group-open:rotate-180" />
              </summary>

              <nav aria-label="On this page" className="px-4 pb-3 border-t border-[var(--border-subtle)] pt-2">
                <ul className="space-y-1.5">
                  {tocItems.map((item) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => jumpTo(item.id)}
                        className={`block w-full text-left text-xs py-1 cursor-pointer ${
                          activeId === item.id
                            ? 'font-semibold text-[#C2641A] dark:text-[#F1A15C]'
                            : 'text-[var(--text-muted)]'
                        }`}
                      >
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </details>

            {/* Slide Deck Stack */}
            <div className="space-y-8">
              {/* Slide 0: Interactive Two-Phase RAG Visualizer */}
              <section
                id="overview"
                className="scroll-mt-6 rounded-[14px] overflow-hidden border border-[#24344D] bg-[#0d1422] shadow-sm"
                style={{
                  backgroundImage:
                    'radial-gradient(ellipse at 65% 0%, rgba(241, 161, 92, 0.14), rgba(115, 197, 241, 0.06) 45%, transparent 72%)',
                }}
              >
                <div className="p-5 sm:p-7">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#172334] border border-[#24344D] text-[11px] font-mono text-[#73C5F1] mb-3">
                    Overview · How RAG Works
                  </span>
                  <h2 className="text-2xl sm:text-[32px] font-bold text-[#F3F4F6] tracking-tight leading-tight">
                    Two Connected Loops Power Every Answer
                  </h2>
                  <p className="mt-2 text-sm text-[#9CA3AF] max-w-xl">
                    Click any stage below or press Play to trace how documents prepared offline feed live, cited answers.
                  </p>
                </div>
                <EndToEndProcessVisualizer />
              </section>

              {/* Slides 1–7: Every Core Stage Visualized Sequentially */}
              {RAG_STEPS.slice(0, 7).map((step, idx) => (
                <div key={step.slug} id={`stage-${step.slug}`} className="scroll-mt-6">
                  <section
                    className="rounded-[14px] border border-[#24344D] bg-[#0d1422] p-5 sm:p-7 text-[#E5E7EB]"
                    style={{
                      backgroundImage:
                        idx % 2 === 0
                          ? 'radial-gradient(ellipse at 70% 0%, rgba(115, 197, 241, 0.13), transparent 65%)'
                          : 'radial-gradient(ellipse at 70% 0%, rgba(241, 161, 92, 0.14), transparent 65%)',
                    }}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#172334] border border-[#24344D] text-[11px] font-mono text-[#F1A15C]">
                        Stage {step.num} · {step.phase}
                      </span>
                      <Link
                        to={step.path}
                        className="text-xs font-mono text-[#8BD4FF] hover:underline"
                      >
                        Interactive Lab →
                      </Link>
                    </div>

                    <h2 className="text-2xl sm:text-[30px] font-bold text-[#F3F4F6] tracking-tight leading-snug">
                      {step.title}
                    </h2>
                    <p className="mt-1.5 text-sm text-[#9CA3AF] leading-relaxed">
                      {step.tagline}
                    </p>

                    <div className="mt-5 rounded-xl bg-[#101827] border border-[#24344D] p-3.5 sm:p-4">
                      <RagDiagram id={step.diagramId} />
                    </div>
                  </section>

                  <StageSlideNotes
                    title={step.title}
                    inputLabel={step.inputLabel}
                    actionLabel={step.actionLabel}
                    outputLabel={step.outputLabel}
                    keyPoints={step.keyPoints}
                    path={step.path}
                    num={step.num}
                  />
                </div>
              ))}

              {/* Slide 8: Without RAG vs With RAG Side-by-Side Visual Slide */}
              <div id="compare" className="scroll-mt-6">
                <section
                  className="rounded-[14px] border border-[#24344D] bg-[#0d1422] p-5 sm:p-7 text-[#E5E7EB]"
                  style={{
                    backgroundImage:
                      'radial-gradient(ellipse at 50% 0%, rgba(241, 161, 92, 0.12), transparent 65%)',
                  }}
                >
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#172334] border border-[#24344D] text-[11px] font-mono text-[#F1A15C] mb-3">
                    Visual Contrast · Why Grounding Matters
                  </span>
                  <h2 className="text-2xl sm:text-[30px] font-bold text-[#F3F4F6] tracking-tight leading-snug mb-5">
                    Pure LLM Guessing vs RAG Evidence
                  </h2>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="rounded-xl border border-[#24344D] bg-[#101827] p-4">
                      <h3 className="text-xs font-mono uppercase tracking-wider text-[#F1A15C] font-bold mb-2">
                        WITHOUT RAG
                      </h3>
                      <ul className="space-y-2 text-xs sm:text-sm text-[#9CA3AF]">
                        <li>• Relies only on stale training memory</li>
                        <li>• Cannot see your private files or policies</li>
                        <li>• No source trail to verify claims</li>
                      </ul>
                    </div>

                    <div className="rounded-xl border border-[#73C5F1]/60 bg-[#172334] p-4">
                      <h3 className="text-xs font-mono uppercase tracking-wider text-[#8BD4FF] font-bold mb-2">
                        WITH RAG PROCESS
                      </h3>
                      <ul className="space-y-2 text-xs sm:text-sm text-[#E5E7EB]">
                        <li>• Pulls exact passages at query time</li>
                        <li>• Reranks top facts before generation</li>
                        <li>• Grounds every sentence with [citations]</li>
                      </ul>
                    </div>
                  </div>
                </section>
              </div>

              {/* Slide 9: Interactive Grounded Answer Tester */}
              <div id="loop-summary" className="scroll-mt-6">
                <InteractiveLab id="grounded-answer-lab" />
              </div>
            </div>

            {/* Bottom Next Navigation Card */}
            <nav
              aria-label="Next page"
              className="mt-10 pt-8 border-t border-[var(--border-subtle)] grid grid-cols-1 sm:grid-cols-2 gap-3.5"
            >
              <Link
                to="/step/01"
                className="sm:col-start-2 block rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-5 py-4 text-right hover:border-[#73C5F1] transition-colors"
              >
                <span className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-[#F1A15C]">
                  NEXT STAGE INTERACTIVE LAB
                </span>
                <span className="mt-1 block text-[15px] font-semibold text-[var(--text-heading)]">
                  01 · Load &amp; Clean Docs →
                </span>
              </Link>
            </nav>
          </div>

          {/* Right Sticky "ON THIS PAGE" Outline */}
          <aside className="hidden lg:block w-[240px] shrink-0 pt-10 pb-8">
            <div className="sticky top-8 border-l border-[var(--border-subtle)] pl-4">
              <p className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[var(--text-subtle)] mb-3">
                On this page
              </p>
              <nav aria-label="On this page">
                <ul className="space-y-2">
                  {tocItems.map((item) => {
                    const isActive = activeId === item.id;
                    return (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={() => jumpTo(item.id)}
                          className={`block w-full text-left text-[12.5px] leading-snug transition-colors cursor-pointer ${
                            isActive
                              ? 'font-semibold text-[#C2641A] dark:text-[#F1A15C] -ml-[17px] pl-[15px] border-l-2 border-[#F1A15C]'
                              : 'text-[var(--text-muted)] hover:text-[var(--text-body)]'
                          }`}
                        >
                          {item.label}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>
          </aside>
        </div>
      </main>
    </Layout>
  );
}
