import { motion, useReducedMotion } from 'motion/react';
import type { RagDiagramId } from '../../data/types';

export function RagDiagram({ id }: { id: RagDiagramId }) {
  const reduced = Boolean(useReducedMotion());

  switch (id) {
    case 'rag-ingestion-flow':
      return <IngestionFlowDiagram reduced={reduced} />;
    case 'rag-chunking-flow':
      return <ChunkingFlowDiagram reduced={reduced} />;
    case 'rag-vector-space':
      return <VectorSpaceDiagram reduced={reduced} />;
    case 'rag-hnsw-ivf':
      return <HnswIvfDiagram reduced={reduced} />;
    case 'rag-hybrid-fusion':
      return <HybridFusionDiagram reduced={reduced} />;
    case 'rag-reranker-funnel':
      return <RerankerFunnelDiagram reduced={reduced} />;
    case 'rag-grounded-prompt':
      return <GroundedPromptDiagram reduced={reduced} />;
    case 'rag-e2e-process':
      return <EndToEndProcessDiagram reduced={reduced} />;
    default:
      return null;
  }
}

function IngestionFlowDiagram({ reduced }: { reduced: boolean }) {
  return (
    <svg viewBox="0 0 740 230" className="w-full h-auto" role="img" aria-label="Document loading, layout parsing, and noise removal flow">
      <rect x="18" y="30" width="180" height="170" rx="12" fill="#172334" stroke="#73C5F1" strokeWidth="1.4" />
      <text x="108" y="58" textAnchor="middle" fill="#8BD4FF" fontSize="13" fontWeight="700">1. Raw Sources</text>
      {['PDF Manual (v4)', 'Web Support Docs', 'Product Tables'].map((label, idx) => (
        <g key={label}>
          <rect x="34" y={78 + idx * 38} width="148" height="28" rx="6" fill="#101827" stroke="#24344D" />
          <text x="108" y={96 + idx * 38} textAnchor="middle" fill="#E5E7EB" fontSize="10.5" fontFamily="Geist Mono, monospace">
            {label}
          </text>
        </g>
      ))}

      <line x1="198" y1="115" x2="254" y2="115" stroke="#73C5F1" strokeWidth="1.8" />
      {!reduced && <motion.circle cy="115" r="4" fill="#F1A15C" animate={{ cx: [204, 248] }} transition={{ duration: 1.5, repeat: Infinity }} />}

      <rect x="254" y="30" width="224" height="170" rx="12" fill="#101827" stroke="#F1A15C" strokeWidth="1.4" />
      <text x="366" y="58" textAnchor="middle" fill="#F1A15C" fontSize="13" fontWeight="700">2. Parse &amp; Strip Noise</text>
      <rect x="274" y="78" width="184" height="46" rx="8" fill="#172334" stroke="#73C5F1" />
      <text x="366" y="98" textAnchor="middle" fill="#8BD4FF" fontSize="10.5" fontWeight="600">Keep Headings &amp; Tables</text>
      <text x="366" y="114" textAnchor="middle" fill="#9CA3AF" fontSize="9.5">Preserves reading order</text>
      <rect x="274" y="136" width="184" height="46" rx="8" fill="#172334" stroke="#F1A15C" strokeDasharray="3 3" />
      <text x="366" y="156" textAnchor="middle" fill="#F1A15C" fontSize="10.5" fontWeight="600">Drop Footers &amp; Banners</text>
      <text x="366" y="172" textAnchor="middle" fill="#9CA3AF" fontSize="9.5">Removes repeated page noise</text>

      <line x1="478" y1="115" x2="534" y2="115" stroke="#F1A15C" strokeWidth="1.8" />
      {!reduced && <motion.circle cy="115" r="4" fill="#73C5F1" animate={{ cx: [484, 528] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }} />}

      <rect x="534" y="42" width="188" height="146" rx="12" fill="#172334" stroke="#8BD4FF" strokeWidth="1.4" />
      <text x="628" y="72" textAnchor="middle" fill="#8BD4FF" fontSize="13" fontWeight="700">3. Clean Text</text>
      <rect x="554" y="92" width="148" height="72" rx="8" fill="#101827" stroke="#24344D" />
      <text x="628" y="116" textAnchor="middle" fill="#E5E7EB" fontSize="10.5" fontFamily="Geist Mono, monospace"># Section Headings</text>
      <text x="628" y="134" textAnchor="middle" fill="#73C5F1" fontSize="10.5" fontFamily="Geist Mono, monospace">| Structured Facts</text>
      <text x="628" y="152" textAnchor="middle" fill="#9CA3AF" fontSize="10">+ Source Metadata</text>
    </svg>
  );
}

