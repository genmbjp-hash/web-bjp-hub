import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ScrollNavButtonProps {
  direction: 'left' | 'right';
  disabled?: boolean;
  onClick: () => void;
  'aria-label': string;
  className?: string;
}

export const ScrollNavButton: React.FC<ScrollNavButtonProps> = ({
  direction,
  disabled = false,
  onClick,
  className = '',
  ...rest
}) => {
  const Icon = direction === 'left' ? ChevronLeft : ChevronRight;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`p-1.5 rounded-lg border transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/40 ${
        disabled
          ? 'bg-stone-50 border-stone-200 text-stone-300 cursor-not-allowed'
          : 'bg-white hover:bg-stone-100 border-stone-300 text-stone-800 shadow-2xs active:scale-95'
      } ${className}`}
      {...rest}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
};
