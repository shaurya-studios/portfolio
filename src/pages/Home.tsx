import { motion } from 'framer-motion';
import ContactFooter from '../components/ContactFooter';
import { useContact } from '../context/ContactContext';
import { useScenery } from '../context/SceneryContext';
import { ArrowUpRight, Check, Compass, ShieldCheck, Zap, Sparkles, Star, ExternalLink } from 'lucide-react';
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
                FULL-STACK WEB DEVELOPER & CREATIVE DESIGNER
              </span>
            </motion.div>

            {/* Kinetic Masked Display Title */}
            <div className="font-display text-[14vw] sm:text-[10vw] lg:text-[6.5vw] font-bold leading-[0.88] tracking-[-0.04em] uppercase text-[var(--color-text)] mb-8 select-none">
              <KineticText as="h1" delay={0.2} stagger={0.05}>
                SHAURYA STUDIOS
              </KineticText>
            </div>

            {/* Human-Friendly Subhead */}
            <p className="text-[var(--color-text-muted)] text-base sm:text-lg md:text-xl font-normal leading-relaxed max-w-lg mb-8 font-sans">
              I build fast, modern websites and interactive 3D web experiences that help businesses, startups, and creators stand out. Clean code, sharp design, and high performance — built from scratch without bloated templates.
            </p>

            {/* Performance & Quality Benchmarks */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-10 font-mono text-xs text-[var(--color-text-muted)]">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[var(--color-text)] font-semibold">100/100</span> SPEED SCORE
              </div>
              <div className="h-3 w-[1px] bg-[var(--color-border)]" />
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span className="text-[var(--color-text)] font-semibold">60 FPS</span> 3D MOTION
              </div>
              <div className="h-3 w-[1px] bg-[var(--color-border)]" />
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span className="text-[var(--color-text)] font-semibold">100%</span> CUSTOM CRAFTED
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
                title="Drive the boat across the 3D islands"
              >
                <Compass size={14} className="text-cyan-400 transition-transform group-hover:rotate-45" />
                <span>EXPLORE 3D WORLD</span>
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

            {/* Status Strip */}
            <div className="mt-16 pt-8 border-t border-[var(--color-border)] w-full flex items-center justify-between text-[11px] font-mono text-[var(--color-text-muted)] tracking-widest uppercase">
              <span>BASED IN INDIA · SERVING CLIENTS GLOBALLY</span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                AVAILABLE FOR NEW PROJECTS
              </span>
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
            <span className="section-label">SELECTED WORK</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[var(--color-text)] uppercase leading-none">
            Featured Projects.
          </h2>
          <p className="text-[var(--color-text-muted)] text-sm md:text-base mt-4 font-sans leading-relaxed">
            Real projects built for startups, agencies, and creators — from high-converting brand platforms to custom web applications.
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
                  <span>·</span>
                  <span className="text-[var(--color-text)] font-semibold">CREATIVE AGENCY PLATFORM</span>
                </div>
                
                <h3 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--color-text)] mb-6 tracking-tight">
                  Editify Studios
                </h3>
                
                <p className="text-[var(--color-text-muted)] text-base font-sans leading-relaxed mb-8 max-w-xl">
                  A custom website built for a creative agency to showcase client work and drive qualified inbound inquiries. Features interactive 3D elements, smooth motion pacing, and a streamlined client contact funnel.
                </p>

                {/* Tech Highlights */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 py-6 border-y border-[var(--color-border)] mb-8 font-mono text-xs">
                  <div>
                    <span className="block text-[var(--color-text-muted)] text-[10px] uppercase tracking-wider mb-1">TECH STACK</span>
                    <strong className="text-[var(--color-text)] font-medium">Next.js & React</strong>
                  </div>
                  <div>
                    <span className="block text-[var(--color-text-muted)] text-[10px] uppercase tracking-wider mb-1">INTERACTIVE 3D</span>
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
                    <span>View Live Site</span>
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
                  <span className="text-amber-400 font-bold">SAAS APPLICATION</span>
                  <span>·</span>
                  <span className="text-[var(--color-text)] font-semibold">CREATOR ANALYTICS TOOL</span>
                </div>
                
                <h3 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--color-text)] mb-6 tracking-tight">
                  ThumbPilot
                </h3>
                
                <p className="text-[var(--color-text-muted)] text-base font-sans leading-relaxed mb-8 max-w-xl">
                  A thumbnail analytics web application helping YouTube creators test, compare, and optimize click-through rates before publishing. Built with side-by-side A/B simulation and instant contrast scoring.
                </p>

                {/* Tech Highlights */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 py-6 border-y border-[var(--color-border)] mb-8 font-mono text-xs">
                  <div>
                    <span className="block text-[var(--color-text-muted)] text-[10px] uppercase tracking-wider mb-1">FRONTEND</span>
                    <strong className="text-[var(--color-text)] font-medium">React / TypeScript</strong>
                  </div>
                  <div>
                    <span className="block text-[var(--color-text-muted)] text-[10px] uppercase tracking-wider mb-1">BACKEND API</span>
                    <strong className="text-[var(--color-text)] font-medium">Node.js REST API</strong>
                  </div>
                  <div>
                    <span className="block text-[var(--color-text-muted)] text-[10px] uppercase tracking-wider mb-1">UI / UX</span>
                    <strong className="text-[var(--color-text)] font-medium">Dark Mode Analytics</strong>
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
                    <span>View Live App</span>
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
            <span className="section-label">SERVICES</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[var(--color-text)] uppercase leading-none">
            What I Do.
          </h2>
          <p className="text-[var(--color-text-muted)] text-sm md:text-base mt-4 font-sans leading-relaxed">
            From bespoke landing pages and multi-page web applications to interactive 3D experiences, I craft high-quality digital products tailored to your goals.
          </p>
        </div>

        {/* 3 Core Disciplines */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pointer-events-auto">
          {[
            {
              index: "01",
              title: "Full-Stack Web Development",
              tag: "REACT & NEXT.JS",
              icon: <ShieldCheck size={20} className="text-amber-400" />,
              desc: "Next.js, React, TypeScript, and Tailwind CSS. Clean component architecture, fast routing, and seamless responsive design that looks flawless on every screen."
            },
            {
              index: "02",
              title: "Interactive 3D & WebGL",
              tag: "THREE.JS / 3D",
              icon: <Sparkles size={20} className="text-cyan-400" />,
              desc: "Three.js and WebGL experiences that captivate visitors without sacrificing performance. Fluid 60 FPS animations optimized for mobile and desktop alike."
            },
            {
              index: "03",
              title: "Performance & SEO Optimization",
              tag: "SEARCH & SPEED",
              icon: <Zap size={20} className="text-emerald-400" />,
              desc: "Sub-second load times, 100/100 Google Lighthouse scores, and search engine optimization so your website ranks higher and converts visitors into paying clients."
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
                    <span className="text-sm font-semibold text-[var(--color-text)]">{item.index} ·</span>
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
          04 // PROCESS
          =================================================== */}
      <section className="py-28 px-6 md:px-16 lg:px-24 max-w-7xl mx-auto w-full relative z-10 pointer-events-none">
        <div className="max-w-2xl mb-16 pointer-events-auto">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-highlight)]" />
            <span className="section-label">PROCESS</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-[var(--color-text)] uppercase leading-none">
            How We'll Work Together.
          </h2>
          <p className="text-[var(--color-text-muted)] text-sm md:text-base mt-4 font-sans leading-relaxed">
            A clear, collaborative process with defined milestones, weekly demos, and open communication from start to launch.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pointer-events-auto">
          {[
            {
              step: "STEP 01",
              title: "Discovery & Strategy",
              desc: "We discuss your vision, target audience, technical needs, and project goals to create a clear project scope and realistic delivery timeline."
            },
            {
              step: "STEP 02",
              title: "Design & Concepts",
              desc: "I design clean wireframes, visual prototypes, and interactive motion concepts so you can see and refine the direction before code is written."
            },
            {
              step: "STEP 03",
              title: "Development",
              desc: "I build your website using modern React and Next.js, with clean maintainable code and regular live preview links for your feedback."
            },
            {
              step: "STEP 04",
              title: "Testing & Launch",
              desc: "Full cross-browser testing, mobile optimization, SEO setup, and smooth deployment to your custom domain so you can launch with confidence."
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
          05 // TESTIMONIAL & PACKAGES (#pricing)
          =================================================== */}
      <section id="pricing" className="py-36 px-6 md:px-16 lg:px-24 max-w-7xl mx-auto w-full relative z-10 pointer-events-none">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-20 pointer-events-auto">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-highlight)]" />
            <span className="section-label">PACKAGES</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[var(--color-text)] uppercase leading-none">
            Transparent Pricing.
          </h2>
          <p className="text-[var(--color-text-muted)] text-sm md:text-base mt-4 font-sans leading-relaxed">
            Clear, upfront quotes with zero hidden fees or surprise hourly billing. Choose the package that matches your project scale, or reach out for custom requirements.
          </p>
        </div>

        {/* Founder Testimonial */}
        <TactileCard
          glowColor="rgba(16, 185, 129, 0.16)"
          className="luxury-glass p-10 md:p-14 rounded-[2.5rem] mb-20 max-w-4xl pointer-events-auto"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2 text-xs font-mono text-[var(--color-text-muted)] tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              <span>VERIFIED CLIENT TESTIMONIAL</span>
            </div>
            {/* 5 Golden Stars */}
            <div className="flex items-center gap-1.5 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={15} className="fill-amber-400 text-amber-400" />
              ))}
              <span className="text-xs font-mono text-[var(--color-text)] font-bold ml-1.5">5.0 / 5.0</span>
            </div>
          </div>

          <blockquote className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold leading-snug text-[var(--color-text)] mb-8">
            "Shaurya is a 10/10 website builder, highly recommended. He delivers exceptional quality."
          </blockquote>

          <div className="flex items-center gap-4 pt-6 border-t border-[var(--color-border)]">
            {/* Editify Studios Brand Logo */}
            <div className="relative flex-shrink-0">
              <div className="w-14 h-14 rounded-2xl bg-white/[0.07] border border-white/15 p-2 flex items-center justify-center backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
                <img 
                  src="/editify-logo.png" 
                  alt="Editify Studios Official Logo" 
                  className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(245,158,11,0.35)]"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[var(--color-bg)] flex items-center justify-center text-[8px] text-black font-bold shadow-sm" title="Verified Client">
                ✓
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-[var(--color-text)] uppercase tracking-wider">
                  Founder, Editify Studios
                </span>
                <a 
                  href="https://editify-studios.vercel.app" 
                  target="_blank" 
                  rel="noreferrer"
                  onClick={playTactileClick}
                  className="text-[var(--color-text-muted)] hover:text-amber-400 transition-colors"
                  title="Visit Editify Studios"
                >
                  <ExternalLink size={13} />
                </a>
              </div>
              <div className="font-mono text-xs text-[var(--color-text-muted)] mt-0.5">
                Project: Full Agency Website & Interactive 3D Architecture
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
                STARTER
              </div>
              <h3 className="font-display text-2xl font-bold text-[var(--color-text)] mb-1">High-Impact Landing Page</h3>
              <div className="text-3xl font-display font-bold my-6 text-[var(--color-text)]">$499</div>
              
              <ul className="space-y-3.5 mb-10 font-mono text-xs text-[var(--color-text-muted)]">
                {[
                  'Custom-designed, high-converting single page',
                  'Fully responsive across mobile, tablet & desktop',
                  'Smooth scroll animations & micro-interactions',
                  'Lighthouse 95+ performance guarantee',
                  'Domain connection, SSL & hosting setup',
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
              GET STARTED
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
                FLAGSHIP
              </div>
              <h3 className="font-display text-2xl font-bold text-[var(--color-text)] mb-1">3D Brand Experience</h3>
              <div className="text-3xl font-display font-bold my-6 text-amber-300">$1,299</div>
              
              <ul className="space-y-3.5 mb-10 font-mono text-xs text-[var(--color-text)]">
                {[
                  'Complete multi-page website (up to 5 pages)',
                  'Interactive 3D centerpiece or model viewer',
                  'Custom animations & fluid scroll choreography',
                  'Complete SEO & social share optimization',
                  'CMS integration for easy content editing',
                  'Delivered in 2–3 weeks with regular demos'
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
              GET STARTED
            </button>
          </TactileCard>

          {/* Tier 03: Full-Stack Web Application */}
          <TactileCard
            className="luxury-glass p-8 md:p-10 rounded-[2rem] flex flex-col justify-between"
          >
            <div>
              <div className="text-xs font-mono text-[var(--color-text-muted)] uppercase tracking-widest mb-3">
                TAILORED
              </div>
              <h3 className="font-display text-2xl font-bold text-[var(--color-text)] mb-1">Custom Web Application</h3>
              <div className="text-3xl font-display font-bold my-6 text-[var(--color-text)]">Custom Quote</div>
              
              <ul className="space-y-3.5 mb-10 font-mono text-xs text-[var(--color-text-muted)]">
                {[
                  'Full-stack application built with Next.js / React',
                  'User accounts, authentication & dashboard',
                  'Stripe or payment gateway integration',
                  'Database setup (PostgreSQL / Supabase / Firebase)',
                  'Comprehensive documentation & 30 days support'
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
              REQUEST A QUOTE
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
