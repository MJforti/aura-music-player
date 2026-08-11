import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  hoverEffect?: boolean;
  intensity?: 'subtle' | 'medium' | 'heavy';
}

export const GlassPanel: React.FC<GlassPanelProps> = ({
  children,
  className,
  glow = false,
  hoverEffect = false,
  intensity = 'medium',
  ...props
}) => {
  const intensityMap = {
    subtle: 'bg-white/[0.03] backdrop-blur-md border-white/[0.08]',
    medium: 'bg-white/[0.06] backdrop-blur-xl border-white/[0.12]',
    heavy: 'bg-white/[0.10] backdrop-blur-2xl border-white/[0.18]',
  };

  return (
    <div
      className={twMerge(
        clsx(
          'rounded-3xl border transition-all duration-300 relative overflow-hidden',
          intensityMap[intensity],
          glow && 'shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] shadow-purple-500/10',
          hoverEffect &&
            'hover:bg-white/[0.09] hover:border-white/20 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/60',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};
