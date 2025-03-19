
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
    light: 'backdrop-blur-md',
    medium: 'backdrop-blur-lg',
    heavy: 'backdrop-blur-xl',
  };
  
  const bgOpacityMap = {
    light: 'bg-white/40 dark:bg-gray-900/30',
    medium: 'bg-white/50 dark:bg-gray-900/40',
    heavy: 'bg-white/60 dark:bg-gray-900/50',
  };
  
  return (
    <div
      className={cn(
        'rounded-xl border border-white/20 dark:border-white/10',
        blurMap[intensity],
        bgOpacityMap[intensity],
        'shadow-xl',
        hoverEffect && 'transition-all duration-300 hover:shadow-2xl hover:-translate-y-1',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassmorphicCard;