function ChunkingFlowDiagram({ reduced }: { reduced: boolean }) {
  return (
    <svg viewBox="0 0 720 220" className="w-full h-auto" role="img" aria-label="Text to Overlapping Chunks ready for embeddings">
      <rect x="20" y="34" width="160" height="152" rx="10" fill="#172334" stroke="#73C5F1" />
      <text x="100" y="60" textAnchor="middle" fill="#8BD4FF" fontSize="12" fontWeight="700">Clean Document</text>
      {[80, 98, 116, 134, 152].map((y, idx) => (
        <rect key={y} x="36" y={y} width={128 - (idx % 2) * 24} height="8" rx="4" fill={idx === 2 ? '#F1A15C' : '#4B5563'} />
      ))}

      <line x1="180" y1="110" x2="230" y2="110" stroke="#73C5F1" strokeWidth="1.8" />
      {!reduced && <motion.circle cy="110" r="3.5" fill="#F1A15C" animate={{ cx: [184, 226] }} transition={{ duration: 1.4, repeat: Infinity }} />}

      <rect x="230" y="28" width="218" height="164" rx="10" fill="#101827" stroke="#24344D" />
      <text x="339" y="54" textAnchor="middle" fill="#F1A15C" fontSize="12" fontWeight="700">Overlapping Chunks</text>
      <rect x="248" y="68" width="182" height="32" rx="6" fill="#172334" stroke="#73C5F1" />
      <text x="339" y="88" textAnchor="middle" fill="#E5E7EB" fontSize="10.5" fontFamily="Geist Mono, monospace">Chunk 1 [0..512] + heading</text>
      <rect x="248" y="106" width="182" height="32" rx="6" fill="#172334" stroke="#F1A15C" />
      <text x="339" y="126" textAnchor="middle" fill="#E5E7EB" fontSize="10.5" fontFamily="Geist Mono, monospace">Chunk 2 [448..960] (overlap)</text>
      <rect x="248" y="144" width="182" height="32" rx="6" fill="#172334" stroke="#73C5F1" />
      <text x="339" y="164" textAnchor="middle" fill="#E5E7EB" fontSize="10.5" fontFamily="Geist Mono, monospace">Chunk 3 [896..1408]</text>

      <line x1="448" y1="110" x2="498" y2="110" stroke="#F1A15C" strokeWidth="1.8" />
      {!reduced && <motion.circle cy="110" r="3.5" fill="#73C5F1" animate={{ cx: [452, 494] }} transition={{ duration: 1.4, repeat: Infinity, delay: 0.5 }} />}

      <rect x="498" y="34" width="202" height="152" rx="10" fill="#172334" stroke="#8BD4FF" />
      <text x="599" y="60" textAnchor="middle" fill="#8BD4FF" fontSize="12" fontWeight="700">Ready for Embedding</text>
      <text x="599" y="92" textAnchor="middle" fill="#73C5F1" fontSize="10.5" fontFamily="Geist Mono, monospace">id: doc_01#c1</text>
      <text x="599" y="124" textAnchor="middle" fill="#F1A15C" fontSize="10.5" fontFamily="Geist Mono, monospace">id: doc_01#c2</text>
      <text x="599" y="156" textAnchor="middle" fill="#73C5F1" fontSize="10.5" fontFamily="Geist Mono, monospace">id: doc_01#c3</text>
    </svg>
  );
}

