import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef } from 'react';

const videos = [
  { id: 1, title: 'Sample Project 1', src: '/videos/sample1.mp4' },
  { id: 2, title: 'Sample Project 2', src: '/videos/sample2.mp4' },
  { id: 3, title: 'Sample Project 3', src: '/videos/sample3.mp4' },
];

const TiltVideoCard = ({ video, index }: { video: typeof videos[0], index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
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
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: index * 0.2, type: "spring" }}
      className="perspective-1000"
    >
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative rounded-3xl bg-white/5 border border-white/10 backdrop-blur-2xl p-4 shadow-[0_30px_60px_rgba(0,0,0,0.4)] overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none" />
        
        <div 
          className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black"
          style={{ transform: "translateZ(30px)" }}
        >
          <video 
            controls 
            preload="metadata"
            className="w-full aspect-video object-cover"
          >
            <source src={video.src} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        <div 
          className="mt-6 flex justify-between items-center px-2"
          style={{ transform: "translateZ(40px)" }}
        >
          <h3 className="text-xl font-bold text-white tracking-tight">{video.title}</h3>
          <span className="text-xs uppercase tracking-widest text-[var(--color-accent)] font-semibold">Premium Edit</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

const HolographicPricingCard = () => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
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
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.6, type: "spring" }}
      className="perspective-1000 h-full min-h-[400px]"
    >
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative rounded-3xl bg-gradient-to-br from-[var(--color-accent)]/20 via-[var(--color-bg-elevated)] to-transparent border border-[var(--color-accent)]/30 backdrop-blur-2xl p-10 shadow-[0_30px_60px_rgba(0,0,0,0.5)] flex flex-col justify-center items-center text-center space-y-8 h-full group overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent-secondary)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        
        <div style={{ transform: "translateZ(50px)" }} className="relative z-10 space-y-4">
          <h3 className="text-3xl font-bold text-white tracking-tight drop-shadow-md">Ready to Elevate Your Content?</h3>
          
          <div className="flex flex-col xl:flex-row gap-6 justify-center items-center py-6">
            <div className="bg-[var(--color-bg-subtle)]/50 border border-[var(--color-border)] p-4 rounded-xl backdrop-blur-md shadow-inner w-full">
              <span className="block text-xs uppercase tracking-widest text-[var(--color-text-secondary)] mb-1">Pricing</span>
              <strong className="text-2xl text-[var(--color-accent)] drop-shadow-[0_0_10px_var(--color-accent-glow)]">$10 - $80</strong>
              <span className="block text-xs text-[var(--color-text-secondary)] mt-1">per video</span>
            </div>
            
            <div className="bg-[var(--color-bg-subtle)]/50 border border-[var(--color-border)] p-4 rounded-xl backdrop-blur-md shadow-inner w-full">
              <span className="block text-xs uppercase tracking-widest text-[var(--color-text-secondary)] mb-1">Timeline</span>
              <strong className="text-2xl text-[var(--color-accent-secondary)] drop-shadow-[0_0_10px_rgba(0,245,212,0.3)]">1 - 7 Days</strong>
              <span className="block text-xs text-[var(--color-text-secondary)] mt-1">delivery</span>
            </div>
          </div>
        </div>

        <div style={{ transform: "translateZ(80px)" }}>
          <a 
            href="https://discord.com" 
            target="_blank" 
            rel="noreferrer"
            className="px-8 py-4 rounded-full bg-white text-black text-sm uppercase tracking-widest font-bold transition-all duration-300 shadow-[0_10px_30px_rgba(255,255,255,0.2)] hover:shadow-[0_15px_40px_rgba(255,255,255,0.4)] hover:bg-[var(--color-accent)] hover:text-white inline-block"
          >
            Order Video Editing
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function VideoEditing() {
  return (
    <div className="min-h-screen pt-32 pb-24 px-6 relative z-10 font-mono">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, type: "spring" }}
          className="text-center space-y-6"
        >
          <div className="inline-block px-4 py-1.5 rounded-full border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 text-[var(--color-accent)] text-xs font-semibold tracking-widest uppercase mb-4 shadow-[0_0_20px_rgba(var(--color-accent-rgb),0.2)]">
            Visual Storytelling
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tighter">
            Next-Level <br className="hidden md:block" />
            <span className="text-[var(--color-accent)] drop-shadow-[0_0_20px_var(--color-accent-glow)]">Video Editing.</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Specializing in high-retention gaming videos and general YouTube content. I cut, color, and composite to bring your vision to life and keep your audience engaged.
          </p>
        </motion.div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-16">
          {videos.map((video, idx) => (
            <TiltVideoCard key={video.id} video={video} index={idx} />
          ))}
          
          {/* Call to Action Card */}
          <HolographicPricingCard />
        </div>

      </div>
    </div>
  );
}
