import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TypewriterText = ({ text, onComplete }: { text: string, onComplete: () => void }) => {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        onComplete();
      }
    }, 12);
    return () => clearInterval(interval);
  }, [text]);

  return <>{displayedText}</>;
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string, typed?: boolean}[]>([
    { role: 'assistant', content: 'Hi! I\'m Shaurya\'s assistant. Ask me anything about current work, services, pricing, or tech stack.', typed: true }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, isOpen, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });
      
      const data = await response.json();
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.reply || `Notice: ${data.error || 'Connection failed.'}` 
      }]);
    } catch (err) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Connection error. Please reach out directly via Discord or Email.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 pointer-events-auto font-mono text-xs">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-16 right-0 w-[350px] sm:w-[380px] h-[520px] flex flex-col rounded-[2rem] luxury-glass overflow-hidden shadow-2xl border border-[var(--color-border)]"
          >
            {/* Header */}
            <div className="border-b border-[var(--color-border)] p-4 flex justify-between items-center bg-[var(--color-bg)]/80 backdrop-blur-md">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-semibold tracking-wider text-[var(--color-text)] uppercase">Studio Assistant</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="w-7 h-7 rounded-full border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
              >
                <X size={14} />
              </button>
            </div>
            
            {/* Messages Feed */}
            <div className="flex-grow p-4 overflow-y-auto space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3.5 text-xs leading-relaxed whitespace-pre-wrap ${
                    m.role === 'user' 
                      ? 'bg-[var(--color-text)] text-[var(--color-bg)] rounded-2xl rounded-tr-xs' 
                      : 'bg-[var(--color-bg)] text-[var(--color-text)] border border-[var(--color-border)] rounded-2xl rounded-tl-xs shadow-sm font-sans text-sm'
                  }`}>
                    {m.role === 'assistant' && !m.typed ? (
                      <TypewriterText 
                        text={m.content} 
                        onComplete={() => {
                          setMessages(prev => prev.map((msg, idx) => idx === i ? { ...msg, typed: true } : msg));
                        }} 
                      />
                    ) : (
                      m.content
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="p-3 bg-[var(--color-bg)] text-[var(--color-text-muted)] border border-[var(--color-border)] rounded-2xl rounded-tl-xs flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-text-muted)] animate-bounce" />
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-text-muted)] animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-text-muted)] animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>
            
            {/* Input Footer */}
            <form onSubmit={handleSubmit} className="border-t border-[var(--color-border)] p-3 bg-[var(--color-bg)]/80 backdrop-blur-md flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask about web projects, video editing, pricing..." 
                className="flex-grow bg-transparent border border-[var(--color-border)] rounded-full px-4 py-2.5 outline-none text-xs text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-text)] transition-colors"
              />
              <button 
                type="submit" 
                className="w-9 h-9 rounded-full bg-[var(--color-text)] text-[var(--color-bg)] flex items-center justify-center hover:opacity-90 disabled:opacity-40 transition-all flex-shrink-0" 
                disabled={!input.trim()}
              >
                <Send size={13} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Launcher Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Studio AI Assistant"
        className="w-13 h-13 rounded-full luxury-glass shadow-lg flex items-center justify-center text-[var(--color-text)] hover:scale-105 transition-transform group"
      >
        <MessageSquare size={20} className="group-hover:rotate-6 transition-transform" />
      </button>
    </div>
  );
}
