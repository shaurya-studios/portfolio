export default function WebGLBackground() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* Blueprint dot grid */}
      <div 
        className="absolute inset-0" 
        style={{
          backgroundImage: 'radial-gradient(circle, var(--color-border) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          opacity: 0.04,
        }}
      />
      
      {/* Subtle vignette — darker edges, lighter center */}
      <div 
        className="absolute inset-0" 
        style={{ background: 'radial-gradient(ellipse at 50% 30%, transparent 30%, rgba(0,0,0,0.6) 100%)' }} 
      />
    </div>
  );
}
