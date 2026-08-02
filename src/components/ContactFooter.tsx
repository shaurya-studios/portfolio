import { motion } from 'framer-motion';
import { useContact } from '../context/ContactContext';

export default function ContactFooter() {
  const { openContact } = useContact();

  return (
    <section id="contact" className="py-40 px-6 md:px-12 max-w-4xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div 
          onClick={openContact}
          className="inline-block mb-10 px-8 py-4 rounded-3xl bg-white/5 border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.3)] backdrop-blur-md transform -rotate-2 hover:rotate-0 hover:bg-white/10 hover:border-white/20 transition-all duration-500 cursor-pointer group"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight group-hover:text-[var(--color-accent)] transition-colors">
            START A PROJECT
          </h2>
        </div>
        <p className="text-sm text-gray-400 max-w-2xl mx-auto uppercase tracking-widest font-semibold leading-relaxed mb-12">
          Currently accepting new clients. Let's discuss your product goals and architect a custom solution for your business.
        </p>
        <button 
          onClick={openContact}
          className="px-10 py-4 rounded-full bg-white text-black text-sm uppercase tracking-widest font-bold transition-all duration-300 shadow-[0_15px_30px_rgba(255,255,255,0.2)] hover:shadow-[0_20px_40px_rgba(255,255,255,0.4)] hover:bg-[var(--color-accent)] hover:text-white"
        >
          View Contact Options
        </button>
      </motion.div>
    </section>
  );
}
