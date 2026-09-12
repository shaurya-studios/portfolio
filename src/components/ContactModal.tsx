import { motion, AnimatePresence } from 'framer-motion';
import { useContact } from '../context/ContactContext';
import { useScenery } from '../context/SceneryContext';
import { Copy, Mail, MessageSquare, ExternalLink, Check, X, Send, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { playTactileClick } from '../utils/audioHaptics';

export default function ContactModal() {
  const { isOpen, closeContact } = useContact();
  const { isCruising, setIsCruising } = useScenery();

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState<'form' | 'channels'>('form');

  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    projectType: '3D Web Experience',
    message: '',
  });

  // Automatically dock/stop cruising when contact modal is opened
  useEffect(() => {
    if (isOpen && isCruising) {
      setIsCruising(false);
    }
  }, [isOpen, isCruising, setIsCruising]);

  // Reset form status on close/open
  useEffect(() => {
    if (isOpen) {
      setFormSubmitted(false);
    }
  }, [isOpen]);

  const handleCopy = (text: string, id: string) => {
    playTactileClick();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2200);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playTactileClick();

    const subject = encodeURIComponent(`Project Inquiry: ${formData.projectType} - ${formData.name}`);
    const body = encodeURIComponent(
      `Hello Shaurya,\n\n` +
      `My Name: ${formData.name}\n` +
      `Contact / Email / Discord: ${formData.contact}\n` +
      `Project Scope: ${formData.projectType}\n\n` +
      `Project Details:\n${formData.message}\n\n` +
      `Sent via Shaurya Studios Portfolio`
    );

    // Open user's default email client
    window.location.href = `mailto:shaurya.studios.dev@gmail.com?subject=${subject}&body=${body}`;
    setFormSubmitted(true);
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
            <div className="text-left mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                  Direct Inquiries · Available for New Projects
                </span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 uppercase">
                Let's Build Something Great.
              </h2>
              <p className="text-xs sm:text-sm mt-1 text-neutral-600 dark:text-neutral-400 font-sans leading-relaxed">
                Send a project message directly, or reach out on your preferred channel.
              </p>
            </div>

            {/* Sub-Nav Mode Tabs */}
            <div className="flex items-center gap-2 p-1 rounded-xl bg-neutral-100 dark:bg-neutral-900/80 border border-black/5 dark:border-white/10 mb-6 font-mono text-xs">
              <button
                onClick={() => {
                  playTactileClick();
                  setActiveTab('form');
                }}
                className={`flex-1 py-2 px-3 rounded-lg font-semibold tracking-wider transition-all ${
                  activeTab === 'form'
                    ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300'
                }`}
              >
                QUICK INQUIRY FORM
              </button>
              <button
                onClick={() => {
                  playTactileClick();
                  setActiveTab('channels');
                }}
                className={`flex-1 py-2 px-3 rounded-lg font-semibold tracking-wider transition-all ${
                  activeTab === 'channels'
                    ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300'
                }`}
              >
                DISCORD · FIVERR · EMAIL
              </button>
            </div>

            {/* TAB 1: QUICK INQUIRY FORM */}
            {activeTab === 'form' && (
              <div>
                {formSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-center text-neutral-800 dark:text-neutral-100 font-sans"
                  >
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3">
                      <Check size={24} />
                    </div>
                    <h4 className="font-display font-bold text-lg mb-1 uppercase">Message Prepared!</h4>
                    <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 mb-4 leading-relaxed">
                      Your inquiry has been dispatched to your email client. I will review your requirements and respond within 24 hours.
                    </p>
                    <button
                      onClick={() => setFormSubmitted(false)}
                      className="px-4 py-2 rounded-lg font-mono text-xs border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 transition-colors"
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-[11px] font-mono font-medium uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1.5">
                          Your Name
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Alex Morgan"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 dark:border-white/15 bg-black/[0.02] dark:bg-white/[0.04] text-neutral-900 dark:text-white placeholder-neutral-400 text-sm focus:outline-none focus:border-cyan-500 transition-colors font-sans"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono font-medium uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1.5">
                          Email or Discord Handle
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="name@company.com or username#0000"
                          value={formData.contact}
                          onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 dark:border-white/15 bg-black/[0.02] dark:bg-white/[0.04] text-neutral-900 dark:text-white placeholder-neutral-400 text-sm focus:outline-none focus:border-cyan-500 transition-colors font-sans"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono font-medium uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1.5">
                        Project Scope
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px]">
                        {[
                          '3D Web Experience',
                          'Custom Web App',
                          'Website Redesign',
                          'Video Editing',
                        ].map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => {
                              playTactileClick();
                              setFormData({ ...formData, projectType: type });
                            }}
                            className={`px-2.5 py-2 rounded-lg border text-center transition-all ${
                              formData.projectType === type
                                ? 'border-cyan-500 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold'
                                : 'border-black/10 dark:border-white/15 text-neutral-600 dark:text-neutral-400 hover:border-black/30 dark:hover:border-white/30'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono font-medium uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1.5">
                        Project Overview & Goals
                      </label>
                      <textarea
                        required
                        rows={3}
                        placeholder="Tell me about your brand, deadline, or what you want to build..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 dark:border-white/15 bg-black/[0.02] dark:bg-white/[0.04] text-neutral-900 dark:text-white placeholder-neutral-400 text-sm focus:outline-none focus:border-cyan-500 transition-colors font-sans resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-mono text-xs font-bold tracking-widest uppercase hover:opacity-90 active:scale-[0.99] transition-all shadow-xl"
                    >
                      <Send size={14} />
                      <span>Send Project Inquiry</span>
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* TAB 2: VERIFIED CHANNELS */}
            {activeTab === 'channels' && (
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
            )}

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
