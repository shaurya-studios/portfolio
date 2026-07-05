import { motion } from 'framer-motion';

export default function Dev() {
  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-16"
      >
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4">Web <span className="text-gradient">Development</span></h1>
        <p className="text-secondary max-w-2xl text-lg">
          Fast, accessible, and beautifully designed web experiences.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Dev Project Card */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="glass rounded-xl overflow-hidden shadow-2xl border-white/5 flex flex-col md:flex-row h-full"
        >
          <div className="md:w-1/2 bg-[#121212] flex items-center justify-center p-8 border-r border-white/5">
            <div className="text-4xl font-extrabold tracking-tighter text-cyan-400">Editify Studios</div>
          </div>
          <div className="p-8 md:w-1/2 flex flex-col justify-center">
            <h3 className="text-2xl font-bold mb-2">Editify Platform</h3>
            <p className="text-sm text-secondary mb-6">
              A complete digital presence built from the ground up, tailored for high conversions and lightning-fast load times.
            </p>
            <a 
              href="https://editifystudios.com" 
              target="_blank" 
              rel="noreferrer"
              className="inline-block text-cyan-400 font-semibold hover:text-cyan-300 transition-colors"
            >
              View Live Site →
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
