import { useState } from 'react';
import { motion } from 'framer-motion';
import ContactFooter from '../components/ContactFooter';
import { useContact } from '../context/ContactContext';
import { Film, Scissors, Sparkles, MonitorPlay, ArrowUpRight, Play, Pause, Activity } from 'lucide-react';
import { KineticText } from '../components/ui/KineticText';
import { TactileCard } from '../components/ui/TactileCard';
import { playTactileClick } from '../utils/audioHaptics';

export default function VideoEditing() {
  const { openContact } = useContact();
  const [isPlayingTimeline, setIsPlayingTimeline] = useState(true);

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* ===================================================
          01 // HERO SECTION (KINETIC EDITORIAL MANIFESTO)
          =================================================== */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden px-6 pt-36 pb-20">
        <div className="w-full max-w-5xl mx-auto text-center relative z-10 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center justify-center gap-2 mb-8 font-mono text-xs text-[var(--color-text-muted)] tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
              <span>HIGH-RETENTION VIDEO EDITING</span>
            </div>

            <div className="font-display text-5xl sm:text-7xl md:text-8xl font-bold leading-[0.92] mb-8 tracking-[-0.04em] uppercase text-[var(--color-text)]">
              <KineticText as="h1" delay={0.1} stagger={0.04}>
                EDITED TO KEEP VIEWERS WATCHING
              </KineticText>
            </div>

            <p className="text-[var(--color-text-muted)] text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-10 font-sans leading-relaxed">
              Tight pacing, rich sound design, and sharp motion graphics tailored for creators, founders, and brands who want higher watch time and real audience growth.
            </p>
            
            <div className="flex flex-wrap gap-4 items-center justify-center">
              <button
                onClick={() => {
                  playTactileClick();
                  openContact();
                }}
                className="luxury-btn-primary"
              >
                START A PROJECT
              </button>
              <a 
                href="#timeline" 
                onClick={(e) => {
                  e.preventDefault();
                  playTactileClick();
                  document.getElementById('timeline')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="luxury-btn-secondary"
              >
                HOW I EDIT
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===================================================
          02 // THE TIMELINE LAB
          =================================================== */}
      <section id="timeline" className="py-24 px-6 md:px-16 lg:px-24 max-w-7xl mx-auto w-full">
        <div className="max-w-2xl mb-12">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span className="section-label">EDITING BREAKDOWN</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-[var(--color-text)] uppercase leading-none">
            What Goes Into Every Edit.
          </h2>
          <p className="text-[var(--color-text-muted)] text-sm md:text-base mt-4 font-sans leading-relaxed">
            Every cut, sound effect, and graphic cue is timed to keep viewers hooked from the first five seconds through to the end.
          </p>
        </div>

        {/* Interactive NLE Timeline Mockup */}
        <TactileCard
          glowColor="rgba(6, 182, 212, 0.18)"
          className="luxury-glass p-6 md:p-10 rounded-[2.5rem] border-white/10"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-6 border-b border-white/10 text-xs font-mono text-stone-400">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  playTactileClick();
                  setIsPlayingTimeline(!isPlayingTimeline);
                }}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors"
                title={isPlayingTimeline ? 'Pause Playhead' : 'Run Playhead'}
              >
                {isPlayingTimeline ? <Pause size={14} /> : <Play size={14} />}
              </button>
              <span className="text-white font-semibold">PROJECT_TIMELINE_PREVIEW</span>
              <span className="text-stone-400">4K 60FPS • PRORES</span>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <div className="flex items-center gap-1 text-emerald-400">
                <Activity size={12} />
                <span>HIGH AUDIENCE RETENTION</span>
              </div>
            </div>
          </div>

          {/* Timeline Tracks */}
          <div className="space-y-3 py-6 font-mono text-[11px]">
            {/* V3: Motion Graphics / VFX */}
            <div className="flex items-center gap-4">
              <span className="w-16 text-stone-400 text-right">V3 GRAPHICS</span>
              <div className="flex-1 h-8 rounded-lg bg-white/5 border border-white/5 relative overflow-hidden flex items-center px-3 gap-2">
                <div className="h-5 px-3 rounded bg-amber-500/30 border border-amber-500/40 text-amber-300 flex items-center text-[10px]">
                  Custom Motion Graphics
                </div>
                <div className="h-5 px-3 rounded bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 flex items-center text-[10px]">
                  Opening Hook Title
                </div>
                <div className="h-5 px-3 rounded bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 flex items-center text-[10px]">
                  Animated Infographics
                </div>
              </div>
            </div>

            {/* V1: Primary A-Roll Footage */}
            <div className="flex items-center gap-4">
              <span className="w-16 text-stone-400 text-right">V1 CUTS</span>
              <div className="flex-1 h-10 rounded-lg bg-white/5 border border-white/5 relative overflow-hidden flex items-center">
                {['00:00 HOOK', '00:04 TENSION', '00:09 PAYOFF', '00:15 ESCALATE', '00:22 NO DRIFT'].map((cut, i) => (
                  <div
                    key={i}
                    className="h-full border-r border-stone-800 bg-stone-800/40 flex items-center justify-center text-stone-300 px-4 text-[10px] whitespace-nowrap"
                    style={{ flex: i === 0 ? 1.5 : i === 1 ? 2.5 : 2 }}
                  >
                    {cut}
                  </div>
                ))}
                {/* Playhead */}
                {isPlayingTimeline && (
                  <motion.div
                    className="absolute top-0 bottom-0 w-[2px] bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] pointer-events-none"
                    animate={{ left: ['0%', '100%'] }}
                    transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
                  />
                )}
              </div>
            </div>

            {/* A1: Dialogue / Pacing */}
            <div className="flex items-center gap-4">
              <span className="w-16 text-stone-400 text-right">A1 VOX</span>
              <div className="flex-1 h-7 rounded-lg bg-white/5 border border-white/5 flex items-center px-4">
                <div className="w-full flex items-center justify-between opacity-50">
                  {Array.from({ length: 48 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-[2px] bg-cyan-400/80 rounded-full"
                      style={{ height: `${Math.sin(i * 0.4) * 8 + 10}px` }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* A2: Layered Sound Design & Sub-bass Drops */}
            <div className="flex items-center gap-4">
              <span className="w-16 text-stone-400 text-right">A2 SFX</span>
              <div className="flex-1 h-7 rounded-lg bg-white/5 border border-white/5 flex items-center px-4">
                <div className="w-full flex items-center justify-between opacity-40">
                  {Array.from({ length: 48 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-[2px] bg-amber-400/80 rounded-full"
                      style={{ height: `${(i % 7 === 0 ? 14 : 4)}px` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Retention Impact Footer */}
          <div className="pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs font-mono">
            <div>
              <span className="text-stone-400 block mb-1 uppercase text-[10px]">OPENING HOOK</span>
              <strong className="text-white font-semibold">Immediate Visual Interest</strong>
            </div>
            <div>
              <span className="text-stone-400 block mb-1 uppercase text-[10px]">PACING & RHYTHM</span>
              <strong className="text-white font-semibold">Visual Changes Every 3–5s</strong>
            </div>
            <div>
              <span className="text-stone-400 block mb-1 uppercase text-[10px]">SOUND DESIGN</span>
              <strong className="text-white font-semibold">Layered SFX & Clean Audio</strong>
            </div>
          </div>
        </TactileCard>
      </section>

      {/* ===================================================
          03 // WORKFLOW
          =================================================== */}
      <section id="process" className="py-28 px-6 md:px-16 lg:px-24 max-w-7xl mx-auto w-full">
        <div className="max-w-2xl mb-16">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span className="section-label">WORKFLOW</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-[var(--color-text)] uppercase leading-none">
            How the Editing Process Works.
          </h2>
          <p className="text-[var(--color-text-muted)] text-sm md:text-base mt-4 font-sans leading-relaxed">
            A clean 4-step workflow that delivers polished, publication-ready videos on schedule.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { 
              icon: <Film size={18} className="text-amber-400" />, 
              step: "STEP 01", 
              title: "Story & Structure", 
              desc: "Reviewing raw footage, cutting out dead air and rambling, and building a compelling story arc from the first second." 
            },
            { 
              icon: <Scissors size={18} className="text-cyan-400" />, 
              step: "STEP 02", 
              title: "Pacing & Cuts", 
              desc: "Tightening edits, adding visual variety, and making sure the video never feels slow, dragged out, or repetitive." 
            },
            { 
              icon: <Sparkles size={18} className="text-emerald-400" />, 
              step: "STEP 03", 
              title: "Motion & Sound", 
              desc: "Adding animated titles, subtitles, sound effects, background music, and clean color grading that pops." 
            },
            { 
              icon: <MonitorPlay size={18} className="text-amber-400" />, 
              step: "STEP 04", 
              title: "Review & Export", 
              desc: "Reviewing the cut together, making quick adjustments, and delivering full-quality 4K master files ready to upload." 
            }
          ].map((item, idx) => (
            <TactileCard
              key={idx}
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
            </TactileCard>
          ))}
        </div>
      </section>

      {/* ===================================================
          04 // ENGAGEMENT TERMS
          =================================================== */}
      <section className="py-24 px-6 md:px-16 lg:px-24 max-w-7xl mx-auto w-full">
        <TactileCard
          glowColor="rgba(217, 119, 6, 0.16)"
          className="luxury-glass p-10 md:p-16 rounded-[2.5rem] max-w-4xl mx-auto text-center"
        >
          <div className="flex items-center justify-center gap-2 text-xs font-mono text-[var(--color-text-muted)] tracking-widest uppercase mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            <span>SIMPLE TERMS & FAST TURNAROUND</span>
          </div>

          <h3 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--color-text)] mb-4">
            Clear Pricing & Quick Delivery.
          </h3>

          <p className="text-[var(--color-text-muted)] text-sm md:text-base max-w-2xl mx-auto mb-10 font-sans leading-relaxed">
            High-retention editing for YouTube channels, podcasts, and short-form content. Includes full sound design, motion graphics, and color grading.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl mx-auto mb-10 text-left font-mono">
            <div className="p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)]/40">
              <span className="text-[10px] uppercase text-[var(--color-text-muted)] block mb-1">PROJECT TYPES</span>
              <div className="text-2xl font-display font-bold text-[var(--color-text)]">Shorts & Long-Form</div>
              <span className="text-[11px] text-[var(--color-text-muted)] mt-1 block">Custom quotes based on video length & complexity</span>
            </div>
            <div className="p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)]/40">
              <span className="text-[10px] uppercase text-[var(--color-text-muted)] block mb-1">DELIVERY TIME</span>
              <div className="text-2xl font-display font-bold text-[var(--color-text)]">24h – 3 Days</div>
              <span className="text-[11px] text-[var(--color-text-muted)] mt-1 block">Reliable delivery with revisions included</span>
            </div>
          </div>

          <button 
            onClick={() => {
              playTactileClick();
              openContact();
            }}
            className="luxury-btn-primary mx-auto flex items-center gap-2"
          >
            <span>START A VIDEO PROJECT</span>
            <ArrowUpRight size={14} />
          </button>
        </TactileCard>
      </section>

      {/* ===================================================
          05 // TOOLS & SOFTWARE
          =================================================== */}
      <section className="py-20 px-6 max-w-4xl mx-auto w-full text-center">
        <div className="section-label mb-6">TOOLS & SOFTWARE</div>

        <div className="flex flex-wrap justify-center gap-3">
          {['Adobe Premiere Pro', 'DaVinci Resolve Studio', 'After Effects', 'Adobe Audition', 'Photoshop', 'Blender'].map((tool, i) => (
            <div key={i} className="px-5 py-2.5 text-xs font-mono text-[var(--color-text)] border border-[var(--color-border)] rounded-full luxury-glass">
              {tool}
            </div>
          ))}
        </div>
      </section>

      {/* ===================================================
          06 // CONTACT FOOTER
          =================================================== */}
      <div>
        <ContactFooter />
      </div>

    </div>
  );
}
