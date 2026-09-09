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
  const { setIsCruising } = useScenery();

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
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              <span className="section-label">
                DIGITAL ARCHITECT & CREATIVE ENGINEER
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
              I build bespoke WebGL experiences, high-converting web applications, and digital platforms for founders who want their brand to stand out. Crafted from first principles with clean code — zero templates, zero bloated frameworks.
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
                <span className="text-[var(--color-text)] font-semibold">60 FPS</span> FLUID WEBGL
              </div>
              <div className="h-3 w-[1px] bg-[var(--color-border)]" />
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span className="text-[var(--color-text)] font-semibold">ZERO</span> BLATED TEMPLATES
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
                START A PROJECT
              </button>
              
              <button
                onClick={() => {
                  playTactileClick();
                  setIsCruising(true);
                }}
                className="luxury-btn-secondary flex items-center gap-2 group"
                title="Pilot the electric hydrofoil vessel across the 3D archipelago"
              >
                <Compass size={14} className="text-cyan-400 transition-transform group-hover:rotate-45" />
                <span>EXPLORE IN 3D (WASD)</span>
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
                VIEW WORK
              </a>
            </div>

            {/* Live WebGL Telemetry Strip */}
            <div className="mt-16 pt-8 border-t border-[var(--color-border)] w-full flex items-center justify-between text-[11px] font-mono text-[var(--color-text-muted)] tracking-widest uppercase">
              <span>BENGALURU, INDIA · GLOBAL CLIENTS</span>
              <span>60 FPS INTERACTIVE ARCHIPELAGO</span>
            </div>

          </div>

          {/* Right Column: Open spatial view of the 3D Island */}
          <div className="hidden lg:block lg:col-span-5 xl:col-span-6 pointer-events-none" />
        </div>
      </section>

      {/* ===================================================
          02 // SELECTED WORK (#work)
          =================================================== */}
      <section id="work" className="py-36 px-6 md:px-16 lg:px-24 max-w-7xl mx-auto w-full relative z-10 pointer-events-none">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-20 pointer-events-auto">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-highlight)]" />
            <span className="section-label">SELECTED WORK // PRODUCTION DEPLOYMENTS</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[var(--color-text)] uppercase leading-none">
            Selected Work.
          </h2>
          <p className="text-[var(--color-text-muted)] text-sm md:text-base mt-4 font-sans leading-relaxed">
            Real production platforms engineered for speed, conversions, and distinctive visual identity. Every build is benchmarked for sub-second performance.
          </p>
        </div>

        {/* Project Showcase Cards */}
        <div className="space-y-16 pointer-events-auto">
          
          {/* Project 01: Editify Studios */}
          <TactileCard
            glowColor="rgba(2, 132, 199, 0.18)"
            className="luxury-glass p-8 md:p-14 rounded-[2.5rem]"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7 flex flex-col">
                <div className="flex items-center gap-3 text-xs font-mono text-[var(--color-text-muted)] tracking-widest uppercase mb-4">
                  <span className="text-cyan-400 font-bold">CLIENT PROJECT</span>
                  <span>//</span>
                  <span className="text-[var(--color-text)] font-semibold">CREATIVE PRODUCTION STUDIO</span>
                </div>
                
                <h3 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--color-text)] mb-6 tracking-tight">
                  Editify Studios
                </h3>
                
                <p className="text-[var(--color-text-muted)] text-base font-sans leading-relaxed mb-8 max-w-xl">
                  A bespoke web platform and interactive brand experience engineered for a premium creative agency. Features custom 3D web geometry, cinematic motion pacing, and a high-converting client intake funnel that doubled qualified inbound inquiries.
                </p>

                {/* Technical Blueprint */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 py-6 border-y border-[var(--color-border)] mb-8 font-mono text-xs">
                  <div>
                    <span className="block text-[var(--color-text-muted)] text-[10px] uppercase tracking-wider mb-1">TECH STACK</span>
                    <strong className="text-[var(--color-text)] font-medium">Next.js 15 / React 19</strong>
                  </div>
                  <div>
                    <span className="block text-[var(--color-text-muted)] text-[10px] uppercase tracking-wider mb-1">INTERACTIVE 3D</span>
                    <strong className="text-[var(--color-text)] font-medium">Three.js / WebGL</strong>
                  </div>
                  <div>
                    <span className="block text-[var(--color-text-muted)] text-[10px] uppercase tracking-wider mb-1">BENCHMARK</span>
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
                    <span>View Live Website</span>
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

          {/* Project 02: ThumbPilot */}
          <TactileCard
            glowColor="rgba(217, 119, 6, 0.18)"
            className="luxury-glass p-8 md:p-14 rounded-[2.5rem]"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7 flex flex-col">
                <div className="flex items-center gap-3 text-xs font-mono text-[var(--color-text-muted)] tracking-widest uppercase mb-4">
                  <span className="text-amber-400 font-bold">SAAS PRODUCT</span>
                  <span>//</span>
                  <span className="text-[var(--color-text)] font-semibold">CREATOR ANALYTICS PLATFORM</span>
                </div>
                
                <h3 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--color-text)] mb-6 tracking-tight">
                  ThumbPilot
                </h3>
                
                <p className="text-[var(--color-text-muted)] text-base font-sans leading-relaxed mb-8 max-w-xl">
                  A dedicated thumbnail analytics platform helping YouTube creators and digital publishers maximize click-through rates. Built with real-time visual hierarchy scoring, side-by-side A/B simulation, and monospace data readouts.
                </p>

                {/* Technical Blueprint */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 py-6 border-y border-[var(--color-border)] mb-8 font-mono text-xs">
                  <div>
                    <span className="block text-[var(--color-text-muted)] text-[10px] uppercase tracking-wider mb-1">FRONTEND</span>
                    <strong className="text-[var(--color-text)] font-medium">React / TypeScript</strong>
                  </div>
                  <div>
                    <span className="block text-[var(--color-text-muted)] text-[10px] uppercase tracking-wider mb-1">BACKEND API</span>
                    <strong className="text-[var(--color-text)] font-medium">Node.js REST APIs</strong>
                  </div>
                  <div>
                    <span className="block text-[var(--color-text-muted)] text-[10px] uppercase tracking-wider mb-1">DESIGN SYSTEM</span>
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
          03 // CORE DISCIPLINES (#services)
          =================================================== */}
      <section id="services" className="py-36 px-6 md:px-16 lg:px-24 max-w-7xl mx-auto w-full relative z-10 pointer-events-none">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-20 pointer-events-auto">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-highlight)]" />
            <span className="section-label">SERVICES // CORE ENGINEERING PILLARS</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[var(--color-text)] uppercase leading-none">
            How I Build.
          </h2>
          <p className="text-[var(--color-text-muted)] text-sm md:text-base mt-4 font-sans leading-relaxed">
            Built from first principles with modern tools and zero template baggage. Every project is engineered for speed, conversion, and durability.
          </p>
        </div>

        {/* 3 Core Disciplines */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pointer-events-auto">
          {[
            {
              index: "01",
              title: "Full-Stack Web Development",
              tag: "NEXT.JS & REACT",
              icon: <ShieldCheck size={20} className="text-amber-400" />,
              desc: "Next.js 15, React 19, TypeScript, Tailwind CSS. Resilient, type-safe architecture with clean state management, modular components, and frictionless deployment. Zero fragile plugins."
            },
            {
              index: "02",
              title: "Interactive 3D & Creative WebGL",
              tag: "THREE.JS / SHADERS",
              icon: <Sparkles size={20} className="text-cyan-400" />,
              desc: "Three.js, React Three Fiber, Custom GLSL Shaders. Engaging spatial 3D elements, product configurators, and interactive environments running at a locked 60 FPS on both mobile and desktop."
            },
            {
              index: "03",
              title: "Speed & Conversion Optimization",
              tag: "CORE WEB VITALS",
              icon: <Zap size={20} className="text-emerald-400" />,
              desc: "100/100 Google Lighthouse benchmarks, sub-second First Contentful Paint, zero layout shift, and intuitive UX pathways structured to convert visitors into clients."
            }
          ].map((item, idx) => (
            <TactileCard
              key={idx}
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
          04 // ENGINEERING SPRINT PROCESS
          =================================================== */}
      <section className="py-28 px-6 md:px-16 lg:px-24 max-w-7xl mx-auto w-full relative z-10 pointer-events-none">
        <div className="max-w-2xl mb-16 pointer-events-auto">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-highlight)]" />
            <span className="section-label">PROCESS // 4-STAGE SPRINT METHODOLOGY</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-[var(--color-text)] uppercase leading-none">
            How We Work Together.
          </h2>
          <p className="text-[var(--color-text-muted)] text-sm md:text-base mt-4 font-sans leading-relaxed">
            A transparent, structured four-step sprint from discovery to production launch with weekly demos and clear deliverables.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pointer-events-auto">
          {[
            {
              step: "STAGE 01",
              title: "Discovery & Scope",
              desc: "Clarifying your business goals, target audience, technical requirements, and visual direction. We lock down a fixed scope and delivery schedule."
            },
            {
              step: "STAGE 02",
              title: "Design & Prototyping",
              desc: "Interactive Figma mockups, custom 3D asset generation, motion physics, and typography hierarchy reviewed and refined with your feedback."
            },
            {
              step: "STAGE 03",
              title: "Production Engineering",
              desc: "Constructing clean, type-safe components with React 19, TypeScript, and Tailwind CSS. Hardened for responsive devices and instant page loads."
            },
            {
              step: "STAGE 04",
              title: "QA, Speed & Launch",
              desc: "Cross-browser stress testing, Lighthouse 100/100 performance tuning, SEO configuration, and seamless zero-downtime domain launch."
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
          05 // VERIFIED CLIENT TESTIMONIAL & PRICING (#pricing)
          =================================================== */}
      <section id="pricing" className="py-36 px-6 md:px-16 lg:px-24 max-w-7xl mx-auto w-full relative z-10 pointer-events-none">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-20 pointer-events-auto">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-highlight)]" />
            <span className="section-label">PRICING // CLEAR ENGAGEMENT TIERS</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[var(--color-text)] uppercase leading-none">
            Simple, Transparent Pricing.
          </h2>
          <p className="text-[var(--color-text-muted)] text-sm md:text-base mt-4 font-sans leading-relaxed">
            Fixed quotes with clear timelines and zero surprise hourly billing. Choose the package that matches your project scale.
          </p>
        </div>

        {/* Founder Testimonial */}
        <TactileCard
          glowColor="rgba(16, 185, 129, 0.16)"
          className="luxury-glass p-10 md:p-14 rounded-[2.5rem] mb-20 max-w-4xl pointer-events-auto"
        >
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--color-text-muted)] tracking-widest uppercase mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            <span>VERIFIED CLIENT TESTIMONIAL</span>
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
                Project: Complete Agency Platform & Interactive 3D Web Architecture
              </div>
            </div>
          </div>
        </TactileCard>

        {/* Pricing Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pointer-events-auto">
          
          {/* Tier 01: Landing Page */}
          <TactileCard
            className="luxury-glass p-8 md:p-10 rounded-[2rem] flex flex-col justify-between"
          >
            <div>
              <div className="text-xs font-mono text-[var(--color-text-muted)] uppercase tracking-widest mb-3">
                PACKAGE 01 // ESSENTIAL
              </div>
              <h3 className="font-display text-2xl font-bold text-[var(--color-text)] mb-1">High-Impact Landing Page</h3>
              <div className="text-3xl font-display font-bold my-6 text-[var(--color-text)]">$499</div>
              
              <ul className="space-y-3.5 mb-10 font-mono text-xs text-[var(--color-text-muted)]">
                {[
                  'Single bespoke high-converting page',
                  'Responsive mobile & desktop design',
                  'Smooth kinetic motion & micro-interactions',
                  '100/100 Lighthouse speed guarantee',
                  'Domain connection, SSL & CDN deployment',
                  'Delivered in 5–7 business days'
                ].map((ft, i) => (
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
              START LANDING PAGE
            </button>
          </TactileCard>

          {/* Tier 02: 3D Brand Experience (Featured) */}
          <TactileCard
            glowColor="rgba(217, 119, 6, 0.22)"
            className="luxury-glass p-8 md:p-10 rounded-[2rem] flex flex-col justify-between border-amber-500/40 relative shadow-2xl"
          >
            <div className="absolute -top-3.5 right-8 px-3.5 py-1 rounded-full bg-amber-400 text-stone-950 font-mono text-[10px] tracking-widest uppercase font-bold shadow-lg">
              MOST POPULAR
            </div>

            <div>
              <div className="text-xs font-mono text-amber-400 uppercase tracking-widest mb-3">
                PACKAGE 02 // 3D FLAGSHIP
              </div>
              <h3 className="font-display text-2xl font-bold text-[var(--color-text)] mb-1">3D Brand Experience</h3>
              <div className="text-3xl font-display font-bold my-6 text-amber-300">$1,299</div>
              
              <ul className="space-y-3.5 mb-10 font-mono text-xs text-[var(--color-text)]">
                {[
                  'Full multi-page corporate or agency website',
                  'Interactive 3D WebGL centerpiece or product viewer',
                  'Scroll-driven camera choreography & physics',
                  'Complete SEO & social share metadata setup',
                  'CMS integration for effortless editing',
                  'Dedicated sprint updates & 2-3 week delivery'
                ].map((ft, i) => (
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
              BUILD 3D WEBSITE
            </button>
          </TactileCard>

          {/* Tier 03: Full-Stack Web Application */}
          <TactileCard
            className="luxury-glass p-8 md:p-10 rounded-[2rem] flex flex-col justify-between"
          >
            <div>
              <div className="text-xs font-mono text-[var(--color-text-muted)] uppercase tracking-widest mb-3">
                PACKAGE 03 // FULL-STACK
              </div>
              <h3 className="font-display text-2xl font-bold text-[var(--color-text)] mb-1">Custom Web Application</h3>
              <div className="text-3xl font-display font-bold my-6 text-[var(--color-text)]">Custom Quote</div>
              
              <ul className="space-y-3.5 mb-10 font-mono text-xs text-[var(--color-text-muted)]">
                {[
                  'Production-ready Next.js / React web application',
                  'User authentication & role-based dashboard',
                  'Stripe / Escrow payment & billing integration',
                  'PostgreSQL / Supabase backend & REST/GraphQL APIs',
                  'Comprehensive documentation & 30-day post-launch support'
                ].map((ft, i) => (
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
              DISCUSS APPLICATION
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
