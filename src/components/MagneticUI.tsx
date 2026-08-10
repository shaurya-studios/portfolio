import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useRef } from 'react';

interface MagneticWrapperProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}

export const MagneticWrapper = ({ children, className = '', strength = 0.2 }: MagneticWrapperProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    
    // Apply magnet strength
    x.set(middleX * strength);
    y.set(middleY * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={`inline-block pointer-events-auto ${className}`}
    >
      {children}
    </motion.div>
  );
};

// Ready-to-use Magnetic Button
interface MagneticButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  primary?: boolean;
  className?: string;
}

export const MagneticButton = ({ children, onClick, href, primary = false, className = '' }: MagneticButtonProps) => {
  const Component = href ? 'a' : 'button';
  
  const baseClasses = "relative px-8 py-4 uppercase tracking-[0.2em] font-semibold transition-all duration-300 block text-xs font-mono";
  
  const styleClasses = primary 
    ? "rounded-full gold-fill gold-shine shadow-[0_8px_20px_rgba(232,182,52,0.2)] hover:shadow-[0_12px_24px_rgba(232,182,52,0.4)] hover:scale-105"
    : "rounded-[4px] bg-[var(--color-bg-surface)] text-white border border-[var(--color-border)] hover:border-[var(--color-border-active)] hover:bg-[var(--color-bg-inset)] hover:scale-105";

  return (
    <MagneticWrapper strength={0.3}>
      <Component 
        href={href} 
        onClick={onClick}
        className={`${baseClasses} ${styleClasses} ${className}`}
      >
        {children}
      </Component>
    </MagneticWrapper>
  );
};
