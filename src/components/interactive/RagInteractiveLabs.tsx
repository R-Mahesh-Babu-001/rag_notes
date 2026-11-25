import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  SlidersHorizontal,
} from 'lucide-react';
import type { InteractiveLabId } from '../../data/types';

export function InteractiveLab({ id }: { id: InteractiveLabId }) {
  switch (id) {
    case 'e2e-process-simulator':
      return <EndToEndProcessVisualizer hideDeepLink />;
    case 'document-cleaner-lab':
      return <DocumentCleanerLab />;
    case 'chunking-comparator':
      return <ChunkingComparatorLab />;
    case 'embedding-similarity':
      return <EmbeddingSimilarityLab />;
    case 'index-lookup-lab':
      return <IndexLookupLab />;
    case 'hybrid-retrieval':
      return <HybridRetrievalLab />;
    case 'reranking-flow':
      return <RerankingFlowLab />;
    case 'grounded-answer-lab':
      return <GroundedAnswerLab />;
    default:
      return null;
  }
}

/* ============================================================================
 * FLAGSHIP INTERACTIVE END-TO-END RAG PROCESS VISUALIZER
 * ========================================================================== */
interface TraceScenario {
  label: string;
  question: string;
  stages: {
    id: string;
    num: string;
    title: string;
    phase: 'Indexing' | 'Query';
    route: string;
    input: string;
    transform: string;
    output: string;
  }[];
}

const TRACE_SCENARIOS: TraceScenario[] = [
  {
    label: 'Billing & Refund Policy',
    question: '"Can I get a refund on an annual subscription after 18 days?"',
    stages: [
      {
        id: '01',
        num: '01',
        title: 'Load & Clean Docs',
        phase: 'Indexing',
        route: '/step/01',
        input: 'Raw Billing_Handbook_v4.pdf (contains header banners & page numbers)',
        transform: 'Parses section headings & tables while stripping repeated page footers.',
        output: 'Clean Markdown sections with source file + page metadata intact.',
      },
      {
        id: '02',
        num: '02',
        title: 'Chunk Text',
        phase: 'Indexing',
        route: '/step/02',
        input: 'Clean 14-page billing handbook document',
        transform: 'Slices at paragraph boundaries (512 tokens, 64-token overlap).',
        output: 'Chunk #14: "Annual subscriptions qualify for a full refund within 30 days..."',
      },
      {
        id: '03',
        num: '03',
        title: 'Embed Chunks',
        phase: 'Indexing',
        route: '/step/03',
        input: 'Text passage Chunk #14',
        transform: 'Embedding model maps text meaning into numerical coordinates.',
        output: 'Vector [0.18, -0.44, 0.79, 0.12, ...] linked to Chunk #14.',
      },
      {
        id: '04',
        num: '04',
        title: 'Vector Index',
        phase: 'Indexing',
        route: '/step/04',
        input: 'All document vectors + tenant/doc metadata',
        transform: 'Inserts vectors into fast HNSW graph + keyword inverted index.',
        output: 'Indexed knowledge base ready for millisecond search.',
      },
      {
        id: '05',
        num: '05',
        title: 'Hybrid Search',
        phase: 'Query',
        route: '/step/05',
        input: 'Question: "Can I get a refund on an annual subscription after 18 days?"',
        transform: 'Encodes query vector + runs Dense meaning search & BM25 keyword search in parallel.',
        output: 'Top-25 merged candidate pool ranked via Reciprocal Rank Fusion.',
      },
      {
        id: '06',
        num: '06',
        title: 'Rerank Pool',
        phase: 'Query',
        route: '/step/06',
        input: '25 candidate chunks (including noisy pricing & monthly FAQs)',
        transform: 'Cross-encoder scores exact query-chunk fit and trims down to top 3.',
        output: '#1 Chunk #14 (0.96 score) placed first; stale drafts dropped.',
      },
      {
        id: '07',
        num: '07',
        title: 'Build Prompt',
        phase: 'Query',
        route: '/step/07',
        input: 'System Grounding Rule + Top-3 Ordered Chunks + User Question',
        transform: 'Wraps retrieved passages in evidence tags and enforces citation-only generation.',
        output: 'Structured prompt sent to the LLM with zero room for guessing.',
      },
      {
        id: '08',
        num: '08',
        title: 'Cited Answer',
        phase: 'Query',
        route: '/step/08',
        input: 'Grounded LLM prompt containing Chunk #14 (30-day window)',
        transform: 'Synthesizes clear yes/no reasoning directly anchored to retrieved text.',
        output: '"Yes—annual plans qualify for a full refund within 30 days of purchase [Billing_Handbook p.4]."',
      },
    ],
  },
  {
    label: 'Exact Error Code Lookup',
    question: '"Why did my file upload fail with ERR_413?"',
    stages: [
      {
        id: '01',
        num: '01',
        title: 'Load & Clean Docs',
        phase: 'Indexing',
        route: '/step/01',
        input: 'API_Reference.html + Error_Codes_Table.md',
        transform: 'Extracts error-code table rows cleanly without scrambling columns.',
        output: 'Structured markdown preserving exact error string ERR_413.',
      },
      {
        id: '02',
        num: '02',
        title: 'Chunk Text',
        phase: 'Indexing',
        route: '/step/02',
        input: 'Cleaned API documentation sections',
        transform: 'Keeps each error code row together with its resolution steps.',
        output: 'Chunk #42: "ERR_413: Payload exceeds 25 MB gateway limit..."',
      },
      {
        id: '03',
        num: '03',
        title: 'Embed Chunks',
        phase: 'Indexing',
        route: '/step/03',
        input: 'Chunk #42 text payload',
        transform: 'Produces dense semantic vector + preserves exact token terms for BM25.',
        output: 'Vector [-0.31, 0.66, 0.22, ...] + sparse lexical weights.',
      },
      {
        id: '04',
        num: '04',
        title: 'Vector Index',
        phase: 'Indexing',
        route: '/step/04',
        input: 'Dense vectors, sparse terms, and endpoint tags',
        transform: 'Stores dual vectors inside hybrid HNSW + BM25 index.',
        output: 'Searchable collection ready for exact codes or conceptual questions.',
      },
      {
        id: '05',
        num: '05',
        title: 'Hybrid Search',
        phase: 'Query',
        route: '/step/05',
        input: 'Query containing rare literal token "ERR_413"',
        transform: 'BM25 boosts exact "ERR_413" match while dense search adds upload context.',
        output: 'Chunk #42 jumps straight to rank #1 in merged pool.',
      },
      {
        id: '06',
        num: '06',
        title: 'Rerank Pool',
        phase: 'Query',
        route: '/step/06',
        input: 'Top-25 candidates mentioning upload limits and HTTP errors',
        transform: 'Cross-encoder promotes multipart upload workaround right next to Chunk #42.',
        output: 'Clean 2-chunk evidence set focused on ERR_413 fix.',
      },
      {
        id: '07',
        num: '07',
        title: 'Build Prompt',
        phase: 'Query',
        route: '/step/07',
        input: 'System Rule + Chunk #42 + Chunk #45 + User Question',
        transform: 'Orders limit definition first and multipart fix second.',
        output: 'Focused grounded prompt ready for final answer generation.',
      },
      {
        id: '08',
        num: '08',
        title: 'Cited Answer',
        phase: 'Query',
        route: '/step/08',
        input: 'Grounded prompt with 25 MB threshold + multipart rule',
        transform: 'Formats concise explanation citing the API doc table.',
        output: '"ERR_413 means your upload exceeded 25 MB [Error_Codes #42]; switch to multipart chunked uploads [API_Ref #45]."',
      },
    ],
  },
];

