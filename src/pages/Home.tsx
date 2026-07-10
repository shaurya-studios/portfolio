import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-12">
      
      {/* Simple Header */}
      <section className="mb-24">
        <h1 className="text-5xl md:text-7xl font-bold mb-4 text-gray-900">Shaurya Agarwal</h1>
        <p className="text-xl md:text-2xl text-gray-600 max-w-3xl">
          Digital Craft. Building high-performance web experiences and editing cinematic, high-retention video.
        </p>
      </section>

      {/* Simple Projects Grid */}
      <section className="mb-24">
        <h2 className="text-3xl font-semibold mb-8 border-b pb-4">Work Areas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <Link to="/dev" className="block border border-gray-200 rounded-lg p-8 hover:bg-gray-50 transition-colors">
            <h3 className="text-2xl font-bold mb-2 text-gray-900">Web Development</h3>
            <p className="text-gray-600">Explore my technical projects, applications, and web platforms.</p>
            <span className="inline-block mt-4 text-blue-600 font-medium">View Projects &rarr;</span>
          </Link>

          <Link to="/video" className="block border border-gray-200 rounded-lg p-8 hover:bg-gray-50 transition-colors">
            <h3 className="text-2xl font-bold mb-2 text-gray-900">Video Production</h3>
            <p className="text-gray-600">Cinematic editing and high-retention video content for modern creators.</p>
            <span className="inline-block mt-4 text-blue-600 font-medium">View Reels &rarr;</span>
          </Link>
          
        </div>
      </section>

      {/* Simple Contact */}
      <section>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">Let's work together</h2>
          <p className="text-lg text-gray-600 mb-8">Ready to start a new project? Reach out below.</p>
          <a 
            href="mailto:shaurya.studios.dev@gmail.com" 
            className="inline-block bg-gray-900 text-white px-8 py-3 rounded font-medium hover:bg-gray-800 transition-colors"
          >
            Contact Me
          </a>
        </div>
      </section>

    </div>
  );
}
