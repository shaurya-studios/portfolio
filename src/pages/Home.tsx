import { motion } from 'framer-motion';
import ContactFooter from '../components/ContactFooter';
import { useContact } from '../context/ContactContext';
import { useScenery } from '../context/SceneryContext';
import { ArrowUpRight, Check, Compass } from 'lucide-react';

export default function Home() {
  const { openContact } = useContact();
  const { setIsCruising } = useScenery();

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* ===================================================
          01 // HERO SECTION (ASYMMETRICAL LUXURY LAYOUT)
          =================================================== */}
      <section className="min-h-screen w-full flex items-center relative z-10 px-6 md:px-16 lg:px-24 pt-32 pb-20 pointer-events-none">
        <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Asymmetrical Column (55% width) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 xl:col-span-6 flex flex-col items-start pointer-events-auto"
          >
            {/* Architectural Index Tag */}
            <div className="flex items-center gap-3 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-text)]" />
              <span className="section-label">
                SYS.SPEC 2026 // ISOLATED MODEL 01
              </span>
            </div>

            {/* Giant Architectural Space Grotesk Display Title */}
            <h1 className="font-display text-[14vw] sm:text-[10vw] lg:text-[6.5vw] font-bold leading-[0.88] tracking-[-0.04em] uppercase text-[var(--color-text)] mb-8 select-none">
              SHAURYA<br />
              STUDIOS
            </h1>

            {/* Editorial Statement */}
            <p className="text-[var(--color-text-muted)] text-base sm:text-lg md:text-xl font-normal leading-relaxed max-w-lg mb-12 font-sans">
              Architecting high-performance web applications, tactile 3D environments, and brand artifacts for founders who treat their digital presence as an enduring asset.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <button 
                onClick={openContact}
                className="luxury-btn-primary"
              >
                INITIATE PROJECT
              </button>
              
              <button
                onClick={() => setIsCruising(true)}
                className="luxury-btn-secondary flex items-center gap-2 group"
                title="Directly pilot the electric hydrofoil skiff across the water"
              >
                <Compass size={14} className="text-cyan-500 transition-transform group-hover:rotate-45" />
                <span>PILOT VESSEL (WASD)</span>
              </button>

              <a 
                href="#work"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="luxury-btn-secondary"
              >
                EXPLORE BIOMES
              </a>
            </div>

            {/* Coordinates / Telemetry Strip */}
            <div className="mt-16 pt-8 border-t border-[var(--color-border)] w-full flex items-center justify-between text-[11px] font-mono text-[var(--color-text-muted)] tracking-widest uppercase">
              <span>BIOME // CENTRAL HARBOR</span>
              <span>CAM // DRONE PATH ACTIVE</span>
            </div>
          </motion.div>

          {/* Right Column (45% width) is left wide open for the 3D Island Centerpiece */}
          <div className="hidden lg:block lg:col-span-5 xl:col-span-6 pointer-events-none" />
        </div>
      </section>

      {/* ===================================================
          02 // THE WORK BIOME (#work)
          =================================================== */}
      <section id="work" className="py-36 px-6 md:px-16 lg:px-24 max-w-7xl mx-auto w-full relative z-10 pointer-events-none">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-20 pointer-events-auto">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-highlight)]" />
            <span className="section-label">01 // WORK BIOME — THE TECH OUTPOST</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[var(--color-text)] uppercase leading-none">
            Deployed Products.
          </h2>
          <p className="text-[var(--color-text-muted)] text-sm md:text-base mt-4 font-sans leading-relaxed">
            Real production architectures engineered for extreme retention, sub-second speed, and conversion.
          </p>
        </div>

        {/* Asymmetrical Project Grid */}
        <div className="space-y-16 pointer-events-auto">
          
          {/* Project 01: Editify Studios */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="luxury-glass p-8 md:p-14 rounded-[2.5rem] grid grid-cols-1 lg:grid-cols-12 gap-10 items-center"
          >
            <div className="lg:col-span-7 flex flex-col">
              <div className="flex items-center gap-3 text-xs font-mono text-[var(--color-text-muted)] tracking-widest uppercase mb-4">
                <span>COMMISSION 01</span>
                <span>//</span>
                <span className="text-[var(--color-text)] font-semibold">PRODUCTION ARCHITECTURE</span>
              </div>
              
              <h3 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--color-text)] mb-6 tracking-tight">
                Editify Studios
              </h3>
              
              <p className="text-[var(--color-text-muted)] text-base font-sans leading-relaxed mb-8 max-w-xl">
                Full-stack creative production agency platform designed to position the studio at the top 1% of the creator economy. Features high-framerate interactive 3D monolith, cinematic motion pacing, and zero-friction client conversion funnel.
              </p>

              {/* Technical Specifications Blueprint */}
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
                  <strong className="text-[var(--color-text)] font-medium">100 / 100 Lighthouse</strong>
                </div>
              </div>

              <div>
                <a 
                  href="https://editify-studios.vercel.app" 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[var(--color-border)] hover:border-[var(--color-text)] text-xs font-mono tracking-widest uppercase text-[var(--color-text)] transition-colors"
                >
                  Inspect Live Deployment <ArrowUpRight size={14} />
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
          </motion.div>

          {/* Project 02: ThumbPilot */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="luxury-glass p-8 md:p-14 rounded-[2.5rem] grid grid-cols-1 lg:grid-cols-12 gap-10 items-center"
          >
            <div className="lg:col-span-7 flex flex-col">
              <div className="flex items-center gap-3 text-xs font-mono text-[var(--color-text-muted)] tracking-widest uppercase mb-4">
                <span>COMMISSION 02</span>
                <span>//</span>
                <span className="text-[var(--color-text)] font-semibold">AI SAAS APPLICATION</span>
              </div>
              
              <h3 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--color-text)] mb-6 tracking-tight">
                ThumbPilot
              </h3>
              
              <p className="text-[var(--color-text-muted)] text-base font-sans leading-relaxed mb-8 max-w-xl">
                Diagnostic thumbnail analysis and retention optimization platform. Engineered with monospace data telemetry, split-test comparison matrices, and rapid visual hierarchy diagnostics.
              </p>

              {/* Technical Specifications Blueprint */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 py-6 border-y border-[var(--color-border)] mb-8 font-mono text-xs">
                <div>
                  <span className="block text-[var(--color-text-muted)] text-[10px] uppercase tracking-wider mb-1">FRONTEND</span>
                  <strong className="text-[var(--color-text)] font-medium">React / TypeScript</strong>
                </div>
                <div>
                  <span className="block text-[var(--color-text-muted)] text-[10px] uppercase tracking-wider mb-1">STATE & APIS</span>
                  <strong className="text-[var(--color-text)] font-medium">REST / Node.js</strong>
                </div>
                <div>
                  <span className="block text-[var(--color-text-muted)] text-[10px] uppercase tracking-wider mb-1">STYLING</span>
                  <strong className="text-[var(--color-text)] font-medium">Tailwind Industrial</strong>
                </div>
              </div>

              <div>
                <a 
                  href="https://thumbpilot-main.vercel.app" 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[var(--color-border)] hover:border-[var(--color-text)] text-xs font-mono tracking-widest uppercase text-[var(--color-text)] transition-colors"
                >
                  Inspect Live Deployment <ArrowUpRight size={14} />
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
          </motion.div>

        </div>
      </section>

      {/* ===================================================
          03 // THE CAPABILITIES BIOME (#services)
          =================================================== */}
      <section id="services" className="py-36 px-6 md:px-16 lg:px-24 max-w-7xl mx-auto w-full relative z-10 pointer-events-none">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-20 pointer-events-auto">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-highlight)]" />
            <span className="section-label">02 // CAPABILITIES BIOME — THE KINETIC BEACON</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[var(--color-text)] uppercase leading-none">
            Architectural Logic.
          </h2>
          <p className="text-[var(--color-text-muted)] text-sm md:text-base mt-4 font-sans leading-relaxed">
            Engineered from first principles without fragile templates or bloated dependencies.
          </p>
        </div>

        {/* Asymmetrical 3-Column Systems */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pointer-events-auto">
          {[
            {
              index: "01",
              title: "System Architecture",
              tag: "CORE FRAMEWORK",
              desc: "Next.js, React, TypeScript. Scalable foundational architectures built with strict type safety and modular components. Zero bloated templates, production-hardened reliability."
            },
            {
              index: "02",
              title: "Tactile 3D Interaction",
              tag: "SPATIAL WEBGL",
              desc: "Three.js, React Three Fiber, GLSL Shaders. Web environments that behave like tactile physical machinery. Smooth 60fps renders with strict resource budgets and low battery impact."
            },
            {
              index: "03",
              title: "Conversion & Speed",
              tag: "OPTIMIZATION",
              desc: "100 Lighthouse performance across the board. Sub-second asset loads, zero layout shift, and intuitive narrative layouts engineered to convert visitors into retained clients."
            }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="luxury-glass p-8 md:p-10 rounded-[2rem] flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-8 font-mono text-xs text-[var(--color-text-muted)]">
                  <span className="text-sm font-semibold text-[var(--color-text)]">{item.index} //</span>
                  <span>{item.tag}</span>
                </div>
                
                <h3 className="font-display text-2xl font-bold text-[var(--color-text)] mb-4">
                  {item.title}
                </h3>
                
                <p className="text-[var(--color-text-muted)] text-sm font-sans leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===================================================
          04 // THE AUTHENTIC TESTIMONIAL & PRICING (#pricing)
          =================================================== */}
      <section id="pricing" className="py-36 px-6 md:px-16 lg:px-24 max-w-7xl mx-auto w-full relative z-10 pointer-events-none">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-20 pointer-events-auto">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-highlight)]" />
            <span className="section-label">03 // VERIFIED AUDIT & INVESTMENT</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[var(--color-text)] uppercase leading-none">
            Predictable Terms.
          </h2>
          <p className="text-[var(--color-text-muted)] text-sm md:text-base mt-4 font-sans leading-relaxed">
            Transparent pricing models for ambitious founders and creators.
          </p>
        </div>

        {/* The Single Real Founder Testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="luxury-glass p-10 md:p-14 rounded-[2.5rem] mb-20 max-w-4xl pointer-events-auto"
        >
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--color-text-muted)] tracking-widest uppercase mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>VERIFIED CLIENT AUDIT // DIRECT TESTIMONIAL</span>
          </div>

          <blockquote className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold leading-snug text-[var(--color-text)] mb-8">
            "Shaurya is a 10/10 website builder, highly recommended. He delivers exceptional quality."
          </blockquote>

          <div className="flex items-center gap-4 pt-6 border-t border-[var(--color-border)]">
            <div className="w-12 h-12 rounded-full bg-[var(--color-border)] overflow-hidden border border-[var(--color-border)] flex items-center justify-center font-mono font-bold text-sm text-[var(--color-text)]">
              ES
            </div>
            <div>
              <div className="font-mono text-sm font-bold text-[var(--color-text)] uppercase tracking-wider">
                Founder, Editify Studios
              </div>
              <div className="font-mono text-xs text-[var(--color-text-muted)]">
                Commission: Complete Agency Platform & Web Architecture
              </div>
            </div>
          </div>
        </motion.div>

        {/* Investment Tier Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pointer-events-auto">
          
          {/* Tier 01: Foundation */}
          <div className="luxury-glass p-8 md:p-10 rounded-[2rem] flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono text-[var(--color-text-muted)] uppercase tracking-widest mb-3">
                TIER.01 // FOUNDATION
              </div>
              <h3 className="font-display text-2xl font-bold text-[var(--color-text)] mb-1">Starter</h3>
              <div className="text-4xl font-display font-bold my-6 text-[var(--color-text)]">$80</div>
              
              <ul className="space-y-3.5 mb-10 font-mono text-xs text-[var(--color-text-muted)]">
                {['1-Page Editorial Architecture', 'Full Mobile & Tablet Responsiveness', 'Foundational Technical SEO', '3 Business Days Delivery', '2 Revision Cycles'].map((ft, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Check size={14} className="text-[var(--color-text)] flex-shrink-0" /> {ft}
                  </li>
                ))}
              </ul>
            </div>

            <button 
              onClick={openContact}
              className="luxury-btn-secondary w-full"
            >
              SELECT FOUNDATION
            </button>
          </div>

          {/* Tier 02: Production Studio (Featured / Champagne Accent) */}
          <div className="luxury-glass p-8 md:p-10 rounded-[2rem] flex flex-col justify-between border-[var(--color-text)]/30 relative">
            <div className="absolute -top-3.5 right-8 px-3.5 py-1 rounded-full bg-[var(--color-text)] text-[var(--color-bg)] font-mono text-[10px] tracking-widest uppercase font-semibold">
              FEATURED STANDARD
            </div>

            <div>
              <div className="text-xs font-mono text-[var(--color-highlight)] uppercase tracking-widest mb-3">
                TIER.02 // STUDIO
              </div>
              <h3 className="font-display text-2xl font-bold text-[var(--color-text)] mb-1">Production</h3>
              <div className="text-4xl font-display font-bold my-6 text-[var(--color-text)]">$140</div>
              
              <ul className="space-y-3.5 mb-10 font-mono text-xs text-[var(--color-text)]">
                {['Up to 5 Custom Pages', 'Interactive 3D WebGL Element', 'Custom Spring & Motion Micro-Interactions', 'Advanced Meta & Social Graphs', '7 Business Days Delivery', '3 Revision Cycles'].map((ft, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Check size={14} className="text-[var(--color-text)] flex-shrink-0" /> {ft}
                  </li>
                ))}
              </ul>
            </div>

            <button 
              onClick={openContact}
              className="luxury-btn-primary w-full"
            >
              SELECT PRODUCTION
            </button>
          </div>

          {/* Tier 03: Custom Architecture */}
          <div className="luxury-glass p-8 md:p-10 rounded-[2rem] flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono text-[var(--color-text-muted)] uppercase tracking-widest mb-3">
                TIER.03 // TAILORED
              </div>
              <h3 className="font-display text-2xl font-bold text-[var(--color-text)] mb-1">Application</h3>
              <div className="text-4xl font-display font-bold my-6 text-[var(--color-text)]">CUSTOM</div>
              
              <ul className="space-y-3.5 mb-10 font-mono text-xs text-[var(--color-text-muted)]">
                {['Full-Stack SaaS Architecture', 'Supabase / PostgreSQL Integration', 'Authentication & Secure Payment Flow', 'Custom Shaders & Complex 3D Canvases', 'Turnaround Timeline Negotiable'].map((ft, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Check size={14} className="text-[var(--color-text)] flex-shrink-0" /> {ft}
                  </li>
                ))}
              </ul>
            </div>

            <button 
              onClick={openContact}
              className="luxury-btn-secondary w-full"
            >
              INQUIRE SPEC
            </button>
          </div>

        </div>
      </section>

      {/* ===================================================
          05 // CONTACT SEQUENCE & FOOTER
          =================================================== */}
      <div className="pointer-events-auto relative z-10">
        <ContactFooter />
      </div>

    </div>
  );
}