export function EndToEndProcessVisualizer({ hideDeepLink = false }: { hideDeepLink?: boolean }) {
  const reduced = Boolean(useReducedMotion());
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [activeStage, setActiveStage] = useState(0);
  const [playing, setPlaying] = useState(true);

  const scenario = TRACE_SCENARIOS[scenarioIdx];
  const current = scenario.stages[activeStage];

  useEffect(() => {
    if (!playing || reduced) return;
    const timer = window.setInterval(() => {
      setActiveStage((prev) => (prev + 1) % 8);
    }, 2600);
    return () => window.clearInterval(timer);
  }, [playing, reduced]);

  const handleSelectStage = (idx: number) => {
    setPlaying(false);
    setActiveStage(idx);
  };

  return (
    <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden">
      {/* Controls Bar */}
      <div className="px-4 sm:px-6 py-4 border-b border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-wider text-[#F1A15C] font-semibold">
            Live RAG Process Visualizer
          </span>
          <div className="flex gap-1.5 ml-1">
            {TRACE_SCENARIOS.map((sc, i) => (
              <button
                key={sc.label}
                type="button"
                onClick={() => {
                  setScenarioIdx(i);
                  setActiveStage(0);
                }}
                className={`px-2.5 py-1 rounded-md text-xs font-medium border cursor-pointer transition-colors ${
                  scenarioIdx === i
                    ? 'border-[#73C5F1] bg-[#73C5F1]/15 text-[var(--text-heading)]'
                    : 'border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-[#73C5F1]/50'
                }`}
              >
                {sc.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              setPlaying(false);
              setActiveStage((s) => (s + 7) % 8);
            }}
            aria-label="Previous stage"
            className="p-1.5 rounded-lg border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-body)] cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#73C5F1] bg-[#73C5F1]/15 text-xs font-semibold text-[var(--text-heading)] cursor-pointer"
          >
            {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{playing ? 'Pause' : 'Play'}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setPlaying(false);
              setActiveStage((s) => (s + 1) % 8);
            }}
            aria-label="Next stage"
            className="p-1.5 rounded-lg border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-body)] cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Interactive Clickable 2-Phase Pipeline Canvas */}
      <div className="bg-[#101827] p-4 sm:p-6 overflow-x-auto">
        <svg
          viewBox="0 0 820 264"
          className="w-full min-w-[640px] h-auto"
          role="img"
          aria-label="Interactive two-phase RAG process diagram. Click any node to inspect how data transforms."
        >
          {/* Phase 1 Row */}
          <text x="20" y="22" fill="#73C5F1" fontSize="11" fontWeight="700" fontFamily="Geist Mono, monospace">
            PHASE 1 · OFFLINE INDEXING (PREPARE YOUR KNOWLEDGE)
          </text>
          <rect x="14" y="32" width="792" height="86" rx="12" fill="#131E31" stroke="#24344D" />

          {scenario.stages.slice(0, 4).map((st, i) => {
            const x = 28 + i * 196;
            const isActive = activeStage === i;
            return (
              <g
                key={st.id}
                role="button"
                tabIndex={0}
                aria-label={`Select Stage ${st.num}: ${st.title}`}
                onClick={() => handleSelectStage(i)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSelectStage(i);
                  }
                }}
                style={{ cursor: 'pointer' }}
              >
                <rect
                  x={x}
                  y="47"
                  width="164"
                  height="56"
                  rx="9"
                  fill={isActive ? '#1C2F4A' : '#172334'}
                  stroke={isActive ? '#73C5F1' : '#2E4361'}
                  strokeWidth={isActive ? 2.4 : 1.2}
                />
                <text
                  x={x + 82}
                  y="69"
                  textAnchor="middle"
                  fill={isActive ? '#8BD4FF' : '#73C5F1'}
                  fontSize="10"
                  fontFamily="Geist Mono, monospace"
                  fontWeight="700"
                >
                  STAGE {st.num}
                </text>
                <text
                  x={x + 82}
                  y="88"
                  textAnchor="middle"
                  fill="#F3F4F6"
                  fontSize="12"
                  fontWeight="600"
                >
                  {st.title}
                </text>
                {i < 3 && (
                  <line x1={x + 164} y1="75" x2={x + 196} y2="75" stroke="#73C5F1" strokeWidth="1.8" />
                )}
              </g>
            );
          })}

          {!reduced && activeStage < 4 && (
            <motion.circle
              cy="103"
              r="5"
              fill="#73C5F1"
              animate={{ cx: 28 + activeStage * 196 + 82 }}
              transition={{ type: 'spring', stiffness: 220, damping: 24 }}
            />
          )}

          {/* Handoff Bridge: Stage 04 Vector Index -> Stage 05 Hybrid Search */}
          <path
            d="M 698 103 L 698 134 L 110 134 L 110 169"
            fill="none"
            stroke="#F1A15C"
            strokeWidth="1.8"
            strokeDasharray="4 4"
          />
          <rect x="315" y="123" width="190" height="22" rx="11" fill="#101827" stroke="#F1A15C" strokeWidth="1" />
          <text x="410" y="138" textAnchor="middle" fill="#F1A15C" fontSize="9.5" fontFamily="Geist Mono, monospace">
            Index Ready → Live Queries
          </text>

          {/* Phase 2 Row */}
          <text x="20" y="160" fill="#F1A15C" fontSize="11" fontWeight="700" fontFamily="Geist Mono, monospace">
            PHASE 2 · LIVE QUERY TIME (RETRIEVE, RERANK &amp; ANSWER)
          </text>
          <rect x="14" y="169" width="792" height="86" rx="12" fill="#131E31" stroke="#24344D" />

          {scenario.stages.slice(4, 8).map((st, idx) => {
            const globalIdx = idx + 4;
            const x = 28 + idx * 196;
            const isActive = activeStage === globalIdx;
            return (
              <g
                key={st.id}
                role="button"
                tabIndex={0}
                aria-label={`Select Stage ${st.num}: ${st.title}`}
                onClick={() => handleSelectStage(globalIdx)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSelectStage(globalIdx);
                  }
                }}
                style={{ cursor: 'pointer' }}
              >
                <rect
                  x={x}
                  y="184"
                  width="164"
                  height="56"
                  rx="9"
                  fill={isActive ? '#2A231E' : '#172334'}
                  stroke={isActive ? '#F1A15C' : '#2E4361'}
                  strokeWidth={isActive ? 2.4 : 1.2}
                />
                <text
                  x={x + 82}
                  y="206"
                  textAnchor="middle"
                  fill="#F1A15C"
                  fontSize="10"
                  fontFamily="Geist Mono, monospace"
                  fontWeight="700"
                >
                  STAGE {st.num}
                </text>
                <text
                  x={x + 82}
                  y="225"
                  textAnchor="middle"
                  fill="#F3F4F6"
                  fontSize="12"
                  fontWeight="600"
                >
                  {st.title}
                </text>
                {idx < 3 && (
                  <line x1={x + 164} y1="212" x2={x + 196} y2="212" stroke="#F1A15C" strokeWidth="1.8" />
                )}
              </g>
            );
          })}

          {!reduced && activeStage >= 4 && (
            <motion.circle
              cy="240"
              r="5"
              fill="#F1A15C"
              animate={{ cx: 28 + (activeStage - 4) * 196 + 82 }}
              transition={{ type: 'spring', stiffness: 220, damping: 24 }}
            />
          )}
        </svg>
      </div>

      {/* Live Stage Transformation Inspector */}
      <div className="p-4 sm:p-6 bg-[var(--bg-surface)] border-t border-[var(--border-subtle)]">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#73C5F1]/15 text-[var(--text-heading)] border border-[#73C5F1]/40">
              Stage {current.num} · {current.title}
            </span>
            <span className="text-xs font-mono text-[var(--text-muted)]">
              Sample query: <span className="text-[#F1A15C]">{scenario.question}</span>
            </span>
          </div>
          {!hideDeepLink && (
            <Link
              to={current.route}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#F1A15C] hover:underline"
            >
              <span>Inspect Stage {current.num}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-3 text-sm">
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-page)] p-3.5">
            <p className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-subtle)] mb-1">
              1 · Entering Input
            </p>
            <p className="text-xs sm:text-sm leading-relaxed text-[var(--text-body)]">{current.input}</p>
          </div>
          <div className="rounded-xl border border-[#73C5F1]/50 bg-[var(--bg-page)] p-3.5">
            <p className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-heading)] mb-1">
              2 · Visual Action
            </p>
            <p className="text-xs sm:text-sm leading-relaxed text-[var(--text-body)]">{current.transform}</p>
          </div>
          <div className="rounded-xl border border-[#F1A15C]/50 bg-[var(--bg-page)] p-3.5">
            <p className="text-[11px] font-mono uppercase tracking-wider text-[#F1A15C] mb-1">
              3 · Output Produced
            </p>
            <p className="text-xs sm:text-sm leading-relaxed font-medium text-[var(--text-body)]">
              {current.output}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
 * 1. DOCUMENT CLEANER VISUALIZER (Stage 01)
 * ========================================================================== */
