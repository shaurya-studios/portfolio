import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Code2, Layers, Cpu, Check, ExternalLink } from 'lucide-react';
import { useRef } from 'react';

// Reusable Magnetic Button
const MagneticButton = ({ children, className = '', href, target }: { children: React.ReactNode, className?: string, href?: string, target?: string }) => {
  const Component = href ? 'a' : 'button';
  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
      <Component href={href} target={target} className={`px-8 py-4 rounded-full font-medium text-sm tracking-wide transition-colors ${className}`}>
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
    <div className="w-full pb-16" ref={containerRef}>
      
      {/* 1. INTERACTIVE HERO */}
      <section className="relative min-h-screen flex flex-col justify-center px-6 md:px-12 max-w-7xl mx-auto overflow-hidden">
        <motion.div style={{ y, opacity }} className="relative z-10 mt-16 flex flex-col md:flex-row items-center gap-12">
          
          <div className="w-full md:w-3/5">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-3 mb-6"
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
              className="text-display-lg text-gradient mb-6 leading-[1.1]"
            >
              Engineering World-Class Web Experiences.
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="text-xl md:text-2xl text-[var(--color-text-secondary)] max-w-2xl leading-relaxed mb-8"
            >
              I partner with forward-thinking founders to design and build premium software that converts, scales, and stands out.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
              className="flex flex-wrap items-center gap-4"
            >
              <MagneticButton href="#pricing" className="bg-white text-black hover:bg-gray-200 flex items-center gap-2">
                View Pricing <ArrowRight size={16} />
              </MagneticButton>
              <MagneticButton href="#work" className="bg-transparent text-white border border-[var(--color-border)] hover:border-gray-600">
                View Showcase
              </MagneticButton>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            className="w-full md:w-2/5 relative hidden md:block"
          >
            {/* Floating Tech Stack / Trust Card to fill empty space */}
            <div className="card-border p-6 rounded-2xl relative overflow-hidden backdrop-blur-xl bg-black/40 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-700">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-accent)] rounded-full blur-[80px] opacity-20" />
              <h3 className="text-xl font-bold mb-4 text-white">Core Stack</h3>
              <div className="flex flex-wrap gap-2">
                {['React', 'Next.js', 'TypeScript', 'Tailwind', 'Node.js', 'Vercel', 'PostgreSQL', 'Framer Motion'].map(tech => (
                  <span key={tech} className="px-3 py-1 rounded-full text-xs font-mono bg-white/5 border border-white/10 text-gray-300">
                    {tech}
                  </span>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Uptime</span>
                  <span className="text-emerald-400 font-mono text-sm">99.99%</span>
                </div>
              </div>
            </div>
          </motion.div>

        </motion.div>
      </section>

      {/* 2. TRUST SECTION */}
      <section className="py-16 border-y border-[var(--color-border)] bg-[var(--color-bg-elevated)] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold mb-1">Lightning Fast</h3>
            <p className="text-[var(--color-text-secondary)] text-xs uppercase tracking-widest">Speed Optimized</p>
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold mb-1">Fully Responsive</h3>
            <p className="text-[var(--color-text-secondary)] text-xs uppercase tracking-widest">Mobile & Desktop Ready</p>
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold mb-1">SEO Friendly</h3>
            <p className="text-[var(--color-text-secondary)] text-xs uppercase tracking-widest">Rank Higher on Google</p>
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold mb-1">Custom Built</h3>
            <p className="text-[var(--color-text-secondary)] text-xs uppercase tracking-widest">Tailored to Your Brand</p>
          </div>
        </div>
      </section>

      {/* 3. PROJECT SHOWCASE */}
      <section id="work" className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="mb-12">
          <h2 className="text-display-md mb-4">Past Works</h2>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl">
            A few of my recent projects.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Project 1: Editify Studios */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }}
            className="group card-border rounded-2xl overflow-hidden flex flex-col md:flex-row relative"
          >
            <div className="p-8 md:w-1/2 flex flex-col justify-center relative z-10">
              <div className="mb-6">
                <span className="text-[var(--color-accent)] font-mono text-xs tracking-widest uppercase mb-3 block">Creative Agency</span>
                <h3 className="text-3xl font-bold mb-3">Editify Studios</h3>
                <p className="text-[var(--color-text-secondary)] leading-relaxed text-sm">
                  A high-performance portfolio and lead generation platform for a creative studio. Optimized for insane conversion rates and cinematic video delivery.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {['Next.js', 'Framer Motion', 'Tailwind CSS'].map(tech => (
                  <span key={tech} className="px-2 py-1 rounded-full text-xs font-mono bg-[#111] border border-[var(--color-border)] text-gray-400">
                    {tech}
                  </span>
                ))}
              </div>
              <a href="https://editify-studios.vercel.app" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:text-[var(--color-accent)] transition-colors">
                View Live Site <ExternalLink size={16} />
              </a>
            </div>
            <div className="md:w-1/2 h-[300px] md:h-auto bg-[#111] relative overflow-hidden border-l border-[var(--color-border)] flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-accent-glow)] to-transparent opacity-20 group-hover:opacity-50 transition-opacity duration-700" />
              <div className="text-white/20 font-bold text-3xl uppercase tracking-widest">Editify-Studios</div>
            </div>
          </motion.div>

          {/* Project 2: Thumbpilot */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }}
            className="group card-border rounded-2xl overflow-hidden flex flex-col md:flex-row-reverse relative"
          >
            <div className="p-8 md:w-1/2 flex flex-col justify-center relative z-10">
              <div className="mb-6">
                <span className="text-[var(--color-accent)] font-mono text-xs tracking-widest uppercase mb-3 block">Web Platform</span>
                <h3 className="text-3xl font-bold mb-3">Thumbpilot</h3>
                <p className="text-[var(--color-text-secondary)] leading-relaxed text-sm">
                  A robust platform built on Edge architecture (Cloudflare Workers) ensuring blazing fast global delivery and highly scalable API routes.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {['React', 'Cloudflare Workers', 'TypeScript'].map(tech => (
                  <span key={tech} className="px-2 py-1 rounded-full text-xs font-mono bg-[#111] border border-[var(--color-border)] text-gray-400">
                    {tech}
                  </span>
                ))}
              </div>
              <a href="https://thumbpilot.sigmashaurya2.workers.dev" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:text-[var(--color-accent)] transition-colors">
                View Live Site <ExternalLink size={16} />
              </a>
            </div>
            <div className="md:w-1/2 h-[300px] md:h-auto bg-[#111] relative overflow-hidden border-r border-[var(--color-border)] flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tl from-[var(--color-accent-glow)] to-transparent opacity-20 group-hover:opacity-50 transition-opacity duration-700" />
              <div className="text-white/20 font-bold text-3xl uppercase tracking-widest">Thumbpilot</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. SERVICES & PROCESS */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto border-t border-[var(--color-border)]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <h2 className="text-2xl font-bold mb-8">Core Competencies</h2>
            <div className="space-y-6">
              {[
                { icon: <Code2 />, title: 'Full-Stack Development', desc: 'End-to-end web applications built on modern, scalable architectures (React, Node, Postgres).' },
                { icon: <Layers />, title: 'UI/UX Engineering', desc: 'Translating Figma designs into pixel-perfect, accessible, and cinematic frontend experiences.' },
                { icon: <Cpu />, title: 'Performance Optimization', desc: 'Auditing and rewriting legacy codebases to achieve instant load times and perfect Core Web Vitals.' }
              ].map((service, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex gap-4">
                  <div className="text-[var(--color-accent)] mt-1">{service.icon}</div>
                  <div>
                    <h4 className="text-lg font-bold mb-1">{service.title}</h4>
                    <p className="text-[var(--color-text-secondary)] leading-relaxed text-sm">{service.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-8">The Pipeline</h2>
            <div className="relative border-l border-[var(--color-border)] ml-4 space-y-8 pb-4">
              {[
                'Discovery & Planning',
                'Design & Wireframing',
                'Building & Development',
                'Testing & Refinement',
                'Launch & Support'
              ].map((step, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="relative pl-6">
                  <div className="absolute left-[-9px] top-1 h-4 w-4 rounded-full bg-[var(--color-bg)] border-2 border-[var(--color-accent)]" />
                  <h4 className="text-base font-bold text-[var(--color-text-primary)]">Phase 0{i + 1}</h4>
                  <p className="text-[var(--color-text-secondary)] text-sm mt-1">{step}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4.5 PRICING */}
      <section id="pricing" className="py-20 px-6 md:px-12 max-w-7xl mx-auto border-t border-[var(--color-border)]">
        <h2 className="text-center text-3xl md:text-4xl font-bold mb-4">Investment</h2>
        <p className="text-center text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto mb-12">
          Clear pricing for high-quality websites.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Tier 1 */}
          <div className="card-border rounded-2xl p-6 flex flex-col relative">
            <h3 className="text-sm font-bold text-[var(--color-text-secondary)] mb-2 uppercase tracking-widest">Starter</h3>
            <div className="mb-6">
              <span className="text-4xl font-black">$80</span>
            </div>
            <ul className="space-y-3 mb-6 flex-grow">
              {['Functional website', '1-3 Pages', '2 Revisions', 'Content upload', 'Basic Speed optimization', 'Social media icons'].map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                  <Check size={16} className="text-[var(--color-accent)] mt-0.5 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <MagneticButton href="mailto:shaurya.studios.dev@gmail.com" className="w-full text-center border border-[var(--color-border)] hover:bg-white/5 py-3">
              Select Plan
            </MagneticButton>
          </div>

          {/* Tier 2 */}
          <div className="card-border rounded-2xl p-6 flex flex-col relative border-[var(--color-accent)] shadow-[0_0_30px_rgba(94,106,210,0.15)]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--color-accent)] text-white text-[10px] font-bold uppercase tracking-widest py-1 px-3 rounded-full whitespace-nowrap">
              Most Popular
            </div>
            <h3 className="text-sm font-bold text-[var(--color-text-secondary)] mb-2 uppercase tracking-widest">Professional</h3>
            <div className="mb-6">
              <span className="text-4xl font-black">$140</span>
            </div>
            <ul className="space-y-3 mb-6 flex-grow">
              {['Functional website', 'Up to 5 Pages', '5 Revisions', 'Content upload', 'Plugins/extensions installation', 'Opt-in form', 'Speed optimization', 'Hosting setup', 'Social media icons'].map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                  <Check size={16} className="text-[var(--color-accent)] mt-0.5 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <MagneticButton href="mailto:shaurya.studios.dev@gmail.com" className="w-full text-center bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent)]/80 py-3">
              Select Plan
            </MagneticButton>
          </div>

          {/* Tier 3 */}
          <div className="card-border rounded-2xl p-6 flex flex-col relative">
            <h3 className="text-sm font-bold text-[var(--color-text-secondary)] mb-2 uppercase tracking-widest">E-Commerce</h3>
            <div className="mb-6">
              <span className="text-4xl font-black">$300</span>
            </div>
            <ul className="space-y-3 mb-6 flex-grow">
              {['Functional website', 'Up to 10 Pages', 'Unlimited Revisions', 'E-commerce functionality', 'Up to 50 Products', 'Payment Integration', 'Autoresponder integration', 'Speed optimization', 'Hosting setup'].map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                  <Check size={16} className="text-[var(--color-accent)] mt-0.5 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <MagneticButton href="mailto:shaurya.studios.dev@gmail.com" className="w-full text-center border border-[var(--color-border)] hover:bg-white/5 py-3">
              Select Plan
            </MagneticButton>
          </div>

          {/* Tier 4 */}
          <div className="card-border rounded-2xl p-6 flex flex-col relative bg-gradient-to-b from-[#111] to-[#0a0a0a]">
            <h3 className="text-sm font-bold text-[var(--color-text-secondary)] mb-2 uppercase tracking-widest">Custom</h3>
            <div className="mb-6">
              <span className="text-4xl font-black tracking-tight">Custom</span>
            </div>
            <ul className="space-y-3 mb-6 flex-grow">
              {['Custom Web Applications', 'Complex API Integrations', 'AI/LLM Integrations', 'Custom Dashboards', 'Headless Architectures', 'Bespoke Animations', 'Dedicated Support'].map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                  <Check size={16} className="text-[var(--color-accent)] mt-0.5 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <MagneticButton href="mailto:shaurya.studios.dev@gmail.com" className="w-full text-center border border-[var(--color-border)] hover:bg-white/5 py-3">
              Contact Sales
            </MagneticButton>
          </div>

        </div>
      </section>

      {/* 5. TESTIMONIALS */}
      <section className="py-20 px-6 md:px-12 max-w-4xl mx-auto border-t border-[var(--color-border)]">
        <h2 className="text-center text-3xl font-bold mb-10">Reviews</h2>
        <div className="grid grid-cols-1 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="card-border p-8 rounded-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-accent)] rounded-full blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity" />
            <div className="flex gap-1 mb-6 text-[var(--color-accent)]">
              {[1,2,3,4,5].map(i => <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>)}
            </div>
            <p className="text-lg leading-relaxed mb-8 italic font-medium">"Shaurya is a 10/10 website builder, highly recommended. He offers the best prices in the market."</p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-black border border-[var(--color-border)] overflow-hidden flex items-center justify-center p-1.5">
                <img src="/editify-logo.png" alt="Editify Studios" className="w-full h-full object-contain" />
              </div>
              <div>
                <h4 className="font-bold text-base">Founder</h4>
                <p className="text-xs text-[var(--color-text-secondary)]">Editify Studios</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 6. CONTACT */}
      <section className="py-20 px-6 md:px-12 max-w-4xl mx-auto text-center border-t border-[var(--color-border)]">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Build?</h2>
          <p className="text-lg text-[var(--color-text-secondary)] mb-10 max-w-2xl mx-auto">
            I'm currently accepting new freelance clients. Let's discuss your product goals and how a custom website can help your business grow.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <MagneticButton href="mailto:shaurya.studios.dev@gmail.com" className="bg-white text-black hover:bg-gray-200 w-full sm:w-auto">
              shaurya.studios.dev@gmail.com
            </MagneticButton>
            <div className="flex gap-4">
              <a href="https://discord.com/users/1338926430679076925" target="_blank" rel="noreferrer" className="px-6 py-4 rounded-full border border-[var(--color-border)] hover:bg-[var(--color-bg-elevated)] transition-colors font-mono text-sm uppercase tracking-widest flex items-center gap-2">
                Discord
              </a>
              <a href="https://www.fiverr.com/s/6Yl5a2r" target="_blank" rel="noreferrer" className="px-6 py-4 rounded-full border border-[var(--color-border)] hover:bg-[var(--color-bg-elevated)] transition-colors font-mono text-sm uppercase tracking-widest flex items-center gap-2">
                Fiverr
              </a>
            </div>
          </div>
        </motion.div>
      </section>

    </div>
  );
}
