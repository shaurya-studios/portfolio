import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Code2, Layers, Cpu } from 'lucide-react';
import { useRef } from 'react';

// Reusable Magnetic Button
const MagneticButton = ({ children, className = '', href }: { children: React.ReactNode, className?: string, href?: string }) => {
  const Component = href ? 'a' : 'button';
  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
      <Component href={href} className={`px-8 py-4 rounded-full font-medium text-sm tracking-wide transition-colors ${className}`}>
        {children}
      </Component>
    </motion.div>
  );
};

export default function Home() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div className="w-full pb-32" ref={containerRef}>
      
      {/* 1. INTERACTIVE HERO */}
      <section className="relative min-h-screen flex flex-col justify-center px-6 md:px-12 max-w-7xl mx-auto overflow-hidden">
        <motion.div style={{ y, opacity }} className="relative z-10 mt-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </div>
            <span className="text-sm font-medium tracking-widest text-[var(--color-text-secondary)] uppercase">
              Available for new projects
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="text-display-lg max-w-5xl text-gradient mb-8"
          >
            Engineering World-Class Web Experiences.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="text-xl md:text-2xl text-[var(--color-text-secondary)] max-w-2xl leading-relaxed mb-12"
          >
            I partner with forward-thinking founders to design and build premium software that converts, scales, and stands out.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            className="flex flex-wrap items-center gap-6"
          >
            <MagneticButton href="mailto:shaurya.studios.dev@gmail.com" className="bg-white text-black hover:bg-gray-200 flex items-center gap-2">
              Start a Project <ArrowRight size={16} />
            </MagneticButton>
            <MagneticButton href="#work" className="bg-transparent text-white border border-[var(--color-border)] hover:border-gray-600">
              View Showcase
            </MagneticButton>
          </motion.div>
        </motion.div>
      </section>

      {/* 2. TRUST SECTION */}
      <section className="py-24 border-y border-[var(--color-border)] bg-[var(--color-bg-elevated)] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="text-center md:text-left">
            <h3 className="text-4xl font-bold mb-2">100/100</h3>
            <p className="text-[var(--color-text-secondary)] text-sm uppercase tracking-widest">Lighthouse Performance</p>
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-4xl font-bold mb-2">&lt; 100ms</h3>
            <p className="text-[var(--color-text-secondary)] text-sm uppercase tracking-widest">Global Latency</p>
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-4xl font-bold mb-2">100%</h3>
            <p className="text-[var(--color-text-secondary)] text-sm uppercase tracking-widest">Type Safe Code</p>
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-4xl font-bold mb-2">24/7</h3>
            <p className="text-[var(--color-text-secondary)] text-sm uppercase tracking-widest">Uptime Architecture</p>
          </div>
        </div>
      </section>

      {/* 3. PROJECT SHOWCASE */}
      <section id="work" className="py-32 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="mb-20">
          <h2 className="text-display-md mb-6">Selected Works</h2>
          <p className="text-xl text-[var(--color-text-secondary)] max-w-2xl">
            A curated selection of products engineered for scalability, speed, and exceptional user experience.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12">
          {/* Project 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }}
            className="group card-border rounded-2xl overflow-hidden flex flex-col md:flex-row relative"
          >
            <div className="p-12 md:w-1/2 flex flex-col justify-center relative z-10">
              <div className="mb-8">
                <span className="text-[var(--color-accent)] font-mono text-sm tracking-widest uppercase mb-4 block">Fintech SaaS</span>
                <h3 className="text-4xl font-bold mb-4">Aura Financial</h3>
                <p className="text-[var(--color-text-secondary)] leading-relaxed">
                  An AI-driven financial dashboard for startup founders. Reduced data query latency by 400% by migrating to a custom Edge architecture.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 mb-8">
                {['Next.js', 'TypeScript', 'Supabase', 'Tailwind'].map(tech => (
                  <span key={tech} className="px-3 py-1 rounded-full text-xs font-mono bg-[#111] border border-[var(--color-border)] text-gray-400">
                    {tech}
                  </span>
                ))}
              </div>
              <a href="#" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:text-[var(--color-accent)] transition-colors">
                View Case Study <ArrowRight size={16} />
              </a>
            </div>
            <div className="md:w-1/2 h-[400px] md:h-auto bg-[#111] relative overflow-hidden border-l border-[var(--color-border)]">
              <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-accent-glow)] to-transparent opacity-20 group-hover:opacity-50 transition-opacity duration-700" />
              <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" alt="Aura Interface" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
            </div>
          </motion.div>

          {/* Project 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }}
            className="group card-border rounded-2xl overflow-hidden flex flex-col md:flex-row-reverse relative"
          >
            <div className="p-12 md:w-1/2 flex flex-col justify-center relative z-10">
              <div className="mb-8">
                <span className="text-[var(--color-accent)] font-mono text-sm tracking-widest uppercase mb-4 block">E-Commerce OS</span>
                <h3 className="text-4xl font-bold mb-4">Nexus Commerce</h3>
                <p className="text-[var(--color-text-secondary)] leading-relaxed">
                  A high-performance headless storefront processing $2M+ in monthly volume. Achieved 100/100 Lighthouse scores across the board.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 mb-8">
                {['React', 'Node.js', 'PostgreSQL', 'Stripe'].map(tech => (
                  <span key={tech} className="px-3 py-1 rounded-full text-xs font-mono bg-[#111] border border-[var(--color-border)] text-gray-400">
                    {tech}
                  </span>
                ))}
              </div>
              <a href="#" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:text-[var(--color-accent)] transition-colors">
                View Case Study <ArrowRight size={16} />
              </a>
            </div>
            <div className="md:w-1/2 h-[400px] md:h-auto bg-[#111] relative overflow-hidden border-r border-[var(--color-border)]">
              <div className="absolute inset-0 bg-gradient-to-tl from-[var(--color-accent-glow)] to-transparent opacity-20 group-hover:opacity-50 transition-opacity duration-700" />
              <img src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2400&auto=format&fit=crop" alt="Nexus Interface" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. SERVICES & PROCESS */}
      <section className="py-32 px-6 md:px-12 max-w-7xl mx-auto border-t border-[var(--color-border)]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
          <div>
            <h2 className="text-3xl font-bold mb-12">Core Competencies</h2>
            <div className="space-y-8">
              {[
                { icon: <Code2 />, title: 'Full-Stack Development', desc: 'End-to-end web applications built on modern, scalable architectures (React, Node, Postgres).' },
                { icon: <Layers />, title: 'UI/UX Engineering', desc: 'Translating Figma designs into pixel-perfect, accessible, and cinematic frontend experiences.' },
                { icon: <Cpu />, title: 'Performance Optimization', desc: 'Auditing and rewriting legacy codebases to achieve instant load times and perfect Core Web Vitals.' }
              ].map((service, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex gap-6">
                  <div className="text-[var(--color-accent)] mt-1">{service.icon}</div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">{service.title}</h4>
                    <p className="text-[var(--color-text-secondary)] leading-relaxed">{service.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          <div>
            <h2 className="text-3xl font-bold mb-12">The Pipeline</h2>
            <div className="relative border-l border-[var(--color-border)] ml-4 space-y-12 pb-4">
              {[
                'Discovery & Architecture Mapping',
                'High-Fidelity Wireframing',
                'Frontend & Backend Engineering',
                'Rigorous QA & Testing',
                'Deployment & Scaling'
              ].map((step, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="relative pl-8">
                  <div className="absolute left-[-9px] top-1 h-4 w-4 rounded-full bg-[var(--color-bg)] border-2 border-[var(--color-accent)]" />
                  <h4 className="text-lg font-bold text-[var(--color-text-primary)]">Phase 0{i + 1}</h4>
                  <p className="text-[var(--color-text-secondary)] mt-1">{step}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS */}
      <section className="py-32 px-6 md:px-12 max-w-7xl mx-auto border-t border-[var(--color-border)]">
        <h2 className="text-center text-3xl font-bold mb-16">Client Success</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="card-border p-8 rounded-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-accent)] rounded-full blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity" />
            <div className="flex gap-1 mb-6 text-[var(--color-accent)]">
              {[1,2,3,4,5].map(i => <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>)}
            </div>
            <p className="text-lg md:text-xl leading-relaxed mb-8 italic">"Shaurya is a 10/10 website builder, highly recommended. He completely overhauled our tech stack, resulting in a 3x increase in conversion rates. He offers the best engineering in the market."</p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-800" />
              <div>
                <h4 className="font-bold">Editify Studios</h4>
                <p className="text-sm text-[var(--color-text-secondary)]">Creative Agency</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="card-border p-8 rounded-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-accent)] rounded-full blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity" />
            <div className="flex gap-1 mb-6 text-[var(--color-accent)]">
              {[1,2,3,4,5].map(i => <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>)}
            </div>
            <p className="text-lg md:text-xl leading-relaxed mb-8 italic">"We needed a developer who understood product as much as they understood code. Shaurya delivered a flawless Next.js application that scales effortlessly. Pure craftsmanship."</p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-800" />
              <div>
                <h4 className="font-bold">Alex Chen</h4>
                <p className="text-sm text-[var(--color-text-secondary)]">Founder, Aura SaaS</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 6. CONTACT */}
      <section className="py-32 px-6 md:px-12 max-w-4xl mx-auto text-center border-t border-[var(--color-border)] mt-20">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
          <h2 className="text-display-md mb-8">Ready to Build?</h2>
          <p className="text-xl text-[var(--color-text-secondary)] mb-12 max-w-2xl mx-auto">
            I'm currently accepting new freelance clients. Let's discuss your product goals and how engineering excellence can accelerate your growth.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <MagneticButton href="mailto:shaurya.studios.dev@gmail.com" className="bg-white text-black hover:bg-gray-200 w-full sm:w-auto">
              shaurya.studios.dev@gmail.com
            </MagneticButton>
            <div className="flex gap-4">
              <a href="#" className="px-6 py-4 rounded-full border border-[var(--color-border)] hover:bg-[var(--color-bg-elevated)] transition-colors font-mono text-sm uppercase tracking-widest">Github</a>
              <a href="#" className="px-6 py-4 rounded-full border border-[var(--color-border)] hover:bg-[var(--color-bg-elevated)] transition-colors font-mono text-sm uppercase tracking-widest">LinkedIn</a>
            </div>
          </div>
        </motion.div>
      </section>

    </div>
  );
}
