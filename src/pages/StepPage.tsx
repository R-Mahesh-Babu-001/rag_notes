import { useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { CheckCircle2, ChevronRight, Circle } from 'lucide-react';
import { getStepBySlug } from '../data/curriculum';
import { useProgress } from '../context/ProgressContext';
import { Layout } from '../components/Layout';
import { AuthorAvatar } from '../components/BrandIcons';
import { RagDiagram } from '../components/diagrams/RagDiagrams';
import { InteractiveLab } from '../components/interactive/RagInteractiveLabs';
import { PrevNextNav } from '../components/PrevNextNav';

export function StepPage() {
  const { slug = '01' } = useParams<{ slug: string }>();
  const step = getStepBySlug(slug);
  const { isComplete, toggleComplete } = useProgress();

  useEffect(() => {
    if (!step) return;
    document.title = `Stage ${step.num}: ${step.title} — The Process of RAG`;
    window.scrollTo(0, 0);
  }, [slug, step]);

  if (!step) return <Navigate to="/step/01" replace />;

  const prevStep = step.prevSlug ? getStepBySlug(step.prevSlug) : undefined;
  const nextStep = step.nextSlug ? getStepBySlug(step.nextSlug) : undefined;
  const completed = isComplete(step.slug);

  return (
    <Layout>
      <main className="max-w-[960px] mx-auto px-4 lg:px-6 pt-4 pb-20">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs text-[var(--text-muted)]">
          <Link to="/" className="hover:text-[var(--text-heading)] transition-colors">
            Process Deck
          </Link>
          <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{step.phase}</span>
          <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
          <span className="font-mono text-[#F1A15C]">Stage {step.num}</span>
        </nav>

        {/* Stage Heading */}
        <h1 className="mt-3 text-[30px] lg:text-[42px] font-bold tracking-tight leading-[1.15]">
          {step.num}. {step.title}
        </h1>
        <p className="mt-2 text-base text-[var(--text-muted)] leading-relaxed max-w-2xl">
          {step.tagline}
        </p>

        {/* Author & Viewed Row */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5 text-[13px] text-[var(--text-muted)]">
            <AuthorAvatar className="w-6 h-6" />
            <span className="font-semibold text-[var(--text-body)]">R Mahesh Babu</span>
            <span>·</span>
            <span>{step.readTime}</span>
          </div>

          <button
            type="button"
            onClick={() => toggleComplete(step.slug)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
              completed
                ? 'border-[#73C5F1] bg-[#73C5F1]/15 text-[var(--text-heading)]'
                : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-muted)] hover:border-[#F1A15C]'
            }`}
          >
            {completed ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-[#73C5F1]" />
            ) : (
              <Circle className="w-3.5 h-3.5" />
            )}
            <span>{completed ? 'Viewed' : 'Mark stage viewed'}</span>
          </button>
        </div>

        <hr className="my-6 border-t border-[var(--border-subtle)]" />

        <div className="space-y-8">
          {/* Primary Animated Stage Diagram */}
          {step.slug !== '08' && (
            <section className="rounded-[14px] border border-[#24344D] bg-[#0d1422] p-5 sm:p-6">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-mono uppercase tracking-wider text-[#8BD4FF]">
                  Visual Architecture · Stage {step.num}
                </span>
              </div>
              <div className="rounded-xl bg-[#101827] border border-[#24344D] p-3">
                <RagDiagram id={step.diagramId} />
              </div>
              <p className="mt-3 text-xs text-[#9CA3AF] leading-relaxed">{step.diagramCaption}</p>
            </section>
          )}

          {/* Interactive Hands-On Visual Sandbox */}
          <section aria-label="Interactive stage simulator">
            <InteractiveLab id={step.interactiveLabId} />
          </section>

          {/* Input -> Process -> Output Flow Strip */}
          <section className="grid md:grid-cols-3 gap-3.5" aria-label="Stage data transformation">
            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
              <p className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-subtle)] mb-1">
                Input Entering Stage
              </p>
              <p className="text-sm font-semibold text-[var(--text-body)]">{step.inputLabel}</p>
            </div>
            <div className="rounded-xl border border-[#73C5F1]/50 bg-[var(--bg-surface)] p-4">
              <p className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-heading)] mb-1">
                Transformation
              </p>
              <p className="text-sm font-semibold text-[var(--text-body)]">{step.actionLabel}</p>
            </div>
            <div className="rounded-xl border border-[#F1A15C]/50 bg-[var(--bg-surface)] p-4">
              <p className="text-[11px] font-mono uppercase tracking-wider text-[#F1A15C] mb-1">
                Output Passed Forward
              </p>
              <p className="text-sm font-semibold text-[var(--text-body)]">{step.outputLabel}</p>
            </div>
          </section>

          {/* Concise Key Visual Takeaways */}
          <section className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5">
            <h2 className="text-base font-bold mb-3">How It Fits Into the RAG Process</h2>
            <ul className="space-y-2 text-sm text-[var(--text-muted)]">
              {step.keyPoints.map((pt) => (
                <li key={pt} className="flex items-start gap-2.5 leading-relaxed">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#F1A15C] shrink-0" aria-hidden="true" />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <PrevNextNav
          prev={prevStep ? { title: prevStep.shortTitle, path: prevStep.path } : undefined}
          next={nextStep ? { title: nextStep.shortTitle, path: nextStep.path } : undefined}
        />
      </main>
    </Layout>
  );
}
