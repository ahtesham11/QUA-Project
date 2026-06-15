import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../api';
import type { Product } from '../types';
import { CheckCircle, XCircle, AlertCircle, ArrowRight, BarChart3 } from 'lucide-react';

const FEATURES: { key: keyof Product; label: string }[] = [
  { key: 'salary_income',        label: 'Salary / Employment Income' },
  { key: 'student_income',       label: 'Student Income' },
  { key: 'medical_expenses',     label: 'Medical Expenses' },
  { key: 'donations',            label: 'Charitable Donations' },
  { key: 'employment_expenses',  label: 'Employment Expenses' },
  { key: 'family_deductions',    label: 'Family Deductions' },
  { key: 'investment_income',    label: 'Investment Income' },
  { key: 'capital_gains',        label: 'Capital Gains' },
  { key: 'foreign_income',       label: 'Foreign Income' },
  { key: 'rental_income',        label: 'Rental Income' },
  { key: 'freelance_income',     label: 'Freelance / Contract Income' },
  { key: 'gig_work_income',      label: 'Gig-Work Income' },
  { key: 'business_expenses',    label: 'Business Expenses' },
  { key: 'home_office_expenses', label: 'Home Office Expenses' },
  { key: 'vehicle_expenses',     label: 'Vehicle Expenses' },
  { key: 'expert_help',          label: 'Expert Help (Chat / Video)' },
  { key: 'full_service',         label: 'Expert Full Service Filing' },
  { key: 'corporate_filing',     label: 'Corporate Tax Filing' },
  { key: 'nil_corporate_return', label: 'Nil Corporate Return' },
];

export default function ComparePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');

  useEffect(() => {
    document.title = 'Compare Products — TaxWise AI';
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
          <div className="badge badge-purple mb-4">
            <BarChart3 className="w-3 h-3" /> Feature Matrix
          </div>
          <h1 className="section-title mb-3">Compare All Products</h1>
          <p className="section-sub mb-6">
            See exactly which features are included in each plan — all in one place.
          </p>
          <div className="flex gap-3">
            <Link to="/recommend" className="btn btn-primary" id="compare-cta-wizard">
              Find My Product <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/products" className="btn btn-ghost" id="compare-cta-products">View Details</Link>
          </div>
        </div>

        {loading && <div className="flex justify-center py-20"><div className="spinner" /></div>}

        {error && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
            <AlertCircle className="w-5 h-5 shrink-0" /> {error}
          </div>
        )}

        {!loading && !error && (
          <div className="fade-in">
            {/* Scrollable table wrapper */}
            <div className="overflow-x-auto rounded-2xl border border-white/10 shadow-card">
              <table className="tw-table min-w-max w-full">
                <thead>
                  <tr>
                    <th className="!text-left min-w-[200px] sticky left-0 bg-slate-900 z-10">Feature</th>
                    {products.map(p => (
                      <th key={p.id} className="min-w-[110px]">
                        <div className="font-display font-bold text-white text-sm mb-1">{p.name}</div>
                        <div className="text-blue-400 font-bold text-base">
                          {p.price === 0 ? 'Free' : `$${p.price}`}
                          {p.price > 0 && <span className="text-slate-500 font-normal text-xs ml-1">CAD</span>}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {FEATURES.map(({ key, label }) => (
                    <tr key={key} className="group">
                      <td className="!text-left font-medium text-slate-300 text-xs sticky left-0 bg-slate-950 group-hover:bg-slate-900/80 z-10">
                        {label}
                      </td>
                      {products.map(p => (
                        <td key={p.id}>
                          {p[key]
                            ? <CheckCircle className="w-4 h-4 text-emerald-400 mx-auto" aria-label="Supported" />
                            : <XCircle    className="w-4 h-4 text-slate-700 mx-auto"   aria-label="Not supported" />
                          }
                        </td>
                      ))}
                    </tr>
                  ))}

                  {/* CTA row */}
                  <tr className="border-t border-white/10">
                    <td className="sticky left-0 bg-slate-950 z-10" />
                    {products.map(p => (
                      <td key={p.id} className="py-4">
                        <Link
                          to="/recommend"
                          className="btn btn-primary btn-sm w-full"
                          id={`compare-select-${p.product_id}`}
                        >
                          Select
                        </Link>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="mt-5 text-slate-500 text-xs text-center">
              ⚠️ This comparison is for general guidance only. Always consult a qualified tax professional.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
