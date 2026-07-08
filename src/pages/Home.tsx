import { Link } from 'react-router-dom';
import { motion, useScroll, useVelocity, useTransform, useSpring } from 'framer-motion';

export default function Home() {
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });
  
  // Skew effect based on scroll speed
  const skewVelocity = useTransform(smoothVelocity, [-1000, 1000], [-10, 10]);
  const skewVelocityStr = useTransform(skewVelocity, (v) => `${v}deg`);

  // Transform effect for the marquee to move faster on scroll
  const x1 = useTransform(scrollY, [0, 1000], [0, -500]);
  const x2 = useTransform(scrollY, [0, 1000], [0, 500]);

  return (
    <div className="min-h-screen flex flex-col pt-24 md:pt-32 bg-transparent text-white">
      
      {/* Massive Hero */}
      <section className="flex flex-col justify-center px-6 md:px-12 pb-20 min-h-[60vh] md:min-h-[75vh]">
        <div className="max-w-[95vw]">
          <div className="mask-container overflow-hidden pb-2">
            <motion.h1 
              initial={{ y: '100%' }} animate={{ y: '0%' }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 1 }}
              className="text-[clamp(3rem,12vw,10rem)] font-black leading-[0.9] tracking-tighter uppercase"
            >
              SHAURYA
            </motion.h1>
          </div>
          <div className="mask-container overflow-hidden pb-4">
            <motion.h1 
              initial={{ y: '100%' }} animate={{ y: '0%' }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 1.1 }}
              className="text-[clamp(3rem,12vw,10rem)] font-black leading-[0.9] tracking-tighter uppercase text-white/50"
            >
              AGARWAL
            </motion.h1>
          </div>
          <div className="mask-container overflow-hidden mt-6 md:mt-10">
            <motion.p 
              initial={{ y: '100%' }} animate={{ y: '0%' }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 1.2 }}
              className="text-xl md:text-3xl font-light tracking-tight max-w-3xl text-white/70"
            >
              Digital Craft. Building high-performance web experiences and editing cinematic, high-retention video.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Physics-Driven Marquee */}
      <section className="py-12 md:py-20 border-y border-white/10 bg-transparent overflow-hidden">
        <motion.div style={{ skewY: skewVelocityStr }} className="relative flex flex-col gap-4">
          <motion.div style={{ x: x1 }} className="flex whitespace-nowrap">
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase px-4 flex items-center">
              Digital Craft <span className="text-white/20 mx-8">✦</span> Video Editing <span className="text-white/20 mx-8">✦</span> Web Development <span className="text-white/20 mx-8">✦</span> Digital Craft
            </h2>
          </motion.div>
          <motion.div style={{ x: x2, left: '-50%' }} className="flex whitespace-nowrap relative">
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase px-4 flex items-center text-transparent" style={{ WebkitTextStroke: '2px rgba(255,255,255,0.3)' }}>
              Video Editing <span className="text-white/20 mx-8">✦</span> Web Development <span className="text-white/20 mx-8">✦</span> Digital Craft <span className="text-white/20 mx-8">✦</span> Video Editing
            </h2>
          </motion.div>
        </motion.div>
      </section>

      {/* Grid-Breaking Hover Categories */}
      <section className="flex flex-col w-full bg-transparent relative z-10">
        <Link to="/dev" className="group relative w-full border-b border-white/10 overflow-hidden h-[30vh] md:h-[45vh] flex items-center">
          <div className="absolute inset-0 z-0 overflow-hidden bg-black">
             <div className="absolute inset-0 bg-black/60 z-10 transition-opacity duration-1000 group-hover:opacity-10" />
             <img 
                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" 
                alt="Development" 
                className="w-full h-full object-cover scale-150 group-hover:scale-100 transition-transform duration-[2s] ease-[0.16,1,0.3,1] opacity-0 group-hover:opacity-100 filter blur-sm group-hover:blur-0"
             />
          </div>
          
          <div className="relative px-6 md:px-12 flex w-full justify-between items-end mix-blend-difference z-20 pointer-events-none">
            <div className="mask-container overflow-hidden pb-2">
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-white/50 block mb-2 transition-transform duration-700 group-hover:-translate-y-4">01</span>
              <h2 className="text-[clamp(2.5rem,7vw,6rem)] font-black leading-none uppercase text-white transition-transform duration-1000 ease-[0.16,1,0.3,1] group-hover:translate-x-8">Development</h2>
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-all duration-700 delay-100 hidden md:block group-hover:-translate-x-8">
              <p className="font-mono text-sm uppercase tracking-widest text-white border border-white/20 rounded-full px-6 py-2">View Projects</p>
            </div>
          </div>
        </Link>

        <Link to="/video" className="group relative w-full border-b border-white/10 overflow-hidden h-[30vh] md:h-[45vh] flex items-center">
          <div className="absolute inset-0 z-0 overflow-hidden bg-black">
             <div className="absolute inset-0 bg-black/60 z-10 transition-opacity duration-1000 group-hover:opacity-10" />
             <img 
                src="https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=2400&auto=format&fit=crop" 
                alt="Video Editing" 
                className="w-full h-full object-cover scale-150 group-hover:scale-100 transition-transform duration-[2s] ease-[0.16,1,0.3,1] opacity-0 group-hover:opacity-100 filter blur-sm group-hover:blur-0"
             />
          </div>

          <div className="relative px-6 md:px-12 flex w-full justify-between items-end mix-blend-difference z-20 pointer-events-none">
            <div className="mask-container overflow-hidden pb-2">
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-white/50 block mb-2 transition-transform duration-700 group-hover:-translate-y-4">02</span>
              <h2 className="text-[clamp(2.5rem,7vw,6rem)] font-black leading-none uppercase text-white transition-transform duration-1000 ease-[0.16,1,0.3,1] group-hover:translate-x-8">Video Editing</h2>
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-all duration-700 delay-100 hidden md:block group-hover:-translate-x-8">
              <p className="font-mono text-sm uppercase tracking-widest text-white border border-white/20 rounded-full px-6 py-2">Play Reels</p>
            </div>
          </div>
        </Link>
      </section>

      {/* Editify Synergy Section */}
      <section className="py-40 px-6 bg-black relative z-10 overflow-hidden">
        <motion.div style={{ skewY: skewVelocityStr }} className="max-w-6xl mx-auto text-center mask-container overflow-hidden">
          <motion.h2 
            initial={{ y: 200, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }} viewport={{ once: true, margin: "-100px" }}
            className="text-[clamp(2.5rem,8vw,7rem)] font-black mb-12 tracking-tighter uppercase leading-[0.85]"
          >
            The Complete Package<br />
            <span className="text-white/50" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.8)' }}>Editify Studios</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }} viewport={{ once: true }}
            className="text-xl md:text-3xl text-white/70 font-light leading-relaxed mb-16 max-w-4xl mx-auto"
          >
            Why hire a web developer and a video editor separately? For Editify Studios, I delivered the ultimate synergy. 
            I built their custom, high-performance web platform from the ground up, <em>and</em> I actively edit their high-retention YouTube content.
          </motion.p>
          <motion.a 
            initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.4 }} viewport={{ once: true }}
            href="mailto:shaurya.studios.dev@gmail.com" 
            className="inline-block border border-white/20 px-12 py-6 text-xl font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-black hover:scale-105 transition-all duration-500 rounded-full"
          >
            Start a project
          </motion.a>
        </motion.div>
      </section>
    </div>
  );
}
