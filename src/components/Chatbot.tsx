import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([
    { role: 'assistant', content: 'SYSTEM_ONLINE. I am the Shaurya.dev AI Assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');

    // Simulate AI response for now until OpenAI is integrated
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `> ERROR: OPENAI_API_KEY_MISSING.\n\nI am currently offline. Please email shaurya.studios.dev@gmail.com directly to talk to Shaurya while I am under maintenance.` 
      }]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-mono">
      {isOpen ? (
        <div className="w-[350px] h-[500px] bg-[#0a0a0a] border border-[var(--color-border)] flex flex-col shadow-[8px_8px_0_0_var(--color-accent-glow)]">
          <div className="border-b border-[var(--color-border)] p-4 flex justify-between items-center bg-[#111111]">
            <div className="flex items-center gap-2 text-[var(--color-accent)] font-bold text-sm">
              <div className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse" />
              SHAURYA_BOT_v1.0
            </div>
            <button onClick={() => setIsOpen(false)} className="text-[var(--color-text-secondary)] hover:text-white">
              <X size={18} />
            </button>
          </div>
          
          <div className="flex-grow p-4 overflow-y-auto space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 text-sm whitespace-pre-wrap ${m.role === 'user' ? 'bg-[var(--color-accent)] text-black' : 'bg-[#111] text-[var(--color-text-primary)] border border-[var(--color-border)]'}`}>
                  {m.content}
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>
          
          <form onSubmit={handleSubmit} className="border-t border-[var(--color-border)] p-3 bg-[#111] flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="&gt; Type command..." 
              className="flex-grow bg-transparent border-none outline-none text-sm text-white placeholder:text-[var(--color-text-secondary)]"
            />
            <button type="submit" className="text-[var(--color-accent)] hover:text-white disabled:opacity-50" disabled={!input.trim()}>
              <Send size={18} />
            </button>
          </form>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-[var(--color-accent)] text-black flex items-center justify-center hover:-translate-y-1 transition-transform border border-[var(--color-border)] shadow-[4px_4px_0_0_var(--color-border)]"
        >
          <MessageSquare size={24} />
        </button>
      )}
    </div>
  );
}
