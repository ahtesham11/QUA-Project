import { Link } from 'react-router-dom';
import { Home, ArrowRight, Frown } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <main className="page-wrapper bg-slate-950 flex items-center justify-center min-h-[80vh]">
      <div className="text-center px-4 fade-in">
        <div className="w-20 h-20 rounded-3xl bg-slate-800 border border-white/10 flex items-center justify-center mx-auto mb-6">
          <Frown className="w-10 h-10 text-slate-500" />
        </div>
        <div className="text-7xl font-display font-bold gradient-text mb-4">404</div>
        <h1 className="text-2xl font-display font-bold text-white mb-3">Page Not Found</h1>
        <p className="text-slate-400 mb-8 max-w-sm mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="btn btn-primary btn-lg">
            <Home className="w-5 h-5" /> Go Home
          </Link>
          <Link to="/products" className="btn btn-ghost btn-lg">
            View Products <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </main>
  );
}
