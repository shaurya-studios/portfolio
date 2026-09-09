import { motion, AnimatePresence } from 'framer-motion';
import { useContact } from '../context/ContactContext';
import { Copy, Mail, MessageSquare, ExternalLink, Check, X } from 'lucide-react';
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
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg luxury-glass p-8 md:p-10 rounded-[2.5rem] relative overflow-hidden shadow-2xl"
          >
            {/* Close Button */}
            <button 
              onClick={closeContact}
              className="absolute top-6 right-6 w-9 h-9 rounded-full border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
            >
              <X size={16} />
            </button>

            {/* Header */}
            <div className="text-left mb-8">
              <span className="section-label mb-2 block">Direct Inquiry</span>
              <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-[var(--color-text)]">
                Let's Build Something Great.
              </h2>
              <p className="text-[var(--color-text-muted)] text-xs md:text-sm mt-1 font-mono">
                Choose your preferred channel below to discuss a project.
              </p>
            </div>

            {/* Channels List */}
            <div className="space-y-3 font-mono text-xs">
              
              {/* Discord Link */}
              <a 
                href="https://discord.gg/GFbtCSYJnP" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-between p-4 rounded-2xl border border-[var(--color-border)] hover:border-[var(--color-text)] transition-all bg-[var(--color-bg)] group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl border border-[var(--color-border)] flex items-center justify-center text-[#5865F2]">
                    <MessageSquare size={18} />
                  </div>
                  <div>
                    <span className="block text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider">Discord Direct</span>
                    <strong className="text-[var(--color-text)] font-semibold text-sm">Direct Message & Chat</strong>
                  </div>
                </div>
                <ExternalLink size={15} className="text-[var(--color-text-muted)] group-hover:text-[var(--color-text)] transition-colors" />
              </a>

              {/* Fiverr Video */}
              <a 
                href="https://www.fiverr.com/s/qDExmAV" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-between p-4 rounded-2xl border border-[var(--color-border)] hover:border-[var(--color-text)] transition-all bg-[var(--color-bg)] group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl border border-[var(--color-border)] flex items-center justify-center text-[#1dbf73] font-bold text-base">
                    fi
                  </div>
                  <div>
                    <span className="block text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider">Fiverr Studio</span>
                    <strong className="text-[var(--color-text)] font-semibold text-sm">Video Editing & Production</strong>
                  </div>
                </div>
                <ExternalLink size={15} className="text-[var(--color-text-muted)] group-hover:text-[var(--color-text)] transition-colors" />
              </a>

              {/* Fiverr Web */}
              <a 
                href="https://www.fiverr.com/s/6Yl5a2r" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-between p-4 rounded-2xl border border-[var(--color-border)] hover:border-[var(--color-text)] transition-all bg-[var(--color-bg)] group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl border border-[var(--color-border)] flex items-center justify-center text-[#1dbf73] font-bold text-base">
                    fi
                  </div>
                  <div>
                    <span className="block text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider">Fiverr Studio</span>
                    <strong className="text-[var(--color-text)] font-semibold text-sm">Full-Stack Web Dev</strong>
                  </div>
                </div>
                <ExternalLink size={15} className="text-[var(--color-text-muted)] group-hover:text-[var(--color-text)] transition-colors" />
              </a>

              {/* Email */}
              <div className="flex items-center justify-between p-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)]">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text)]">
                    <Mail size={18} />
                  </div>
                  <div>
                    <span className="block text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider">Direct Email</span>
                    <strong className="text-[var(--color-text)] font-semibold text-xs sm:text-sm truncate block max-w-[180px] sm:max-w-[240px]">
                      shaurya.studios.dev@gmail.com
                    </strong>
                  </div>
                </div>
                <button 
                  onClick={() => handleCopy('shaurya.studios.dev@gmail.com', 'email')}
                  className="p-2 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-text)] transition-colors"
                  title="Copy Email"
                >
                  {copiedId === 'email' ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                </button>
              </div>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
