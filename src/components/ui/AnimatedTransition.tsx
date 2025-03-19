
import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

type AnimationType = 
  | 'fade' 
  | 'scale' 
  | 'slide-up' 
  | 'slide-down' 
  | 'slide-left' 
  | 'slide-right';

interface AnimatedTransitionProps {
  children: React.ReactNode;
  className?: string;
  type?: AnimationType;
  duration?: number;
  delay?: number;
  show?: boolean;
  once?: boolean;
}

const AnimatedTransition = ({
  children,
  className,
  type = 'fade',
  duration = 400,
  delay = 0,
  show = true,
  once = false,
}: AnimatedTransitionProps) => {
  const elementRef = useRef<HTMLDivElement>(null);
  
  // Base styles for each animation type
  const animations = {
    'fade': {
      hidden: 'opacity-0',
      visible: 'opacity-100',
    },
    'scale': {
      hidden: 'opacity-0 scale-95',
      visible: 'opacity-100 scale-100',
    },
    'slide-up': {
      hidden: 'opacity-0 translate-y-10',
      visible: 'opacity-100 translate-y-0',
    },
    'slide-down': {
      hidden: 'opacity-0 -translate-y-10',
      visible: 'opacity-100 translate-y-0',
    },
    'slide-left': {
      hidden: 'opacity-0 translate-x-10',
      visible: 'opacity-100 translate-x-0',
    },
    'slide-right': {
      hidden: 'opacity-0 -translate-x-10',
      visible: 'opacity-100 translate-x-0',
    },
  };
  
  // Intersection observer for "once" animations
  useEffect(() => {
    if (!once) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.remove(animations[type].hidden);
              entry.target.classList.add(animations[type].visible);
            }, delay);
            
            // Once the animation is triggered, we don't need to observe anymore
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    
    if (elementRef.current) {
      observer.observe(elementRef.current);
    }
    
    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [once, type, delay]);
  
  return (
    <div
      ref={elementRef}
      className={cn(
        'transition-all',
        `duration-${duration}`,
        show ? animations[type].visible : animations[type].hidden,
        // Only apply delay if show is true or once is true
        (show || once) && delay > 0 ? `delay-${delay}` : '',
        className
      )}
      style={{ 
        transitionDuration: `${duration}ms`,
        transitionDelay: delay > 0 ? `${delay}ms` : undefined
      }}
    >
      {children}
    </div>
  );
};

export default AnimatedTransition;
