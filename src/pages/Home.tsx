import { motion } from 'framer-motion';
import ContactFooter from '../components/ContactFooter';
import { useContact } from '../context/ContactContext';
import { useScenery } from '../context/SceneryContext';
import { ArrowUpRight, Check, Compass, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import { KineticText } from '../components/ui/KineticText';
import { TactileCard } from '../components/ui/TactileCard';
import { playTactileClick } from '../utils/audioHaptics';

export default function Home() {
  const { openContact } = useContact();
  const { setIsCruising, setFocusedTarget } = useScenery();

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* ===================================================
          01 // HERO SECTION (ASYMMETRICAL ATELIER MANIFESTO)
          =================================================== */}
      <section className="min-h-screen w-full flex items-center relative z-10 px-6 md:px-16 lg:px-24 pt-32 pb-20 pointer-events-none">
        <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Asymmetrical Column */}
          <div className="lg:col-span-7 xl:col-span-6 flex flex-col items-start pointer-events-auto">
            {/* Studio Index Tag */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="flex items-center gap-3 mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
              <span className="section-label">
                ATELIER // SPATIAL COMPUTING & ARTIFACTS
              </span>
            </motion.div>

            {/* Kinetic Masked Display Title */}
            <div className="font-display text-[14vw] sm:text-[10vw] lg:text-[6.5vw] font-bold leading-[0.88] tracking-[-0.04em] uppercase text-[var(--color-text)] mb-8 select-none">
              <KineticText as="h1" delay={0.2} stagger={0.05}>
                SHAURYA STUDIOS
              </KineticText>
            </div>

            {/* Authorial Manifesto */}
            <p className="text-[var(--color-text-muted)] text-base sm:text-lg md:text-xl font-normal leading-relaxed max-w-lg mb-8 font-sans">
              We do not build disposable templates. We forge uncompromising digital artifacts, spatial WebGL environments, and production systems for founders who treat their digital presence as an enduring monument.
            </p>

            {/* Performance & Quality Benchmarks */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-10 font-mono text-xs text-[var(--color-text-muted)]">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[var(--color-text)] font-semibold">100/100</span> LIGHTHOUSE
              </div>
              <div className="h-3 w-[1px] bg-[var(--color-border)]" />
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span className="text-[var(--color-text)] font-semibold">60 FPS</span> WEBGL LIQUID
              </div>
              <div className="h-3 w-[1px] bg-[var(--color-border)]" />
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span className="text-[var(--color-text)] font-semibold">ZERO</span> COMMODITY SLOP
              </div>
            </div>

            {/* Interactive Call to Actions */}
            <div className="flex flex-wrap items-center gap-4">
              <button 
                onClick={() => {
                  playTactileClick();
                  openContact();
                }}
                className="luxury-btn-primary"
              >
                COMMISSION ARTIFACT
              </button>
              
              <button
                onClick={() => {
                  playTactileClick();
                  setIsCruising(true);
                }}
                className="luxury-btn-secondary flex items-center gap-2 group"
                title="Directly pilot the electric hydrofoil skiff across the water"
              >
                <Compass size={14} className="text-cyan-400 transition-transform group-hover:rotate-45" />
                <span>PILOT VESSEL (WASD)</span>
              </button>

              <a 
                href="#work"
                onClick={(e) => {
                  e.preventDefault();
                  playTactileClick();
                  document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="luxury-btn-secondary"
              >
                SPECIMENS
              </a>
            </div>

            {/* Live WebGL Telemetry Strip */}
            <div className="mt-16 pt-8 border-t border-[var(--color-border)] w-full flex items-center justify-between text-[11px] font-mono text-[var(--color-text-muted)] tracking-widest uppercase">
              <span>COORDINATES // 43°N ARCHIPELAGO</span>
              <span>SYNCHRONIZED DOM $\leftrightarrow$ 3D</span>
            </div>
          </div>

          {/* Right Column: Open spatial view of the 3D Island */}
          <div className="hidden lg:block lg:col-span-5 xl:col-span-6 pointer-events-none" />
        </div>
      </section>

      {/* ===================================================
          02 // THE WORK SPECIMENS (#work)
          =================================================== */}
      <section id="work" className="py-36 px-6 md:px-16 lg:px-24 max-w-7xl mx-auto w-full relative z-10 pointer-events-none">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-20 pointer-events-auto">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-highlight)]" />
            <span className="section-label">01 // PRODUCTION SPECIMENS — SPATIAL ANCHORS</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[var(--color-text)] uppercase leading-none">
            Architectural Work.
          </h2>
          <p className="text-[var(--color-text-muted)] text-sm md:text-base mt-4 font-sans leading-relaxed">
            Hover cards to spotlight their corresponding monuments in the 3D ocean behind. Real production deployments engineered for retention and speed.
          </p>
        </div>

        {/* Specimen Cards with Directional Glare & 3D Reactive Linking */}
        <div className="space-y-16 pointer-events-auto">
          
          {/* Specimen 01: Editify Studios (Links to West Basalt Sea-Stack & Lighthouse) */}
          <TactileCard
            onFocusTarget={() => setFocusedTarget('editify')}
            onBlurTarget={() => setFocusedTarget(null)}
            glowColor="rgba(2, 132, 199, 0.18)"
            className="luxury-glass p-8 md:p-14 rounded-[2.5rem]"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7 flex flex-col">
                <div className="flex items-center gap-3 text-xs font-mono text-[var(--color-text-muted)] tracking-widest uppercase mb-4">
                  <span className="text-cyan-400 font-bold">SPECIMEN 01</span>
                  <span>//</span>
                  <span className="text-[var(--color-text)] font-semibold">CREATIVE AGENCY PLATFORM</span>
                </div>
                
                <h3 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--color-text)] mb-6 tracking-tight">
                  Editify Studios
                </h3>
                
                <p className="text-[var(--color-text-muted)] text-base font-sans leading-relaxed mb-8 max-w-xl">
                  Bespoke creative production platform positioning the agency at the pinnacle of the creator economy. Combines a high-framerate interactive 3D monolith, cinematic motion pacing, and an ultra-low-friction client onboarding funnel.
                </p>

                {/* Technical Blueprint */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 py-6 border-y border-[var(--color-border)] mb-8 font-mono text-xs">
                  <div>
                    <span className="block text-[var(--color-text-muted)] text-[10px] uppercase tracking-wider mb-1">FOUNDATION</span>
                    <strong className="text-[var(--color-text)] font-medium">Next.js 15 / React 19</strong>
                  </div>
                  <div>
                    <span className="block text-[var(--color-text-muted)] text-[10px] uppercase tracking-wider mb-1">3D ENGINE</span>
                    <strong className="text-[var(--color-text)] font-medium">Three.js / WebGL</strong>
                  </div>
                  <div>
                    <span className="block text-[var(--color-text-muted)] text-[10px] uppercase tracking-wider mb-1">PERFORMANCE</span>
                    <strong className="text-[var(--color-text)] font-medium">100/100 Lighthouse</strong>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <a 
                    href="https://editify-studios.vercel.app" 
                    target="_blank" 
                    rel="noreferrer"
                    onClick={playTactileClick}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[var(--color-border)] hover:border-[var(--color-text)] text-xs font-mono tracking-widest uppercase text-[var(--color-text)] transition-colors"
                  >
                    <span>Inspect Live Deployment</span>
                    <ArrowUpRight size={14} />
                  </a>
                </div>
              </div>

              <div className="lg:col-span-5 rounded-2xl overflow-hidden border border-[var(--color-border)] aspect-[16/10] bg-white flex items-center justify-center p-6 relative group">
                <img 
                  src="/editify-work.jpg" 
                  alt="Editify Studios Brand & Architecture" 
                  className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>
          </TactileCard>

          {/* Specimen 02: ThumbPilot (Links to East Coral Reef & Creative Outpost) */}
          <TactileCard
            onFocusTarget={() => setFocusedTarget('thumbpilot')}
            onBlurTarget={() => setFocusedTarget(null)}
            glowColor="rgba(217, 119, 6, 0.18)"
            className="luxury-glass p-8 md:p-14 rounded-[2.5rem]"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7 flex flex-col">
                <div className="flex items-center gap-3 text-xs font-mono text-[var(--color-text-muted)] tracking-widest uppercase mb-4">
                  <span className="text-amber-400 font-bold">SPECIMEN 02</span>
                  <span>//</span>
                  <span className="text-[var(--color-text)] font-semibold">AI DIAGNOSTIC SAAS</span>
                </div>
                
                <h3 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--color-text)] mb-6 tracking-tight">
                  ThumbPilot
                </h3>
                
                <p className="text-[var(--color-text-muted)] text-base font-sans leading-relaxed mb-8 max-w-xl">
                  Diagnostic thumbnail analysis and retention optimization platform for digital publishers. Engineered with monospace data telemetry, A/B split-test simulation matrices, and instant visual hierarchy scoring.
                </p>

                {/* Technical Blueprint */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 py-6 border-y border-[var(--color-border)] mb-8 font-mono text-xs">
                  <div>
                    <span className="block text-[var(--color-text-muted)] text-[10px] uppercase tracking-wider mb-1">FRONTEND</span>
                    <strong className="text-[var(--color-text)] font-medium">React / TypeScript</strong>
                  </div>
                  <div>
                    <span className="block text-[var(--color-text-muted)] text-[10px] uppercase tracking-wider mb-1">RUNTIME</span>
                    <strong className="text-[var(--color-text)] font-medium">Node.js REST APIs</strong>
                  </div>
                  <div>
                    <span className="block text-[var(--color-text-muted)] text-[10px] uppercase tracking-wider mb-1">DESIGN LANGUAGE</span>
                    <strong className="text-[var(--color-text)] font-medium">Tactile Monospace</strong>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <a 
                    href="https://thumbpilot-main.vercel.app" 
                    target="_blank" 
                    rel="noreferrer"
                    onClick={playTactileClick}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[var(--color-border)] hover:border-[var(--color-text)] text-xs font-mono tracking-widest uppercase text-[var(--color-text)] transition-colors"
                  >
                    <span>Inspect Live Deployment</span>
                    <ArrowUpRight size={14} />
                  </a>
                </div>
              </div>

              <div className="lg:col-span-5 rounded-2xl overflow-hidden border border-[var(--color-border)] aspect-[16/10] bg-black flex items-center justify-center p-6 relative group">
                <img 
                  src="/thumbpilot-work.png" 
                  alt="ThumbPilot Platform Architecture" 
                  className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>
          </TactileCard>

        </div>
      </section>

      {/* ===================================================
          03 // ATELIER DISCIPLINES (#services)
          =================================================== */}
      <section id="services" className="py-36 px-6 md:px-16 lg:px-24 max-w-7xl mx-auto w-full relative z-10 pointer-events-none">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-20 pointer-events-auto">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-highlight)]" />
            <span className="section-label">02 // ATELIER DISCIPLINES — CORE PILLARS</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[var(--color-text)] uppercase leading-none">
            Architectural Craft.
          </h2>
          <p className="text-[var(--color-text-muted)] text-sm md:text-base mt-4 font-sans leading-relaxed">
            Constructed from first mathematical principles without template baggage or bloated component libraries.
          </p>
        </div>

        {/* 3 Disciplines with Tactile 3D Focus */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pointer-events-auto">
          {[
            {
              index: "01",
              target: "villa",
              title: "Foundational Architecture",
              tag: "SYSTEM FRAMEWORK",
              icon: <ShieldCheck size={20} className="text-amber-400" />,
              desc: "Next.js, React, TypeScript. Robust foundational structures built with strict type safety, modular micro-components, and scalable schemas. Zero fragile dependencies."
            },
            {
              index: "02",
              target: "sanctuary",
              title: "Tactile Spatial WebGL",
              tag: "KINETIC 3D LAB",
              icon: <Sparkles size={20} className="text-cyan-400" />,
              desc: "Three.js, React Three Fiber, Custom GLSL Shaders. Web environments engineered to respond like physical mechanical instruments with silky 60–120 FPS performance."
            },
            {
              index: "03",
              target: "thumbpilot",
              title: "Conversion & Fluid Speed",
              tag: "OPTIMIZATION AUDIT",
              icon: <Zap size={20} className="text-emerald-400" />,
              desc: "100/100 Lighthouse audits across performance, accessibility, and best practices. Sub-second asset loads, zero layout shift, and intuitive architectural pacing."
            }
          ].map((item, idx) => (
            <TactileCard
              key={idx}
              onFocusTarget={() => setFocusedTarget(item.target)}
              onBlurTarget={() => setFocusedTarget(null)}
              glowColor={idx === 1 ? 'rgba(6, 182, 212, 0.16)' : 'rgba(217, 119, 6, 0.16)'}
              className="luxury-glass p-8 md:p-10 rounded-[2rem] flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-8 font-mono text-xs text-[var(--color-text-muted)]">
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <span className="text-sm font-semibold text-[var(--color-text)]">{item.index} //</span>
                  </div>
                  <span className="text-[10px] tracking-wider">{item.tag}</span>
                </div>
                
                <h3 className="font-display text-2xl font-bold text-[var(--color-text)] mb-4">
                  {item.title}
                </h3>
                
                <p className="text-[var(--color-text-muted)] text-sm font-sans leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </TactileCard>
          ))}
        </div>
      </section>

      {/* ===================================================
          04 // ENGINEERING SPRINT SCRIPT (METHODOLOGY)
          =================================================== */}
      <section className="py-28 px-6 md:px-16 lg:px-24 max-w-7xl mx-auto w-full relative z-10 pointer-events-none">
        <div className="max-w-2xl mb-16 pointer-events-auto">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-highlight)]" />
            <span className="section-label">03 // ENGINEERING SPRINT SPECIFICATION</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-[var(--color-text)] uppercase leading-none">
            Disciplined Execution.
          </h2>
          <p className="text-[var(--color-text-muted)] text-sm md:text-base mt-4 font-sans leading-relaxed">
            Every digital artifact is forged through an unambiguous 4-stage engineering sprint. Zero guesswork.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pointer-events-auto">
          {[
            {
              step: "STAGE 01",
              title: "System Mapping",
              desc: "Deconstruct your vision, determine strict performance budgets, and specify conversion pathways into an unambiguous architecture document."
            },
            {
              step: "STAGE 02",
              title: "Spatial Prototyping",
              desc: "Craft custom WebGL shaders, kinetic spring micro-interactions, and high-fidelity typography hierarchy with real-time feedback."
            },
            {
              step: "STAGE 03",
              title: "Full-Stack Assembly",
              desc: "Construct component systems with React 19, TypeScript, and modern CSS primitives. Hardened for instantaneous routing and zero layout shift."
            },
            {
              step: "STAGE 04",
              title: "Lighthouse Hardening",
              desc: "Stress testing across global edge CDNs, asset minification, and multi-threaded rendering checks guaranteeing a spotless 100/100 benchmark."
            }
          ].map((item, idx) => (
            <TactileCard
              key={idx}
              className="luxury-glass p-8 rounded-[1.8rem] flex flex-col justify-between"
            >
              <div>
                <span className="font-mono text-xs text-[var(--color-highlight)] tracking-widest block mb-4">
                  {item.step}
                </span>
                <h4 className="font-display text-xl font-bold text-[var(--color-text)] mb-3">
                  {item.title}
                </h4>
                <p className="text-xs font-sans text-[var(--color-text-muted)] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </TactileCard>
          ))}
        </div>
      </section>

      {/* ===================================================
          05 // VERIFIED AUDIT & ATELIER COMMISSIONS (#pricing)
          =================================================== */}
      <section id="pricing" className="py-36 px-6 md:px-16 lg:px-24 max-w-7xl mx-auto w-full relative z-10 pointer-events-none">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-20 pointer-events-auto">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-highlight)]" />
            <span className="section-label">04 // VERIFIED AUDIT & COMMISSION STRUCTURE</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[var(--color-text)] uppercase leading-none">
            Selective Commissions.
          </h2>
          <p className="text-[var(--color-text-muted)] text-sm md:text-base mt-4 font-sans leading-relaxed">
            We partner with a strictly limited number of founders each quarter to ensure obsessive craft and perfection.
          </p>
        </div>

        {/* Founder Testimonial */}
        <TactileCard
          glowColor="rgba(16, 185, 129, 0.16)"
          className="luxury-glass p-10 md:p-14 rounded-[2.5rem] mb-20 max-w-4xl pointer-events-auto"
        >
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--color-text-muted)] tracking-widest uppercase mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            <span>VERIFIED CLIENT AUDIT // DIRECT TESTIMONIAL</span>
          </div>

          <blockquote className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold leading-snug text-[var(--color-text)] mb-8">
            "Shaurya is a 10/10 website builder, highly recommended. He delivers exceptional quality."
          </blockquote>

          <div className="flex items-center gap-4 pt-6 border-t border-[var(--color-border)]">
            <div className="w-12 h-12 rounded-full bg-stone-800 border border-white/10 flex items-center justify-center font-mono font-bold text-sm text-amber-300">
              ES
            </div>
            <div>
              <div className="font-mono text-sm font-bold text-[var(--color-text)] uppercase tracking-wider">
                Founder, Editify Studios
              </div>
              <div className="font-mono text-xs text-[var(--color-text-muted)]">
                Commission: Complete Agency Platform & 3D Web Architecture
              </div>
            </div>
          </div>
        </TactileCard>

        {/* Selective Commission Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pointer-events-auto">
          
          {/* Tier 01: The Flagship Artifact */}
          <TactileCard
            className="luxury-glass p-8 md:p-10 rounded-[2rem] flex flex-col justify-between"
          >
            <div>
              <div className="text-xs font-mono text-[var(--color-text-muted)] uppercase tracking-widest mb-3">
                COMMISSION.01 // ARTIFACT
              </div>
              <h3 className="font-display text-2xl font-bold text-[var(--color-text)] mb-1">The Flagship Artifact</h3>
              <div className="text-3xl font-display font-bold my-6 text-[var(--color-text)]">Selective</div>
              
              <ul className="space-y-3.5 mb-10 font-mono text-xs text-[var(--color-text-muted)]">
                {['Single bespoke editorial experience', 'Tactile kinetic motion & spring physics', 'Custom high-contrast typography hierarchy', '100/100 Lighthouse benchmark guaranteed', 'Complete deployment & domain DNS setup'].map((ft, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Check size={14} className="text-amber-400 flex-shrink-0" /> {ft}
                  </li>
                ))}
              </ul>
            </div>

            <button 
              onClick={() => {
                playTactileClick();
                openContact();
              }}
              className="luxury-btn-secondary w-full"
            >
              INQUIRE SPEC
            </button>
          </TactileCard>

          {/* Tier 02: The Spatial Atelier (Featured) */}
          <TactileCard
            glowColor="rgba(217, 119, 6, 0.22)"
            className="luxury-glass p-8 md:p-10 rounded-[2rem] flex flex-col justify-between border-amber-500/40 relative shadow-2xl"
          >
            <div className="absolute -top-3.5 right-8 px-3.5 py-1 rounded-full bg-amber-400 text-stone-950 font-mono text-[10px] tracking-widest uppercase font-bold shadow-lg">
              ATELIER STANDARD
            </div>

            <div>
              <div className="text-xs font-mono text-amber-400 uppercase tracking-widest mb-3">
                COMMISSION.02 // SPATIAL
              </div>
              <h3 className="font-display text-2xl font-bold text-[var(--color-text)] mb-1">The Spatial Atelier</h3>
              <div className="text-3xl font-display font-bold my-6 text-amber-300">Flagship</div>
              
              <ul className="space-y-3.5 mb-10 font-mono text-xs text-[var(--color-text)]">
                {['Multi-page digital brand ecosystem', 'Interactive 3D WebGL centerpiece & shaders', 'Scroll-driven camera choreography', 'Acoustic micro-haptics & audio synthesis', 'Sub-second edge CDN asset caching', 'Dedicated 1-on-1 sprint collaboration'].map((ft, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Check size={14} className="text-amber-400 flex-shrink-0" /> {ft}
                  </li>
                ))}
              </ul>
            </div>

            <button 
              onClick={() => {
                playTactileClick();
                openContact();
              }}
              className="luxury-btn-primary w-full"
            >
              RESERVE ENGAGEMENT
            </button>
          </TactileCard>

          {/* Tier 03: Full-Stack SaaS Architecture */}
          <TactileCard
            className="luxury-glass p-8 md:p-10 rounded-[2rem] flex flex-col justify-between"
          >
            <div>
              <div className="text-xs font-mono text-[var(--color-text-muted)] uppercase tracking-widest mb-3">
                COMMISSION.03 // ENTERPRISE
              </div>
              <h3 className="font-display text-2xl font-bold text-[var(--color-text)] mb-1">Full-Stack SaaS</h3>
              <div className="text-3xl font-display font-bold my-6 text-[var(--color-text)]">Bespoke</div>
              
              <ul className="space-y-3.5 mb-10 font-mono text-xs text-[var(--color-text-muted)]">
                {['Production-grade web application', 'PostgreSQL / Supabase backend integration', 'Secure authentication & Stripe billing', 'High-throughput real-time APIs & state', 'Autonomous telemetry & error observability'].map((ft, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Check size={14} className="text-amber-400 flex-shrink-0" /> {ft}
                  </li>
                ))}
              </ul>
            </div>

            <button 
              onClick={() => {
                playTactileClick();
                openContact();
              }}
              className="luxury-btn-secondary w-full"
            >
              COMMENCE ARCHITECTURE
            </button>
          </TactileCard>

        </div>
      </section>

      {/* ===================================================
          06 // CONTACT SEQUENCE & FOOTER
          =================================================== */}
      <div className="pointer-events-auto relative z-10">
        <ContactFooter />
      </div>

    </div>
  );
}
