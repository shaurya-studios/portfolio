import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col pt-24">
      
      {/* Massive Hero */}
      <section className="flex-1 flex flex-col justify-end p-6 pb-12">
        <div className="max-w-[95vw]">
          <div className="mask-container overflow-hidden">
            <motion.h1 
              initial={{ y: '100%' }} animate={{ y: '0%' }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="text-huge"
            >
              SHAURYA
            </motion.h1>
          </div>
          <div className="mask-container overflow-hidden -mt-4 md:-mt-8">
            <motion.h1 
              initial={{ y: '100%' }} animate={{ y: '0%' }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="text-huge text-[var(--text-secondary)]"
            >
              AGARWAL
            </motion.h1>
          </div>
          <div className="mask-container overflow-hidden mt-6">
            <motion.p 
              initial={{ y: '100%' }} animate={{ y: '0%' }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="text-lg md:text-2xl font-medium tracking-tight max-w-2xl text-[var(--text-secondary)]"
            >
              Digital Craft. Building high-performance web experiences and editing cinematic, high-retention video.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Infinite Marquee using Pure CSS for React 19 safety */}
      <section className="py-8 border-y border-[var(--border-color)] bg-[var(--bg-primary)] overflow-hidden">
        <div className="animate-marquee">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase flex items-center whitespace-nowrap px-4">
            Digital Craft <span className="text-[var(--accent-cyan)] mx-8">✦</span> 
            Video Editing <span className="text-[var(--accent-cyan)] mx-8">✦</span> 
            Web Development <span className="text-[var(--accent-cyan)] mx-8">✦</span>
          </h2>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase flex items-center whitespace-nowrap px-4">
            Digital Craft <span className="text-[var(--accent-cyan)] mx-8">✦</span> 
            Video Editing <span className="text-[var(--accent-cyan)] mx-8">✦</span> 
            Web Development <span className="text-[var(--accent-cyan)] mx-8">✦</span>
          </h2>
        </div>
      </section>

      {/* Massive Full-Width Categories with Image Masking */}
      <section className="flex flex-col w-full bg-[var(--bg-primary)] relative">
        <Link to="/dev" className="group relative w-full border-b border-[var(--border-color)] overflow-hidden h-[30vh] md:h-[40vh] flex items-center">
          {/* Hover Image Mask */}
          <div className="absolute inset-0 z-0 overflow-hidden">
             <div className="absolute inset-0 bg-black/60 z-10 transition-opacity duration-700 group-hover:opacity-40" />
             <img 
                src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop" 
                alt="Development" 
                className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-[1.5s] ease-[0.16,1,0.3,1] opacity-0 group-hover:opacity-100"
             />
          </div>
          
          <div className="relative p-6 md:p-12 flex w-full justify-between items-end mix-blend-difference z-20">
            <div className="mask-container overflow-hidden">
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-white/50 block mb-2 transition-transform duration-500 group-hover:-translate-y-2">01</span>
              <h2 className="text-subhuge text-white transition-transform duration-700 ease-[0.16,1,0.3,1] group-hover:translate-x-4">Development</h2>
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 hidden md:block">
              <p className="font-mono text-sm uppercase tracking-widest text-[var(--accent-cyan)]">View Projects &rarr;</p>
            </div>
          </div>
        </Link>

        <Link to="/video" className="group relative w-full border-b border-[var(--border-color)] overflow-hidden h-[30vh] md:h-[40vh] flex items-center">
          {/* Hover Image Mask */}
          <div className="absolute inset-0 z-0 overflow-hidden">
             <div className="absolute inset-0 bg-black/60 z-10 transition-opacity duration-700 group-hover:opacity-40" />
             <img 
                src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=2070&auto=format&fit=crop" 
                alt="Video Editing" 
                className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-[1.5s] ease-[0.16,1,0.3,1] opacity-0 group-hover:opacity-100"
             />
          </div>

          <div className="relative p-6 md:p-12 flex w-full justify-between items-end mix-blend-difference z-20">
            <div className="mask-container overflow-hidden">
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-white/50 block mb-2 transition-transform duration-500 group-hover:-translate-y-2">02</span>
              <h2 className="text-subhuge text-white transition-transform duration-700 ease-[0.16,1,0.3,1] group-hover:translate-x-4">Video Editing</h2>
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 hidden md:block">
              <p className="font-mono text-sm uppercase tracking-widest text-white">Play Reels &rarr;</p>
            </div>
          </div>
        </Link>
      </section>

      {/* Editify Synergy Section (Extreme Polish) */}
      <section className="py-32 px-6 bg-[var(--bg-primary)]">
        <div className="max-w-5xl mx-auto text-center mask-container overflow-hidden">
          <motion.h2 
            initial={{ y: 100 }} whileInView={{ y: 0 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} viewport={{ once: true }}
            className="text-4xl md:text-7xl font-black mb-8 tracking-tighter uppercase leading-[0.9]"
          >
            The Complete Package<br />
            <span className="text-[var(--accent-cyan)]">Editify Studios</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 1, delay: 0.2 }} viewport={{ once: true }}
            className="text-xl md:text-3xl text-[var(--text-secondary)] font-medium leading-tight mb-12 max-w-3xl mx-auto"
          >
            Why hire a web developer and a video editor separately? For Editify Studios, I delivered the ultimate synergy. 
            I built their custom, high-performance web platform from the ground up, <em>and</em> I actively edit their high-retention YouTube content.
          </motion.p>
          <motion.a 
            initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.4 }} viewport={{ once: true }}
            href="mailto:shaurya.studios.dev@gmail.com" 
            className="inline-block border border-white/20 px-10 py-5 font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-colors duration-500 rounded-full"
          >
            Start a project
          </motion.a>
        </div>
      </section>
    </div>
  );
}
