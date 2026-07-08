export default function ThreeBackground() {
  return (
    <div className="fixed inset-0 z-[-1] bg-[#050505]">
      {/* Extremely subtle, sophisticated gradient glow */}
      <div 
        className="absolute inset-0 z-0 opacity-40 mix-blend-screen pointer-events-none" 
        style={{
          background: 'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.03) 0%, transparent 50%), radial-gradient(circle at 100% 100%, rgba(0, 229, 255, 0.02) 0%, transparent 40%)'
        }}
      />
    </div>
  );
}
