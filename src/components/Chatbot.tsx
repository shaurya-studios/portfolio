import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';

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
    { role: 'assistant', content: 'SYSTEM_ONLINE. I am Buggie, ready to fix your problems. Ask me anything about Shaurya\'s services, pricing, or past work!', typed: true }
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
        content: data.reply || `> ERROR: ${data.error || 'BUGGIE COULD NOT COMPUTE.'}` 
      }]);
    } catch (err) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '> ERROR: NETWORK_FAILURE. Buggie is currently offline.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-mono">
      {isOpen ? (
        <div className="island corner-brackets w-[350px] h-[500px] flex flex-col overflow-hidden">
          <div className="border-b border-[var(--color-border)] p-4 flex justify-between items-center bg-[var(--color-bg-inset)]">
            <div className="flex items-center gap-2 text-[var(--color-gold)] font-bold text-sm uppercase">
              <div className="w-2 h-2 rounded-full bg-[var(--color-gold)] animate-pulse shadow-[0_0_8px_var(--color-gold-glow)]" />
              BUGGIE_v1.0
            </div>
            <button onClick={() => setIsOpen(false)} className="text-[var(--color-text-muted)] hover:text-white">
              <X size={18} />
            </button>
          </div>
          
          <div className="flex-grow p-4 overflow-y-auto space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 text-sm whitespace-pre-wrap rounded-[4px] ${m.role === 'user' ? 'gold-fill text-black font-semibold' : 'bg-[var(--color-bg-inset)] text-[var(--color-text)] border border-[var(--color-border)]'}`}>
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
                <div className="max-w-[85%] p-3 text-sm bg-[var(--color-bg-inset)] text-[var(--color-gold)] border border-[var(--color-border)] animate-pulse rounded-[4px]">
                  Buggie is typing...
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>
          
          <form onSubmit={handleSubmit} className="border-t border-[var(--color-border)] p-3 bg-[var(--color-bg-inset)] flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="&gt; Type command..." 
              className="flex-grow bg-transparent border-none outline-none text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]"
            />
            <button type="submit" className="text-[var(--color-gold)] hover:text-white disabled:opacity-50" disabled={!input.trim()}>
              <Send size={18} />
            </button>
          </form>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          aria-label="Open AI Chatbot"
          className="w-14 h-14 rounded-full gold-fill gold-shine shadow-[0_8px_20px_rgba(232,182,52,0.2)] hover:shadow-[0_12px_24px_rgba(232,182,52,0.4)] text-black flex items-center justify-center transition-all duration-300"
        >
          <MessageSquare size={24} />
        </button>
      )}
    </div>
  );
}
