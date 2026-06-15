import { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Zap, Menu, X, ChevronRight, Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const NAV_LINKS = [
  { to: '/products',  label: 'Products' },
  { to: '/compare',   label: 'Compare' },
  { to: '/recommend', label: 'Wizard' },
  { to: '/assistant', label: 'AI Assistant' },
  { to: '/admin/products', label: 'Admin' },
];

export default function Navbar() {
  const [open, setOpen]       = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => { setOpen(false); }, [location]);

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-slate-900/95 dark:bg-slate-900/95 light:bg-white/95 backdrop-blur-md border-b border-white/8 light:border-slate-200 shadow-lg'
          : 'bg-transparent'
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Brand */}
          <Link to="/" className="flex items-center gap-2.5 group" aria-label="TaxWise AI home">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-glow group-hover:bg-blue-500 transition-colors">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-lg text-white dark:text-white light:text-slate-900">
              TaxWise <span className="gradient-text">AI</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-1" role="list">
            {NAV_LINKS.map(l => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  className={({ isActive }) =>
                    `px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-600/20 text-blue-400'
                        : 'text-slate-400 dark:text-slate-400 light:text-slate-600 hover:text-white light:hover:text-slate-900 hover:bg-white/8 light:hover:bg-slate-100'
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* CTA + Theme Toggle */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/8 dark:bg-white/8 light:bg-slate-200 text-slate-300 dark:text-slate-300 light:text-slate-700 hover:bg-white/12 light:hover:bg-slate-300 hover:text-white light:hover:text-slate-900 transition-all"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={`${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <Link
              to="/recommend"
              className="btn btn-primary btn-sm flex items-center gap-1.5"
              id="nav-cta"
            >
              Get Started <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile hamburger + theme */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/8 light:bg-slate-200 text-slate-300 light:text-slate-700 hover:bg-white/12 light:hover:bg-slate-300 transition-all"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/8 light:bg-slate-200 text-slate-300 light:text-slate-700 hover:bg-white/12 light:hover:bg-slate-300 transition-all"
              aria-label="Toggle menu"
              aria-expanded={open}
              onClick={() => setOpen(!open)}
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-slate-900/98 dark:bg-slate-900/98 light:bg-slate-50 border-t border-white/8 light:border-slate-200 px-4 py-4 space-y-1">
          {NAV_LINKS.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `block px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600/20 text-blue-400'
                    : 'text-slate-400 hover:text-white hover:bg-white/8'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <div className="pt-2">
            <Link
              to="/recommend"
              className="btn btn-primary w-full justify-center"
              id="nav-mobile-cta"
            >
              Get Started <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
