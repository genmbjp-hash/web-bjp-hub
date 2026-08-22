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

const radii: Record<CardRadius, string> = {
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  '3xl': 'rounded-3xl',
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