function VectorSpaceDiagram({ reduced }: { reduced: boolean }) {
  return (
    <svg viewBox="0 0 640 240" className="w-full h-auto" role="img" aria-label="Cosine similarity vs Euclidean distance in vector space">
      <rect x="16" y="16" width="608" height="208" rx="12" fill="#101827" stroke="#24344D" />
      <line x1="80" y1="196" x2="80" y2="36" stroke="#4B5563" strokeWidth="1.4" />
      <line x1="80" y1="196" x2="360" y2="196" stroke="#4B5563" strokeWidth="1.4" />

      <line x1="80" y1="196" x2="250" y2="76" stroke="#F1A15C" strokeWidth="2.5" />
      <circle cx="250" cy="76" r="5" fill="#F1A15C" />
      <text x="262" y="74" fill="#F1A15C" fontSize="11.5" fontWeight="600">Query Vector q</text>

      <line x1="80" y1="196" x2="300" y2="104" stroke="#73C5F1" strokeWidth="2.5" />
      <circle cx="300" cy="104" r="5" fill="#73C5F1" />
      <text x="295" y="124" textAnchor="end" fill="#8BD4FF" fontSize="11.5" fontWeight="600">Match d1 (small θ)</text>

      <line x1="80" y1="196" x2="140" y2="66" stroke="#6B7280" strokeWidth="1.8" strokeDasharray="4 4" />
      <circle cx="140" cy="66" r="4.5" fill="#9CA3AF" />
      <text x="150" y="54" fill="#9CA3AF" fontSize="10.5">Unrelated d2 (wide θ)</text>

      {!reduced ? (
        <motion.path d="M135 157 A64 64 0 0 1 144 169" fill="none" stroke="#F1A15C" strokeWidth="2" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }} />
      ) : (
        <path d="M135 157 A64 64 0 0 1 144 169" fill="none" stroke="#F1A15C" strokeWidth="2" />
      )}
      <text x="158" y="166" fill="#F1A15C" fontSize="11" fontFamily="Geist Mono, monospace">cos(θ)</text>

      <rect x="406" y="42" width="196" height="156" rx="10" fill="#172334" stroke="#24344D" />
      <text x="422" y="68" fill="#8BD4FF" fontSize="12" fontWeight="700">How Vectors Compare</text>
      <text x="422" y="96" fill="#E5E7EB" fontSize="10.5" fontFamily="Geist Mono, monospace">Smaller θ = Closer Meaning</text>
      <text x="422" y="122" fill="#73C5F1" fontSize="10.5" fontFamily="Geist Mono, monospace">cos(θ) → 1.00 = Best Match</text>
      <text x="422" y="148" fill="#9CA3AF" fontSize="10.5" fontFamily="Geist Mono, monospace">cos(θ) → 0.00 = Unrelated</text>
      <text x="422" y="180" fill="#F1A15C" fontSize="10">Same encoder for docs &amp; query</text>
    </svg>
  );
}

function HnswIvfDiagram({ reduced }: { reduced: boolean }) {
  return (
    <svg viewBox="0 0 720 230" className="w-full h-auto" role="img" aria-label="HNSW multi-layer graph vs IVF Voronoi clusters">
      <rect x="16" y="18" width="336" height="194" rx="12" fill="#101827" stroke="#73C5F1" strokeWidth="1.3" />
      <text x="184" y="42" textAnchor="middle" fill="#8BD4FF" fontSize="13" fontWeight="700">HNSW (Express Highway Graph)</text>
      {[74, 122, 172].map((y, layer) => (
        <g key={y}>
          <rect x="38" y={y - 12} width="292" height="32" rx="6" fill="#172334" stroke="#24344D" />
          <text x="50" y={y + 8} fill="#9CA3AF" fontSize="9.5" fontFamily="Geist Mono, monospace">L{2 - layer}</text>
          {(layer === 0 ? [120, 260] : layer === 1 ? [100, 180, 270] : [90, 145, 200, 255, 305]).map((cx) => (
            <circle key={cx} cx={cx} cy={y + 4} r="4.5" fill={cx === 260 || cx === 270 || cx === 255 ? '#F1A15C' : '#73C5F1'} />
          ))}
        </g>
      ))}
      <motion.path
        d="M120 78 L260 78 L270 126 L255 176"
        fill="none"
        stroke="#F1A15C"
        strokeWidth="2"
        animate={reduced ? undefined : { opacity: [0.35, 1, 0.35] }}
        transition={{ duration: 2.2, repeat: Infinity }}
      />

      <rect x="368" y="18" width="336" height="194" rx="12" fill="#101827" stroke="#F1A15C" strokeWidth="1.3" />
      <text x="536" y="42" textAnchor="middle" fill="#F1A15C" fontSize="13" fontWeight="700">IVF (Clustered Neighborhoods)</text>
      <line x1="536" y1="62" x2="536" y2="196" stroke="#24344D" strokeWidth="1.5" />
      <line x1="392" y1="130" x2="680" y2="130" stroke="#24344D" strokeWidth="1.5" />
      {[
        { cx: 460, cy: 96, active: false },
        { cx: 610, cy: 96, active: true },
        { cx: 460, cy: 164, active: false },
        { cx: 610, cy: 164, active: false },
      ].map((c, idx) => (
        <g key={idx}>
          <circle cx={c.cx} cy={c.cy} r="28" fill={c.active ? '#F1A15C' : '#73C5F1'} fillOpacity="0.1" stroke={c.active ? '#F1A15C' : '#24344D'} />
          <circle cx={c.cx} cy={c.cy} r="5" fill={c.active ? '#F1A15C' : '#73C5F1'} />
          <text x={c.cx + 10} y={c.cy + 4} fill="#9CA3AF" fontSize="9.5" fontFamily="Geist Mono, monospace">C{idx + 1}</text>
        </g>
      ))}
      <text x="536" y="202" textAnchor="middle" fill="#9CA3AF" fontSize="10">Check nearest cluster cell only (skips the rest)</text>
    </svg>
  );
}

