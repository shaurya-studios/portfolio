import { motion } from 'framer-motion';
import ContactFooter from '../components/ContactFooter';
import { useContact } from '../context/ContactContext';
import { Film, Scissors, Sparkles, MonitorPlay, ArrowUpRight } from 'lucide-react';

export default function VideoEditing() {
  const { openContact } = useContact();

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* ===================================================
          01 // HERO SECTION
          =================================================== */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden px-6 pt-36 pb-20">
        <div className="w-full max-w-5xl mx-auto text-center relative z-10 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center justify-center gap-2 mb-8 font-mono text-xs text-[var(--color-text-muted)] tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-text)]" />
              <span>POST-PRODUCTION // SYS.02</span>
            </div>

            <h1 className="font-display text-5xl sm:text-7xl md:text-8xl font-bold leading-[0.92] mb-8 tracking-[-0.04em] uppercase text-[var(--color-text)]">
              Engineered <br />
              For Retention.
            </h1>

            <p className="text-[var(--color-text-muted)] text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-10 font-sans leading-relaxed">
              Precision pacing, algorithmic tension building, and immersive audio engineering built to maximize viewer retention on YouTube and creator platforms.
            </p>
            
            <div className="flex flex-wrap gap-4 items-center justify-center">
              <button onClick={openContact} className="luxury-btn-primary">
                COMMENCE EDIT
              </button>
              <a 
                href="#process" 
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('process')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="luxury-btn-secondary"
              >
                VIEW PROCESS
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===================================================
          02 // PROCESS PIPELINE
          =================================================== */}
      <section id="process" className="py-28 px-6 md:px-16 lg:px-24 max-w-7xl mx-auto w-full">
        <div className="max-w-2xl mb-16">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-highlight)]" />
            <span className="section-label">01 // POST-PRODUCTION PIPELINE</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-[var(--color-text)] uppercase leading-none">
            Algorithmic Pacing.
          </h2>
          <p className="text-[var(--color-text-muted)] text-sm md:text-base mt-4 font-sans leading-relaxed">
            Every frame is calibrated for viewer psychological engagement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { 
              icon: <Film size={18} />, 
              step: "STAGE 01", 
              title: "Acquisition", 
              desc: "Deep analysis of raw footage, narrative thread extraction, and retention curve mapping." 
            },
            { 
              icon: <Scissors size={18} />, 
              step: "STAGE 02", 
              title: "Rough Assembly", 
              desc: "Splicing dead space, engineering pattern interrupts, and locking in macro narrative flow." 
            },
            { 
              icon: <Sparkles size={18} />, 
              step: "STAGE 03", 
              title: "VFX & Micro-Motion", 
              desc: "Contextual motion graphics, graphic callouts, sound design layers, and color grading." 
            },
            { 
              icon: <MonitorPlay size={18} />, 
              step: "STAGE 04", 
              title: "Mastering", 
              desc: "Loudness normalization, high-bitrate render export, and CTR-tested thumbnail advice." 
            }
          ].map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="luxury-glass p-8 rounded-[1.8rem] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-9 h-9 rounded-full border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text)]">
                    {item.icon}
                  </div>
                  <span className="font-mono text-[10px] text-[var(--color-text-muted)] tracking-widest uppercase">
                    {item.step}
                  </span>
                </div>
                <h3 className="font-display text-xl font-bold text-[var(--color-text)] mb-3">{item.title}</h3>
                <p className="text-xs font-sans text-[var(--color-text-muted)] leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===================================================
          03 // FLAT-RATE EDITING COMMISSIONS
          =================================================== */}
      <section className="py-24 px-6 md:px-16 lg:px-24 max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="luxury-glass p-10 md:p-16 rounded-[2.5rem] max-w-4xl mx-auto text-center"
        >
          <div className="flex items-center justify-center gap-2 text-xs font-mono text-[var(--color-text-muted)] tracking-widest uppercase mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
            <span>COMMISSION MODEL // FLAT RATE EDITING</span>
          </div>

          <h3 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--color-text)] mb-4">
            Predictable Terms.
          </h3>

          <p className="text-[var(--color-text-muted)] text-sm md:text-base max-w-2xl mx-auto mb-10 font-sans leading-relaxed">
            High-retention editing for gaming, tech, and creator channels. Includes complete sound design, pattern interrupts, and custom color grading.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl mx-auto mb-10 text-left font-mono">
            <div className="p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)]/40">
              <span className="text-[10px] uppercase text-[var(--color-text-muted)] block mb-1">STANDARD RATE</span>
              <div className="text-3xl font-display font-bold text-[var(--color-text)]">$10 – $80</div>
              <span className="text-[11px] text-[var(--color-text-muted)] mt-1 block">Scaled with footage duration & VFX intensity</span>
            </div>
            <div className="p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)]/40">
              <span className="text-[10px] uppercase text-[var(--color-text-muted)] block mb-1">TYPICAL TURNAROUND</span>
              <div className="text-3xl font-display font-bold text-[var(--color-text)]">24h – 5 Days</div>
              <span className="text-[11px] text-[var(--color-text-muted)] mt-1 block">Expedited rush delivery available upon request</span>
            </div>
          </div>

          <button onClick={openContact} className="luxury-btn-primary mx-auto flex items-center gap-2">
            <span>INITIATE EDITORIAL COMMISSION</span>
            <ArrowUpRight size={14} />
          </button>
        </motion.div>
      </section>

      {/* ===================================================
          04 // SOFTWARE STACK
          =================================================== */}
      <section className="py-20 px-6 max-w-4xl mx-auto w-full text-center">
        <div className="section-label mb-6">PRODUCTION HARDWARE & SOFTWARE</div>
        <div className="flex flex-wrap justify-center gap-3">
          {['Adobe Premiere Pro', 'After Effects', 'DaVinci Resolve Studio', 'CapCut Pro', 'Adobe Audition'].map((tool, i) => (
            <div key={i} className="px-5 py-2.5 text-xs font-mono text-[var(--color-text)] border border-[var(--color-border)] rounded-full luxury-glass">
              {tool}
            </div>
          ))}
        </div>
      </section>

      {/* ===================================================
          05 // CONTACT FOOTER
          =================================================== */}
      <div>
        <ContactFooter />
      </div>

    </div>
  );
}