function DocumentCleanerLab() {
  const [cleaned, setCleaned] = useState(true);

  return (
    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <span className="text-xs font-mono uppercase tracking-wider text-[var(--accent-orange-text)]">
          Visual Comparison · Raw vs Cleaned Document
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setCleaned(false)}
            className={`px-3 py-1 rounded-md text-xs font-medium border cursor-pointer ${
              !cleaned
                ? 'border-[#F1A15C] bg-[#F1A15C]/15 text-[var(--text-body)]'
                : 'border-[var(--border-subtle)] text-[var(--text-muted)]'
            }`}
          >
            Raw Noisy PDF Extract
          </button>
          <button
            type="button"
            onClick={() => setCleaned(true)}
            className={`px-3 py-1 rounded-md text-xs font-medium border cursor-pointer ${
              cleaned
                ? 'border-[#73C5F1] bg-[#73C5F1]/15 text-[var(--text-heading)]'
                : 'border-[var(--border-subtle)] text-[var(--text-muted)]'
            }`}
          >
            Cleaned Structured Output
          </button>
        </div>
      </div>

      {!cleaned ? (
        <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-page)] p-4 font-mono text-xs leading-relaxed space-y-2">
          <p className="text-[#F1A15C] line-through opacity-80">
            ACME DOCS · CONFIDENTIAL · HOME | PRICING | LOGIN | COOKIE SETTINGS
          </p>
          <p>
            Refund Policy Annual subscriptions may be canceled within 30 days for a full refund.
          </p>
          <p className="text-[#F1A15C] line-through opacity-80">
            Page 4 of 28 · Copyright 2026 ACME Corp · All Rights Reserved
          </p>
          <p className="text-[11px] font-sans text-[var(--text-muted)] pt-1">
            Notice how repeating navigation menus and page footers would dilute every search vector if indexed directly.
          </p>
        </div>
      ) : (
        <div className="rounded-lg border border-[#73C5F1]/50 bg-[var(--bg-page)] p-4 font-mono text-xs leading-relaxed space-y-2">
          <p className="text-[var(--text-heading)] font-bold">## Billing &amp; Refund Policy</p>
          <p className="text-[var(--text-body)]">
            Annual subscriptions may be canceled within 30 days for a full refund via Account Settings.
          </p>
          <p className="text-[11px] text-[#F1A15C]">
            metadata: &#123; source: &quot;Billing_Handbook.pdf&quot;, page: 4 &#125;
          </p>
        </div>
      )}
    </div>
  );
}