function HybridFusionDiagram({ reduced }: { reduced: boolean }) {
  return (
    <svg viewBox="0 0 740 240" className="w-full h-auto" role="img" aria-label="Hybrid Search combining Semantic Vector Search and Keyword BM25">
      <rect x="20" y="92" width="120" height="54" rx="10" fill="#172334" stroke="#73C5F1" />
      <text x="80" y="123" textAnchor="middle" fill="#E5E7EB" fontSize="12" fontWeight="600">User Query</text>

      <line x1="140" y1="108" x2="210" y2="66" stroke="#73C5F1" strokeWidth="1.6" />
      <line x1="140" y1="130" x2="210" y2="174" stroke="#F1A15C" strokeWidth="1.6" />

      <rect x="210" y="34" width="186" height="64" rx="10" fill="#101827" stroke="#73C5F1" />
      <text x="303" y="60" textAnchor="middle" fill="#8BD4FF" fontSize="12" fontWeight="700">Dense Vector Search</text>
      <text x="303" y="80" textAnchor="middle" fill="#9CA3AF" fontSize="10.5">Matches meaning &amp; synonyms</text>

      <rect x="210" y="142" width="186" height="64" rx="10" fill="#101827" stroke="#F1A15C" />
      <text x="303" y="168" textAnchor="middle" fill="#F1A15C" fontSize="12" fontWeight="700">Keyword / BM25 Search</text>
      <text x="303" y="188" textAnchor="middle" fill="#9CA3AF" fontSize="10.5">Matches exact codes &amp; names</text>

      <line x1="396" y1="66" x2="465" y2="108" stroke="#73C5F1" strokeWidth="1.6" />
      <line x1="396" y1="174" x2="465" y2="130" stroke="#F1A15C" strokeWidth="1.6" />
      {!reduced && (
        <motion.circle r="4" fill="#F1A15C" animate={{ cx: [400, 462], cy: [172, 132] }} transition={{ duration: 1.6, repeat: Infinity }} />
      )}

      <rect x="465" y="76" width="255" height="88" rx="12" fill="#172334" stroke="#8BD4FF" strokeWidth="1.5" />
      <text x="592" y="106" textAnchor="middle" fill="#8BD4FF" fontSize="13" fontWeight="700">Rank Fusion (RRF Merge)</text>
      <text x="592" y="128" textAnchor="middle" fill="#E5E7EB" fontSize="11" fontFamily="Geist Mono, monospace">score = Σ 1 / (k + rank_i)</text>
      <text x="592" y="148" textAnchor="middle" fill="#F1A15C" fontSize="10.5">Top-25 Combined Pool</text>
    </svg>
  );
}

