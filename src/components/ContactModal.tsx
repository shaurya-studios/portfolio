import { motion, AnimatePresence } from 'framer-motion';
import { useContact } from '../context/ContactContext';
import { Copy, Mail, MessageSquare, ExternalLink, Check } from 'lucide-react';
import { useState } from 'react';

export default function ContactModal() {
  const { isOpen, closeContact } = useContact();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeContact}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25, mass: 0.8 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg island corner-brackets p-8 relative overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-gradient-to-b from-[var(--color-gold)] to-transparent opacity-10 blur-[80px] -z-10 pointer-events-none" />

            <button 
              onClick={closeContact}
              className="absolute top-6 right-6 text-[var(--color-text-muted)] hover:text-white transition-colors"
            >
              ✕
            </button>

            <div className="text-center mb-8">
              <div className="section-label mb-2">COMMUNICATION UPLINK</div>
              <h2 className="font-display text-3xl font-bold mb-2 tracking-tight">INITIALIZE PROJECT</h2>
              <p className="text-[var(--color-text-muted)] text-sm">Select a secure channel to commence discussion.</p>
            </div>

            <div className="space-y-4">
              {/* Discord */}
              <div className="flex items-center justify-between p-4 bg-[var(--color-bg-inset)] border border-[var(--color-border)] hover:border-[#5865F2] hover:shadow-[0_0_20px_rgba(88,101,242,0.15)] transition-all group rounded-[4px]">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 border border-[var(--color-border)] bg-[var(--color-bg-surface)] text-[#5865F2] flex items-center justify-center rounded-[4px]">
                    <MessageSquare size={18} />
                  </div>
                  <div>
                    <span className="block text-[0.65rem] uppercase tracking-widest text-[var(--color-text-muted)] font-bold">Discord</span>
                    <strong className="text-white font-mono text-sm">shauryaa74</strong>
                  </div>
                </div>
                <button 
                  onClick={() => handleCopy('shauryaa74', 'discord')}
                  className="p-2 bg-[var(--color-bg-surface)] border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-white hover:border-white transition-all rounded-[4px]"
                  title="Copy Discord ID"
                >
                  {copiedId === 'discord' ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                </button>
              </div>

              {/* Email */}
              <div className="flex items-center justify-between p-4 bg-[var(--color-bg-inset)] border border-[var(--color-border)] hover:border-[var(--color-gold)] hover:shadow-[0_0_20px_var(--color-gold-glow)] transition-all group rounded-[4px]">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 border border-[var(--color-border)] bg-[var(--color-bg-surface)] text-[var(--color-gold)] flex items-center justify-center rounded-[4px]">
                    <Mail size={18} />
                  </div>
                  <div>
                    <span className="block text-[0.65rem] uppercase tracking-widest text-[var(--color-text-muted)] font-bold">Email</span>
                    <strong className="text-white font-mono text-[0.8rem] md:text-sm truncate max-w-[150px] md:max-w-[200px] block">shaurya.studios.dev@gmail.com</strong>
                  </div>
                </div>
                <button 
                  onClick={() => handleCopy('shaurya.studios.dev@gmail.com', 'email')}
                  className="p-2 bg-[var(--color-bg-surface)] border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-white hover:border-white transition-all rounded-[4px] flex-shrink-0"
                  title="Copy Email"
                >
                  {copiedId === 'email' ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                </button>
              </div>

              {/* Fiverr */}
              <a 
                href="https://www.fiverr.com/s/6Yl5a2r" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-between p-4 bg-[var(--color-bg-inset)] border border-[var(--color-border)] hover:border-[#00b22d] hover:shadow-[0_0_20px_rgba(0,178,45,0.15)] transition-all group rounded-[4px]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 border border-[var(--color-border)] bg-[var(--color-bg-surface)] text-[#00b22d] flex items-center justify-center font-bold text-lg rounded-[4px]">
                    fi
                  </div>
                  <div>
                    <span className="block text-[0.65rem] uppercase tracking-widest text-[var(--color-text-muted)] font-bold">Fiverr</span>
                    <strong className="text-white font-mono text-sm">Order Directly</strong>
                  </div>
                </div>
                <div className="p-2 text-[#00b22d] group-hover:scale-110 transition-transform">
                  <ExternalLink size={16} />
                </div>
              </a>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
