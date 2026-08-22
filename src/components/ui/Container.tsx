import React from 'react';

interface ContainerProps {
  as?: React.ElementType;
  className?: string;
  children: React.ReactNode;
}

export const Container: React.FC<ContainerProps> = ({
  as: Tag = 'div',
  className = '',
  children,
}) => {
  return (
    <Tag className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </Tag>
  );
};
