import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-4">404</h2>
        <p className="text-xl text-gray-400 mb-8">Page not found</p>
        <Link
          href="/"
          className="px-6 py-3 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
} 