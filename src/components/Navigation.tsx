import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';

export default function Navigation() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 p-6 mix-blend-difference pointer-events-none">
      <div className="max-w-7xl mx-auto flex justify-between items-center pointer-events-auto">
        <Link to="/" className="text-xl font-extrabold tracking-tighter text-white hover:opacity-80 transition-opacity">
          SA
        </Link>

        <div className="flex items-center gap-4">
          <a 
            href="https://discordapp.com/users/YOUR_DISCORD_ID" 
            target="_blank" 
            rel="noreferrer"
            className="hidden sm:flex items-center gap-2 bg-[#5865F2] hover:bg-[#4752C4] text-white px-4 py-2 rounded-lg font-medium text-sm transition-all hover:scale-105"
          >
            Message on Discord
          </a>
          <a 
            href="https://www.fiverr.com/yourprofile" 
            target="_blank" 
            rel="noreferrer"
            className="hidden sm:flex items-center gap-2 bg-[#1dbf73] hover:bg-[#19a463] text-white px-4 py-2 rounded-lg font-medium text-sm transition-all hover:scale-105"
          >
            Hire me on Fiverr
          </a>
          <a 
            href="mailto:shaurya.studios.dev@gmail.com" 
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-medium text-sm transition-all hover:scale-105 backdrop-blur-md border border-white/10"
          >
            <Mail size={16} />
            <span className="hidden sm:inline">Contact</span>
          </a>
        </div>
      </div>
    </header>
  );
}
