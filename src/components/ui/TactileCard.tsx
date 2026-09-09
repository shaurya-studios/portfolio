import React, { useRef, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { playSoftHover } from '../../utils/audioHaptics';

interface TactileCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  tiltIntensity?: number;
  onClick?: () => void;
  onFocusTarget?: () => void;
  onBlurTarget?: () => void;
}

export const TactileCard: React.FC<TactileCardProps> = ({
  children,
  className = '',
  glowColor = 'rgba(217, 119, 6, 0.14)',
  tiltIntensity = 6,
  onClick,
  onFocusTarget,
  onBlurTarget,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [spotlightPos, setSpotlightPos] = useState({ x: 0, y: 0 });

  // Spring physics for smooth 3D tilt
  const rotateX = useSpring(useMotionValue(0), { stiffness: 260, damping: 24 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 260, damping: 24 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setSpotlightPos({ x, y });

    // Normalize coordinates from -1 to 1 for perspective tilt
    const normX = (x / rect.width - 0.5) * 2;
    const normY = (y / rect.height - 0.5) * 2;

    rotateX.set(-normY * tiltIntensity);
    rotateY.set(normX * tiltIntensity);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    playSoftHover();
    onFocusTarget?.();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
    onBlurTarget?.();
  };

  return (
    <motion.div
      ref={cardRef}
      className={`relative overflow-hidden rounded-2xl border transition-colors duration-300 ${className}`}
      style={{
        perspective: 1000,
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {/* Directional Cursor Spotlight Glare */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-500 z-10"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(380px circle at ${spotlightPos.x}px ${spotlightPos.y}px, ${glowColor}, transparent 70%)`,
        }}
      />

      {/* Border Sheen Ring */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl border transition-opacity duration-300 z-20"
        style={{
          opacity: isHovered ? 0.6 : 0,
          borderColor: 'rgba(255, 255, 255, 0.15)',
        }}
      />

      {/* Card Content with subtle 3D lift */}
      <div className="relative z-0 h-full">{children}</div>
    </motion.div>
  );
};
