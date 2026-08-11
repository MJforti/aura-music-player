import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'pill';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  children: React.ReactNode;
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  variant = 'secondary',
  size = 'md',
  children,
  className,
  ...props
}) => {
  const variantStyles = {
    primary:
      'bg-white text-black font-semibold hover:bg-opacity-90 active:scale-95 shadow-lg shadow-white/10 border-transparent',
    secondary:
      'bg-white/10 hover:bg-white/15 text-white border border-white/15 backdrop-blur-md active:scale-95 shadow-md',
    ghost:
      'bg-transparent hover:bg-white/10 text-white/80 hover:text-white border-transparent active:scale-95',
    pill:
      'bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-xl rounded-full active:scale-95',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs rounded-xl gap-1.5',
    md: 'px-4 py-2.5 text-sm rounded-2xl gap-2',
    lg: 'px-6 py-3.5 text-base rounded-2xl gap-2.5 font-medium',
    icon: 'p-2.5 rounded-full aspect-square justify-center items-center',
  };

  return (
    <button
      className={twMerge(
        clsx(
          'inline-flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/30 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer',
          variantStyles[variant],
          sizeStyles[size],
          className
        )
      )}
      {...props}
    >
      {children}
    </button>
  );
};
