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
  <div className="section-divider max-w-7xl mx-auto px-6">
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
      className={`col-span-12 lg:col-span-10 ${reversed ? 'lg:col-start-1' : 'lg:col-start-2'} flex flex-col md:flex-row min-h-[500px] mb-24`}
    >
      <div className={`md:w-[60%] relative overflow-hidden ${reversed ? 'order-1 md:order-2' : 'order-1'}`}>
        <View className="absolute inset-0 w-full h-full">
          <ProjectPlane imageSrc={imageSrc} scrollProgress={scrollYProgress} />
        </View>
      </div>
      <div className={`p-8 md:w-[40%] flex flex-col justify-center ${reversed ? 'order-2 md:order-1' : 'order-2'}`}>
        <div className="section-label mb-4">{label}</div>
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
    <div className="flex flex-col min-h-screen">
      
      {/* 01 / HERO */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pointer-events-none">
        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 flex flex-col items-center justify-center text-center pt-24 lg:pt-0 pointer-events-auto">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="font-mono text-xs md:text-sm tracking-[0.3em] uppercase text-[var(--color-text-muted)] mb-8 block">
              System Online
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center"
          >
            <h1 className="font-display text-[clamp(4rem,10vw,9rem)] font-bold leading-[0.9] mb-8 tracking-tighter">
              DIGITAL <br />
              <span className="gold-text">ARTIFACTS</span>
            </h1>
            <p className="font-sans text-[var(--color-text-muted)] text-base md:text-xl max-w-lg mb-12 leading-relaxed">
              Engineering highly tactile, performant web applications for those who treat their digital presence as a physical asset.
            </p>
            
            <div className="flex flex-col items-center">
              <MagneticButton primary onClick={openContact}>INITIATE PROJECT</MagneticButton>
            </div>
          </motion.div>

        </div>
      </section>

      <SectionDivider number="02" title="WORK" />

      {/* 02 / WORK */}
      <section id="work" className="py-32 px-6 max-w-7xl mx-auto w-full relative">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24">
          
          <ProjectShowcase 
            title="Editify Platform"
            desc="Full-stack portfolio architecture engineered for extreme performance and conversion."
            label="CLIENT.01"
            link="https://editify-studios.vercel.app"
            imageSrc="/placeholder1.jpg"
          />

          <ProjectShowcase 
            title="Thumbpilot"
            desc="High-converting landing page designed to rapidly funnel traffic and maximize lead capture."
            label="CLIENT.02"
            link="#"
            imageSrc="/placeholder2.jpg"
            reversed={true}
          />

        </div>
      </section>

      <SectionDivider number="03" title="CAPABILITIES" />

      {/* 03 / CAPABILITIES */}
      <section id="services" className="py-24 px-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
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
      <section id="pricing" className="py-24 px-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
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
            className="flex flex-col gap-4"
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
      <section className="py-24 px-6 max-w-4xl mx-auto w-full">
        <motion.div 
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row items-center gap-12"
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
