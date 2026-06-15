import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../api';
import type { Product } from '../types';
import ProductCard from '../components/ProductCard';
import {
  ClipboardList, Brain, BadgeCheck,
  ArrowRight, ChevronDown, ChevronUp,
  MapPin, Shield, Sparkles,
} from 'lucide-react';

const HOW_IT_WORKS = [
  {
    icon: ClipboardList,
    step: '01',
    title: 'Answer Questions',
    desc: 'Tell us about your income sources, deductions, and filing type in a simple step-by-step wizard.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
  },
  {
    icon: Brain,
    step: '02',
    title: 'Smart Analysis',
    desc: 'Our recommendation engine applies priority rules to find your best product match instantly.',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
  },
  {
    icon: BadgeCheck,
    step: '03',
    title: 'Get Recommended',
    desc: 'Receive a clear recommendation with reasons, price breakdown, and optional upgrade suggestions.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
  },
];

const FAQ_ITEMS = [
  {
    q: 'Is this real tax software?',
    a: 'No — TaxWise AI is a fictional demonstration application built to showcase product recommendation and AI assistant capabilities.',
  },
  {
    q: 'Can the AI give me tax advice?',
    a: 'No. The AI assistant provides general product guidance only. Always consult a qualified tax professional for personalised tax advice.',
  },
  {
    q: 'How does the recommendation work?',
    a: 'We apply a priority rule engine: corporate rules override personal rules, expert help overrides standard products — all in a defined hierarchy.',
  },
  {
    q: 'What AI powers the assistant?',
    a: 'The assistant uses Groq (LLaMA 3.3) for fast, real AI responses. Without an API key it falls back to a built-in simulated engine.',
  },
];

const STATS = [
  { value: '8', label: 'Tax Products' },
  { value: 'AI', label: 'Groq Powered' },
  { value: '$0', label: 'To Start' },
  { value: '<1s', label: 'AI Response' },
];

export default function LandingPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    document.title = 'TaxWise AI — Find Your Perfect Tax Software';
    fetchProducts()
      .then(data => setProducts(data.slice(0, 4)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="bg-slate-950">

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden" aria-label="Hero section">
        {/* Orbs */}
        <div className="orb orb-blue  w-[600px] h-[600px] -top-32 -left-48 opacity-30" />
        <div className="orb orb-purple w-[500px] h-[500px] top-24 -right-24 opacity-20" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.4) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
          <div className="max-w-3xl fade-in">
            {/* Label */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
                <MapPin className="w-3 h-3" />
                Canadian Tax Software Guide
              </div>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold text-white leading-[1.1] mb-6">
              Find Your Perfect<br />
              <span className="gradient-text">Tax Software</span><br />
              With AI Guidance
            </h1>

            <p className="text-slate-400 text-lg sm:text-xl leading-relaxed mb-10 max-w-xl">
              Answer a few questions about your tax situation and get a personalised product recommendation — powered by smart rules and an AI assistant.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              <Link to="/recommend" className="btn btn-primary btn-lg" id="hero-cta-wizard">
                <Sparkles className="w-5 h-5" />
                Find My Product
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/compare" className="btn btn-secondary btn-lg" id="hero-cta-compare">
                Compare All Plans
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8">
              {STATS.map(s => (
                <div key={s.label} className="text-center sm:text-left">
                  <div className="text-3xl font-display font-bold gradient-text">{s.value}</div>
                  <div className="text-slate-500 text-sm mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────── */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="badge badge-blue mx-auto mb-4">How It Works</div>
            <h2 className="section-title">Three steps to your perfect plan</h2>
            <p className="section-sub mx-auto text-center">
              Simple, fast, and accurate — our wizard gets you there in under 2 minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-px bg-gradient-to-r from-blue-500/30 via-violet-500/30 to-emerald-500/30" />

            {HOW_IT_WORKS.map((item, idx) => (
              <div key={item.step} className="card p-8 text-center fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center mx-auto mb-5`}>
                  <item.icon className={`w-7 h-7 ${item.color}`} />
                </div>
                <div className="text-xs font-bold text-slate-500 tracking-widest mb-2">STEP {item.step}</div>
                <h3 className="font-display font-bold text-white text-xl mb-3">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ─────────────────────────────── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
            <div>
              <div className="badge badge-purple mb-4">Our Products</div>
              <h2 className="section-title">Plans for every situation</h2>
              <p className="section-sub">From free simple filing to full expert service.</p>
            </div>
            <Link to="/products" className="btn btn-secondary shrink-0">
              View All 8 Products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="spinner" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {products.map((p, i) => (
                <ProductCard key={p.id} product={p} highlighted={i === 2} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Trust Bar ────────────────────────────────────── */}
      <section className="py-16 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {[
              { icon: Shield, title: 'No Real Data Stored', desc: 'Purely a demonstration app. Your inputs are never persisted.' },
              { icon: Brain, title: 'Groq LLaMA 3.3', desc: 'Powered by one of the fastest LLM inference APIs available.' },
              { icon: BadgeCheck, title: 'Rule-Based Engine', desc: 'Deterministic priority logic ensures consistent, accurate recommendations.' },
            ].map(item => (
              <div key={item.title} className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="font-semibold text-white">{item.title}</h3>
                <p className="text-slate-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────── */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="badge badge-blue mx-auto mb-4">FAQ</div>
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-sub mx-auto text-center">Quick answers to common questions.</p>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <div
                key={i}
                className="card cursor-pointer"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <div className="p-5 flex items-center justify-between gap-4">
                  <span className="font-semibold text-white text-sm sm:text-base">{item.q}</span>
                  {openFaq === i
                    ? <ChevronUp className="w-5 h-5 text-blue-400 shrink-0" />
                    : <ChevronDown className="w-5 h-5 text-slate-500 shrink-0" />
                  }
                </div>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-slate-400 text-sm leading-relaxed border-t border-white/8 pt-4">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────── */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl border border-blue-500/20 bg-gradient-to-br from-blue-600/20 via-slate-900 to-violet-600/20 p-10 sm:p-16 text-center shadow-glow-lg">
            <div className="orb orb-blue w-72 h-72 -top-16 -left-16 opacity-30" />
            <div className="orb orb-purple w-72 h-72 -bottom-16 -right-16 opacity-20" />
            <div className="relative">
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-4">
                Ready to find your product?
              </h2>
              <p className="text-slate-400 text-lg mb-8 max-w-md mx-auto">
                Take our 2-minute recommendation wizard and get an AI-powered suggestion instantly.
              </p>
              <Link to="/recommend" className="btn btn-primary btn-lg" id="bottom-cta-wizard">
                <Sparkles className="w-5 h-5" />
                Start the Wizard
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
