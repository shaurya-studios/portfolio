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
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-2xl overflow-y-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl bg-gradient-to-b from-[#1c140e] via-[#120d09] to-[#090705] border border-amber-500/35 p-6 sm:p-9 rounded-[2rem] relative overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.95)] my-auto"
          >
            {/* Ambient Warm Golden/Amber Glows */}
            <div className="pointer-events-none absolute -top-24 -right-24 w-64 h-64 rounded-full bg-amber-500/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-orange-700/15 blur-3xl" />

            {/* Close Button */}
            <button
              onClick={() => {
                playTactileClick();
                closeContact();
              }}
              className="absolute top-5 right-5 w-9 h-9 rounded-full border border-amber-500/30 flex items-center justify-center text-amber-200/70 hover:text-white hover:border-amber-400 bg-black/40 hover:bg-amber-500/15 transition-all cursor-pointer"
              aria-label="Close Contact Dialog"
            >
              <X size={16} />
            </button>

            {/* Header */}
            <div className="text-left mb-8">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_10px_#f59e0b]" />
                <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-amber-300/80">
                  Shaurya Studios &bull; Direct Inquiries
                </span>
              </div>
              <h2 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Get In Touch.
              </h2>
              <p className="text-xs sm:text-sm mt-1 text-amber-100/70 font-sans leading-relaxed">
                Reach out directly via email, Discord, or Fiverr below.
              </p>
            </div>

            {/* CHANNELS */}
            <div className="space-y-3 font-mono text-xs">
              {/* Direct Mail Link with Copy */}
              <div className="flex items-center justify-between p-3.5 sm:p-4 rounded-xl border border-amber-500/25 bg-[#211710]/70 hover:border-amber-400/50 transition-colors">
                <a
                  href="mailto:shaurya.studios.dev@gmail.com?subject=Project%20Inquiry%20from%20Portfolio"
                  onClick={playTactileClick}
                  className="flex items-center gap-3 hover:opacity-90 transition-opacity min-w-0"
                >
                  <div className="w-10 h-10 rounded-lg border border-amber-500/35 bg-black/40 flex items-center justify-center text-amber-400 flex-shrink-0">
                    <Mail size={18} />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[10px] text-amber-300/60 uppercase tracking-wider">
                      Direct Email
                    </span>
                    <strong className="text-white font-semibold text-xs sm:text-sm truncate block font-sans">
                      shaurya.studios.dev@gmail.com
                    </strong>
                  </div>
                </a>
                <button
                  onClick={() => handleCopy('shaurya.studios.dev@gmail.com', 'email')}
                  className="p-2 rounded-lg border border-amber-500/30 hover:border-amber-400 text-amber-300 hover:bg-amber-500/20 transition-colors flex-shrink-0 ml-2 cursor-pointer"
                  title="Copy Email Address"
                >
                  {copiedId === 'email' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                </button>
              </div>

              {/* Discord Link */}
              <a
                href="https://discord.gg/GFbtCSYJnP"
                target="_blank"
                rel="noreferrer"
                onClick={playTactileClick}
                className="flex items-center justify-between p-3.5 sm:p-4 rounded-xl border border-amber-500/25 bg-[#211710]/70 hover:border-amber-400/50 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg border border-amber-500/35 bg-black/40 flex items-center justify-center text-amber-400">
                    <MessageSquare size={18} />
                  </div>
                  <div>
                    <span className="block text-[10px] text-amber-300/60 uppercase tracking-wider">
                      Discord Community & DM
                    </span>
                    <strong className="text-white font-semibold text-xs sm:text-sm font-sans">
                      Connect on Discord
                    </strong>
                  </div>
                </div>
                <ExternalLink size={14} className="text-amber-300/60 group-hover:text-amber-300 transition-colors" />
              </a>

              {/* Fiverr Web Dev Link */}
              <a
                href="https://www.fiverr.com/s/6Yl5a2r"
                target="_blank"
                rel="noreferrer"
                onClick={playTactileClick}
                className="flex items-center justify-between p-3.5 sm:p-4 rounded-xl border border-amber-500/25 bg-[#211710]/70 hover:border-amber-400/50 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg border border-amber-500/35 bg-black/40 flex items-center justify-center text-amber-400 font-bold text-base">
                    fi
                  </div>
                  <div>
                    <span className="block text-[10px] text-amber-300/60 uppercase tracking-wider">
                      Fiverr Client Verified
                    </span>
                    <strong className="text-white font-semibold text-xs sm:text-sm font-sans">
                      Web Development Order
                    </strong>
                  </div>
                </div>
                <ExternalLink size={14} className="text-amber-300/60 group-hover:text-amber-300 transition-colors" />
              </a>

              {/* Fiverr Video Editing Link */}
              <a
                href="https://www.fiverr.com/s/qDExmAV"
                target="_blank"
                rel="noreferrer"
                onClick={playTactileClick}
                className="flex items-center justify-between p-3.5 sm:p-4 rounded-xl border border-amber-500/25 bg-[#211710]/70 hover:border-amber-400/50 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg border border-amber-500/35 bg-black/40 flex items-center justify-center text-amber-400 font-bold text-base">
                    fi
                  </div>
                  <div>
                    <span className="block text-[10px] text-amber-300/60 uppercase tracking-wider">
                      Fiverr Studio
                    </span>
                    <strong className="text-white font-semibold text-xs sm:text-sm font-sans">
                      Video Editing & Production
                    </strong>
                  </div>
                </div>
                <ExternalLink size={14} className="text-amber-300/60 group-hover:text-amber-300 transition-colors" />
              </a>
            </div>

            {/* Footer Trust Bar */}
            <div className="mt-6 pt-4 border-t border-amber-500/20 flex items-center justify-between font-mono text-[10px] text-amber-300/60">
              <span className="flex items-center gap-1.5">
                <Sparkles size={12} className="text-amber-400" />
                Fast Response Time
              </span>
              <span>Available Worldwide</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
