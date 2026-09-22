import { motion, AnimatePresence } from 'framer-motion';
import { useContact } from '../context/ContactContext';
import { Copy, Mail, MessageSquare, ExternalLink, Check, X, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { playTactileClick } from '../utils/audioHaptics';

export default function ContactModal() {
  const { isOpen, closeContact } = useContact();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    playTactileClick();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2200);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeContact}
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-2xl overflow-y-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl bg-white dark:bg-[#0F1115] border border-black/10 dark:border-white/15 p-6 sm:p-9 rounded-[2rem] relative overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.4)] my-auto"
          >
            {/* Ambient Background Glow */}
            <div className="pointer-events-none absolute -top-24 -right-24 w-64 h-64 rounded-full bg-cyan-500/10 dark:bg-cyan-400/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-emerald-500/10 dark:bg-emerald-400/15 blur-3xl" />

            {/* Close Button */}
            <button
              onClick={() => {
                playTactileClick();
                closeContact();
              }}
              className="absolute top-5 right-5 w-9 h-9 rounded-full border border-black/10 dark:border-white/15 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              aria-label="Close Contact Dialog"
            >
              <X size={16} />
            </button>

            {/* Header */}
            <div className="text-left mb-8">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                  Direct Inquiries &bull; Available for New Projects
                </span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 uppercase">
                Let's Build Something Great.
              </h2>
              <p className="text-xs sm:text-sm mt-1 text-neutral-600 dark:text-neutral-400 font-sans leading-relaxed">
                Reach out on your preferred channel below.
              </p>
            </div>

            {/* VERIFIED CHANNELS */}
            <div className="space-y-3 font-mono text-xs">
              {/* Direct Mail Link with Copy */}
              <div className="flex items-center justify-between p-3.5 sm:p-4 rounded-xl border border-black/10 dark:border-white/15 bg-neutral-50 dark:bg-white/[0.03]">
                <a
                  href="mailto:shaurya.studios.dev@gmail.com?subject=Project%20Inquiry%20from%20Portfolio"
                  onClick={playTactileClick}
                  className="flex items-center gap-3 hover:opacity-80 transition-opacity min-w-0"
                >
                  <div className="w-10 h-10 rounded-lg border border-black/10 dark:border-white/15 flex items-center justify-center text-neutral-900 dark:text-white flex-shrink-0">
                    <Mail size={18} />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[10px] text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Direct Email
                    </span>
                    <strong className="text-neutral-900 dark:text-neutral-100 font-semibold text-xs sm:text-sm truncate block">
                      shaurya.studios.dev@gmail.com
                    </strong>
                  </div>
                </a>
                <button
                  onClick={() => handleCopy('shaurya.studios.dev@gmail.com', 'email')}
                  className="p-2 rounded-lg border border-black/10 dark:border-white/15 hover:border-black/30 dark:hover:border-white/30 text-neutral-700 dark:text-neutral-300 transition-colors flex-shrink-0 ml-2"
                  title="Copy Email Address"
                >
                  {copiedId === 'email' ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                </button>
              </div>

              {/* Discord Link */}
              <a
                href="https://discord.gg/GFbtCSYJnP"
                target="_blank"
                rel="noreferrer"
                onClick={playTactileClick}
                className="flex items-center justify-between p-3.5 sm:p-4 rounded-xl border border-black/10 dark:border-white/15 hover:border-cyan-500/50 dark:hover:border-cyan-400/50 transition-all bg-neutral-50 dark:bg-white/[0.03] group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg border border-black/10 dark:border-white/15 flex items-center justify-center text-[#5865F2]">
                    <MessageSquare size={18} />
                  </div>
                  <div>
                    <span className="block text-[10px] text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Discord Community & DM
                    </span>
                    <strong className="text-neutral-900 dark:text-neutral-100 font-semibold text-xs sm:text-sm">
                      Connect on Discord
                    </strong>
                  </div>
                </div>
                <ExternalLink size={14} className="text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors" />
              </a>

              {/* Fiverr Web Link */}
              <a
                href="https://www.fiverr.com/s/6Yl5a2r"
                target="_blank"
                rel="noreferrer"
                onClick={playTactileClick}
                className="flex items-center justify-between p-3.5 sm:p-4 rounded-xl border border-black/10 dark:border-white/15 hover:border-emerald-500/50 dark:hover:border-emerald-400/50 transition-all bg-neutral-50 dark:bg-white/[0.03] group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg border border-black/10 dark:border-white/15 flex items-center justify-center text-[#1dbf73] font-bold text-base">
                    fi
                  </div>
                  <div>
                    <span className="block text-[10px] text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Fiverr Escrow Protected
                    </span>
                    <strong className="text-neutral-900 dark:text-neutral-100 font-semibold text-xs sm:text-sm">
                      Full-Stack Web Dev Gig
                    </strong>
                  </div>
                </div>
                <ExternalLink size={14} className="text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors" />
              </a>

              {/* Fiverr Video Link */}
              <a
                href="https://www.fiverr.com/s/qDExmAV"
                target="_blank"
                rel="noreferrer"
                onClick={playTactileClick}
                className="flex items-center justify-between p-3.5 sm:p-4 rounded-xl border border-black/10 dark:border-white/15 hover:border-emerald-500/50 dark:hover:border-emerald-400/50 transition-all bg-neutral-50 dark:bg-white/[0.03] group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg border border-black/10 dark:border-white/15 flex items-center justify-center text-[#1dbf73] font-bold text-base">
                    fi
                  </div>
                  <div>
                    <span className="block text-[10px] text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Fiverr Studio
                    </span>
                    <strong className="text-neutral-900 dark:text-neutral-100 font-semibold text-xs sm:text-sm">
                      Video Editing & Production
                    </strong>
                  </div>
                </div>
                <ExternalLink size={14} className="text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors" />
              </a>
            </div>

            {/* Footer Trust Bar */}
            <div className="mt-6 pt-4 border-t border-black/10 dark:border-white/10 flex items-center justify-between font-mono text-[10px] text-neutral-500 dark:text-neutral-400">
              <span className="flex items-center gap-1.5">
                <Sparkles size={12} className="text-amber-500" />
                Direct Communication
              </span>
              <span>100% Response Rate</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
