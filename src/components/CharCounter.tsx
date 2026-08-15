import React from 'react';

interface CharCounterProps {
  value?: string;
  max: number;
}

export const CharCounter: React.FC<CharCounterProps> = ({ value = '', max }) => {
  const isNearLimit = value.length >= max * 0.9;
  return (
    <span className={`text-[10px] font-mono ${isNearLimit ? 'text-amber-600' : 'text-stone-400'}`}>
      {value.length}/{max}
    </span>
  );
};