/* ============================================================================
 * 2. CHUNKING STRATEGY VISUALIZER (Stage 02)
 * ========================================================================== */
const SAMPLE_DOC = `# ACME Corp Billing Policy
Annual subscriptions qualify for a full refund within 30 days of payment. Monthly plans remain active until the current billing cycle ends.

## Team Access Rules
Account admins can transfer unused seats across departments at zero cost when usage drops below quota.`;

type ChunkStrategy = 'fixed' | 'recursive' | 'contextual';

function ChunkingComparatorLab() {
  const [strategy, setStrategy] = useState<ChunkStrategy>('recursive');
  const [chunkSize, setChunkSize] = useState(130);
  const [overlap, setOverlap] = useState(25);

  const chunks = useMemo(() => {
    if (strategy === 'fixed') {
      const out: string[] = [];
      const step = Math.max(40, chunkSize - overlap);
      for (let i = 0; i < SAMPLE_DOC.length; i += step) {
        out.push(SAMPLE_DOC.slice(i, i + chunkSize));
      }
      return out.map((text, i) => ({ label: `Fixed Window #${i + 1}`, text }));
    }
    if (strategy === 'recursive') {
      const paras = SAMPLE_DOC.split('\n\n');
      return paras.flatMap((p, idx) =>
        p.length <= chunkSize
          ? [{ label: `Paragraph Chunk #${idx + 1}`, text: p }]
          : [
              { label: `Paragraph #${idx + 1}a`, text: p.slice(0, chunkSize) },
              { label: `Paragraph #${idx + 1}b (overlap)`, text: p.slice(Math.max(0, chunkSize - overlap)) },
            ]
      );
    }
    return [
      {
        label: 'Contextual Chunk #1',
        text: '[From: ACME Billing Policy — Refunds] Annual subscriptions qualify for a full refund within 30 days of payment.',
      },
      {
        label: 'Contextual Chunk #2',
        text: '[From: ACME Billing Policy — Team Access] Account admins can transfer unused seats across departments at zero cost.',
      },
    ];
  }, [strategy, chunkSize, overlap]);

  return (
    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <span className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[var(--accent-orange-text)]">
          <SlidersHorizontal className="w-3.5 h-3.5" /> Interactive Chunking Visualizer
        </span>
        <div className="flex flex-wrap gap-1.5">
          {(
            [
              ['fixed', 'Fixed-Size'],
              ['recursive', 'Paragraph-Aware'],
              ['contextual', 'Heading-Prefixed'],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setStrategy(key)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer border transition-colors ${
                strategy === key
                  ? 'border-[#73C5F1] bg-[#73C5F1]/15 text-[var(--text-heading)]'
                  : 'border-[var(--border-subtle)] text-[var(--text-muted)]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {(strategy === 'fixed' || strategy === 'recursive') && (
        <div className="grid sm:grid-cols-2 gap-4 mb-4 p-3 rounded-lg bg-[var(--bg-page)] border border-[var(--border-subtle)] text-xs">
          <label className="flex flex-col gap-1">
            <span className="font-mono text-[var(--text-muted)]">Max Chunk Size: {chunkSize} chars</span>
            <input
              type="range"
              min={80}
              max={220}
              step={15}
              value={chunkSize}
              onChange={(e) => setChunkSize(Number(e.target.value))}
              className="accent-[#73C5F1]"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-mono text-[var(--text-muted)]">Overlap Window: {overlap} chars</span>
            <input
              type="range"
              min={0}
              max={55}
              step={5}
              value={overlap}
              onChange={(e) => setOverlap(Number(e.target.value))}
              className="accent-[#F1A15C]"
            />
          </label>
        </div>
      )}

      <div className="grid gap-2.5">
        {chunks.map((c) => (
          <div key={c.label} className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-page)] p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-mono font-semibold text-[#F1A15C]">{c.label}</span>
              <span className="text-[11px] font-mono text-[var(--text-subtle)]">{c.text.length} chars</span>
            </div>
            <p className="text-xs font-mono leading-relaxed text-[var(--text-body)] whitespace-pre-wrap">
              {c.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================================
 * 3. EMBEDDING SIMILARITY VISUALIZER (Stage 03)
 * ========================================================================== */
const SIMILARITY_SCENARIOS = [
  {
    query: '"How quickly can I cancel an annual subscription?"',
    candidates: [
      { doc: 'Annual plans qualify for a full refund within 30 days of purchase.', cos: 0.93 },
      { doc: 'Monthly accounts remain active until the end of the billing month.', cos: 0.78 },
      { doc: 'Gateway error ERR_413 indicates payloads larger than 25 MB.', cos: 0.16 },
    ],
  },
  {
    query: '"How does RAG stop an AI model from guessing facts?"',
    candidates: [
      { doc: 'Grounding injects verified chunks into the prompt with source citations.', cos: 0.94 },
      { doc: 'Cross-encoders drop noisy passages before final answer generation.', cos: 0.81 },
      { doc: 'Company holiday schedule takes effect every January.', cos: 0.12 },
    ],
  },
];

function EmbeddingSimilarityLab() {
  const [qIdx, setQIdx] = useState(0);
  const scenario = SIMILARITY_SCENARIOS[qIdx];

  return (
    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <span className="text-xs font-mono uppercase tracking-wider text-[var(--accent-orange-text)]">
          Vector Meaning Closeness Visualizer
        </span>
        <div className="flex gap-2">
          {SIMILARITY_SCENARIOS.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setQIdx(i)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium border cursor-pointer ${
                qIdx === i
                  ? 'border-[#73C5F1] bg-[#73C5F1]/15 text-[var(--text-heading)]'
                  : 'border-[var(--border-subtle)] text-[var(--text-muted)]'
              }`}
            >
              Sample Query {i + 1}
            </button>
          ))}
        </div>
      </div>

      <p className="text-sm font-mono mb-4 px-3 py-2 rounded-lg bg-[var(--bg-page)] border border-[var(--border-subtle)]">
        Query Vector: <span className="text-[#F1A15C]">{scenario.query}</span>
      </p>

      <div className="space-y-2.5">
        {scenario.candidates.map((c) => (
          <div key={c.doc} className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-page)] p-3">
            <p className="text-sm mb-2">{c.doc}</p>
            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="flex-1 h-2.5 rounded-full bg-[var(--bg-surface-muted)] overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#73C5F1] to-[#F1A15C]" style={{ width: `${Math.round(c.cos * 100)}%` }} />
              </div>
              <span className="text-[var(--text-heading)] font-bold shrink-0">cos = {c.cos.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================================
 * 4. INDEX LOOKUP VISUALIZER (Stage 04)
 * ========================================================================== */
type IndexMode = 'exact' | 'hnsw' | 'ivf';

function IndexLookupLab() {
  const [mode, setMode] = useState<IndexMode>('hnsw');

  const meta: Record<IndexMode, { label: string; scanned: number[]; stats: string; explanation: string }> = {
    exact: {
      label: 'Brute-Force Exact Scan',
      scanned: Array.from({ length: 16 }).map((_, i) => i),
      stats: '16 / 16 buckets checked · Slow at millions of chunks',
      explanation: 'Compares your query vector against every single chunk one-by-one. 100% accurate, but slow on large libraries.',
    },
    hnsw: {
      label: 'HNSW Highway Graph',
      scanned: [0, 2, 6, 10],
      stats: '4 hops taken · ~5–15 ms lookup',
      explanation: 'Jumps across coarse top-layer shortcuts down to the target neighborhood, touching only a tiny fraction of nodes.',
    },
    ivf: {
      label: 'IVF Cluster Probe',
      scanned: [8, 9, 12, 13],
      stats: '1 cluster cell probed · Low memory footprint',
      explanation: 'Finds the nearest centroid region first and searches only inside that single cell.',
    },
  };

  const cur = meta[mode];

  return (
    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <span className="text-xs font-mono uppercase tracking-wider text-[var(--accent-orange-text)]">
          Interactive Vector Lookup Visualizer
        </span>
        <div className="flex flex-wrap gap-1.5">
          {(['hnsw', 'ivf', 'exact'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium border cursor-pointer ${
                mode === m
                  ? 'border-[#73C5F1] bg-[#73C5F1]/15 text-[var(--text-heading)]'
                  : 'border-[var(--border-subtle)] text-[var(--text-muted)]'
              }`}
            >
              {meta[m].label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-4 max-w-md">
        {Array.from({ length: 16 }).map((_, idx) => {
          const hit = cur.scanned.includes(idx);
          const isTarget = idx === 10 || (mode === 'ivf' && idx === 9);
          return (
            <div
              key={idx}
              className={`h-10 rounded-lg border flex items-center justify-center text-xs font-mono transition-colors ${
                isTarget
                  ? 'border-[#F1A15C] bg-[#F1A15C]/25 text-[#F1A15C] font-bold'
                  : hit
                  ? 'border-[#73C5F1] bg-[#73C5F1]/15 text-[var(--text-heading)]'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-page)] text-[var(--text-subtle)] opacity-50'
              }`}
            >
              {isTarget ? 'MATCH' : `V${String(idx + 1).padStart(2, '0')}`}
            </div>
          );
        })}
      </div>

      <p className="text-xs font-mono text-[#F1A15C] mb-1">{cur.stats}</p>
      <p className="text-xs text-[var(--text-muted)]">{cur.explanation}</p>
    </div>
  );
}

/* ============================================================================
 * 5. HYBRID RETRIEVAL VISUALIZER (Stage 05)
 * ========================================================================== */
const HYBRID_CASES = [
  {
    query: 'Upload error ERR_413 exceeding limit',
    dense: [
      { id: 'Doc B', text: 'General gateway file upload troubleshooting', score: '0.74' },
      { id: 'Doc C', text: 'How timeouts work during slow requests', score: '0.70' },
      { id: 'Doc A', text: 'ERR_413: Payload exceeds 25 MB limit', score: '0.66' },
    ],
    sparse: [
      { id: 'Doc A', text: 'ERR_413: Payload exceeds 25 MB limit', score: 'BM25 18.4' },
      { id: 'Doc D', text: 'Multipart upload API reference', score: 'BM25 6.2' },
      { id: 'Doc B', text: 'General gateway file upload troubleshooting', score: 'BM25 2.1' },
    ],
    hybrid: [
      { id: 'Doc A', text: 'ERR_413: Payload exceeds 25 MB limit', score: 'RRF #1' },
      { id: 'Doc B', text: 'General gateway file upload troubleshooting', score: 'RRF #2' },
      { id: 'Doc D', text: 'Multipart upload API reference', score: 'RRF #3' },
    ],
  },
  {
    query: 'How does RAG stay accurate without retraining?',
    dense: [
      { id: 'Doc E', text: 'External vector retrieval grounds responses in fresh documents', score: '0.92' },
      { id: 'Doc F', text: 'Citation grounding links claims back to source passages', score: '0.84' },
      { id: 'Doc G', text: 'Prompt formatting for evidence blocks', score: '0.71' },
    ],
    sparse: [
      { id: 'Doc H', text: 'Model fine-tuning training guide (matches "training")', score: 'BM25 7.9' },
      { id: 'Doc E', text: 'External vector retrieval grounds responses in fresh documents', score: 'BM25 3.1' },
      { id: 'Doc G', text: 'Prompt formatting for evidence blocks', score: 'BM25 1.8' },
    ],
    hybrid: [
      { id: 'Doc E', text: 'External vector retrieval grounds responses in fresh documents', score: 'RRF #1' },
      { id: 'Doc F', text: 'Citation grounding links claims back to source passages', score: 'RRF #2' },
      { id: 'Doc H', text: 'Model fine-tuning training guide', score: 'RRF #3' },
    ],
  },
];

function HybridRetrievalLab() {
  const [caseIdx, setCaseIdx] = useState(0);
  const [mode, setMode] = useState<'dense' | 'sparse' | 'hybrid'>('hybrid');
  const current = HYBRID_CASES[caseIdx];
  const rows = current[mode];

  return (
    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <span className="text-xs font-mono uppercase tracking-wider text-[var(--accent-orange-text)]">
          Dense vs Keyword vs Hybrid Fusion Visualizer
        </span>
        <div className="flex gap-1.5">
          {(['dense', 'sparse', 'hybrid'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium capitalize border cursor-pointer ${
                mode === m
                  ? 'border-[#F1A15C] bg-[#F1A15C]/15 text-[var(--text-body)]'
                  : 'border-[var(--border-subtle)] text-[var(--text-muted)]'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {HYBRID_CASES.map((c, idx) => (
          <button
            key={c.query}
            type="button"
            onClick={() => setCaseIdx(idx)}
            className={`text-left text-xs px-3 py-1.5 rounded-lg border cursor-pointer ${
              caseIdx === idx
                ? 'border-[#73C5F1] bg-[#73C5F1]/10 text-[var(--text-heading)]'
                : 'border-[var(--border-subtle)] text-[var(--text-muted)]'
            }`}
          >
            {idx === 0 ? 'Exact Error Query' : 'Meaning Query'}: {c.query}
          </button>
        ))}
      </div>

      <ol className="space-y-2">
        {rows.map((r, i) => (
          <li
            key={r.id}
            className="flex items-center justify-between gap-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-page)] px-3.5 py-2.5 text-sm"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-mono font-bold text-[#73C5F1]">#{i + 1}</span>
              <span className="font-mono text-xs text-[var(--text-muted)]">{r.id}</span>
              <span>{r.text}</span>
            </div>
            <span className="text-xs font-mono text-[#F1A15C] shrink-0">{r.score}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ============================================================================
 * 6. ANIMATED RERANKING VISUALIZER (Stage 06)
 * ========================================================================== */
const RERANK_CANDIDATES = [
  { id: 'C1', text: 'Enterprise pricing tiers overview', biRank: 1, crossScore: 0.21, finalSlot: 'Dropped' },
  { id: 'C2', text: 'General annual invoice formatting FAQ', biRank: 2, crossScore: 0.44, finalSlot: 'Dropped' },
  { id: 'C3', text: 'Annual subscriptions qualify for a full refund within 30 days', biRank: 3, crossScore: 0.96, finalSlot: 'Start Slot (Top)' },
  { id: 'C4', text: 'Refund requests take 5 business days to settle back to card', biRank: 4, crossScore: 0.89, finalSlot: 'End Slot (Edge)' },
  { id: 'C5', text: 'Cancel anytime from Settings > Billing before renewal', biRank: 5, crossScore: 0.74, finalSlot: 'Middle Slot' },
];

function RerankingFlowLab() {
  const [step, setStep] = useState<0 | 1 | 2>(1);
  const steps = ['1. Fast Vector Candidates', '2. Cross-Encoder Rescore', '3. Best-at-Edges Prompt Order'];

  const displayed = useMemo(() => {
    if (step === 0) return RERANK_CANDIDATES;
    if (step === 1) return [...RERANK_CANDIDATES].sort((a, b) => b.crossScore - a.crossScore);
    return [RERANK_CANDIDATES[2], RERANK_CANDIDATES[4], RERANK_CANDIDATES[3]];
  }, [step]);

  return (
    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <span className="text-xs font-mono uppercase tracking-wider text-[var(--accent-orange-text)]">
          Animated Reranking &amp; Context Trim Visualizer
        </span>
        <button
          type="button"
          onClick={() => setStep((s) => ((s + 1) % 3) as 0 | 1 | 2)}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md border border-[#73C5F1] bg-[#73C5F1]/15 text-xs font-medium text-[var(--text-heading)] cursor-pointer"
        >
          <Play className="w-3 h-3" /> Next Stage
        </button>
      </div>

      <div className="grid sm:grid-cols-3 gap-2 mb-4">
        {steps.map((label, idx) => (
          <button
            key={label}
            type="button"
            onClick={() => setStep(idx as 0 | 1 | 2)}
            className={`px-3 py-2 rounded-lg border text-xs font-medium text-left cursor-pointer ${
              step === idx
                ? 'border-[#F1A15C] bg-[#F1A15C]/15 text-[var(--text-body)]'
                : 'border-[var(--border-subtle)] text-[var(--text-muted)]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {displayed.map((c, idx) => (
          <motion.div
            key={c.id}
            layout
            transition={{ duration: 0.25 }}
            className="flex items-center justify-between gap-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-page)] px-3.5 py-2.5 text-sm"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-mono font-bold text-[#73C5F1]">#{idx + 1}</span>
              <span className="font-mono text-xs text-[var(--text-muted)]">{c.id}</span>
              <span>{c.text}</span>
            </div>
            <span className="text-xs font-mono text-[#F1A15C] shrink-0">
              {step === 0
                ? `Vec #${c.biRank}`
                : step === 1
                ? `Score ${c.crossScore.toFixed(2)}`
                : c.finalSlot}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================================
 * 7. GROUNDED ANSWER VISUALIZER (Stage 07)
 * ========================================================================== */
function GroundedAnswerLab() {
  const [withRag, setWithRag] = useState(true);

  return (
    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <span className="text-xs font-mono uppercase tracking-wider text-[var(--accent-orange-text)]">
          Visual Comparison · Pure LLM vs RAG-Grounded Answer
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setWithRag(false)}
            className={`px-3 py-1 rounded-md text-xs font-medium border cursor-pointer ${
              !withRag
                ? 'border-[#F1A15C] bg-[#F1A15C]/15 text-[var(--text-body)]'
                : 'border-[var(--border-subtle)] text-[var(--text-muted)]'
            }`}
          >
            Without RAG (Guessing)
          </button>
          <button
            type="button"
            onClick={() => setWithRag(true)}
            className={`px-3 py-1 rounded-md text-xs font-medium border cursor-pointer ${
              withRag
                ? 'border-[#73C5F1] bg-[#73C5F1]/15 text-[var(--text-heading)]'
                : 'border-[var(--border-subtle)] text-[var(--text-muted)]'
            }`}
          >
            With RAG Grounding
          </button>
        </div>
      </div>

      <p className="text-xs font-mono px-3 py-2 rounded-lg bg-[var(--bg-page)] border border-[var(--border-subtle)] mb-3">
        Question: <span className="text-[#F1A15C]">&quot;Can I cancel our annual ACME subscription after 18 days?&quot;</span>
      </p>

      {withRag ? (
        <div className="grid sm:grid-cols-2 gap-3 text-xs">
          <div className="rounded-lg border border-[#73C5F1]/50 bg-[var(--bg-page)] p-3.5 space-y-2">
            <p className="font-mono uppercase text-[var(--text-heading)] font-semibold">Retrieved Prompt Context</p>
            <p className="text-[var(--text-muted)]">
              <strong className="text-[#73C5F1]">[1]</strong> Annual subscriptions qualify for a full refund within 30 days of payment.
            </p>
            <p className="text-[var(--text-muted)]">
              <strong className="text-[#F1A15C]">[2]</strong> Refunds settle back to the original card in 5 business days.
            </p>
          </div>
          <div className="rounded-lg border border-[#F1A15C]/50 bg-[var(--bg-page)] p-3.5 space-y-2">
            <p className="font-mono uppercase text-[#F1A15C] font-semibold">Verified LLM Output</p>
            <p className="text-sm leading-relaxed text-[var(--text-body)]">
              Yes. Because day 18 is within the 30-day window, you qualify for a full refund{' '}
              <span className="font-mono text-[#73C5F1]">[1]</span>, and it settles within 5 business days{' '}
              <span className="font-mono text-[#F1A15C]">[2]</span>.
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-page)] p-4 text-sm text-[var(--text-muted)]">
          <p className="text-xs font-mono uppercase text-[#F1A15C] mb-1.5">Ungrounded Model Guess</p>
          <p className="leading-relaxed">
            &quot;Most SaaS companies offer a 14-day refund window, so after 18 days your annual charge is likely non-refundable.&quot;
          </p>
          <p className="mt-2 text-xs text-[#F1A15C]">
            Without retrieval, the LLM falls back to generic guesses and gives the wrong policy!
          </p>
        </div>
      )}
    </div>
  );
}
