
import React from 'react';

// Fix: Use React.PropsWithChildren to resolve potential type mismatch issues with children prop in consumers
export const Badge = ({ children, variant = 'neutral' }: React.PropsWithChildren<{ variant?: string }>) => {
  const colors: Record<string, string> = {
    neutral: 'bg-gray-100 text-gray-600',
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-red-100 text-red-700',
    info: 'bg-sky-100 text-sky-700'
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${colors[variant] || colors.neutral}`}>
      {children}
    </span>
  );
};
