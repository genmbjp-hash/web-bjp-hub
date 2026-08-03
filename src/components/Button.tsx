import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

interface BaseButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
}

type ButtonAsButton = BaseButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement> & {
  as?: 'button';
};

type ButtonAsLink = BaseButtonProps & React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  as: 'a';
};

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export const Button: React.FC<ButtonProps> = (props) => {
  const { variant = 'primary', size = 'md', className = '', children, as = 'button', ...rest } = props;

  const baseStyles = 'inline-flex items-center justify-center font-semibold transition-colors shrink-0 whitespace-nowrap rounded-lg';
  
  const variants = {
    primary: 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-2xs',
    secondary: 'bg-stone-800 hover:bg-stone-900 text-white',
    outline: 'border border-stone-200 text-stone-700 hover:bg-stone-100',
    ghost: 'text-stone-600 hover:text-stone-900 hover:bg-stone-100',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-2xs',
  };

  const sizes = {
    sm: 'text-xs px-2 py-1.5 gap-1',
    md: 'text-xs px-3 py-1.5 gap-1.5',
    lg: 'text-sm px-4 py-2 gap-2',
    icon: 'p-1.5',
  };

  const combinedClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  if (as === 'a') {
    return (
      <a className={combinedClassName} {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </a>
    );
  }

  return (
    <button className={combinedClassName} {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
};
