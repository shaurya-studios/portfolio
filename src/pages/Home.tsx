import { motion } from 'framer-motion';
import { useScenery } from '../context/SceneryContext';

export default function Home() {
  const { isConstructionMode } = useScenery();

  return (
    <div className="flex flex-col">
      {/* Scroll Spacers to drive the 3D spatial camera */}
      
      {/* SECTION 1: HERO / CORE */}
      <section id="hero" className="h-[150vh] w-full flex flex-col justify-start relative z-10 px-6 md:px-12 pt-48 pointer-events-none">
        <div className="max-w-7xl w-full mx-auto">
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="text-[4rem] md:text-[7rem] leading-[0.9] font-mono font-bold tracking-tighter text-white"
          >
            I BUILD<br />THINGS.
          </motion.h1>
        </div>
      </section>

      {/* SECTION 2: WORK */}
      <section id="work" className="h-[150vh] w-full flex items-center relative z-10 px-6 md:px-12 pointer-events-none">
        <div className="max-w-7xl w-full mx-auto grid grid-cols-12">
          <div className="col-span-12 md:col-span-4">
            <h2 className="text-sm font-mono tracking-[0.2em] text-white/50 mb-8">[01] EXPERIMENTS</h2>
            <p className="text-lg md:text-xl font-sans text-white max-w-sm">
              Projects that explore the intersection of interaction design and software engineering.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3: PROCESS */}
      <section id="process" className="h-[150vh] w-full flex items-center justify-end relative z-10 px-6 md:px-12 pointer-events-none">
        <div className="max-w-7xl w-full mx-auto flex justify-end">
          <div className="text-right">
            <h2 className="text-sm font-mono tracking-[0.2em] text-white/50 mb-8">[02] ARCHITECTURE</h2>
            <p className="text-lg md:text-xl font-sans text-white max-w-sm text-right">
              Precision engineered systems. No bloated templates. Built from the ground up.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 4: OUTRO */}
      <section className="h-[100vh] w-full flex items-center justify-center relative z-10 px-6 md:px-12 pointer-events-none">
        <div className="text-center">
          <h2 className="text-sm font-mono tracking-[0.2em] text-white/50 mb-4">[STATUS]</h2>
          <p className="text-3xl font-mono text-white">Still building.</p>
        </div>
      </section>
      
      {/* Construction Mode Overlay Data */}
      {isConstructionMode && (
        <div className="fixed top-1/2 right-12 transform -translate-y-1/2 font-mono text-[10px] text-[#5eead4] leading-relaxed tracking-widest text-right pointer-events-none z-50">
          <p>SYS.CORE: ONLINE</p>
          <p>RENDER_TARGET: SIGNATURE_OBJ</p>
          <p>HAPTICS: ENABLED</p>
          <p>ENV: VOID_GRID</p>
        </div>
      )}
    </div>
  );
}
