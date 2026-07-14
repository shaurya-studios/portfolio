import { motion } from 'framer-motion';
import { ArrowRight, Code2, Layers, Cpu, Terminal } from 'lucide-react';
import { useState, useEffect } from 'react';

// Reusable Terminal Button
const TerminalButton = ({ children, className = '', href, target }: { children: React.ReactNode, className?: string, href?: string, target?: string }) => {
  const Component = href ? 'a' : 'button';
  return (
    <Component 
      href={href} 
      target={target} 
      className={`px-6 py-3 border border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-accent)] hover:text-black hover:border-[var(--color-accent)] font-mono text-sm uppercase tracking-widest transition-colors ${className}`}
    >
      {children}
    </Component>
  );
};

export default function Home() {
  const words = ["AGENCY WEBSITES", "BUSINESS PLATFORMS", "SAAS APPLICATIONS", "E-COMMERCE STORES", "WEB EXPERIENCES"];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const fullWord = words[currentWordIndex];
      
      if (!isDeleting) {
        setCurrentText(fullWord.substring(0, currentText.length + 1));
        if (currentText.length === fullWord.length) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        setCurrentText(fullWord.substring(0, currentText.length - 1));
        if (currentText.length === 0) {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, isDeleting ? 30 : 80);

    return () => clearTimeout(timeoutId);
  }, [currentText, isDeleting, currentWordIndex]);

  return (
    <div id="home" className="w-full pb-16 font-mono selection:bg-[var(--color-accent)] selection:text-white relative z-10 pt-20">
      
      {/* 1. INTERACTIVE HERO */}
      <section className="min-h-screen flex flex-col justify-center px-6 md:px-12 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row items-center gap-12 mt-16"
        >
          
          <div className="w-full md:w-3/5">
            <div className="mb-8 text-[var(--color-accent)] text-sm flex items-center gap-2">
              <Terminal size={16} />
              <span>SHAURYA.DEV // SYSTEM_ONLINE</span>
            </div>

            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-white min-h-[120px]"
            >
              ENGINEERING WORLD-CLASS <span className="text-[var(--color-accent)]">{currentText}</span><span className="text-[var(--color-accent)] animate-blink">_</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-lg md:text-xl text-[var(--color-text-secondary)] max-w-2xl leading-relaxed mb-8"
            >
              I partner with forward-thinking founders to design and build premium software that converts, scales, and stands out.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex flex-wrap items-center gap-4"
            >
              <TerminalButton href="#pricing" className="bg-[var(--color-accent)] text-white border-[var(--color-accent)] hover:bg-transparent hover:text-[var(--color-accent)] flex items-center gap-2">
                VIEW PRICING <ArrowRight size={16} />
              </TerminalButton>
              <TerminalButton href="#work">
                SHOWCASE
              </TerminalButton>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="w-full md:w-2/5 relative hidden md:block"
          >
            {/* Tech Stack Card */}
            <div className="card-border p-6 shadow-[8px_8px_0_0_var(--color-border)]">
              <div className="border-b border-[var(--color-border)] pb-2 mb-4 flex justify-between items-center text-xs text-[var(--color-text-secondary)]">
                <span>CORE_STACK</span>
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-red-500/50 rounded-full" />
                  <div className="w-3 h-3 bg-yellow-500/50 rounded-full" />
                  <div className="w-3 h-3 bg-[var(--color-accent)] rounded-full" />
                </div>
              </div>
              <div className="space-y-2 text-sm text-[var(--color-text-secondary)]">
                <p><span className="text-[var(--color-accent)]">&gt;</span> loading dependencies...</p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {['React', 'Next.js', 'TypeScript', 'Tailwind', 'Node.js', 'Vercel', 'PostgreSQL', 'Framer Motion'].map(tech => (
                    <span key={tech} className="px-2 py-1 bg-[var(--color-bg-subtle)] border border-[var(--color-border)] text-[var(--color-text-primary)]">
                      {tech}
                    </span>
                  ))}
                </div>
                <p className="pt-4 text-emerald-400">&gt; STATUS: ONLINE (99.99% UPTIME)</p>
              </div>
            </div>
          </motion.div>

        </motion.div>
      </section>

      {/* 2. TRUST SECTION */}
      <section className="py-16 border-y border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold mb-1 text-[var(--color-accent)]">Lightning Fast</h3>
            <p className="text-[var(--color-text-secondary)] text-xs uppercase tracking-widest">Speed Optimized</p>
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold mb-1 text-[var(--color-accent)]">Fully Responsive</h3>
            <p className="text-[var(--color-text-secondary)] text-xs uppercase tracking-widest">Mobile & Desktop Ready</p>
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold mb-1 text-[var(--color-accent)]">SEO Friendly</h3>
            <p className="text-[var(--color-text-secondary)] text-xs uppercase tracking-widest">Rank Higher on Google</p>
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold mb-1 text-[var(--color-accent)]">Custom Built</h3>
            <p className="text-[var(--color-text-secondary)] text-xs uppercase tracking-widest">Tailored to Your Brand</p>
          </div>
        </div>
      </section>

      {/* 3. PROJECT SHOWCASE */}
      <section id="work" className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="mb-12 border-b border-[var(--color-border)] pb-4">
          <h2 className="text-3xl font-bold text-white mb-2">PAST WORKS</h2>
          <p className="text-sm text-[var(--color-text-secondary)] uppercase">
            A few of my recent projects.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12">
          {/* Project 1 */}
          <div className="card-border flex flex-col md:flex-row shadow-[8px_8px_0_0_var(--color-border)] hover:shadow-[8px_8px_0_0_var(--color-accent)] transition-shadow">
            <div className="p-8 md:w-1/2 flex flex-col justify-center">
              <span className="text-[var(--color-accent)] text-xs tracking-widest uppercase mb-2 block">Creative Agency</span>
              <h3 className="text-2xl font-bold mb-4 text-white">Editify Studios</h3>
              <p className="text-[var(--color-text-secondary)] leading-relaxed text-sm mb-6">
                A high-performance portfolio and lead generation platform for a creative studio. Optimized for insane conversion rates and cinematic video delivery.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {['Next.js', 'Framer Motion', 'Tailwind CSS'].map(tech => (
                  <span key={tech} className="px-2 py-1 text-xs border border-[var(--color-border)] text-[var(--color-text-primary)]">
                    {tech}
                  </span>
                ))}
              </div>
              <TerminalButton href="https://editify-studios.vercel.app" target="_blank">
                VIEW PROJECT
              </TerminalButton>
            </div>
            <div className="md:w-1/2 h-[200px] md:h-auto bg-[#050505] border-l border-[var(--color-border)] flex items-center justify-center p-4">
              <div className="w-full h-full border border-[var(--color-border)] border-dashed flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[var(--color-accent-glow)] opacity-20" />
                <span className="text-[var(--color-accent)] font-bold text-xl uppercase tracking-widest relative z-10">EDITIFY_STUDIOS</span>
              </div>
            </div>
          </div>

          {/* Project 2 */}
          <div className="card-border flex flex-col md:flex-row-reverse shadow-[8px_8px_0_0_var(--color-border)] hover:shadow-[8px_8px_0_0_var(--color-accent)] transition-shadow">
            <div className="p-8 md:w-1/2 flex flex-col justify-center">
              <span className="text-[var(--color-accent)] text-xs tracking-widest uppercase mb-2 block">Web Platform</span>
              <h3 className="text-2xl font-bold mb-4 text-white">Thumbpilot</h3>
              <p className="text-[var(--color-text-secondary)] leading-relaxed text-sm mb-6">
                A robust platform built on Edge architecture (Cloudflare Workers) ensuring blazing fast global delivery and highly scalable API routes.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {['React', 'Cloudflare Workers', 'TypeScript'].map(tech => (
                  <span key={tech} className="px-2 py-1 text-xs border border-[var(--color-border)] text-[var(--color-text-primary)]">
                    {tech}
                  </span>
                ))}
              </div>
              <TerminalButton href="https://thumbpilot.sigmashaurya2.workers.dev" target="_blank">
                VIEW PROJECT
              </TerminalButton>
            </div>
            <div className="md:w-1/2 h-[200px] md:h-auto bg-[#050505] border-r border-[var(--color-border)] flex items-center justify-center p-4">
              <div className="w-full h-full border border-[var(--color-border)] border-dashed flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[var(--color-accent-glow)] opacity-20" />
                <span className="text-[var(--color-accent)] font-bold text-xl uppercase tracking-widest relative z-10">THUMBPILOT</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SERVICES & PROCESS */}
      <section id="services" className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="card-border p-8">
            <h2 className="text-xl font-bold mb-8 text-[var(--color-accent)] border-b border-[var(--color-border)] pb-2">Core Services</h2>
            <div className="space-y-6">
              {[
                { icon: <Code2 size={20}/>, title: 'Full-Stack Dev', desc: 'Modern, scalable architectures (React, Node, Postgres).' },
                { icon: <Layers size={20}/>, title: 'UI/UX Engineering', desc: 'Translating designs into pixel-perfect frontend experiences.' },
                { icon: <Cpu size={20}/>, title: 'Optimization', desc: 'Achieving instant load times and perfect Core Web Vitals.' }
              ].map((service, i) => (
                <div key={i} className="flex gap-4">
                  <div className="text-[var(--color-accent)] mt-1">{service.icon}</div>
                  <div>
                    <h4 className="text-base font-bold mb-1 text-white">{service.title}</h4>
                    <p className="text-[var(--color-text-secondary)] text-sm">{service.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="card-border p-8">
            <h2 className="text-xl font-bold mb-8 text-[var(--color-accent)] border-b border-[var(--color-border)] pb-2">Execution Pipeline</h2>
            <div className="space-y-6">
              {[
                'Discovery & Planning',
                'Design & Wireframing',
                'Building & Development',
                'Testing & Refinement',
                'Launch & Support'
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="text-[var(--color-accent)] font-bold text-sm">0{i + 1}</div>
                  <p className="text-[var(--color-text-primary)] text-sm">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4.5 PRICING */}
      <section id="pricing" className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="mb-12 border-b border-[var(--color-border)] pb-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-2">PRICING TIERS</h2>
          <p className="text-sm text-[var(--color-text-secondary)] uppercase">
            Clear pricing for high-quality websites.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Tier 1 */}
          <div className="card-border p-6 flex flex-col">
            <h3 className="text-sm font-bold text-[var(--color-text-secondary)] mb-2 uppercase border-b border-[var(--color-border)] pb-2">Starter</h3>
            <div className="mb-6 mt-4">
              <span className="text-3xl font-bold text-white">$80</span>
            </div>
            <ul className="space-y-3 mb-8 flex-grow">
              {['Functional website', '1-3 Pages', '2 Revisions', 'Content upload', 'Basic Speed opt', 'Social icons'].map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-gray-300">
                  <span className="text-[var(--color-accent)]">•</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <TerminalButton href="mailto:shaurya.studios.dev@gmail.com" className="w-full text-center">
              SELECT PLAN
            </TerminalButton>
          </div>

          {/* Tier 2 */}
          <div className="card-border p-6 flex flex-col border-[var(--color-accent)] shadow-[0_0_15px_var(--color-accent-glow)] relative mt-[-10px] mb-[-10px] bg-[var(--color-bg-elevated)] z-10">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--color-accent)] text-white text-[10px] font-bold uppercase tracking-widest py-1 px-3">
              RECOMMENDED
            </div>
            <h3 className="text-sm font-bold text-[var(--color-accent)] mb-2 uppercase border-b border-[var(--color-border)] pb-2">Professional</h3>
            <div className="mb-6 mt-4">
              <span className="text-3xl font-bold text-white">$140</span>
            </div>
            <ul className="space-y-3 mb-8 flex-grow">
              {['Functional website', 'Up to 5 Pages', '5 Revisions', 'Content upload', 'Plugins setup', 'Opt-in form', 'Speed opt', 'Hosting setup', 'Social icons'].map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-gray-300">
                  <span className="text-[var(--color-accent)]">•</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <TerminalButton href="mailto:shaurya.studios.dev@gmail.com" className="w-full text-center bg-[var(--color-accent)] text-white hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-accent)]">
              SELECT PLAN
            </TerminalButton>
          </div>

          {/* Tier 3 */}
          <div className="card-border p-6 flex flex-col">
            <h3 className="text-sm font-bold text-[var(--color-text-secondary)] mb-2 uppercase border-b border-[var(--color-border)] pb-2">E-Commerce</h3>
            <div className="mb-6 mt-4">
              <span className="text-3xl font-bold text-white">$300</span>
            </div>
            <ul className="space-y-3 mb-8 flex-grow">
              {['Functional website', 'Up to 10 Pages', 'Unltd Revisions', 'E-commerce func', 'Up to 50 Products', 'Payment Config', 'Autoresponder', 'Speed opt', 'Hosting setup'].map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-gray-300">
                  <span className="text-[var(--color-accent)]">•</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <TerminalButton href="mailto:shaurya.studios.dev@gmail.com" className="w-full text-center">
              SELECT PLAN
            </TerminalButton>
          </div>

          {/* Tier 4 */}
          <div className="card-border p-6 flex flex-col bg-[#050505]">
            <h3 className="text-sm font-bold text-[var(--color-text-secondary)] mb-2 uppercase border-b border-[var(--color-border)] pb-2">Bespoke</h3>
            <div className="mb-6 mt-4">
              <span className="text-2xl font-bold text-white">LET'S TALK</span>
            </div>
            <ul className="space-y-3 mb-8 flex-grow">
              {['Your Unique Vision', 'Complex Integrations', 'AI/LLM Capabilities', 'Bespoke Animations', 'Custom Architecture', 'Dedicated Support'].map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-gray-300">
                  <span className="text-[var(--color-accent)]">•</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <TerminalButton href="mailto:shaurya.studios.dev@gmail.com" className="w-full text-center">
              CONTACT
            </TerminalButton>
          </div>

        </div>
      </section>

      {/* 5. TESTIMONIALS */}
      <section className="py-20 px-6 md:px-12 max-w-4xl mx-auto">
        <h2 className="text-xl font-bold mb-8 text-[var(--color-accent)] border-b border-[var(--color-border)] pb-2">CLIENT REVIEWS</h2>
        <div className="grid grid-cols-1 gap-6">
          <div className="card-border p-8 border-l-4 border-l-[var(--color-accent)]">
            <div className="flex gap-1 mb-6 text-[var(--color-accent)]">
              {[1,2,3,4,5].map(i => <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>)}
            </div>
            <p className="text-sm leading-relaxed mb-8 text-white">
              "Shaurya is a 10/10 website builder, highly recommended. He offers the best prices in the market."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-black border border-[var(--color-border)] flex items-center justify-center p-1.5 grayscale">
                <img src="/editify-logo.png" alt="Editify Studios" loading="lazy" className="w-full h-full object-contain" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[var(--color-accent)]">Founder</h4>
                <p className="text-xs text-[var(--color-text-secondary)] uppercase">Editify Studios</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CONTACT */}
      <section id="contact" className="py-20 px-6 md:px-12 max-w-4xl mx-auto text-center border-t border-[var(--color-border)] mt-10">
        <h2 className="text-3xl font-bold mb-4 text-white">Ready to Build?</h2>
        <p className="text-sm text-[var(--color-text-secondary)] mb-8 max-w-2xl mx-auto uppercase">
          Let's discuss your product goals and how a custom website can help your business grow.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <TerminalButton href="mailto:shaurya.studios.dev@gmail.com" className="w-full sm:w-auto text-center">
            shaurya.studios.dev@gmail.com
          </TerminalButton>
          <div className="flex gap-4">
            <TerminalButton href="https://discord.com/users/1338926430679076925" target="_blank">
              DISCORD
            </TerminalButton>
            <TerminalButton href="https://www.fiverr.com/s/6Yl5a2r" target="_blank">
              FIVERR
            </TerminalButton>
          </div>
        </div>
      </section>

    </div>
  );
}
