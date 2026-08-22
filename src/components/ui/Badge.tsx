import React from 'react';

type BadgeVariant = 'neutral' | 'accent' | 'warning' | 'danger';

interface BadgeProps {
  variant?: BadgeVariant;
  className?: string;
  children: React.ReactNode;
}

// Kept to a small closed set of colors on purpose: emerald is the site's one
// accent, amber/red are reserved for genuine "important"/"urgent" semantics
// rather than decoration.
const variants: Record<BadgeVariant, string> = {
  neutral: 'bg-stone-100 text-stone-700 border-stone-200',
  accent: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  warning: 'bg-amber-50 text-amber-800 border-amber-200',
  danger: 'bg-red-50 text-red-700 border-red-200',
};

export const Badge: React.FC<BadgeProps> = ({ variant = 'neutral', className = '', children }) => {
  return (
    <span
      className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
