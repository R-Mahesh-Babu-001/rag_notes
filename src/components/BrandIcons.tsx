export function RagBrandLogo({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      className={`${className} shrink-0`}
      aria-hidden="true"
    >
      <rect width="36" height="36" rx="9" fill="#101827" stroke="#73C5F1" strokeWidth="1.5" />
      <circle cx="11" cy="18" r="3" fill="#73C5F1" />
      <circle cx="24" cy="11" r="3" fill="#F1A15C" />
      <circle cx="24" cy="25" r="3" fill="#8BD4FF" />
      <path d="M13.5 16.5L21.5 12.2M13.5 19.5L21.5 23.8" stroke="#73C5F1" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function AuthorAvatar({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full bg-[#101827] dark:bg-[#8BD4FF] text-[#8BD4FF] dark:text-[#101827] text-[10px] font-bold tracking-tight border border-[#73C5F1]/40 shrink-0 ${className}`}
      aria-hidden="true"
    >
      RM
    </span>
  );
}
