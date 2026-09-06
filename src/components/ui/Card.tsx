import React from 'react';

type CardPadding = 'none' | 'sm' | 'md' | 'lg';
type CardRadius = 'xl' | '2xl' | '3xl';

interface CardProps extends Omit<React.HTMLAttributes<HTMLElement>, 'as'> {
  as?: React.ElementType;
  padding?: CardPadding;
  radius?: CardRadius;
  interactive?: boolean;
  className?: string;
  children: React.ReactNode;
  [key: string]: any;
}

const paddings: Record<CardPadding, string> = {
  none: '',
  sm: 'p-4',
  md: 'p-5 sm:p-6',
  lg: 'p-6 sm:p-8',
};

// '3xl' is kept as a distinct prop value for callers that still request it,
// but maps to the same 2xl radius as the rest of the site's "soft minimal"
// look so corners stay consistent everywhere without touching every caller.
const radii: Record<CardRadius, string> = {
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  '3xl': 'rounded-2xl',
};

export const Card: React.FC<CardProps> = ({
  as: Tag = 'div',
  padding = 'md',
  radius = '2xl',
  interactive = false,
  className = '',
  children,
  ...rest
}) => {
  return (
    <Tag
      className={`bg-white border border-stone-200 shadow-xs ${radii[radius]} ${paddings[padding]} ${
        interactive
          ? 'transition-all duration-300 hover:shadow-md hover:border-stone-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600/40'
          : ''
      } ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
};