function RerankerFunnelDiagram({ reduced }: { reduced: boolean }) {
  const stages = [
    { label: 'Candidate Pool', sub: 'Top-25 Fast Matches', w: 152, color: '#73C5F1' },
    { label: 'Cross-Encoder', sub: 'Reads Query + Chunk', w: 152, color: '#F1A15C' },
    { label: 'Noise Dropped', sub: 'Low Scores Filtered', w: 148, color: '#8BD4FF' },
    { label: 'Ordered Context', sub: 'Top-3 Best-at-Edges', w: 152, color: '#73C5F1' },
  ];

  return (
    <svg viewBox="0 0 740 160" className="w-full h-auto" role="img" aria-label="Candidate Pool to Cross-Encoder Reranker to Final Ordered Context">
      {stages.map((st, idx) => {
        const x = 16 + idx * 182;
        return (
          <g key={st.label}>
            <rect x={x} y="34" width={st.w} height="86" rx="10" fill="#101827" stroke={st.color} strokeWidth="1.4" />
            <text x={x + st.w / 2} y="68" textAnchor="middle" fill={st.color} fontSize="11.5" fontWeight="700">{st.label}</text>
            <text x={x + st.w / 2} y="90" textAnchor="middle" fill="#9CA3AF" fontSize="10">{st.sub}</text>
            {idx < 3 && <line x1={x + st.w} y1="77" x2={x + 182} y2="77" stroke="#F1A15C" strokeWidth="1.8" />}
          </g>
        );
      })}
      {!reduced && (
        <motion.circle cy="77" r="4.5" fill="#F1A15C" animate={{ cx: [28, 712] }} transition={{ duration: 3.6, repeat: Infinity, ease: 'linear' }} />
      )}
    </svg>
  );
}

function GroundedPromptDiagram({ reduced }: { reduced: boolean }) {
  return (
    <svg viewBox="0 0 740 230" className="w-full h-auto" role="img" aria-label="Prompt Assembly Combining System Rules, Retrieved Chunks, and User Query Into Cited Answer">
      {/* Left stacked inputs */}
      <rect x="20" y="24" width="210" height="52" rx="9" fill="#172334" stroke="#73C5F1" />
      <text x="125" y="47" textAnchor="middle" fill="#8BD4FF" fontSize="11.5" fontWeight="700">1. Grounding Rules</text>
      <text x="125" y="64" textAnchor="middle" fill="#9CA3AF" fontSize="9.5">Answer only from provided context</text>

      <rect x="20" y="88" width="210" height="54" rx="9" fill="#172334" stroke="#F1A15C" />
      <text x="125" y="111" textAnchor="middle" fill="#F1A15C" fontSize="11.5" fontWeight="700">2. Top-3 Ordered Chunks</text>
      <text x="125" y="128" textAnchor="middle" fill="#E5E7EB" fontSize="9.5" fontFamily="Geist Mono, monospace">[1] Policy §4 · [2] Billing FAQ</text>

      <rect x="20" y="154" width="210" height="52" rx="9" fill="#172334" stroke="#73C5F1" />
      <text x="125" y="177" textAnchor="middle" fill="#8BD4FF" fontSize="11.5" fontWeight="700">3. User Question</text>
      <text x="125" y="194" textAnchor="middle" fill="#9CA3AF" fontSize="9.5">&quot;Can I cancel annual billing?&quot;</text>

      {/* Connectors into LLM */}
      <line x1="230" y1="50" x2="310" y2="115" stroke="#73C5F1" strokeWidth="1.5" />
      <line x1="230" y1="115" x2="310" y2="115" stroke="#F1A15C" strokeWidth="2" />
      <line x1="230" y1="180" x2="310" y2="115" stroke="#73C5F1" strokeWidth="1.5" />
      {!reduced && <motion.circle cy="115" r="4" fill="#F1A15C" animate={{ cx: [236, 306] }} transition={{ duration: 1.5, repeat: Infinity }} />}

      {/* Center LLM box */}
      <rect x="310" y="62" width="150" height="106" rx="12" fill="#101827" stroke="#8BD4FF" strokeWidth="1.6" />
      <text x="385" y="102" textAnchor="middle" fill="#8BD4FF" fontSize="13.5" fontWeight="700">LLM</text>
      <text x="385" y="122" textAnchor="middle" fill="#E5E7EB" fontSize="10.5">Reads evidence,</text>
      <text x="385" y="138" textAnchor="middle" fill="#E5E7EB" fontSize="10.5">no guessing</text>

      {/* Arrow out */}
      <line x1="460" y1="115" x2="516" y2="115" stroke="#F1A15C" strokeWidth="2" />
      {!reduced && <motion.circle cy="115" r="4" fill="#73C5F1" animate={{ cx: [464, 512] }} transition={{ duration: 1.4, repeat: Infinity, delay: 0.4 }} />}

      {/* Right Cited Output */}
      <rect x="516" y="44" width="204" height="142" rx="12" fill="#172334" stroke="#F1A15C" strokeWidth="1.5" />
      <text x="618" y="74" textAnchor="middle" fill="#F1A15C" fontSize="12.5" fontWeight="700">Grounded Answer</text>
      <rect x="534" y="90" width="168" height="76" rx="8" fill="#101827" stroke="#24344D" />
      <text x="618" y="112" textAnchor="middle" fill="#E5E7EB" fontSize="10">Full refund within 30 days</text>
      <text x="618" y="129" textAnchor="middle" fill="#E5E7EB" fontSize="10">via account settings</text>
      <text x="618" y="150" textAnchor="middle" fill="#73C5F1" fontSize="10.5" fontFamily="Geist Mono, monospace">Sources: [1] [2]</text>
    </svg>
  );
}

