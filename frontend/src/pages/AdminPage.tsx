import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../api';
import type { Product } from '../types';
import { CheckCircle, XCircle, Settings, LayoutGrid, BarChart3, AlertCircle } from 'lucide-react';

const FEATURE_KEYS: (keyof Product)[] = [
  'salary_income', 'student_income', 'medical_expenses', 'donations',
  'employment_expenses', 'family_deductions', 'investment_income', 'capital_gains',
  'foreign_income', 'rental_income', 'freelance_income', 'gig_work_income',
  'business_expenses', 'home_office_expenses', 'vehicle_expenses',
  'expert_help', 'full_service', 'corporate_filing', 'nil_corporate_return',
];

const FEATURE_LABELS: Partial<Record<keyof Product, string>> = {
  salary_income: 'Salary', student_income: 'Student', medical_expenses: 'Medical',
  donations: 'Donations', employment_expenses: 'Employment Exp.', family_deductions: 'Family Ded.',
  investment_income: 'Investment', capital_gains: 'Capital Gains', foreign_income: 'Foreign Income',
  rental_income: 'Rental', freelance_income: 'Freelance', gig_work_income: 'Gig Work',
  business_expenses: 'Business Exp.', home_office_expenses: 'Home Office', vehicle_expenses: 'Vehicle',
  expert_help: 'Expert Help', full_service: 'Full Service', corporate_filing: 'Corporate',
  nil_corporate_return: 'Nil Corp.',
};

const TIER_COLORS: Record<string, string> = {
  free:                  '#10b981',
  deluxe:                '#3b82f6',
  premier:               '#7c3aed',
  'self-employed':       '#f59e0b',
  'expert-assist':       '#ec4899',
  'expert-full-service': '#ef4444',
  'business-corporate':  '#06b6d4',
  'nil-corporate-return':'#8b5cf6',
};

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');

  useEffect(() => {
    document.title = 'Admin — TaxWise AI';
    fetchProducts()
      .then(setProducts)
      .catch(() => setError('Could not load products. Is the backend running?'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="page-wrapper bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="mb-10 fade-in">
          <div className="badge badge-yellow mb-4">
            <Settings className="w-3 h-3" /> Admin Panel
          </div>
          <h1 className="section-title mb-3">Product Management</h1>
          <p className="section-sub mb-5">
            Read-only product overview — {products.length} products loaded from the API.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/products" className="btn btn-ghost btn-sm" id="admin-view-products">
              <LayoutGrid className="w-3.5 h-3.5" /> View Public Products
            </Link>
            <Link to="/compare" className="btn btn-ghost btn-sm" id="admin-compare">
              <BarChart3 className="w-3.5 h-3.5" /> Compare Matrix
            </Link>
          </div>
        </div>

        {loading && <div className="flex justify-center py-20"><div className="spinner" /></div>}

        {error && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
            <AlertCircle className="w-5 h-5 shrink-0" /> {error}
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 fade-in">
            {products.map((product, idx) => {
              const color         = TIER_COLORS[product.product_id] ?? '#3b82f6';
              const supportedCount = FEATURE_KEYS.filter(k => product[k] === true).length;

              return (
                <article
                  key={product.id}
                  className="card overflow-hidden fade-in"
                  style={{ animationDelay: `${idx * 0.06}s` }}
                >
                  {/* Colour stripe */}
                  <div className="h-1 w-full" style={{ background: color }} />

                  <div className="p-5">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-mono text-slate-500 mb-1 block">#{product.product_id}</span>
                        <h2 className="font-display font-bold text-white text-base leading-tight">{product.name}</h2>
                      </div>
                      <div className="text-right ml-3">
                        <div className="text-xl font-display font-bold" style={{ color }}>
                          {product.price === 0 ? 'Free' : `$${product.price}`}
                        </div>
                        <div className="text-slate-500 text-xs">CAD</div>
                      </div>
                    </div>

                    <p className="text-slate-400 text-xs leading-relaxed mb-4">{product.description}</p>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {[
                        { num: supportedCount,         label: 'features' },
                        { num: product.sort_order,     label: 'sort order' },
                        { num: product.best_for.length, label: 'audiences' },
                      ].map(s => (
                        <div key={s.label} className="text-center p-2 rounded-lg bg-white/[0.03] border border-white/10">
                          <div className="text-lg font-bold" style={{ color }}>{s.num}</div>
                          <div className="text-slate-500 text-xs">{s.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Feature chips */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {FEATURE_KEYS.map(key => (
                        <div
                          key={key}
                          className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border transition-none ${
                            product[key]
                              ? 'border-current text-current bg-current/10'
                              : 'border-white/10 text-slate-600 bg-transparent'
                          }`}
                          style={product[key] ? { color, borderColor: color } : {}}
                          title={String(FEATURE_LABELS[key])}
                        >
                          {product[key]
                            ? <CheckCircle className="w-2.5 h-2.5" />
                            : <XCircle    className="w-2.5 h-2.5" />
                          }
                          {FEATURE_LABELS[key]}
                        </div>
                      ))}
                    </div>

                    {/* Best for */}
                    <div className="pt-3 border-t border-white/10">
                      <span className="text-slate-500 text-xs font-medium mr-2">Best for:</span>
                      {product.best_for.map(b => (
                        <span key={b} className="badge badge-blue text-xs mr-1 mt-1">{b}</span>
                      ))}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
