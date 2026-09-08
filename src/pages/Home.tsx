import { motion, useScroll } from 'framer-motion';
import { useRef } from 'react';
import ContactFooter from '../components/ContactFooter';
import { useContact } from '../context/ContactContext';
import { Code2, Layers, Cpu, Check, ArrowUpRight } from 'lucide-react';
import { MagneticButton } from '../components/MagneticUI';
import TiltCard from '../components/TiltCard';
import { View } from '@react-three/drei';
import ProjectPlane from '../components/3d/ProjectPlane';

// ==========================================
// REUSABLE SECTION HEADER (EDITIFY STYLE)
// ==========================================
const SectionHeader = ({ label, title }: { label: string; title: string }) => (
  <div className="mb-20">
    <span className="text-xs uppercase tracking-[0.25em] text-yellow-500 font-mono mb-4 block">
      {label}
    </span>
    <h2 className="text-[7vw] md:text-[4vw] font-bold leading-none tracking-tighter uppercase text-white font-display">
      {title}
    </h2>
  </div>
);

// ==========================================
// PROJECT SHOWCASE COMPONENT
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
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`col-span-12 rounded-[2.5rem] border border-zinc-800/80 bg-zinc-950/70 backdrop-blur-xl overflow-hidden hover:border-yellow-500/50 transition-all duration-500 flex flex-col md:flex-row min-h-[500px] shadow-2xl group`}
    >
      <div className={`md:w-[58%] relative min-h-[350px] overflow-hidden ${reversed ? 'order-1 md:order-2' : 'order-1'}`}>
        <View className="absolute inset-0 w-full h-full">
          <ProjectPlane imageSrc={imageSrc} scrollProgress={scrollYProgress} />
        </View>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent md:hidden pointer-events-none" />
      </div>

      <div className={`p-8 md:p-14 md:w-[42%] flex flex-col justify-center ${reversed ? 'order-2 md:order-1' : 'order-2'} relative z-10`}>
        <div className="text-xs uppercase tracking-[0.2em] font-mono text-yellow-500 font-medium mb-4">
          {label}
        </div>
        <h3 className="font-display text-3xl md:text-5xl font-bold mb-4 tracking-tight text-white group-hover:text-yellow-400 transition-colors">
          {title}
        </h3>
        <p className="font-mono text-zinc-400 text-sm md:text-base mb-10 leading-relaxed">
          {desc}
        </p>
        <div>
          <a 
            href={link} 
            target="_blank" 
            rel="noreferrer" 
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-zinc-700 bg-zinc-900/80 text-white font-mono text-xs uppercase tracking-[0.2em] font-semibold hover:border-yellow-500 hover:text-yellow-400 transition-all"
          >
            Visit Live Site <ArrowUpRight size={15} />
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default function Home() {
  const { openContact } = useContact();

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* 01 / HERO SECTION (EDITIFY INSPIRATION) */}
      <section className="min-h-screen w-full flex flex-col items-center justify-center relative z-10 px-6 pt-36 pb-24 text-center">
        
        {/* Monolith is positioned right in the center 3D canvas behind this text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center"
        >
          <span className="text-xs uppercase tracking-[0.3em] font-mono text-yellow-500 mb-6 px-4 py-1.5 rounded-full border border-yellow-500/20 bg-yellow-500/5 backdrop-blur-md">
            Digital Product & Engineering Studio
          </span>

          {/* Editify-style Two-Tone Giant Typography */}
          <h1 className="text-[12vw] md:text-[8.5vw] font-bold leading-[0.85] tracking-tighter uppercase flex flex-col items-center select-none font-display">
            <span className="inline-block text-white">SHAURYA</span>
            <span 
              className="inline-block text-transparent" 
              style={{ WebkitTextStroke: '2px #e8b634' }}
            >
              STUDIOS
            </span>
          </h1>

          <p className="mt-8 max-w-xl text-center text-zinc-400 text-lg md:text-xl font-medium leading-relaxed font-sans">
            Engineering high-retention digital artifacts, immersive 3D web environments, and scalable systems that convert.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-5 mt-12">
            <MagneticButton 
              primary 
              onClick={openContact}
              className="!px-8 !py-4 !rounded-full !bg-yellow-500 !text-black font-bold tracking-widest text-sm shadow-[0_0_35px_rgba(234,179,8,0.35)] hover:scale-105 transition-transform duration-300"
            >
              INITIATE PROJECT
            </MagneticButton>
            
            <a 
              href="#work"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 py-4 rounded-full border border-zinc-700 bg-zinc-950/40 text-white hover:bg-zinc-900 transition-colors tracking-widest text-sm font-bold font-mono"
            >
              VIEW WORK
            </a>
          </div>

          {/* Trust / Credibility Bar */}
          <div className="mt-20 flex flex-wrap items-center justify-center gap-4 border-t border-zinc-800/60 pt-8 w-full max-w-2xl">
            <div className="flex -space-x-3">
              <img src="/jona_logo.jpg" alt="Client" className="w-8 h-8 rounded-full border-2 border-black object-cover" />
              <img src="/logo1.jpg" alt="Client" className="w-8 h-8 rounded-full border-2 border-black object-cover" />
              <img src="/logo2.jpg" alt="Client" className="w-8 h-8 rounded-full border-2 border-black object-cover" />
              <div className="w-8 h-8 rounded-full border-2 border-black bg-zinc-800 text-zinc-400 flex items-center justify-center text-[10px] font-bold font-mono">+</div>
            </div>
            <span className="text-xs tracking-widest text-zinc-400 uppercase font-mono font-medium">
              Trusted by Leading Creators & Founders Worldwide
            </span>
          </div>
        </motion.div>
      </section>

      {/* 02 / SELECTED WORK */}
      <section id="work" className="py-32 px-6 md:px-10 max-w-7xl mx-auto w-full relative z-10">
        <SectionHeader label="01 / SELECTED WORK" title="Deployed Products." />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-20">
          <ProjectShowcase 
            title="Editify Platform"
            desc="Full-stack creative production agency platform engineered for extreme performance, cinematic pacing, and seamless lead conversion."
            label="CLIENT.01 // PRODUCTION"
            link="https://editify-studios.vercel.app"
            imageSrc="/placeholder1.jpg"
          />

          <ProjectShowcase 
            title="ThumbPilot"
            desc="AI-powered diagnostic and retention analysis platform designed to objectively dissect visual hierarchy and maximize YouTube audience clickthrough."
            label="CLIENT.02 // SAAS PRODUCT"
            link="https://thumbpilot.com"
            imageSrc="/placeholder2.jpg"
            reversed={true}
          />
        </div>
      </section>

      {/* 03 / CAPABILITIES (SYSTEM ARCHITECTURE) */}
      <section id="services" className="py-32 px-6 md:px-10 max-w-7xl mx-auto w-full relative z-10 border-t border-zinc-900/80">
        <SectionHeader label="02 / CAPABILITIES" title="Core Architecture." />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              icon: <Code2 size={24} />, 
              tag: "SYSTEM.01",
              title: "Frontend Engineering", 
              desc: "Next.js, React, TypeScript. Scalable foundational architectures built from clean principles. Zero spaghetti code, 100% type-safe, and production-hardened." 
            },
            { 
              icon: <Layers size={24} />, 
              tag: "SYSTEM.02",
              title: "Interactive 3D WebGL", 
              desc: "React Three Fiber, GLSL Shaders. Web environments that behave like tactile physical machinery. Smooth 60fps renders with strict resource management." 
            },
            { 
              icon: <Cpu size={24} />, 
              tag: "SYSTEM.03",
              title: "Conversion & Speed", 
              desc: "Lighthouse 100s across the board. Sub-second asset loads, zero layout shift, and narrative layout flow engineered to convert visitors into clients." 
            }
          ].map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="island p-10 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-8">
                  <div className="w-12 h-12 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 flex items-center justify-center text-yellow-500">
                    {item.icon}
                  </div>
                  <span className="font-mono text-xs text-zinc-500 tracking-widest">{item.tag}</span>
                </div>
                <h3 className="font-display text-2xl font-bold mb-4 text-white">{item.title}</h3>
                <p className="font-mono text-zinc-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 04 / INVESTMENT WITH EDITIFY 3D TILT CARDS */}
      <section id="pricing" className="py-32 px-6 md:px-10 max-w-7xl mx-auto w-full relative z-10 border-t border-zinc-900/80">
        <SectionHeader label="03 / INVESTMENT" title="Predictable Pricing." />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Tier 1: Starter */}
          <TiltCard className="h-full">
            <div className="island p-8 flex flex-col h-full bg-zinc-950/80">
              <div className="text-xs uppercase tracking-[0.2em] font-mono text-zinc-500 mb-2">TIER.01</div>
              <h3 className="font-display text-2xl font-bold mb-1 text-white">Starter</h3>
              <div className="text-4xl font-display font-bold mt-4 mb-6 text-white">$80</div>
              <ul className="space-y-3 mb-8 flex-grow">
                {['1 Page Portfolio', 'Responsive Design', 'Basic SEO', '3 Days Delivery'].map((ft, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-zinc-400 font-mono">
                    <Check size={14} className="text-yellow-500 flex-shrink-0" /> {ft}
                  </li>
                ))}
              </ul>
              <MagneticButton onClick={openContact} className="w-full text-center !rounded-full">
                SELECT TIER
              </MagneticButton>
            </div>
          </TiltCard>

          {/* Tier 2: Professional (Featured with Glow and 3D Badge like Editify) */}
          <div className="relative">
            <TiltCard glow className="h-full w-full">
              {/* Floating 3D Badge */}
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 flex items-center justify-center z-30" style={{ transform: "translateZ(30px)" }}>
                <div className="relative bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 text-black px-6 py-1.5 rounded-full text-xs font-bold tracking-[0.2em] uppercase shadow-[0_10px_20px_rgba(202,138,4,0.4)] border border-yellow-300/50 flex items-center gap-2">
                  <span>★</span>
                  Most Popular
                  <span>★</span>
                </div>
              </div>

              <div className="island p-8 flex flex-col h-full bg-black/90 border-yellow-500/40 shadow-[0_0_40px_rgba(202,138,4,0.15)] relative overflow-hidden">
                <div className="text-xs uppercase tracking-[0.2em] font-mono text-yellow-500 mb-2 mt-2">TIER.02 // POPULAR</div>
                <h3 className="font-display text-2xl font-bold mb-1 text-white">Professional</h3>
                <div className="text-4xl font-display font-bold mt-4 mb-6 text-yellow-500">$140</div>
                <ul className="space-y-3 mb-8 flex-grow">
                  {['Up to 5 Pages', 'Interactive 3D Elements', 'Custom Motion & Animation', 'Advanced SEO & Meta', '1 Week Delivery'].map((ft, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-zinc-200 font-mono">
                      <Check size={14} className="text-yellow-400 flex-shrink-0" /> {ft}
                    </li>
                  ))}
                </ul>
                <MagneticButton primary onClick={openContact} className="w-full text-center !rounded-full !bg-yellow-500 !text-black font-bold">
                  SELECT TIER
                </MagneticButton>
              </div>
            </TiltCard>
          </div>

          {/* Tier 3: E-Commerce */}
          <TiltCard className="h-full">
            <div className="island p-8 flex flex-col h-full bg-zinc-950/80">
              <div className="text-xs uppercase tracking-[0.2em] font-mono text-zinc-500 mb-2">TIER.03</div>
              <h3 className="font-display text-2xl font-bold mb-1 text-white">E-Commerce</h3>
              <div className="text-4xl font-display font-bold mt-4 mb-6 text-white">$300</div>
              <ul className="space-y-3 mb-8 flex-grow">
                {['Full Online Store', 'Stripe / PayPal Gateway', 'Inventory & Cart Flow', 'Admin Management', '2 Weeks Delivery'].map((ft, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-zinc-400 font-mono">
                    <Check size={14} className="text-yellow-500 flex-shrink-0" /> {ft}
                  </li>
                ))}
              </ul>
              <MagneticButton onClick={openContact} className="w-full text-center !rounded-full">
                SELECT TIER
              </MagneticButton>
            </div>
          </TiltCard>

          {/* Tier 4: Custom SaaS */}
          <TiltCard className="h-full">
            <div className="island p-8 flex flex-col h-full bg-zinc-950/80">
              <div className="text-xs uppercase tracking-[0.2em] font-mono text-zinc-500 mb-2">TIER.04</div>
              <h3 className="font-display text-2xl font-bold mb-1 text-white">SaaS Application</h3>
              <div className="text-3xl font-display font-bold mt-4 mb-6 text-zinc-400">CUSTOM</div>
              <ul className="space-y-3 mb-8 flex-grow">
                {['Complex Full-Stack App', 'Database & Auth Flow', 'Custom API Integrations', 'AI Engine Hookup', 'Timeline Negotiable'].map((ft, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-zinc-400 font-mono">
                    <Check size={14} className="text-zinc-500 flex-shrink-0" /> {ft}
                  </li>
                ))}
              </ul>
              <MagneticButton onClick={openContact} className="w-full text-center !rounded-full">
                INQUIRE
              </MagneticButton>
            </div>
          </TiltCard>

        </div>
      </section>

      {/* 05 / CLIENT VOICES (AUTHENTIC EDITIFY REVIEWS) */}
      <section className="py-32 px-6 md:px-10 max-w-7xl mx-auto w-full relative z-10 border-t border-zinc-900/80">
        <SectionHeader label="04 / CLIENT VOICES" title="Verified Track Record." />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: "JxckeMC",
              title: "Founder, ChampionsMC",
              text: "Shaurya is a 10/10 website builder, highly recommended. The quality is exceptional and was instrumental in expanding our community to over 2.5k members.",
              img: "/logo2.jpg"
            },
            {
              name: "Bloomsart.tcr",
              title: "Brand Director",
              text: "Understood exactly what we needed and executed it flawlessly. The transitions, structure, and responsiveness felt completely bespoke.",
              img: "/logo1.jpg"
            },
            {
              name: "Jooonah",
              title: "Content Creator",
              text: "The definition of professionalism. You get extreme quality, lightning fast turnaround, and attention to every detail.",
              img: "/jona_logo.jpg"
            }
          ].map((review, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="island p-10 flex flex-col justify-between"
            >
              <div>
                <div className="text-yellow-500 text-lg tracking-widest mb-6">★★★★★</div>
                <p className="text-zinc-300 font-sans text-base leading-relaxed mb-8">
                  "{review.text}"
                </p>
              </div>
              
              <div className="flex items-center gap-4 border-t border-zinc-800/80 pt-6">
                <img 
                  src={review.img} 
                  alt={review.name} 
                  className="w-12 h-12 rounded-full border border-zinc-700 object-cover" 
                />
                <div>
                  <div className="font-bold text-white text-sm uppercase tracking-wider font-mono">{review.name}</div>
                  <div className="text-xs text-zinc-500 font-mono">{review.title}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 06 / FOOTER & LAUNCH SEQUENCE */}
      <div className="pointer-events-auto relative z-10 border-t border-zinc-900">
        <ContactFooter />
      </div>

    </div>
  );
}
