import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../api';
import type { Product } from '../types';
import {
  CheckCircle, XCircle, ArrowRight, LayoutGrid,
  SlidersHorizontal, ArrowUpDown, AlertCircle,
} from 'lucide-react';

type Filter   = 'all' | 'personal' | 'expert' | 'corporate';
type SortDir  = 'asc' | 'desc';

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all',       label: 'All Plans' },
  { id: 'personal',  label: 'Personal' },
  { id: 'expert',    label: 'Expert' },
  { id: 'corporate', label: 'Corporate' },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');
  const [filter,   setFilter]   = useState<Filter>('all');
  const [sortDir,  setSortDir]  = useState<SortDir>('asc');

  useEffect(() => {
    document.title = 'Products — TaxWise AI';
    fetchProducts()
      .then(setProducts)
      .catch(() => setError('Could not load products. Is the backend running?'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = products
    .filter(p => {
      if (filter === 'personal')  return !p.corporate_filing && !p.expert_help && !p.full_service;
      if (filter === 'expert')    return p.expert_help || p.full_service;
      if (filter === 'corporate') return p.corporate_filing;
      return true;
    })
    .sort((a, b) => sortDir === 'asc' ? a.price - b.price : b.price - a.price);

  return (
    <main className="page-wrapper bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="mb-10 fade-in">
          <div className="badge badge-blue mb-4">
            <LayoutGrid className="w-3 h-3" /> All Products
          </div>
          <h1 className="section-title mb-3">Tax Software Products</h1>
          <p className="section-sub">
            From simple free filing to full expert service — choose the right plan for your situation.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 p-4 rounded-2xl bg-white/[0.03] border border-white/8 fade-in">
          {/* Filter tabs */}
          <div className="flex items-center gap-2 flex-wrap">
            <SlidersHorizontal className="w-4 h-4 text-slate-500 mr-1" />
            {FILTERS.map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                id={`filter-${f.id}`}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  filter === f.id
                    ? 'bg-blue-600 text-white shadow-glow'
                    : 'text-slate-400 hover:text-white hover:bg-white/8'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Sort */}
          <button
            onClick={() => setSortDir(d => d === 'asc' ? 'desc' : 'asc')}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <ArrowUpDown className="w-4 h-4" />
            Price: {sortDir === 'asc' ? 'Low → High' : 'High → Low'}
          </button>
        </div>

        {/* Loading */}
        {loading && <div className="flex justify-center py-20"><div className="spinner" /></div>}

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
            <AlertCircle className="w-5 h-5 shrink-0" />
            {error}
          </div>
        )}

        {/* Products grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {filtered.map((product, idx) => (
              <article
                key={product.id}
                className="card p-6 fade-in"
                style={{ animationDelay: `${idx * 0.07}s` }}
              >
                {/* Top row */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1 min-w-0">
                    <h2 className="font-display font-bold text-xl text-white mb-1">{product.name}</h2>
                    <p className="text-slate-400 text-sm leading-relaxed">{product.description}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-3xl font-display font-bold gradient-text leading-none">
                      {product.price === 0 ? 'Free' : `$${product.price}`}
                    </div>
                    {product.price > 0 && (
                      <div className="text-slate-500 text-xs mt-1">CAD / year</div>
                    )}
                  </div>
                </div>

                {/* Best for tags */}
                <div className="flex items-center gap-2 flex-wrap mb-5">
                  <span className="text-slate-500 text-xs font-medium">Best for:</span>
                  {product.best_for.map(b => (
                    <span key={b} className="badge badge-blue text-xs">{b}</span>
                  ))}
                </div>

                {/* Feature columns */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <div className="text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2.5">Included</div>
                    <div className="space-y-1.5">
                      {product.supported_features.map(f => (
                        <div key={f} className="flex items-center gap-1.5 text-slate-300 text-xs">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          {f}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-600 text-xs font-semibold uppercase tracking-wider mb-2.5">Not Included</div>
                    <div className="space-y-1.5">
                      {product.unsupported_features.slice(0, 6).map(f => (
                        <div key={f} className="flex items-center gap-1.5 text-slate-600 text-xs">
                          <XCircle className="w-3.5 h-3.5 shrink-0" />
                          {f}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                  <Link
                    to="/recommend"
                    className="btn btn-primary btn-sm"
                    id={`product-cta-${product.product_id}`}
                  >
                    Start with {product.name} <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link to="/compare" className="btn btn-ghost btn-sm">Compare</Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
