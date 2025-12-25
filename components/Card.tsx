
import React from 'react';

interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  variant?: 'white' | 'glass';
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, subtitle, children, variant = 'white', className = '' }) => {
  const bgClass = variant === 'white' ? 'bg-white' : 'bg-emerald-50';
  
  return (
    <div className={`${bgClass} rounded-2xl p-5 shadow-sm border border-gray-100 mb-4 card-hover transition-all duration-300 ${className}`}>
      {title && (
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-800 leading-tight">{title}</h3>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
