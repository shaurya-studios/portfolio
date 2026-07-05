import { motion } from 'framer-motion';

export default function Video() {
  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-16"
      >
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4">Video <span className="text-gradient">Editing</span></h1>
        <p className="text-secondary max-w-2xl text-lg">
          High-retention, cinematic, and perfectly paced. Here is a selection of my best work.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Video Card 1 */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="glass rounded-xl overflow-hidden shadow-2xl border-white/5"
        >
          <div className="aspect-video w-full bg-black relative">
            <iframe 
              src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
              title="Video Sample 1"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
              className="absolute inset-0 w-full h-full border-0"
            />
          </div>
          <div className="p-6">
            <h3 className="text-xl font-bold mb-2">Gaming Highlight Reel</h3>
            <p className="text-sm text-secondary">Fast-paced cuts and motion graphics tailored for high retention.</p>
          </div>
        </motion.div>

        {/* Video Card 2 */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="glass rounded-xl overflow-hidden shadow-2xl border-white/5"
        >
          <div className="aspect-video w-full bg-black relative">
            <iframe 
              src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
              title="Video Sample 2"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
              className="absolute inset-0 w-full h-full border-0"
            />
          </div>
          <div className="p-6">
            <h3 className="text-xl font-bold mb-2">Cinematic Vlog Edit</h3>
            <p className="text-sm text-secondary">Color grading and seamless transitions for storytelling.</p>
          </div>
        </motion.div>

        {/* Video Card 3 */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="glass rounded-xl overflow-hidden shadow-2xl border-white/5"
        >
          <div className="aspect-video w-full bg-black relative">
            <iframe 
              src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
              title="Video Sample 3"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
              className="absolute inset-0 w-full h-full border-0"
            />
          </div>
          <div className="p-6">
            <h3 className="text-xl font-bold mb-2">Promotional Ad</h3>
            <p className="text-sm text-secondary">Engaging promotional material built to convert viewers into clients.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
