import { motion, AnimatePresence } from 'framer-motion';
import { useContact } from '../context/ContactContext';
import { Copy, Mail, MessageSquare, ExternalLink } from 'lucide-react';

export default function ContactModal() {
  const { isOpen, closeContact } = useContact();

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add a small toast notification here
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeContact}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-[var(--color-bg-elevated)] border border-[var(--color-border)] p-8 rounded-3xl shadow-[0_40px_80px_rgba(0,0,0,0.6)] relative overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-gradient-to-b from-[var(--color-accent)]/20 to-transparent blur-3xl -z-10" />

            <button 
              onClick={closeContact}
              className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
            >
              ✕
            </button>

            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Let's Talk</h2>
              <p className="text-gray-400 text-sm">Reach out to discuss your next project.</p>
            </div>

            <div className="space-y-4">
              {/* Discord */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#5865F2]/20 text-[#5865F2] flex items-center justify-center">
                    <MessageSquare size={20} />
                  </div>
                  <div>
                    <span className="block text-xs uppercase tracking-wider text-gray-500 font-bold">Discord</span>
                    <strong className="text-white">shauryaa74</strong>
                  </div>
                </div>
                <button 
                  onClick={() => handleCopy('shauryaa74')}
                  className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                  title="Copy Discord ID"
                >
                  <Copy size={18} />
                </button>
              </div>

              {/* Email */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Mail size={20} />
                  </div>
                  <div>
                    <span className="block text-xs uppercase tracking-wider text-gray-500 font-bold">Email</span>
                    <strong className="text-white text-sm md:text-base">shaurya.studios.dev@gmail.com</strong>
                  </div>
                </div>
                <button 
                  onClick={() => handleCopy('shaurya.studios.dev@gmail.com')}
                  className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all flex-shrink-0"
                  title="Copy Email"
                >
                  <Copy size={18} />
                </button>
              </div>

              {/* Fiverr */}
              <a 
                href="https://www.fiverr.com/s/6Yl5a2r" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-between p-4 rounded-2xl bg-[#00b22d]/10 border border-[#00b22d]/30 hover:border-[#00b22d]/60 hover:bg-[#00b22d]/20 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#00b22d]/20 text-[#00b22d] flex items-center justify-center font-bold text-xl">
                    fi
                  </div>
                  <div>
                    <span className="block text-xs uppercase tracking-wider text-[#00b22d] font-bold">Fiverr</span>
                    <strong className="text-white">Order directly on Fiverr</strong>
                  </div>
                </div>
                <div className="p-2 text-[#00b22d] group-hover:scale-110 transition-transform">
                  <ExternalLink size={18} />
                </div>
              </a>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
