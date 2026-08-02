import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useContact } from '../context/ContactContext';
import { useRef } from 'react';

// Locally defined MagneticButton for the footer to ensure isolated functionality
const MagneticButton = ({ children, onClick }: { children: React.ReactNode, onClick: () => void }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 30, stiffness: 600, mass: 0.3 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    x.set(middleX * 0.2);
    y.set(middleY * 0.2);
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
      className="inline-block"
    >
      <button 
        onClick={onClick}
        className="relative px-10 py-4 uppercase tracking-widest font-semibold transition-all duration-300 block text-sm rounded-full gold-fill gold-shine shadow-[0_8px_20px_rgba(232,182,52,0.2)] hover:shadow-[0_12px_24px_rgba(232,182,52,0.4)]"
      >
        {children}
      </button>
    </motion.div>
  );
};

export default function ContactFooter() {
  const { openContact } = useContact();

  return (
    <section id="contact" className="py-32 px-6 max-w-4xl mx-auto text-center w-full">
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="island p-12 md:p-20 flex flex-col items-center bg-[var(--color-bg-inset)]"
      >
        <div className="section-label mb-6 gold-text">PROJECT INITIATION</div>
        <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 tracking-tight">
          READY TO BUILD?
        </h2>
        <p className="text-[var(--color-text-muted)] text-sm md:text-base max-w-lg mx-auto leading-relaxed mb-10">
          Currently accepting new clients. Let's discuss your product goals and architect a custom solution for your business.
        </p>
        <MagneticButton onClick={openContact}>
          OPEN COMMUNICATIONS
        </MagneticButton>
      </motion.div>
    </section>
  );
}
