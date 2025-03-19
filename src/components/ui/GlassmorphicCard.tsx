
import React from 'react';
import { cn } from '@/lib/utils';

interface GlassmorphicCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  intensity?: 'light' | 'medium' | 'heavy';
}

const GlassmorphicCard = ({
  children,
  className,
  hoverEffect = true,
  intensity = 'medium',
  ...props
}: GlassmorphicCardProps) => {
  // Define blur and opacity based on intensity
  const blurMap = {
    light: 'backdrop-blur-sm',
    medium: 'backdrop-blur-md',
    heavy: 'backdrop-blur-lg',
  };
  
  const bgOpacityMap = {
    light: 'bg-white/30 dark:bg-black/20',
    medium: 'bg-white/50 dark:bg-black/40',
    heavy: 'bg-white/70 dark:bg-black/60',
  };
  
  return (
    <div
      className={cn(
        'rounded-2xl border border-white/20 dark:border-white/10',
        blurMap[intensity],
        bgOpacityMap[intensity],
        'shadow-glass',
        hoverEffect && 'transition-all duration-300 hover:shadow-glass-hover',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassmorphicCard;
