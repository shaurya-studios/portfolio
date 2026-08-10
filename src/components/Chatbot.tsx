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
    }, 15);
    return () => clearInterval(interval);
  }, [text]);

  return <>{displayedText}</>;
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string, typed?: boolean}[]>([
    { role: 'assistant', content: 'System online. How can I assist you with Shaurya\'s services?', typed: true }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

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
        content: data.reply || `Error: ${data.error || 'Connection failed.'}` 
      }]);
    } catch (err) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Error: Network failure. Please try again later.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 pointer-events-auto">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-16 right-0 w-[350px] h-[500px] flex flex-col rounded-2xl glass-panel overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.5)] border border-[var(--color-border)]"
          >
            <div className="border-b border-[var(--color-border)] p-4 flex justify-between items-center bg-black/40 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                <span className="font-sans text-sm font-semibold tracking-wide text-white">Assistant</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-[var(--color-text-muted)] hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>
            
            <div className="flex-grow p-5 overflow-y-auto space-y-5 bg-black/20">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 text-sm whitespace-pre-wrap leading-relaxed ${m.role === 'user' ? 'bg-[var(--color-text)] text-black rounded-2xl rounded-tr-sm' : 'bg-[var(--color-bg-inset)] text-[var(--color-text)] border border-[var(--color-border)] rounded-2xl rounded-tl-sm'}`}>
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
                  <div className="max-w-[85%] p-3 text-sm bg-[var(--color-bg-inset)] text-[var(--color-text-muted)] border border-[var(--color-border)] rounded-2xl rounded-tl-sm flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-text-muted)] animate-bounce" />
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-text-muted)] animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-text-muted)] animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>
            
            <form onSubmit={handleSubmit} className="border-t border-[var(--color-border)] p-3 bg-black/40 backdrop-blur-md flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask a question..." 
                className="flex-grow bg-[var(--color-bg-inset)] border border-[var(--color-border)] rounded-full px-4 py-2 outline-none text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-border-active)] transition-colors"
              />
              <button 
                type="submit" 
                className="w-10 h-10 rounded-full bg-[var(--color-text)] text-black flex items-center justify-center hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 transition-all flex-shrink-0" 
                disabled={!input.trim()}
              >
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Chatbot"
        className="w-14 h-14 rounded-full glass-panel shadow-[0_10px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.5)] flex items-center justify-center transition-all duration-300 group"
      >
        <MessageSquare size={24} className="text-[var(--color-text)] group-hover:scale-110 transition-transform" />
      </button>
    </div>
  );
}
