import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRecommendation } from '../api';
import type { WizardAnswers, RecommendationResult } from '../types';
import {
  User, Laptop, Building2, TrendingUp, GraduationCap,
  Briefcase, Car, Home, Globe, PiggyBank, BarChart2,
  House, Heart, HandHeart, Receipt, Store, Wrench,
  Hand, UserCheck, Users, HeartHandshake,
  CheckCircle, ArrowRight, ArrowLeft, RotateCcw,
  MessageSquare, GitCompare, Target, AlertTriangle,
  TrendingDown, Sparkles,
} from 'lucide-react';

const INCOME_OPTIONS = [
  { id: 'salary-income',     label: 'Employment / Salary',   icon: Briefcase },
  { id: 'student-income',    label: 'Student Income',         icon: GraduationCap },
  { id: 'freelance-income',  label: 'Freelance / Contract',   icon: Laptop },
  { id: 'gig-work-income',   label: 'Gig Work (Uber, etc.)',  icon: Car },
  { id: 'investment-income', label: 'Investment Income',      icon: TrendingUp },
  { id: 'capital-gains',     label: 'Capital Gains',          icon: BarChart2 },
  { id: 'rental-income',     label: 'Rental Income',          icon: House },
  { id: 'foreign-income',    label: 'Foreign Income',         icon: Globe },
];

const DEDUCTION_OPTIONS = [
  { id: 'medical-expenses',     label: 'Medical Expenses',      icon: Heart },
  { id: 'donations',            label: 'Charitable Donations',  icon: HandHeart },
  { id: 'employment-expenses',  label: 'Employment Expenses',   icon: Receipt },
  { id: 'business-expenses',    label: 'Business Expenses',     icon: Store },
  { id: 'home-office-expenses', label: 'Home Office',           icon: Home },
  { id: 'vehicle-expenses',     label: 'Vehicle Expenses',      icon: Car },
  { id: 'no-deductions',        label: 'No Special Deductions', icon: Hand },
];

const HELP_OPTIONS = [
  { id: 'self',        label: "I'll file myself",           desc: 'You do it on your own — we guide the software.', icon: UserCheck },
  { id: 'expert-help', label: 'Expert help while I file',   desc: 'You file, but a real tax expert is on call via chat or video.', icon: Users },
  { id: 'expert-file', label: 'Expert files for me',        desc: 'A dedicated expert prepares and submits your return.', icon: HeartHandshake },
];

const STEPS = ['Filing Type', 'Income Sources', 'Deductions', 'Help Preference'];

function ConfidenceBadge({ level }: { level: string }) {
  const map: Record<string, { cls: string; label: string }> = {
    high:   { cls: 'badge-green',  label: 'High Confidence' },
    medium: { cls: 'badge-yellow', label: 'Medium Confidence' },
    low:    { cls: 'badge-purple', label: 'Low Confidence' },
  };
  const { cls, label } = map[level] ?? map.medium;
  return <span className={`badge ${cls}`}>{label}</span>;
}

