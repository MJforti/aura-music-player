import React from 'react';
import { ChevronRight } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actionText?: string;
  onAction?: () => void;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  actionText,
  onAction,
}) => {
  return (
    <div className="flex items-end justify-between mb-4">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white/95">{title}</h2>
        {subtitle && <p className="text-xs sm:text-sm text-white/50 mt-0.5">{subtitle}</p>}
      </div>

      {actionText && onAction && (
        <button
          onClick={onAction}
          className="text-xs sm:text-sm font-medium text-white/60 hover:text-white transition-colors flex items-center gap-0.5 group cursor-pointer"
        >
          {actionText}
          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      )}
    </div>
  );
};
