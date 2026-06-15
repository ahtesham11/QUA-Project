import { Link } from 'react-router-dom';
import { Zap, Shield, ExternalLink } from 'lucide-react';

const FOOTER_LINKS = {
  Product: [
    { label: 'All Products', to: '/products' },
    { label: 'Compare Plans', to: '/compare' },
    { label: 'Recommendation Wizard', to: '/recommend' },
  ],
  Support: [
    { label: 'AI Assistant', to: '/assistant' },
    { label: 'Admin Panel', to: '/admin/products' },
  ],
};

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-white/8 bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Brand col */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-lg text-white">
                TaxWise <span className="gradient-text">AI</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              General product guidance for Canadian tax filers. Not tax, legal, or financial advice.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Shield className="w-3.5 h-3.5 text-emerald-500" />
              Fictional demo application
            </div>
          </div>

          {/* Link cols */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section} className="space-y-4">
              <h4 className="text-white font-semibold text-sm tracking-wide">{section}</h4>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-slate-400 hover:text-blue-400 text-sm transition-colors flex items-center gap-1.5 group"
                    >
                      {link.label}
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-xs">
            © {new Date().getFullYear()} TaxWise AI. All product guidance is general in nature.
          </p>
          <p className="text-slate-600 text-xs text-center sm:text-right max-w-sm">
            This application is fictional and for demonstration only. Not affiliated with any real tax authority.
          </p>
        </div>
      </div>
    </footer>
  );
}