export default function RecommendPage() {
  const navigate = useNavigate();
  const [step,          setStep]         = useState(0);
  const [filingType,    setFilingType]   = useState('');
  const [hasRevenue,    setHasRevenue]   = useState<boolean | null>(null);
  const [incomeSources, setIncomeSources] = useState<string[]>([]);
  const [deductions,    setDeductions]   = useState<string[]>([]);
  const [helpPref,      setHelpPref]     = useState('');
  const [loading,       setLoading]      = useState(false);
  const [result,        setResult]       = useState<RecommendationResult | null>(null);
  const [error,         setError]        = useState('');

  const totalSteps = filingType === 'incorporated' ? STEPS.length + 1 : STEPS.length;
  const progress   = (step / totalSteps) * 100;

  function toggleIncome(id: string) {
    setIncomeSources(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }
  function toggleDeduction(id: string) {
    if (id === 'no-deductions') { setDeductions(['no-deductions']); return; }
    setDeductions(prev => {
      const without = prev.filter(x => x !== 'no-deductions');
      return without.includes(id) ? without.filter(x => x !== id) : [...without, id];
    });
  }

  async function submit() {
    setLoading(true); setError('');
    try {
      const res = await getRecommendation({
        filing_type: filingType, income_sources: incomeSources,
        deductions, help_preference: helpPref,
        has_revenue: filingType === 'incorporated' ? hasRevenue : null,
      } as WizardAnswers);
      setResult(res);
    } catch {
      setError('Could not get recommendation. Is the backend running?');
    } finally { setLoading(false); }
  }

  function restart() {
    setStep(0); setFilingType(''); setHasRevenue(null);
    setIncomeSources([]); setDeductions([]); setHelpPref('');
    setResult(null); setError('');
  }

  // ── Results ────────────────────────────────────────────────────────────────
  if (result) return (
    <main className="page-wrapper bg-slate-950">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <div className="card p-8 fade-in">
          {/* Result header */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-blue-400" />
                <span className="text-slate-400 text-sm font-medium">Your Recommended Product</span>
              </div>
              <h1 className="font-display font-bold text-3xl sm:text-4xl gradient-text mb-2">
                {result.recommended_product_name}
              </h1>
              <div className="text-2xl font-bold text-white">
                {result.price === 0 ? 'Free' : `$${result.price} CAD`}
              </div>
            </div>
            <ConfidenceBadge level={result.confidence} />
          </div>

          {/* Warnings */}
          {result.warnings.length > 0 && (
            <div className="space-y-2 mb-5">
              {result.warnings.map((w, i) => (
                <div key={i} className="flex items-start gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" /> {w}
                </div>
              ))}
            </div>
          )}

          {/* Why this product */}
          <div className="mb-5">
            <h3 className="font-semibold text-white mb-3 text-sm uppercase tracking-wider">Why this product?</h3>
            <div className="space-y-2">
              {result.reasons.map((r, i) => (
                <div key={i} className="flex items-start gap-2.5 text-slate-300 text-sm">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> {r}
                </div>
              ))}
            </div>
          </div>

          {/* Optional upgrade */}
          {result.optional_upgrade && (
            <div className="p-5 rounded-xl bg-violet-500/10 border border-violet-500/20 mb-5">
              <div className="badge badge-purple mb-3">Optional Upgrade</div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-white">{result.optional_upgrade.product_name}</span>
                <span className="text-slate-400 text-sm">${result.optional_upgrade.price} CAD</span>
              </div>
              <p className="text-slate-400 text-sm">{result.optional_upgrade.reason}</p>
            </div>
          )}

          {/* Disclaimer */}
          <div className="disclaimer-box mb-6">{result.disclaimer}</div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="btn btn-primary btn-lg flex-1 justify-center" onClick={() => navigate('/assistant')} id="result-ask-ai">
              <MessageSquare className="w-5 h-5" /> Ask AI Assistant
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/compare')} id="result-compare">
              <GitCompare className="w-4 h-4" /> Compare
            </button>
            <button className="btn btn-ghost" onClick={restart} id="result-restart">
              <RotateCcw className="w-4 h-4" /> Restart
            </button>
          </div>
        </div>
      </div>
    </main>
  );

  // ── Wizard ─────────────────────────────────────────────────────────────────
  return (
    <main className="page-wrapper bg-slate-950">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">

        {/* Progress header */}
        <div className="mb-8 fade-in">
          <div className="flex items-center justify-between mb-2">
            <span className="badge badge-blue">Step {step + 1} of {totalSteps}</span>
            <span className="text-slate-500 text-xs">{Math.round(progress)}% complete</span>
          </div>
          <div className="progress-track mb-4">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <h1 className="section-title">{STEPS[Math.min(step, STEPS.length - 1)]}</h1>
        </div>

        <div className="card p-6 sm:p-8 fade-in">

          {/* ── Step 0: Filing Type ── */}
          {step === 0 && (
            <div>
              <p className="text-slate-400 text-sm mb-5">How do you primarily earn income or file taxes?</p>
              <div className="space-y-3">
                {[
                  { id: 'personal',      label: 'Personal',               desc: 'Employed, student, or simple personal return.', icon: User },
                  { id: 'self-employed', label: 'Freelancer / Self-Employed', desc: 'Contractor, gig worker, or sole proprietor.', icon: Laptop },
                  { id: 'incorporated', label: 'Incorporated Company',    desc: 'You own a registered corporation.', icon: Building2 },
                ].map(opt => (
                  <label key={opt.id} className={`option-card ${filingType === opt.id ? 'selected' : ''}`} id={`filing-${opt.id}`}>
                    <input type="radio" name="filing" value={opt.id} checked={filingType === opt.id} onChange={() => setFilingType(opt.id)} />
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${filingType === opt.id ? 'bg-blue-500/20' : 'bg-white/5'}`}>
                      <opt.icon className={`w-5 h-5 ${filingType === opt.id ? 'text-blue-400' : 'text-slate-400'}`} />
                    </div>
                    <div>
                      <div className="font-semibold text-white text-sm">{opt.label}</div>
                      <div className="text-slate-400 text-xs mt-0.5">{opt.desc}</div>
                    </div>
                    {filingType === opt.id && <CheckCircle className="w-5 h-5 text-blue-400 ml-auto shrink-0" />}
                  </label>
                ))}
              </div>
              <div className="flex justify-end mt-6">
                <button className="btn btn-primary" disabled={!filingType}
                  onClick={() => setStep(filingType === 'incorporated' ? 0.5 as any : 1)} id="step0-next">
                  Next <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ── Step 0.5: Revenue ── */}
          {(step as any) === 0.5 && (
            <div>
              <p className="text-slate-400 text-sm mb-2">Did your corporation earn revenue this year?</p>
              <p className="text-slate-500 text-xs mb-5">This determines whether you need a full corporate return or a nil return.</p>
              <div className="space-y-3">
                {[
                  { val: true,  label: 'Yes, we had revenue',     icon: TrendingUp },
                  { val: false, label: 'No revenue (nil return)',  icon: TrendingDown },
                ].map(opt => (
                  <label key={String(opt.val)} className={`option-card ${hasRevenue === opt.val ? 'selected' : ''}`} id={`revenue-${opt.val}`}>
                    <input type="radio" name="revenue" checked={hasRevenue === opt.val} onChange={() => setHasRevenue(opt.val)} />
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${hasRevenue === opt.val ? 'bg-blue-500/20' : 'bg-white/5'}`}>
                      <opt.icon className={`w-5 h-5 ${hasRevenue === opt.val ? 'text-blue-400' : 'text-slate-400'}`} />
                    </div>
                    <div className="font-semibold text-white text-sm">{opt.label}</div>
                    {hasRevenue === opt.val && <CheckCircle className="w-5 h-5 text-blue-400 ml-auto shrink-0" />}
                  </label>
                ))}
              </div>
              <div className="flex justify-between mt-6">
                <button className="btn btn-ghost" onClick={() => setStep(0)} id="step05-back"><ArrowLeft className="w-4 h-4" /> Back</button>
                <button className="btn btn-primary" disabled={hasRevenue === null} onClick={() => setStep(1)} id="step05-next">Next <ArrowRight className="w-4 h-4" /></button>
              </div>
            </div>
          )}

          {/* ── Step 1: Income Sources ── */}
          {step === 1 && (
            <div>
              <p className="text-slate-400 text-sm mb-5">Select all income sources that apply to you.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {INCOME_OPTIONS.map(opt => (
                  <label key={opt.id} className={`option-card ${incomeSources.includes(opt.id) ? 'selected' : ''}`} id={`income-${opt.id}`}>
                    <input type="checkbox" checked={incomeSources.includes(opt.id)} onChange={() => toggleIncome(opt.id)} />
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${incomeSources.includes(opt.id) ? 'bg-blue-500/20' : 'bg-white/5'}`}>
                      <opt.icon className={`w-4 h-4 ${incomeSources.includes(opt.id) ? 'text-blue-400' : 'text-slate-400'}`} />
                    </div>
                    <span className="font-medium text-white text-sm">{opt.label}</span>
                    {incomeSources.includes(opt.id) && <CheckCircle className="w-4 h-4 text-blue-400 ml-auto shrink-0" />}
                  </label>
                ))}
              </div>
              <div className="flex justify-between mt-6">
                <button className="btn btn-ghost" onClick={() => setStep(filingType === 'incorporated' ? 0.5 as any : 0)} id="step1-back"><ArrowLeft className="w-4 h-4" /> Back</button>
                <button className="btn btn-primary" disabled={incomeSources.length === 0} onClick={() => setStep(2)} id="step1-next">Next <ArrowRight className="w-4 h-4" /></button>
              </div>
            </div>
          )}

          {/* ── Step 2: Deductions ── */}
          {step === 2 && (
            <div>
              <p className="text-slate-400 text-sm mb-5">Which deductions do you plan to claim?</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {DEDUCTION_OPTIONS.map(opt => (
                  <label key={opt.id} className={`option-card ${deductions.includes(opt.id) ? 'selected' : ''}`} id={`ded-${opt.id}`}>
                    <input type="checkbox" checked={deductions.includes(opt.id)} onChange={() => toggleDeduction(opt.id)} />
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${deductions.includes(opt.id) ? 'bg-blue-500/20' : 'bg-white/5'}`}>
                      <opt.icon className={`w-4 h-4 ${deductions.includes(opt.id) ? 'text-blue-400' : 'text-slate-400'}`} />
                    </div>
                    <span className="font-medium text-white text-sm">{opt.label}</span>
                    {deductions.includes(opt.id) && <CheckCircle className="w-4 h-4 text-blue-400 ml-auto shrink-0" />}
                  </label>
                ))}
              </div>
              <div className="flex justify-between mt-6">
                <button className="btn btn-ghost" onClick={() => setStep(1)} id="step2-back"><ArrowLeft className="w-4 h-4" /> Back</button>
                <button className="btn btn-primary" disabled={deductions.length === 0} onClick={() => setStep(3)} id="step2-next">Next <ArrowRight className="w-4 h-4" /></button>
              </div>
            </div>
          )}

          {/* ── Step 3: Help Preference ── */}
          {step === 3 && (
            <div>
              <p className="text-slate-400 text-sm mb-5">How would you like to complete your return?</p>
              <div className="space-y-3">
                {HELP_OPTIONS.map(opt => (
                  <label key={opt.id} className={`option-card ${helpPref === opt.id ? 'selected' : ''}`} id={`help-${opt.id}`}>
                    <input type="radio" name="help" value={opt.id} checked={helpPref === opt.id} onChange={() => setHelpPref(opt.id)} />
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${helpPref === opt.id ? 'bg-blue-500/20' : 'bg-white/5'}`}>
                      <opt.icon className={`w-5 h-5 ${helpPref === opt.id ? 'text-blue-400' : 'text-slate-400'}`} />
                    </div>
                    <div>
                      <div className="font-semibold text-white text-sm">{opt.label}</div>
                      <div className="text-slate-400 text-xs mt-0.5">{opt.desc}</div>
                    </div>
                    {helpPref === opt.id && <CheckCircle className="w-5 h-5 text-blue-400 ml-auto shrink-0" />}
                  </label>
                ))}
              </div>
              {error && (
                <div className="flex items-center gap-2 mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
                </div>
              )}
              <div className="flex justify-between mt-6">
                <button className="btn btn-ghost" onClick={() => setStep(2)} id="step3-back"><ArrowLeft className="w-4 h-4" /> Back</button>
                <button className="btn btn-primary btn-lg" disabled={!helpPref || loading} onClick={submit} id="step3-submit">
                  {loading
                    ? <><div className="spinner !w-4 !h-4 !border-2" /> Analysing…</>
                    : <><Sparkles className="w-5 h-5" /> Get My Recommendation</>
                  }
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}
