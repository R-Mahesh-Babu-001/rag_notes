import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs font-medium text-[var(--text-body)] hover:border-[#73C5F1] transition-colors cursor-pointer shrink-0"
    >
      {isDark ? (
        <Sun className="w-3.5 h-3.5 text-[#F1A15C]" aria-hidden="true" />
      ) : (
        <Moon className="w-3.5 h-3.5 text-[#1978ad]" aria-hidden="true" />
      )}
      {!compact && <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>}
    </button>
  );
}
