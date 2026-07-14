export default function WebGLBackground() {
  return (
    <div className="fixed inset-0 z-[-1] bg-[#121212] overflow-hidden pointer-events-none">
      {/* Base Grid */}
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{
          backgroundImage: 'linear-gradient(var(--color-accent) 1px, transparent 1px), linear-gradient(90deg, var(--color-accent) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />
      
      {/* CRT Scanlines Overlay */}
      <div className="absolute inset-0 scanlines z-10" />
      
      {/* Subtle Vignette for old monitor curve feel */}
      <div 
        className="absolute inset-0 z-20" 
        style={{ background: 'radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.8) 100%)' }} 
      />
    </div>
  );
}
