import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Home() {
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
  };

  return (
    <div className="w-full overflow-hidden">
      {/* Massive Clean Hero */}
      <section className="w-full px-6 md:px-12 pt-40 pb-24 md:pt-48 md:pb-32">
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-[95vw]"
        >
          <motion.h1 variants={fadeUp} className="text-huge text-[var(--text-primary)] m-0 p-0 block">
            SHAURYA
          </motion.h1>
          <motion.h1 variants={fadeUp} className="text-huge text-[var(--text-secondary)] m-0 p-0 block -mt-2 md:-mt-6">
            STUDIOS
          </motion.h1>
          <motion.p variants={fadeUp} className="text-xl md:text-3xl font-medium tracking-tight max-w-3xl text-[var(--text-secondary)] leading-relaxed mt-8 md:mt-12">
            Building the largest onchain communities and driving the consumer web revolution through elite digital craft.
          </motion.p>
        </motion.div>
      </section>

      {/* Structured Kinetic Marquee */}
      <section className="py-12 md:py-20 border-y border-[var(--border-color)] bg-[var(--glass-bg)] backdrop-blur-md w-full">
        <div className="animate-marquee">
          <h2 className="text-4xl md:text-7xl font-black tracking-tighter uppercase px-4 flex items-center text-[var(--text-primary)] whitespace-nowrap">
            Digital Craft <span className="text-[var(--accent-cyan)] mx-8">✦</span> Consumer Crypto <span className="text-[var(--accent-cyan)] mx-8">✦</span> Web Development <span className="text-[var(--accent-cyan)] mx-8">✦</span> Digital Craft <span className="text-[var(--accent-cyan)] mx-8">✦</span> Consumer Crypto <span className="text-[var(--accent-cyan)] mx-8">✦</span> Web Development <span className="text-[var(--accent-cyan)] mx-8">✦</span>
          </h2>
        </div>
      </section>

      {/* Clean Grid Layout Projects */}
      <section className="w-full px-6 md:px-12 py-24 md:py-32">
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
              <div className="absolute bottom-8 left-8 z-20">
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
              <div className="absolute bottom-8 left-8 z-20">
                <h2 className="text-4xl md:text-6xl font-black text-white mix-blend-difference uppercase translate-y-4 group-hover:translate-y-0 transition-transform duration-700 ease-[0.16,1,0.3,1]">
                  Production
                </h2>
              </div>
            </Link>
          </motion.div>

        </div>
      </section>

      {/* Massive Call to Action */}
      <section className="py-32 px-6 relative z-20 overflow-hidden text-center">
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
