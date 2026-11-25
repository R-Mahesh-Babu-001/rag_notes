export type RagPhase =
  | 'Phase 1 · Offline Indexing'
  | 'Phase 2 · Live Query & Answer';

export type RagDiagramId =
  | 'rag-ingestion-flow'
  | 'rag-chunking-flow'
  | 'rag-vector-space'
  | 'rag-hnsw-ivf'
  | 'rag-hybrid-fusion'
  | 'rag-reranker-funnel'
  | 'rag-grounded-prompt'
  | 'rag-e2e-process';

export type InteractiveLabId =
  | 'document-cleaner-lab'
  | 'chunking-comparator'
  | 'embedding-similarity'
  | 'index-lookup-lab'
  | 'hybrid-retrieval'
  | 'reranking-flow'
  | 'grounded-answer-lab'
  | 'e2e-process-simulator';

export interface RagProcessStep {
  num: string;
  slug: string;
  path: string;
  phase: RagPhase;
  title: string;
  shortTitle: string;
  tagline: string;
  description: string;
  readTime: string;
  diagramId: RagDiagramId;
  diagramCaption: string;
  interactiveLabId: InteractiveLabId;
  inputLabel: string;
  actionLabel: string;
  outputLabel: string;
  keyPoints: string[];
  prevSlug?: string;
  nextSlug?: string;
}
