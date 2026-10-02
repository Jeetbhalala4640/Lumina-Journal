import React, { useState } from 'react';
import { Mail, Check, ArrowRight, Sparkles } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const { success } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubscribed(true);
      success('Welcome aboard! You will receive new essays directly in your inbox.');
    }, 600);
  };

  return (
    <section className="my-16 sm:my-24 relative overflow-hidden rounded-3xl bg-neutral-900 dark:bg-neutral-900 border border-neutral-800 text-white p-8 sm:p-12 lg:p-16">
      {/* Background accents */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-medium text-brand-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>The Lumina Dispatches</span>
        </div>

        <h2 className="font-serif font-bold text-3xl sm:text-4xl text-white tracking-tight leading-tight">
          Delivered thoughtfully to your inbox.
        </h2>

        <p className="text-neutral-400 text-sm sm:text-base leading-relaxed max-w-lg mx-auto">
          Deep architectural case studies, interface design essays, and notes on software craft. No spam, no marketing fluff — just thoughtful long-form writing.
        </p>

        {subscribed ? (
          <div className="pt-4 flex items-center justify-center gap-2 text-emerald-400 font-medium">
            <Check className="w-5 h-5 bg-emerald-500/20 p-1 rounded-full" />
            <span>You&apos;re subscribed. Thank you for reading!</span>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="pt-4 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <div className="relative flex-1">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full pl-10 pr-4 py-3 text-sm rounded-xl bg-neutral-800/90 border border-neutral-700/80 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold transition-all shadow-md hover:shadow-brand-500/20 active:scale-95 disabled:opacity-50"
            >
              <span>{loading ? 'Subscribing...' : 'Subscribe'}</span>
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
        )}

        <p className="text-xs text-neutral-500 pt-2">
          Join 4,200+ engineers & designers. Unsubscribe at any time with one click.
        </p>
      </div>
    </section>
  );
};

export default NewsletterSection;
