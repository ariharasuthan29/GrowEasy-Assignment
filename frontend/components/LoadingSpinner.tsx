import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Loading...',
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6 border-2',
    md: 'h-10 w-10 border-2',
    lg: 'h-16 w-16 border-3'
  };

  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 text-center animate-fade-in">
      <div className="relative flex items-center justify-center">
        {/* Neon blur accent */}
        <div className="absolute h-10 w-10 bg-indigo-500/20 blur-xl rounded-full" />
        <Loader2 className={`${sizeClasses[size]} text-indigo-400 animate-spin`} />
      </div>
      {message && (
        <p className="mt-3 text-xs sm:text-sm text-slate-400 font-medium">
          {message}
        </p>
      )}
    </div>
  );
};
export default LoadingSpinner;
