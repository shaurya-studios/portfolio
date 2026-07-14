import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Code2, Layers, Cpu } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

// Apple-style Magnetic Button Component (Rounded, soft shadow)
const MagneticButton = ({ children, className = '', href, target }: { children: React.ReactNode, className?: string, href?: string, target?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 200, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    // Subtle movement for high performance
    x.set(middleX * 0.15);
    y.set(middleY * 0.15);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const Component = href ? 'a' : 'button';

  const isWhiteBg = className.includes('bg-white');
  const textClass = isWhiteBg ? 'text-black' : 'text-white';
  const borderClass = isWhiteBg ? '' : 'border border-white/10';
  const hoverClass = isWhiteBg ? '' : 'hover:bg-white/10';

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
        target={target} 
        className={`px-8 py-3.5 rounded-full backdrop-blur-md text-xs uppercase tracking-widest font-semibold transition-all duration-300 shadow-[0_8px_16px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.5)] block ${textClass} ${borderClass} ${hoverClass} ${className}`}
      >
        {children}
      </Component>
    </motion.div>
  );
};

// Apple-style Glassmorphic Tilt Card Component
const TiltCard = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 400, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 400, damping: 30 });

  // Very subtle rotation for premium Apple feel (max 4 degrees)
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["4deg", "-4deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-4deg", "4deg"]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={`rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-xl p-8 shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.6)] transition-shadow duration-500 ${className}`}
    >
      <div style={{ transform: "translateZ(20px)" }}>
        {children}
      </div>
    </motion.div>
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
    <div id="home" className="w-full pb-16 font-sans selection:bg-[var(--color-accent)] selection:text-white relative z-10 pt-32 overflow-hidden">
      
      {/* Soft glowing ambient background elements */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[var(--color-accent)]/10 blur-[120px] pointer-events-none -z-10"></div>
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none -z-10"></div>

      {/* 1. INTERACTIVE 3D HERO */}
      <section className="min-h-[85vh] flex flex-col justify-center px-6 md:px-12 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col md:flex-row items-center gap-12"
        >
          
          <div className="w-full md:w-3/5" style={{ perspective: 1000 }}>
            <motion.div className="mb-8 text-[var(--color-accent)] text-xs font-semibold tracking-widest flex items-center gap-3 uppercase"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-2 h-2 rounded-full bg-[var(--color-accent)] shadow-[0_0_10px_var(--color-accent-glow)] animate-pulse" />
              <span>SHAURYA.DEV // SYSTEM_ONLINE</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-500 min-h-[140px] tracking-tight"
            >
              ENGINEERING <br/>WORLD-CLASS <br/><span className="text-[var(--color-accent)] drop-shadow-[0_0_15px_rgba(176,38,255,0.3)]">{currentText}</span><span className="text-[var(--color-accent)] animate-blink">_</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-lg md:text-xl text-gray-400 max-w-2xl leading-relaxed mb-10 font-medium"
            >
              I partner with forward-thinking founders to design and build premium software that converts, scales, and stands out. 
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="flex flex-wrap items-center gap-6"
            >
              <MagneticButton href="#pricing" className="bg-white !text-black hover:bg-gray-200 border-none shadow-[0_10px_30px_rgba(255,255,255,0.2)]">
                VIEW PRICING
              </MagneticButton>
              <MagneticButton href="#work">
                SHOWCASE
              </MagneticButton>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="w-full md:w-2/5 relative hidden md:block perspective-[1000px]"
          >
            <TiltCard>
              <div className="border-b border-white/10 pb-4 mb-6 flex justify-between items-center text-xs text-gray-400 font-medium tracking-wide">
                <span>CORE_STACK</span>
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-red-500/80 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                  <div className="w-3 h-3 bg-yellow-500/80 rounded-full shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
                  <div className="w-3 h-3 bg-green-500/80 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                </div>
              </div>
              <div className="space-y-4 text-sm text-gray-300 font-mono">
                <p><span className="text-[var(--color-accent)]">❯</span> loading dependencies...</p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {['React', 'Next.js', 'TypeScript', 'Tailwind', 'Node.js', 'Vercel', 'Postgres', 'Framer'].map(tech => (
                    <span key={tech} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white backdrop-blur-md">
                      {tech}
                    </span>
                  ))}
                </div>
                <p className="pt-4 text-emerald-400 font-medium">❯ STATUS: ONLINE (99.99% UPTIME)</p>
              </div>
            </TiltCard>
          </motion.div>

        </motion.div>
      </section>

      {/* 2. 3D PROJECT SHOWCASE */}
      <section id="work" className="py-32 px-6 md:px-12 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 border-b border-white/10 pb-8"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-3 tracking-tight">PAST WORKS</h2>
          <p className="text-sm text-[var(--color-accent)] font-semibold uppercase tracking-widest">
            ENGINEERED FOR SCALABILITY & SPEED
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-24 perspective-[1200px]">
          {/* Project 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="rounded-3xl flex flex-col md:flex-row overflow-hidden border border-white/10 bg-white/[0.02] backdrop-blur-xl shadow-[0_30px_60px_rgba(0,0,0,0.4)] group"
          >
            <div className="p-12 md:w-1/2 flex flex-col justify-center">
              <span className="text-[var(--color-accent)] text-xs tracking-widest uppercase mb-4 block font-bold">Creative Agency Website</span>
              <h3 className="text-3xl md:text-4xl font-bold mb-6 text-white tracking-tight">Editify Studios</h3>
              <p className="text-gray-400 leading-relaxed text-base mb-10">
                A high-performance portfolio and lead generation platform for a creative studio. Optimized for insane conversion rates, smooth animations, and perfect SEO scores.
              </p>
              <div className="flex flex-wrap gap-3 mb-10">
                {['Next.js', 'Framer Motion', 'Tailwind CSS'].map(tech => (
                  <span key={tech} className="px-3 py-1.5 text-xs font-semibold rounded-full bg-white/10 text-white">
                    {tech}
                  </span>
                ))}
              </div>
              <MagneticButton href="https://editify-studios.vercel.app" target="_blank" className="self-start">
                VIEW LIVE PROJECT
              </MagneticButton>
            </div>
            <div className="md:w-1/2 min-h-[300px] bg-gradient-to-br from-gray-900 to-black border-l border-white/10 flex items-center justify-center p-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-[var(--color-accent)] opacity-0 group-hover:opacity-10 transition-opacity duration-700" />
              <div className="w-full h-full rounded-2xl border border-white/20 bg-white/5 backdrop-blur-md flex items-center justify-center relative group-hover:scale-105 transition-transform duration-700 shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
                <span className="text-white font-extrabold text-2xl uppercase tracking-widest relative z-10">EDITIFY_STUDIOS</span>
              </div>
            </div>
          </motion.div>

          {/* Project 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="rounded-3xl flex flex-col md:flex-row-reverse overflow-hidden border border-white/10 bg-white/[0.02] backdrop-blur-xl shadow-[0_30px_60px_rgba(0,0,0,0.4)] group"
          >
            <div className="p-12 md:w-1/2 flex flex-col justify-center">
              <span className="text-[var(--color-accent)] text-xs tracking-widest uppercase mb-4 block font-bold">AI Web Application</span>
              <h3 className="text-3xl md:text-4xl font-bold mb-6 text-white tracking-tight">Thumbpilot</h3>
              <p className="text-gray-400 leading-relaxed text-base mb-10">
                A robust AI-powered platform built on modern architecture ensuring blazing fast global delivery, highly scalable API routes, and a premium 3D user interface.
              </p>
              <div className="flex flex-wrap gap-3 mb-10">
                {['React', 'Edge Workers', 'TypeScript'].map(tech => (
                  <span key={tech} className="px-3 py-1.5 text-xs font-semibold rounded-full bg-white/10 text-white">
                    {tech}
                  </span>
                ))}
              </div>
              <MagneticButton href="https://thumbpilot.sigmashaurya2.workers.dev" target="_blank" className="self-start">
                VIEW LIVE PROJECT
              </MagneticButton>
            </div>
            <div className="md:w-1/2 min-h-[300px] bg-gradient-to-br from-gray-900 to-black border-r border-white/10 flex items-center justify-center p-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-[var(--color-accent)] opacity-0 group-hover:opacity-10 transition-opacity duration-700" />
              <div className="w-full h-full rounded-2xl border border-white/20 bg-white/5 backdrop-blur-md flex items-center justify-center relative group-hover:scale-105 transition-transform duration-700 shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
                <span className="text-white font-extrabold text-2xl uppercase tracking-widest relative z-10">THUMBPILOT</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. CORE SERVICES */}
      <section id="services" className="py-32 px-6 md:px-12 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-12"
        >
          <TiltCard className="h-full">
            <h2 className="text-3xl font-extrabold mb-10 text-white tracking-tight">Capabilities</h2>
            <div className="space-y-10">
              {[
                { icon: <Code2 size={28}/>, title: 'Full-Stack Architecture', desc: 'Secure, scalable backends paired with lightning-fast frontends.' },
                { icon: <Layers size={28}/>, title: 'UI/UX Engineering', desc: 'Interactive 3D experiences, smooth animations, and magnetic interfaces.' },
                { icon: <Cpu size={28}/>, title: 'Extreme Optimization', desc: 'Perfect Lighthouse scores, instant load times, and top-tier SEO indexing.' }
              ].map((service, i) => (
                <div key={i} className="flex gap-6">
                  <div className="text-[var(--color-accent)] mt-1 drop-shadow-[0_0_15px_var(--color-accent-glow)]">{service.icon}</div>
                  <div>
                    <h4 className="text-xl font-bold mb-2 text-white">{service.title}</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">{service.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </TiltCard>
          
          <TiltCard className="h-full">
            <h2 className="text-3xl font-extrabold mb-10 text-white tracking-tight">Execution Pipeline</h2>
            <div className="space-y-6 mt-4">
              {[
                'Discovery & Architecture Planning',
                'UI/UX Design & 3D Prototyping',
                'Full-Stack Development & API Integration',
                'Performance Tuning & SEO Optimization',
                'Launch, Deployment & Ongoing Support'
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-6 p-5 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                  <div className="text-[var(--color-accent)] font-bold text-xl font-mono opacity-80">0{i + 1}</div>
                  <p className="text-white text-sm font-semibold tracking-wide">{step}</p>
                </div>
              ))}
            </div>
          </TiltCard>
        </motion.div>
      </section>

      {/* 4. AUTHENTIC PRICING */}
      <section id="pricing" className="py-32 px-6 md:px-12 max-w-7xl mx-auto relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 border-b border-white/10 pb-8 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-3 tracking-tight">INVESTMENT</h2>
          <p className="text-sm text-[var(--color-accent)] font-semibold uppercase tracking-widest">
            Transparent Pricing for Premium Quality
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Agency */}
          <motion.div whileHover={{ y: -10 }} className="rounded-3xl p-8 flex flex-col bg-white/[0.02] border border-white/10 backdrop-blur-xl shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.5)] transition-all duration-500">
            <h3 className="text-xl font-bold text-white mb-2 tracking-tight">Agency</h3>
            <p className="text-xs text-gray-400 border-b border-white/10 pb-5 mb-6">High-conversion portfolio & lead gen.</p>
            <div className="mb-8">
              <span className="text-5xl font-extrabold text-white">$70</span>
              <span className="text-xs text-gray-500 block mt-2 font-bold uppercase tracking-widest">Starting Price</span>
            </div>
            <ul className="space-y-4 mb-10 flex-grow">
              {['Custom UI/UX Design', 'Smooth Animations', 'SEO & Speed Opt', 'Contact Forms', '5–14 Days Delivery', '3 Free Revisions'].map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-300 font-medium">
                  <span className="text-[var(--color-accent)] mt-0.5">●</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <MagneticButton href="mailto:shaurya.studios.dev@gmail.com" className="w-full text-center">
              BOOK AGENCY
            </MagneticButton>
          </motion.div>

          {/* Business */}
          <motion.div whileHover={{ y: -10 }} className="rounded-3xl p-8 flex flex-col bg-white/[0.05] border border-[var(--color-accent)]/50 backdrop-blur-xl shadow-[0_20px_50px_rgba(176,38,255,0.15)] hover:shadow-[0_30px_70px_rgba(176,38,255,0.25)] transition-all duration-500 relative lg:-mt-4 lg:mb-4">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[var(--color-accent)] text-white text-xs font-bold uppercase tracking-widest py-1.5 px-5 rounded-full shadow-[0_10px_20px_rgba(176,38,255,0.4)]">
              MOST POPULAR
            </div>
            <h3 className="text-xl font-bold text-white mb-2 tracking-tight mt-2">Business</h3>
            <p className="text-xs text-gray-400 border-b border-white/10 pb-5 mb-6">Advanced functionality for companies.</p>
            <div className="mb-8">
              <span className="text-5xl font-extrabold text-white">$80</span>
              <span className="text-xs text-gray-500 block mt-2 font-bold uppercase tracking-widest">Starting Price</span>
            </div>
            <ul className="space-y-4 mb-10 flex-grow">
              {['Everything in Agency', 'Booking Systems', 'Google Maps / Local SEO', 'Testimonials & FAQs', '7–14 Days Delivery', '3 Free Revisions'].map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-white font-semibold">
                  <span className="text-[var(--color-accent)] mt-0.5">●</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <MagneticButton href="mailto:shaurya.studios.dev@gmail.com" className="w-full text-center bg-white !text-black font-bold border-none">
              BOOK BUSINESS
            </MagneticButton>
          </motion.div>

          {/* E-Commerce */}
          <motion.div whileHover={{ y: -10 }} className="rounded-3xl p-8 flex flex-col bg-white/[0.02] border border-white/10 backdrop-blur-xl shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.5)] transition-all duration-500">
            <h3 className="text-xl font-bold text-white mb-2 tracking-tight">E-Commerce</h3>
            <p className="text-xs text-gray-400 border-b border-white/10 pb-5 mb-6">Fully functional online stores.</p>
            <div className="mb-8">
              <span className="text-5xl font-extrabold text-white">$250</span>
              <span className="text-xs text-gray-500 block mt-2 font-bold uppercase tracking-widest">Starting Price</span>
            </div>
            <ul className="space-y-4 mb-10 flex-grow">
              {['Custom Product Pages', 'Secure Cart & Checkout', 'Stripe/PayPal Gateways', 'Inventory Management', '2–4 Weeks Delivery', 'Full SEO Optimization'].map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-300 font-medium">
                  <span className="text-[var(--color-accent)] mt-0.5">●</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <MagneticButton href="mailto:shaurya.studios.dev@gmail.com" className="w-full text-center">
              BOOK E-COM
            </MagneticButton>
          </motion.div>

          {/* SaaS */}
          <motion.div whileHover={{ y: -10 }} className="rounded-3xl p-8 flex flex-col bg-white/[0.02] border border-white/10 backdrop-blur-xl shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.5)] transition-all duration-500">
            <h3 className="text-xl font-bold text-white mb-2 tracking-tight">SaaS Apps</h3>
            <p className="text-xs text-gray-400 border-b border-white/10 pb-5 mb-6">Complex software architectures.</p>
            <div className="mb-8">
              <span className="text-5xl font-extrabold text-white">$500</span>
              <span className="text-xs text-gray-500 block mt-2 font-bold uppercase tracking-widest">Starting Price</span>
            </div>
            <ul className="space-y-4 mb-10 flex-grow">
              {['Secure Authentication', 'Database Integration', 'Custom Admin Dashboards', 'API Development', '3–8 Weeks Delivery', 'Scalable Architecture'].map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-300 font-medium">
                  <span className="text-[var(--color-accent)] mt-0.5">●</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <MagneticButton href="mailto:shaurya.studios.dev@gmail.com" className="w-full text-center">
              BOOK SAAS
            </MagneticButton>
          </motion.div>

        </div>
      </section>

      {/* 5. AUTHENTIC TESTIMONIALS */}
      <section className="py-32 px-6 md:px-12 max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <TiltCard className="p-12 relative overflow-hidden">
            <h2 className="text-lg font-bold mb-10 text-[var(--color-accent)] tracking-widest uppercase text-center md:text-left">Client Verification</h2>
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="flex-grow">
                <div className="flex gap-2 mb-8 text-[var(--color-accent)] drop-shadow-[0_0_8px_var(--color-accent-glow)]">
                  {[1,2,3,4,5].map(i => <svg key={i} className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>)}
                </div>
                <p className="text-xl leading-relaxed mb-10 text-white font-medium italic">
                  "Shaurya is a 10/10 website builder, highly recommended. He offers the best prices in the market and delivers exceptional quality."
                </p>
                <div className="flex items-center gap-4">
                  <div>
                    <h4 className="font-bold text-lg text-white">Founder</h4>
                    <p className="text-xs text-[var(--color-accent)] uppercase tracking-widest font-bold mt-1">Editify Studios</p>
                  </div>
                </div>
              </div>
              <div className="w-32 h-32 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center p-6 shadow-[0_15px_30px_rgba(0,0,0,0.4)] flex-shrink-0 backdrop-blur-md">
                <img src="/editify-logo.png" alt="Editify Studios" loading="lazy" className="w-full h-full object-contain filter contrast-125 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]" />
              </div>
            </div>
          </TiltCard>
        </motion.div>
      </section>

      {/* 6. CONTACT FOOTER */}
      <section id="contact" className="py-40 px-6 md:px-12 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-block mb-10 px-8 py-4 rounded-3xl bg-white/5 border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.3)] backdrop-blur-md transform -rotate-2 hover:rotate-0 transition-transform duration-500 cursor-pointer">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">INITIATE DEPLOYMENT</h2>
          </div>
          <p className="text-sm text-gray-400 mb-16 max-w-2xl mx-auto uppercase tracking-widest font-semibold leading-relaxed">
            Currently accepting new clients. Let's discuss your product goals and architect a custom solution for your business.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <MagneticButton href="mailto:shaurya.studios.dev@gmail.com" className="w-full sm:w-auto text-center bg-white !text-black hover:bg-gray-200 py-4 px-10 font-bold text-sm shadow-[0_15px_30px_rgba(255,255,255,0.2)] hover:shadow-[0_20px_40px_rgba(255,255,255,0.3)] border-none">
              EMAIL INQUIRY
            </MagneticButton>
            <div className="flex gap-4 w-full sm:w-auto">
              <MagneticButton href="https://discord.com/users/1338926430679076925" target="_blank" className="flex-1 text-center py-4 px-8">
                DISCORD
              </MagneticButton>
              <MagneticButton href="https://www.fiverr.com/s/6Yl5a2r" target="_blank" className="flex-1 text-center py-4 px-8">
                FIVERR
              </MagneticButton>
            </div>
          </div>
        </motion.div>
      </section>

    </div>
  );
}
