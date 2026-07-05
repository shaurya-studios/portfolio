import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Code, Video, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="relative min-h-screen pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col gap-32">
      
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center gap-8 min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <p className="font-mono text-sm uppercase tracking-[0.35em] text-secondary mb-6">Shaurya Agarwal · Portfolio · 2026</p>
          <h1 className="heading-jumbo mb-6">
            Step inside the <span className="text-gradient">studio.</span>
          </h1>
          <p className="subtitle max-w-2xl mx-auto">
            Pick a door — Development or Video Editing. 
            <br className="hidden md:block"/>
            Move your cursor to look around.
          </p>
        </motion.div>

        {/* The Doors */}
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 mt-10">
          <Link to="/dev" className="group">
            <motion.div 
              whileHover={{ scale: 1.05, y: -10 }}
              whileTap={{ scale: 0.95 }}
              className="glass rounded-2xl p-10 flex flex-col items-center justify-center gap-4 w-64 h-64 border border-cyan-400/20 hover:border-cyan-400/60 hover:bg-cyan-400/5 transition-colors"
            >
              <Code size={48} className="text-cyan-400 opacity-80 group-hover:opacity-100 transition-opacity" />
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-secondary">01</span>
              <span className="text-xl font-extrabold tracking-tight">Development</span>
            </motion.div>
          </Link>

          <Link to="/video" className="group">
            <motion.div 
              whileHover={{ scale: 1.05, y: -10 }}
              whileTap={{ scale: 0.95 }}
              className="glass rounded-2xl p-10 flex flex-col items-center justify-center gap-4 w-64 h-64 border border-orange-400/20 hover:border-orange-400/60 hover:bg-orange-400/5 transition-colors"
            >
              <Video size={48} className="text-orange-400 opacity-80 group-hover:opacity-100 transition-opacity" />
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-secondary">02</span>
              <span className="text-xl font-extrabold tracking-tight">Video Editing</span>
            </motion.div>
          </Link>
        </div>
      </section>

      {/* Editify Synergy Section */}
      <section className="py-20 relative">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="glass rounded-3xl p-10 md:p-16 border border-[var(--accent-cyan)] border-opacity-30 relative overflow-hidden"
        >
          {/* Decorative glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--accent-cyan)] opacity-10 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="max-w-3xl relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              The Complete Package: <span className="text-gradient">Editify Studios</span>
            </h2>
            <p className="text-lg text-secondary leading-relaxed mb-10">
              Why hire a web developer and a video editor separately? For Editify Studios, I delivered the ultimate synergy. 
              I built their custom, high-performance web platform from the ground up, <em>and</em> I actively edit their high-retention YouTube and gaming content. 
              Seamless integration, one point of contact.
            </p>
            
            <div className="flex gap-4">
              <a href="mailto:shaurya.studios.dev@gmail.com" className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition-colors">
                Let's achieve this for you <ArrowRight size={18} />
              </a>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
