import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useRef } from 'react';
import ContactFooter from '../components/ContactFooter';
import { useContact } from '../context/ContactContext';
import { Film, Scissors, Sparkles, MonitorPlay } from 'lucide-react';

// ==========================================
// REUSABLE COMPONENTS (Matches Home.tsx)
// ==========================================

const SectionDivider = ({ number, title }: { number: string, title: string }) => (
  <div className="section-divider max-w-7xl mx-auto px-6">
    <span className="section-label whitespace-nowrap">—— {number} / {title} ——</span>
  </div>
);

const MagneticButton = ({ children, onClick, href, primary = false, className = '' }: { children: React.ReactNode, onClick?: () => void, href?: string, primary?: boolean, className?: string }) => {
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

  const Component = href ? 'a' : 'button';
  const baseClasses = "relative px-8 py-3 uppercase tracking-widest font-semibold transition-all duration-300 block text-xs";
  
  const styleClasses = primary 
    ? "rounded-full gold-fill gold-shine shadow-[0_8px_20px_rgba(232,182,52,0.2)] hover:shadow-[0_12px_24px_rgba(232,182,52,0.4)]"
    : "rounded-[4px] bg-[var(--color-bg-surface)] text-[var(--color-text)] border border-[var(--color-border)] hover:border-[var(--color-border-active)] hover:bg-[var(--color-bg-inset)]";

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className="inline-block"
    >
      <Component 
        href={href} 
        onClick={onClick}
        className={`${baseClasses} ${styleClasses} ${className}`}
      >
        {children}
      </Component>
    </motion.div>
  );
};

// ==========================================
// MAIN PAGE
// ==========================================

const videos = [
  { id: 1, title: 'Gaming Montage / Fast Paced', src: '/videos/sample1.mp4' },
  { id: 2, title: 'YouTube Documentary / Narrative', src: '/videos/sample2.mp4' },
  { id: 3, title: 'Short Form / High Retention', src: '/videos/sample3.mp4' },
];

