import { motion } from 'framer-motion';
import { useContact } from '../context/ContactContext';

export default function ContactFooter() {
  const { openContact } = useContact();

  return (
    <section id="contact" className="py-36 px-6 md:px-12 max-w-5xl mx-auto text-center w-full">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="luxury-glass p-12 md:p-20 rounded-[2.5rem] flex flex-col items-center"
      >
        <span className="section-label mb-4">Direct Contact</span>
        <h2 className="font-display text-4xl md:text-6xl font-bold mb-6 tracking-tight text-[var(--color-text)]">
          Let's Build Something Exceptional.
        </h2>
        <p className="text-[var(--color-text-muted)] text-base md:text-lg max-w-xl mx-auto leading-relaxed mb-10 font-sans">
          Available for select web development, interactive 3D experiences, and video editing projects. Reach out directly to discuss your vision.
        </p>
        <button 
          onClick={openContact}
          className="luxury-btn-primary"
        >
          GET IN TOUCH
        </button>
      </motion.div>

      {/* Ultra-minimal copyright & location footer */}
      <div className="mt-20 flex flex-col md:flex-row justify-between items-center text-xs font-mono text-[var(--color-text-muted)] border-t border-[var(--color-border)] pt-8 tracking-widest uppercase">
        <div>© 2026 SHAURYA STUDIOS. ALL RIGHTS RESERVED.</div>
        <div className="mt-4 md:mt-0 flex gap-6">
          <span>LAT. 28.6139° N</span>
          <span>//</span>
          <span>CREATIVE DEV & DESIGN</span>
        </div>
      </div>
    </section>
  );
}
