import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Star } from 'lucide-react';
import type { Product } from '../types';

interface Props {
  product: Product;
  highlighted?: boolean;
}

export default function ProductCard({ product, highlighted = false }: Props) {
  const priceLabel = product.price === 0 ? 'Free' : `$${product.price}`;

  return (
    <article
      className={`card flex flex-col h-full transition-all duration-300 ${
        highlighted ? 'border-blue-500/50 shadow-glow' : ''
      }`}
    >
      {/* Highlight accent bar */}
      {highlighted && (
        <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-blue-500 to-violet-500 rounded-t-2xl" />
      )}

      <div className="p-6 flex flex-col h-full">
        {/* Most popular badge */}
        {highlighted && (
          <div className="flex items-center gap-1.5 mb-3">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="badge badge-purple text-xs">Most Popular</span>
          </div>
        )}

        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-display font-bold text-lg text-white leading-tight">
            {product.name}
          </h3>
          <div className="text-right shrink-0 ml-3">
            <div className="text-2xl font-bold gradient-text font-display leading-none">
              {priceLabel}
            </div>
            {product.price > 0 && (
              <div className="text-slate-500 text-xs mt-0.5">CAD/yr</div>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-slate-400 text-sm leading-relaxed mb-4 flex-1">
          {product.description}
        </p>

        {/* Features */}
        <div className="space-y-1.5 mb-5">
          {product.supported_features.slice(0, 4).map(f => (
            <div key={f} className="flex items-center gap-2 text-sm text-slate-300">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{f}</span>
            </div>
          ))}
          {product.supported_features.length > 4 && (
            <div className="text-slate-500 text-xs pl-5.5">
              +{product.supported_features.length - 4} more features
            </div>
          )}
        </div>

        {/* Footer buttons */}
        <div className="flex gap-2 mt-auto pt-2">
          <Link to="/recommend" className="btn btn-primary btn-sm flex-1 justify-center" >
            Get Started <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link to="/products" className="btn btn-ghost btn-sm">
            Details
          </Link>
        </div>
      </div>
    </article>
  );
}