function EndToEndProcessDiagram({ reduced }: { reduced: boolean }) {
  const ingSteps = ['01 Load Docs', '02 Chunk', '03 Embed', '04 Vector Index'];
  const qrySteps = ['05 Search Index', '06 Rerank', '07 Prompt + LLM', '08 Cited Answer'];

  return (
    <svg viewBox="0 0 760 270" className="w-full h-auto" role="img" aria-label="Two-phase RAG process diagram">
      <text x="20" y="24" fill="#73C5F1" fontSize="11.5" fontWeight="700" fontFamily="Geist Mono, monospace">
        PHASE 1 · OFFLINE INDEXING (PREPARE DOCUMENTS)
      </text>
      <rect x="14" y="34" width="732" height="88" rx="12" fill="#101827" stroke="#24344D" />

      {ingSteps.map((label, i) => {
        const x = 28 + i * 180;
        return (
          <g key={label}>
            <rect x={x} y="50" width="146" height="56" rx="8" fill="#172334" stroke={i === 3 ? '#F1A15C' : '#73C5F1'} strokeWidth="1.3" />
            <text x={x + 73} y="82" textAnchor="middle" fill="#E5E7EB" fontSize="11.5" fontWeight="600">{label}</text>
            {i < 3 && <line x1={x + 146} y1="78" x2={x + 180} y2="78" stroke="#73C5F1" strokeWidth="1.6" />}
          </g>
        );
      })}
      {!reduced && <motion.circle cy="78" r="4" fill="#73C5F1" animate={{ cx: [40, 706] }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }} />}

      <line x1="641" y1="106" x2="641" y2="138" stroke="#F1A15C" strokeWidth="1.6" strokeDasharray="4 3" />
      <line x1="641" y1="138" x2="101" y2="138" stroke="#F1A15C" strokeWidth="1.6" strokeDasharray="4 3" />
      <line x1="101" y1="138" x2="101" y2="176" stroke="#F1A15C" strokeWidth="1.6" strokeDasharray="4 3" />

      <text x="20" y="160" fill="#F1A15C" fontSize="11.5" fontWeight="700" fontFamily="Geist Mono, monospace">
        PHASE 2 · LIVE QUERY TIME (ANSWER QUESTION WITH EVIDENCE)
      </text>
      <rect x="14" y="170" width="732" height="88" rx="12" fill="#101827" stroke="#24344D" />

      {qrySteps.map((label, i) => {
        const x = 28 + i * 180;
        return (
          <g key={label}>
            <rect x={x} y="186" width="146" height="56" rx="8" fill="#172334" stroke={i === 3 ? '#73C5F1' : '#F1A15C'} strokeWidth="1.3" />
            <text x={x + 73} y="218" textAnchor="middle" fill="#E5E7EB" fontSize="11.5" fontWeight="600">{label}</text>
            {i < 3 && <line x1={x + 146} y1="214" x2={x + 180} y2="214" stroke="#F1A15C" strokeWidth="1.6" />}
          </g>
        );
      })}
      {!reduced && <motion.circle cy="214" r="4" fill="#F1A15C" animate={{ cx: [40, 706] }} transition={{ duration: 4, repeat: Infinity, ease: 'linear', delay: 1.5 }} />}
    </svg>
  );
}
