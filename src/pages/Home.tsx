import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useVelocity, useSpring } from 'framer-motion';

export default function Home() {
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });
  
  // Parallax effects
  const heroY = useTransform(scrollY, [0, 1000], [0, 300]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);

  // Skew effect for the marquee based on scroll speed
  const skewVelocity = useTransform(smoothVelocity, [-1000, 1000], [-5, 5]);
  const skewVelocityStr = useTransform(skewVelocity, (v) => `${v}deg`);
  
  const x1 = useTransform(scrollY, [0, 1000], [0, -300]);

  return (
    <div className="min-h-screen flex flex-col pt-32 pb-24 relative z-10">
      
      {/* Massive Clean Hero */}
      <motion.section 
        style={{ y: heroY, opacity: heroOpacity }}
        className="flex flex-col justify-center px-6 md:px-12 pb-32 min-h-[70vh] w-full"
      >
        <div className="max-w-[95vw] pointer-events-none">
          <div className="mask-container overflow-hidden pb-2">
            <motion.h1 
              initial={{ y: '100%' }} animate={{ y: '0%' }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
              className="text-huge text-[var(--text-primary)]"
            >
              SHAURYA
            </motion.h1>
          </div>
          <div className="mask-container overflow-hidden pb-4">
            <motion.h1 
              initial={{ y: '100%' }} animate={{ y: '0%' }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
              className="text-huge text-[var(--text-secondary)]"
            >
              STUDIOS
            </motion.h1>
          </div>
          <div className="mask-container overflow-hidden mt-8 md:mt-12 pointer-events-auto">
            <motion.p 
              initial={{ y: '100%' }} animate={{ y: '0%' }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.7 }}
              className="text-xl md:text-3xl font-medium tracking-tight max-w-3xl text-[var(--text-secondary)] leading-relaxed"
            >
              Building the largest onchain communities and driving the consumer web revolution through elite digital craft.
            </motion.p>
          </div>
        </div>
      </motion.section>

      {/* Structured Kinetic Marquee */}
      <section className="py-16 md:py-24 border-y border-[var(--border-color)] bg-[var(--glass-bg)] backdrop-blur-md overflow-hidden relative z-20">
        <motion.div style={{ skewY: skewVelocityStr }} className="relative flex flex-col">
          <motion.div style={{ x: x1 }} className="flex whitespace-nowrap">
            <h2 className="text-4xl md:text-7xl font-black tracking-tighter uppercase px-4 flex items-center text-[var(--text-primary)]">
              Digital Craft <span className="text-[var(--accent-cyan)] mx-8">✦</span> Consumer Crypto <span className="text-[var(--accent-cyan)] mx-8">✦</span> Web Development <span className="text-[var(--accent-cyan)] mx-8">✦</span> Digital Craft
            </h2>
          </motion.div>
        </motion.div>
      </section>

      {/* Clean Grid Layout Projects */}
      <section className="w-full px-6 md:px-12 py-32 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-screen-2xl mx-auto">
          
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link to="/dev" className="group block glass-panel overflow-hidden relative h-[400px] md:h-[600px] hover:shadow-2xl transition-shadow duration-700">
              <div className="absolute inset-0 z-0 p-4">
                <img 
                  src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" 
                  alt="Development" 
                  className="w-full h-full object-cover rounded-2xl scale-110 group-hover:scale-100 transition-transform duration-[1.5s] ease-[0.16,1,0.3,1]"
                />
              </div>
              <div className="absolute inset-0 bg-white/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
              
              <div className="absolute top-8 left-8 z-20">
                <span className="glass-pill px-6 py-2 text-sm font-bold uppercase tracking-widest text-[var(--text-primary)] shadow-sm">
                  01 // Web Platform
                </span>
              </div>
              <div className="absolute bottom-8 left-8 z-20 mask-container">
                <h2 className="text-4xl md:text-6xl font-black text-white mix-blend-difference uppercase translate-y-4 group-hover:translate-y-0 transition-transform duration-700 ease-[0.16,1,0.3,1]">
                  Development
                </h2>
              </div>
            </Link>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            <Link to="/video" className="group block glass-panel overflow-hidden relative h-[400px] md:h-[600px] hover:shadow-2xl transition-shadow duration-700 md:mt-24">
              <div className="absolute inset-0 z-0 p-4">
                <img 
                  src="https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=2400&auto=format&fit=crop" 
                  alt="Video Editing" 
                  className="w-full h-full object-cover rounded-2xl scale-110 group-hover:scale-100 transition-transform duration-[1.5s] ease-[0.16,1,0.3,1]"
                />
              </div>
              <div className="absolute inset-0 bg-white/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
              
              <div className="absolute top-8 left-8 z-20">
                <span className="glass-pill px-6 py-2 text-sm font-bold uppercase tracking-widest text-[var(--text-primary)] shadow-sm">
                  02 // Cinematic
                </span>
              </div>
              <div className="absolute bottom-8 left-8 z-20 mask-container">
                <h2 className="text-4xl md:text-6xl font-black text-white mix-blend-difference uppercase translate-y-4 group-hover:translate-y-0 transition-transform duration-700 ease-[0.16,1,0.3,1]">
                  Production
                </h2>
              </div>
            </Link>
          </motion.div>

        </div>
      </section>

      {/* Massive Call to Action */}
      <section className="py-40 px-6 relative z-20 overflow-hidden text-center">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} 
          whileInView={{ scale: 1, opacity: 1 }} 
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }} 
          viewport={{ once: true }}
          className="max-w-5xl mx-auto glass-panel p-12 md:p-24 shadow-2xl"
        >
          <h2 className="text-[clamp(2.5rem,6vw,5rem)] font-black mb-8 tracking-tighter uppercase leading-[0.9] text-[var(--text-primary)]">
            Ready to <span className="text-[var(--accent-cyan)]">Build?</span>
          </h2>
          <p className="text-xl md:text-2xl text-[var(--text-secondary)] font-medium leading-relaxed mb-12 max-w-2xl mx-auto">
            Take this bespoke template and customize it to launch your brand into the consumer crypto revolution.
          </p>
          <a 
            href="mailto:shaurya.studios.dev@gmail.com" 
            className="inline-block bg-[var(--text-primary)] text-[var(--bg-primary)] px-10 py-5 font-bold uppercase tracking-[0.2em] hover:bg-[var(--accent-cyan)] transition-colors duration-500 rounded-full shadow-lg"
          >
            Start customizing
          </a>
        </motion.div>
      </section>
    </div>
  );
}
