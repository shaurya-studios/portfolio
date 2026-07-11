import { Link } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } 
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 }
  }
};

export default function Home() {
  return (
    <div className="w-full">
      
      {/* Igloo Style Hero Section */}
      <section className="w-full px-6 md:px-12 pt-24 md:pt-40 pb-32">
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-[95vw] mx-auto"
        >
          <div className="mask-wrapper">
            <motion.h1 variants={fadeInUp} className="text-display-lg text-[var(--color-brand-dark)]">
              SHAURYA
            </motion.h1>
          </div>
          <div className="mask-wrapper -mt-2 md:-mt-6">
            <motion.h1 variants={fadeInUp} className="text-display-lg text-slate-400">
              STUDIOS
            </motion.h1>
          </div>
          <div className="mask-wrapper mt-8 md:mt-16">
            <motion.p variants={fadeInUp} className="text-xl md:text-3xl font-medium tracking-tight max-w-3xl text-slate-600 leading-relaxed">
              Building the largest onchain communities and driving the consumer web revolution through elite digital craft and cinematic video production.
            </motion.p>
          </div>
        </motion.div>
      </section>

      {/* Selected Works Grid */}
      <section className="w-full px-6 md:px-12 py-32 bg-white/50 backdrop-blur-md border-t border-slate-200">
        <div className="max-w-[95vw] mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="mb-16"
          >
            <h2 className="text-display-md text-[var(--color-brand-dark)]">Selected Works</h2>
            <p className="text-lg text-slate-500 font-medium tracking-wide uppercase mt-4">01 // Disciplines</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link to="/dev" className="group block glass-panel overflow-hidden relative h-[500px] md:h-[700px] hover:shadow-2xl transition-all duration-700 rounded-2xl">
                <div className="absolute inset-0 bg-slate-100 group-hover:scale-105 transition-transform duration-[1.5s] ease-[0.16,1,0.3,1] z-0">
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-cyan-50" />
                </div>
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500 z-10" />
                
                <div className="absolute top-8 left-8 z-20">
                  <span className="glass-pill px-6 py-2 text-sm font-bold uppercase tracking-widest text-[var(--color-brand-dark)] shadow-sm">
                    Web Platform
                  </span>
                </div>
                <div className="absolute bottom-8 left-8 z-20">
                  <h3 className="text-4xl md:text-5xl font-black text-[var(--color-brand-dark)] uppercase translate-y-4 group-hover:translate-y-0 transition-transform duration-700 ease-[0.16,1,0.3,1]">
                    Development
                  </h3>
                </div>
              </Link>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            >
              <Link to="/video" className="group block glass-panel overflow-hidden relative h-[500px] md:h-[700px] md:mt-24 hover:shadow-2xl transition-all duration-700 rounded-2xl">
                <div className="absolute inset-0 bg-slate-100 group-hover:scale-105 transition-transform duration-[1.5s] ease-[0.16,1,0.3,1] z-0">
                  <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-100" />
                </div>
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500 z-10" />
                
                <div className="absolute top-8 left-8 z-20">
                  <span className="glass-pill px-6 py-2 text-sm font-bold uppercase tracking-widest text-[var(--color-brand-dark)] shadow-sm">
                    Cinematic
                  </span>
                </div>
                <div className="absolute bottom-8 left-8 z-20">
                  <h3 className="text-4xl md:text-5xl font-black text-[var(--color-brand-dark)] uppercase translate-y-4 group-hover:translate-y-0 transition-transform duration-700 ease-[0.16,1,0.3,1]">
                    Production
                  </h3>
                </div>
              </Link>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Heavy CTA Footer */}
      <section className="py-32 px-6 md:px-12 bg-[var(--color-brand-dark)] text-white relative z-20">
        <motion.div 
          initial={{ opacity: 0 }} 
          whileInView={{ opacity: 1 }} 
          transition={{ duration: 1.5 }} 
          viewport={{ once: true }}
          className="max-w-[95vw] mx-auto flex flex-col items-center text-center"
        >
          <h2 className="text-display-md mb-8">
            Ready to <span className="text-[var(--color-brand-accent)]">Build?</span>
          </h2>
          <a 
            href="mailto:shaurya.studios.dev@gmail.com" 
            className="inline-block bg-white text-[var(--color-brand-dark)] px-12 py-6 font-black uppercase tracking-[0.2em] hover:bg-[var(--color-brand-accent)] hover:text-white transition-colors duration-500 rounded-full"
          >
            Start a project
          </a>
        </motion.div>
      </section>

    </div>
  );
}
