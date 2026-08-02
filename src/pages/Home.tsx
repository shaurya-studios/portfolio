import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import ContactFooter from '../components/ContactFooter';
import { useContact } from '../context/ContactContext';
import { Code2, Layers, Cpu, Check, ExternalLink } from 'lucide-react';

// ==========================================
// REUSABLE COMPONENTS
// ==========================================

const SectionDivider = ({ number, title }: { number: string, title: string }) => (
  <div className="section-divider max-w-7xl mx-auto px-6">
    <span className="section-label whitespace-nowrap">—— {number} / {title} ——</span>
  </div>
);

// Magnetic button with industrial styling
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
  
  // Primary CTA gets rounded-full, gold finish
  // Secondary gets 4px radius, structural border
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

export default function Home() {
  const { openContact } = useContact();
  
  // Hero Parallax Setup
  const heroRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleHeroMouseMove = (e: React.MouseEvent) => {
    if (!heroRef.current) return;
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    
    // Normalize -1 to 1
    const normX = (clientX / innerWidth) * 2 - 1;
    const normY = (clientY / innerHeight) * 2 - 1;
    
    mouseX.set(normX);
    mouseY.set(normY);
  };

  // Parallax Springs (heavy mass for sluggish diorama feel)
  const springConfig = { damping: 20, stiffness: 150, mass: 1.2 };
  const sX = useSpring(mouseX, springConfig);
  const sY = useSpring(mouseY, springConfig);

  // Layer Offsets
  const layer0X = useTransform(sX, [-1, 1], [-15, 15]);
  const layer0Y = useTransform(sY, [-1, 1], [-15, 15]);
  
  const layer1X = useTransform(sX, [-1, 1], [-35, 35]);
  const layer1Y = useTransform(sY, [-1, 1], [-35, 35]);
  
  const layer2X = useTransform(sX, [-1, 1], [-50, 50]);
  const layer2Y = useTransform(sY, [-1, 1], [-50, 50]);
  
  const layer3X = useTransform(sX, [-1, 1], [-80, 80]);
  const layer3Y = useTransform(sY, [-1, 1], [-80, 80]);
  
  const layer4X = useTransform(sX, [-1, 1], [-100, 100]);

  // Independent Wobble for Badges
  const badge1Y = useSpring(useTransform(sY, [-1, 1], [-120, 120]), { damping: 15, stiffness: 120, mass: 1.5 });
  const badge2Y = useSpring(useTransform(sY, [-1, 1], [-90, 90]), { damping: 25, stiffness: 180, mass: 0.8 });
  const badge3Y = useSpring(useTransform(sY, [-1, 1], [-110, 110]), { damping: 20, stiffness: 140, mass: 1.1 });

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* 01 / HERO */}
      <section 
        ref={heroRef}
        onMouseMove={!isMobile ? handleHeroMouseMove : undefined}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ perspective: isMobile ? 'none' : '1400px' }}
      >
        {/* Layer 0 (Z: -80px) Ambient Background */}
        <motion.div 
          className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none"
          style={{ x: isMobile ? 0 : layer0X, y: isMobile ? 0 : layer0Y, translateZ: isMobile ? 0 : -80 }}
        >
          <div className="w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-[var(--color-gold)] opacity-[0.03] rounded-full blur-[120px]" />
        </motion.div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center pt-24 lg:pt-0 h-full">
          
          {/* Left Column - Copy */}
          <div className="flex flex-col justify-center h-full transform-style-3d">
            {/* Layer 1 (Z: -20px) Label */}
            <motion.div
              style={{ x: isMobile ? 0 : layer1X, y: isMobile ? 0 : layer1Y, translateZ: isMobile ? 0 : -20 }}
              initial={{ opacity: 0, y: 60, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="section-label mb-6 block">SHAURYA AGARWAL / SYS.01</span>
            </motion.div>

            {/* Layer 2 (Z: 0) Headline */}
            <motion.div
              style={{ x: isMobile ? 0 : layer2X, y: isMobile ? 0 : layer2Y, translateZ: 0 }}
              initial={{ opacity: 0, y: 60, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 className="font-display text-5xl md:text-7xl font-bold leading-[1.1] mb-8 tracking-[-0.03em]">
                BUILDING <br />
                DIGITAL <br />
                <span className="gold-text">ARTIFACTS</span>_
              </h1>
              <p className="text-[var(--color-text-muted)] text-base md:text-lg max-w-md mb-10 leading-relaxed">
                I engineer highly tactile, performant web applications for founders who treat their digital presence as a physical asset.
              </p>
              
              <div className="flex flex-wrap gap-4 items-center">
                <MagneticButton primary onClick={openContact}>INITIATE PROJECT</MagneticButton>
                <MagneticButton href="#work">VIEW LOG</MagneticButton>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Browser Mockup & Badges */}
          <div className="relative h-[60vh] min-h-[400px] lg:h-full flex items-center justify-center transform-style-3d mt-12 lg:mt-0">
            
            {/* Layer 3 (Z: +50px) Browser Mockup */}
            <motion.div
              style={{ x: isMobile ? 0 : layer3X, y: isMobile ? 0 : layer3Y, translateZ: isMobile ? 0 : 50 }}
              initial={{ opacity: 0, scale: 0.9, rotateX: 10 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="absolute w-full max-w-[500px] z-10"
            >
              <div className="glass-panel corner-brackets rounded-lg p-2 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                {/* Browser bar */}
                <div className="flex items-center gap-2 mb-3 px-2 pt-1 border-b border-[var(--color-border)] pb-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-border)]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-border)]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-border)]" />
                  <div className="ml-4 section-label text-[0.6rem] !tracking-widest">EDITIFY-STUDIOS.VERCEL.APP</div>
                </div>
                {/* Mockup content */}
                <div className="aspect-[4/3] bg-[var(--color-bg-inset)] rounded border border-[var(--color-border)] overflow-hidden relative group cursor-pointer">
                  <img src="/editify-logo.png" alt="Editify Studios" className="absolute inset-0 w-full h-full object-contain p-12 opacity-80 filter brightness-150 contrast-150 group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-inset)] via-transparent to-transparent" />
                </div>
              </div>
            </motion.div>

            {/* Layer 4 (Z: +90px) Floating Badges */}
            <div className={`absolute inset-0 z-20 pointer-events-none ${isMobile ? 'flex flex-wrap justify-center content-end gap-4 pb-10' : ''}`}>
              
              <motion.div
                style={isMobile ? {} : { x: layer4X, y: badge1Y, translateZ: 90 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: isMobile ? 0.9 : 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className={`${isMobile ? 'relative' : 'absolute top-[20%] right-[10%]'} glass-panel px-5 py-3 rounded-full flex items-center gap-3`}
              >
                <div className="w-2 h-2 rounded-full bg-[var(--color-gold)] shadow-[0_0_8px_var(--color-gold)]" />
                <span className="font-display font-bold text-sm">2+ YEARS</span>
              </motion.div>

              <motion.div
                style={isMobile ? {} : { x: layer4X, y: badge2Y, translateZ: 90 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: isMobile ? 0.9 : 1 }}
                transition={{ duration: 0.8, delay: 0.48 }}
                className={`${isMobile ? 'relative' : 'absolute bottom-[30%] left-[5%]'} glass-panel px-5 py-3 rounded-full corner-brackets border-[var(--color-border-active)] shadow-[0_10px_20px_var(--color-gold-glow)]`}
              >
                <span className="gold-text font-display font-bold text-lg leading-none tracking-tight">10+ BUILDS</span>
              </motion.div>

              <motion.div
                style={isMobile ? {} : { x: layer4X, y: badge3Y, translateZ: 90 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: isMobile ? 0.9 : 1 }}
                transition={{ duration: 0.8, delay: 0.56 }}
                className={`${isMobile ? 'relative' : 'absolute bottom-[15%] right-[20%]'} glass-panel px-5 py-3 rounded-full`}
              >
                <span className="font-display font-bold text-sm">5★ RATED</span>
              </motion.div>

            </div>
          </div>
        </div>
      </section>

      <SectionDivider number="02" title="WORK" />

      {/* 02 / WORK */}
      <section id="work" className="py-24 px-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Editify Project Island */}
          <motion.div 
            initial={{ opacity: 0, y: 60, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="island corner-brackets flex flex-col md:flex-row overflow-hidden group h-full"
          >
            <div className="md:w-1/2 bg-[var(--color-bg-inset)] relative p-8 flex items-center justify-center border-b md:border-b-0 md:border-r border-[var(--color-border)] overflow-hidden">
              <img src="/editify-logo.png" alt="Editify Studios" className="w-32 opacity-70 group-hover:scale-110 group-hover:opacity-100 transition-all duration-700 filter contrast-125" />
            </div>
            <div className="p-8 md:w-1/2 flex flex-col justify-center">
              <div className="section-label mb-3">CLIENT.01</div>
              <h3 className="font-display text-2xl font-bold mb-3">Editify Platform</h3>
              <p className="text-[var(--color-text-muted)] text-sm mb-8 leading-relaxed">
                Full-stack portfolio architecture engineered for extreme performance and conversion.
              </p>
              <a href="https://editify-studios.vercel.app" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold gold-text hover:text-white transition-colors">
                Initialize <ExternalLink size={14} />
              </a>
            </div>
          </motion.div>

          {/* Thumbpilot Project Island */}
          <motion.div 
            initial={{ opacity: 0, y: 60, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="island flex flex-col md:flex-row overflow-hidden group h-full"
          >
            <div className="md:w-1/2 bg-[var(--color-bg-inset)] relative p-8 flex items-center justify-center border-b md:border-b-0 md:border-r border-[var(--color-border)] overflow-hidden">
              <div className="font-display text-4xl font-bold text-[var(--color-text-muted)] group-hover:scale-110 group-hover:text-white transition-all duration-700">THUMB.</div>
            </div>
            <div className="p-8 md:w-1/2 flex flex-col justify-center">
              <div className="section-label mb-3">CLIENT.02</div>
              <h3 className="font-display text-2xl font-bold mb-3">Thumbpilot</h3>
              <p className="text-[var(--color-text-muted)] text-sm mb-8 leading-relaxed">
                High-converting landing page designed to rapidly funnel traffic and maximize lead capture.
              </p>
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-[var(--color-text-muted)] cursor-not-allowed">
                Classified
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      <SectionDivider number="03" title="CAPABILITIES" />

      {/* 03 / CAPABILITIES */}
      <section id="services" className="py-24 px-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {[
            { icon: <Code2 size={20} />, title: "SYS.ARCH", desc: "React, Node, Next.js. I build scalable foundations, not fragile templates." },
            { icon: <Layers size={20} />, title: "INTERFACE", desc: "Framer Motion, CSS 3D, WebGL. Interfaces that feel like physical objects." },
            { icon: <Cpu size={20} />, title: "OPTIMIZE", desc: "Lighthouse 100s. Zero layout shift. Instantly interactive." }
          ].map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 60, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="island p-8"
            >
              <div className="w-10 h-10 rounded-full border border-[var(--color-border)] flex items-center justify-center mb-6 text-[var(--color-text-muted)]">
                {item.icon}
              </div>
              <h3 className="font-display text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-[var(--color-text-muted)] text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
          
        </div>
      </section>

      <SectionDivider number="04" title="INVESTMENT" />

      {/* 04 / INVESTMENT */}
      <section id="pricing" className="py-24 px-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Starter */}
          <motion.div 
            initial={{ opacity: 0, y: 60, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0, ease: [0.16, 1, 0.3, 1] }}
            className="island p-8 flex flex-col"
          >
            <div className="section-label mb-2">TIER.01</div>
            <h3 className="font-display text-2xl font-bold mb-1">Starter</h3>
            <div className="text-3xl font-display font-bold mt-4 mb-6">$80</div>
            <ul className="space-y-3 mb-8 flex-grow">
              {['1 Page Portfolio', 'Responsive Design', 'Basic SEO', '3 Days Delivery'].map((ft, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-[var(--color-text-muted)]">
                  <Check size={14} className="text-[var(--color-gold)]" /> {ft}
                </li>
              ))}
            </ul>
            <MagneticButton onClick={openContact} className="w-full text-center">DEPLOY</MagneticButton>
          </motion.div>

          {/* Professional (Featured) */}
          <motion.div 
            initial={{ opacity: 0, y: 60, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="island corner-brackets p-8 flex flex-col border-[var(--color-border-active)] shadow-[0_10px_30px_var(--color-gold-glow)] relative overflow-hidden"
          >
            {/* Gold highlight line at top */}
            <div className="absolute top-0 left-0 w-full h-[2px] gold-fill" />
            
            <div className="section-label mb-2 gold-text">TIER.02 / POPULAR</div>
            <h3 className="font-display text-2xl font-bold mb-1">Professional</h3>
            <div className="text-4xl font-display font-bold mt-4 mb-6 gold-text">$140</div>
            <ul className="space-y-3 mb-8 flex-grow">
              {['Up to 5 Pages', 'Custom Animations', 'Advanced SEO', 'Contact Forms', '1 Week Delivery'].map((ft, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-[var(--color-text)]">
                  <Check size={14} className="text-[var(--color-gold-bright)]" /> {ft}
                </li>
              ))}
            </ul>
            <MagneticButton primary onClick={openContact} className="w-full text-center">DEPLOY</MagneticButton>
          </motion.div>

          {/* E-Commerce */}
          <motion.div 
            initial={{ opacity: 0, y: 60, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="island p-8 flex flex-col"
          >
            <div className="section-label mb-2">TIER.03</div>
            <h3 className="font-display text-2xl font-bold mb-1">E-Commerce</h3>
            <div className="text-3xl font-display font-bold mt-4 mb-6">$300</div>
            <ul className="space-y-3 mb-8 flex-grow">
              {['Full Online Store', 'Payment Gateway', 'Admin Dashboard', 'Product Management', '2 Weeks Delivery'].map((ft, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-[var(--color-text-muted)]">
                  <Check size={14} className="text-[var(--color-gold)]" /> {ft}
                </li>
              ))}
            </ul>
            <MagneticButton onClick={openContact} className="w-full text-center">DEPLOY</MagneticButton>
          </motion.div>

          {/* Custom */}
          <motion.div 
            initial={{ opacity: 0, y: 60, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.36, ease: [0.16, 1, 0.3, 1] }}
            className="island p-8 flex flex-col bg-[var(--color-bg-inset)]"
          >
            <div className="section-label mb-2">TIER.04</div>
            <h3 className="font-display text-2xl font-bold mb-1">SaaS / Web App</h3>
            <div className="text-3xl font-display font-bold mt-4 mb-6 text-[var(--color-text-muted)]">CUSTOM</div>
            <ul className="space-y-3 mb-8 flex-grow">
              {['Complex Architecture', 'Database Design', 'Authentication', 'API Integration', 'Timeline TBD'].map((ft, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-[var(--color-text-muted)]">
                  <Check size={14} className="text-[var(--color-text-muted)]" /> {ft}
                </li>
              ))}
            </ul>
            <MagneticButton onClick={openContact} className="w-full text-center">QUERY</MagneticButton>
          </motion.div>

        </div>
      </section>

      <SectionDivider number="05" title="PROOF" />

      {/* 05 / PROOF */}
      <section className="py-24 px-6 max-w-4xl mx-auto w-full">
        <motion.div 
          initial={{ opacity: 0, y: 60, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="island p-10 md:p-16 flex flex-col md:flex-row items-center gap-12"
        >
          <div className="flex-grow">
            <div className="flex gap-1 mb-8">
              {[1,2,3,4,5].map(i => (
                <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="var(--color-gold)" className="drop-shadow-[0_0_4px_var(--color-gold)]">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
              ))}
            </div>
            <h3 className="font-display text-2xl md:text-3xl font-bold mb-8 leading-tight">
              "Shaurya is a 10/10 website builder, highly recommended. He delivers exceptional quality."
            </h3>
            <div>
              <div className="font-bold text-[var(--color-text)]">Founder</div>
              <div className="section-label !text-[0.65rem] mt-1">EDITIFY STUDIOS</div>
            </div>
          </div>
          <div className="w-32 h-32 rounded-lg bg-[var(--color-bg-inset)] border border-[var(--color-border)] flex items-center justify-center p-6 flex-shrink-0">
            <img src="/editify-logo.png" alt="Editify Studios" className="w-full h-full object-contain filter contrast-125" />
          </div>
        </motion.div>
      </section>

      {/* 06 / CONTACT FOOTER */}
      <ContactFooter />

    </div>
  );
}