export default function VideoEditing() {
  const { openContact } = useContact();

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* 01 / HERO */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden px-6 pt-32 pb-16">
        <div className="w-full max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="section-label mb-6 block text-[var(--color-gold)]">POST-PRODUCTION / SYS.02</span>
            <h1 className="font-display text-5xl md:text-7xl font-bold leading-[1.1] mb-8 tracking-[-0.03em]">
              ENGINEERED <br />
              FOR <span className="gold-text">RETENTION</span>_
            </h1>
            <p className="text-[var(--color-text-muted)] text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              I edit gaming videos and general YouTube content. Precision cuts, algorithmic pacing, and sound design built to maximize audience retention. Not just flashy—effective.
            </p>
            
            <div className="flex flex-wrap gap-4 items-center justify-center">
              <MagneticButton primary onClick={openContact}>COMMENCE EDIT</MagneticButton>
              <MagneticButton href="#portfolio">VIEW TIMELINES</MagneticButton>
            </div>
          </motion.div>
        </div>
      </section>

      <SectionDivider number="02" title="PORTFOLIO" />

      {/* 02 / PORTFOLIO */}
      <section id="portfolio" className="py-24 px-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {videos.map((video, idx) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 60, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className={`island p-4 flex flex-col ${idx === 0 ? 'corner-brackets border-[var(--color-border-active)] shadow-[0_10px_30px_var(--color-gold-glow)]' : ''}`}
            >
              <div className="aspect-video bg-[var(--color-bg-inset)] rounded border border-[var(--color-border)] overflow-hidden relative mb-4">
                {/* Fallback pattern since real videos might not exist in public/videos */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,var(--color-text)_1px,transparent_1px)] bg-[length:10px_10px]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-surface)] flex items-center justify-center text-[var(--color-text-muted)]">
                    <MonitorPlay size={20} />
                  </div>
                </div>
                {/* <video src={video.src} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-60" /> */}
                <div className="absolute top-2 left-2 px-2 py-1 bg-black/80 backdrop-blur text-[0.6rem] font-mono tracking-widest text-[var(--color-gold)] border border-[var(--color-border)] rounded">REC</div>
              </div>
              <div className="section-label mb-1">FILE.0{video.id}</div>
              <h3 className="font-display font-bold text-lg">{video.title}</h3>
            </motion.div>
          ))}
        </div>

        {/* Holographic Pricing Card (Main Conversion Element) */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="island corner-brackets p-10 md:p-16 max-w-4xl mx-auto border-[var(--color-border-active)] shadow-[0_10px_40px_var(--color-gold-glow)] relative overflow-hidden text-center"
        >
          <div className="absolute top-0 left-0 w-full h-[2px] gold-fill" />
          <div className="section-label mb-4 gold-text">SERVICE.01 / VIDEO PRODUCTION</div>
          <h3 className="font-display text-3xl md:text-5xl font-bold mb-4">Flat Rate Editing</h3>
          <p className="text-[var(--color-text-muted)] text-sm md:text-base max-w-2xl mx-auto mb-8">
            High-retention edits tailored for Gaming & YouTube. Includes sound design, VFX, pacing, and color grading. Pricing scales with raw footage length and complexity.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-10">
            <div>
              <div className="text-[0.65rem] tracking-widest text-[var(--color-text-muted)] mb-1 uppercase">ESTIMATED COST</div>
              <div className="text-4xl font-display font-bold gold-text">$10 - $80</div>
            </div>
            <div className="hidden md:block w-px h-12 bg-[var(--color-border)]" />
            <div>
              <div className="text-[0.65rem] tracking-widest text-[var(--color-text-muted)] mb-1 uppercase">TURNAROUND</div>
              <div className="text-2xl font-display font-bold text-[var(--color-text)] mt-2">1 Day - 1 Week</div>
            </div>
          </div>
          <MagneticButton primary onClick={openContact} className="mx-auto">INITIATE INQUIRY</MagneticButton>
        </motion.div>
      </section>

      <SectionDivider number="03" title="PROCESS" />

      {/* 03 / PROCESS */}
      <section className="py-24 px-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: <Film size={20} />, title: "1. ACQUISITION", desc: "Analyzing raw clips and planning the narrative flow for maximum retention." },
            { icon: <Scissors size={20} />, title: "2. ASSEMBLY", desc: "Splicing the best moments to build pacing and core structural timeline." },
            { icon: <Sparkles size={20} />, title: "3. EFFECTS", desc: "Adding motion graphics, VFX, and color grading for visual polish." },
            { icon: <MonitorPlay size={20} />, title: "4. MASTERING", desc: "Sound design mixing and high-bitrate export for publishing." }
          ].map((step, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 60, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="island p-8"
            >
              <div className="w-10 h-10 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-inset)] flex items-center justify-center mb-6 text-[var(--color-gold)]">
                {step.icon}
              </div>
              <h3 className="font-display text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-[var(--color-text-muted)] text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <SectionDivider number="04" title="TOOLS" />

      {/* 04 / TOOLS */}
      <section className="py-24 px-6 max-w-3xl mx-auto w-full mb-12">
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="island p-10 flex flex-col items-center text-center bg-[var(--color-bg-inset)]"
        >
          <div className="section-label mb-8">SOFTWARE STACK</div>
          <div className="flex flex-wrap justify-center gap-4">
            {['Premiere Pro', 'CapCut Pro', 'After Effects', 'Photoshop'].map((tool, i) => (
              <div key={i} className="px-5 py-2 text-sm font-bold border border-[var(--color-border)] rounded-full text-[var(--color-text)] bg-[var(--color-bg-surface)]">
                {tool}
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* 05 / CONTACT FOOTER */}
      <ContactFooter />

    </div>
  );
}
