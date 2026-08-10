import { motion, useScroll } from 'framer-motion';
import { useRef } from 'react';
import ContactFooter from '../components/ContactFooter';
import { useContact } from '../context/ContactContext';
import { Code2, Layers, Cpu, Check, ExternalLink } from 'lucide-react';
import { MagneticButton } from '../components/MagneticUI';
import { View } from '@react-three/drei';
import ProjectPlane from '../components/3d/ProjectPlane';

// ==========================================
// REUSABLE COMPONENTS
// ==========================================

const SectionDivider = ({ number, title }: { number: string, title: string }) => (
  <div className="section-divider max-w-7xl mx-auto px-6 pointer-events-none">
    <h2 className="section-label whitespace-nowrap m-0 font-normal text-[10px]">—— {number} / {title} ——</h2>
  </div>
);

// ==========================================
// MAIN PAGE
// ==========================================

const ProjectShowcase = ({ title, desc, link, label, imageSrc, reversed = false }: any) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`col-span-12 lg:col-span-10 ${reversed ? 'lg:col-start-1' : 'lg:col-start-2'} island corner-brackets flex flex-col md:flex-row overflow-hidden group min-h-[400px] pointer-events-none`}
    >
      <div className={`md:w-[60%] bg-[var(--color-bg-inset)] relative p-8 flex items-center justify-center border-b md:border-b-0 border-[var(--color-border)] overflow-hidden ${reversed ? 'order-1 md:order-2 md:border-l' : 'order-1 md:border-r'}`}>
        <View className="absolute inset-0 w-full h-full pointer-events-none">
          <ProjectPlane imageSrc={imageSrc} scrollProgress={scrollYProgress} />
        </View>
      </div>
      <div className={`p-12 md:w-[40%] flex flex-col justify-center pointer-events-auto ${reversed ? 'order-2 md:order-1' : 'order-2'}`}>
        <div className="section-label mb-4 text-[var(--color-gold)]">{label}</div>
        <h3 className="font-display text-4xl font-bold mb-4 tracking-tight">{title}</h3>
        <p className="font-mono text-[var(--color-text-muted)] text-sm mb-10 leading-relaxed">
          {desc}
        </p>
        <a href={link} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm uppercase tracking-[0.2em] font-bold gold-text hover:text-white transition-colors">
          Initialize <ExternalLink size={16} />
        </a>
      </div>
    </motion.div>
  );
};

export default function Home() {
  const { openContact } = useContact();

  return (
    <div className="flex flex-col min-h-screen pointer-events-none">
      
      {/* 01 / HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-8 items-center pt-24 lg:pt-0 h-full">
          
          {/* Left Column - Copy */}
          <div className="flex flex-col justify-center h-full col-span-12 lg:col-span-6 xl:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="section-label mb-6 block">SHAURYA AGARWAL / SYS.01</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 className="font-display text-[clamp(3.5rem,8vw,7rem)] font-bold leading-[1.05] mb-8 tracking-[-0.04em] pointer-events-auto">
                BUILDING <br />
                DIGITAL <br />
                <span className="gold-text">ARTIFACTS</span>_
              </h1>
              <p className="text-[var(--color-text-muted)] text-base md:text-lg max-w-md mb-10 leading-relaxed pointer-events-auto">
                I engineer highly tactile, performant web applications for founders who treat their digital presence as a physical asset.
              </p>
              
              <div className="flex flex-wrap gap-4 items-center">
                <MagneticButton primary onClick={openContact}>INITIATE PROJECT</MagneticButton>
                <MagneticButton href="#work">VIEW LOG</MagneticButton>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Removed CSS 3D Mockup, space is reserved for the R3F Monolith */}
          <div className="relative h-[60vh] min-h-[400px] lg:h-full flex items-center justify-center mt-12 lg:mt-0 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className={`absolute top-[20%] right-[10%] glass-panel px-5 py-3 rounded-full flex items-center gap-3 pointer-events-auto`}
            >
              <div className="w-2 h-2 rounded-full bg-[var(--color-gold)] shadow-[0_0_8px_var(--color-gold)]" />
              <span className="font-display font-bold text-sm">2+ YEARS</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.48 }}
              className={`absolute bottom-[30%] left-[5%] glass-panel px-5 py-3 rounded-full corner-brackets border-[var(--color-border-active)] shadow-[0_10px_20px_var(--color-gold-glow)] pointer-events-auto`}
            >
              <span className="gold-text font-display font-bold text-lg leading-none tracking-tight">10+ BUILDS</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.56 }}
              className={`absolute bottom-[15%] right-[20%] glass-panel px-5 py-3 rounded-full pointer-events-auto`}
            >
              <span className="font-display font-bold text-sm">5★ RATED</span>
            </motion.div>
          </div>
        </div>
      </section>

      <SectionDivider number="02" title="WORK" />

      {/* 02 / WORK */}
      <section id="work" className="py-32 px-6 max-w-7xl mx-auto w-full pointer-events-none relative">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24">
          
          <ProjectShowcase 
            title="Editify Platform"
            desc="Full-stack portfolio architecture engineered for extreme performance and conversion."
            label="CLIENT.01"
            link="https://editify-studios.vercel.app"
            imageSrc=""
          />

          <ProjectShowcase 
            title="Thumbpilot"
            desc="High-converting landing page designed to rapidly funnel traffic and maximize lead capture."
            label="CLIENT.02"
            link="#"
            imageSrc=""
            reversed={true}
          />

        </div>
      </section>

      <SectionDivider number="03" title="CAPABILITIES" />

      {/* 03 / CAPABILITIES */}
      <section id="services" className="py-24 px-6 max-w-7xl mx-auto w-full pointer-events-none">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pointer-events-auto">
          
          {[
            { icon: <Code2 size={20} />, title: "SYS.ARCH", desc: "React, Node, Next.js. I build scalable foundations, not fragile templates." },
            { icon: <Layers size={20} />, title: "INTERFACE", desc: "React Three Fiber, WebGL. Interfaces that feel like physical objects." },
            { icon: <Cpu size={20} />, title: "OPTIMIZE", desc: "Lighthouse 100s. Zero layout shift. Instantly interactive." }
          ].map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
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
      <section id="pricing" className="py-24 px-6 max-w-7xl mx-auto w-full pointer-events-none">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pointer-events-auto">
          
          {/* Starter */}
          <motion.div 
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
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
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
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
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
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
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
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
      <section className="py-24 px-6 max-w-4xl mx-auto w-full pointer-events-none">
        <motion.div 
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="island p-10 md:p-16 flex flex-col md:flex-row items-center gap-12 pointer-events-auto"
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
      <div className="pointer-events-auto">
        <ContactFooter />
      </div>

    </div>
  );
}
