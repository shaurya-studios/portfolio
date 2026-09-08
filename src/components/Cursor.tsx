import { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

export default function Cursor() {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Use springs for the outer ring — weighted, mechanical feel
  const springConfig = { stiffness: 500, damping: 28, mass: 0.5 };
  const ringX = useSpring(0, springConfig);
  const ringY = useSpring(0, springConfig);

  // Inner dot uses stiffer springs — snappy, precise
  const dotConfig = { stiffness: 1000, damping: 40, mass: 0.2 };
  const dotX = useSpring(0, dotConfig);
  const dotY = useSpring(0, dotConfig);

  useEffect(() => {
    // Don't show custom cursor on touch devices
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const updateMousePosition = (e: MouseEvent) => {
      ringX.set(e.clientX - 16);
      ringY.set(e.clientY - 16);
      dotX.set(e.clientX - 3);
      dotY.set(e.clientY - 3);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = target.tagName.toLowerCase() === 'a' 
        || target.tagName.toLowerCase() === 'button'
        || target.closest('a') 
        || target.closest('button')
        || target.closest('[role="button"]');
      setIsHovered(!!isInteractive);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);
    document.documentElement.addEventListener('mouseenter', handleMouseEnter);
    document.body.classList.add('cursor-none');

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      document.documentElement.removeEventListener('mouseenter', handleMouseEnter);
      document.body.classList.remove('cursor-none');
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0 w-7 h-7 rounded-full pointer-events-none z-[9999]"
        style={{
          x: ringX,
          y: ringY,
          scale: isHovered ? 1.5 : 1,
          backgroundColor: isHovered ? 'rgba(233, 216, 166, 0.15)' : 'transparent',
          border: isHovered 
            ? '1px solid var(--color-text)' 
            : '1px solid var(--color-border-hover)',
          transition: 'background-color 0.2s, border-color 0.2s, scale 0.2s',
        }}
      />
      {/* Inner dot */}
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full pointer-events-none z-[10000]"
        style={{
          x: dotX,
          y: dotY,
          backgroundColor: 'var(--color-text)',
          scale: isHovered ? 0 : 1,
          transition: 'background-color 0.15s, scale 0.15s',
        }}
      />
    </>
  );
}
