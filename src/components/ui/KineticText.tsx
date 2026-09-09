import React from 'react';
import { motion } from 'framer-motion';

interface KineticTextProps {
  children: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
  delay?: number;
  stagger?: number;
  once?: boolean;
}

export const KineticText: React.FC<KineticTextProps> = ({
  children,
  className = '',
  as: Component = 'div',
  delay = 0,
  stagger = 0.035,
  once = true,
}) => {
  const words = children.split(' ');

  const MotionComponent = motion[Component as keyof typeof motion] as typeof motion.div;

  return (
    <MotionComponent
      className={`inline-flex flex-wrap gap-x-[0.3em] gap-y-[0.1em] ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-40px' }}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
    >
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden pb-[0.1em] -mb-[0.1em]">
          <motion.span
            className="inline-block origin-bottom-left"
            variants={{
              hidden: {
                y: '120%',
                opacity: 0,
                rotateZ: 2.5,
              },
              visible: {
                y: '0%',
                opacity: 1,
                rotateZ: 0,
                transition: {
                  type: 'spring',
                  damping: 24,
                  stiffness: 110,
                  mass: 0.8,
                },
              },
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </MotionComponent>
  );
};
