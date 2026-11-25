import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

interface ProgressContextValue {
  completedIds: string[];
  toggleComplete: (id: string) => void;
  isComplete: (id: string) => boolean;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);
const PROGRESS_KEY = 'rag-process-progress';

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [completedIds, setCompletedIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(PROGRESS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(completedIds));
    } catch {
      // ignore
    }
  }, [completedIds]);

  const toggleComplete = (id: string) => {
    setCompletedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const isComplete = (id: string) => completedIds.includes(id);

  return (
    <ProgressContext.Provider value={{ completedIds, toggleComplete, isComplete }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used inside ProgressProvider');
  return ctx;
}
