import { useNavigate } from '@tanstack/react-router';
import { Wallet, Hash, ArrowRight, Shield, Zap, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Home() {
  const navigate = useNavigate();

  const implementations = [
    {
      title: 'Wallet Widget',
      description: 'Connect and manage your Midnight wallet. View addresses, balances, and connection status in a unified dashboard.',
      icon: Wallet,
      path: '/wallet-ui' as const,
      accent: 'from-violet-500/10 to-violet-500/5',
      iconColor: 'text-violet-500',
    },
    {
      title: 'Counter Contract',
      description: 'Deploy and interact with a privacy-preserving smart contract. Experience zero-knowledge proofs in action.',
      icon: Hash,
      path: '/counter' as const,
      accent: 'from-blue-500/10 to-blue-500/5',
      iconColor: 'text-blue-500',
    },
  ];

  const features = [
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Built on Midnight Network with zero-knowledge proof technology.',
    },
    {
      icon: Zap,
      title: 'Fast & Modern',
      description: 'React 19, Vite, and TypeScript for a blazing fast developer experience.',
    },
    {
      icon: Lock,
      title: 'Secure by Design',
      description: 'Shielded transactions and encrypted state out of the box.',
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-primary/[0.03]" />
        <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-24 relative">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              Midnight Network
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-4">
              Midnight Starter Template
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              A production-ready foundation for building privacy-preserving decentralized applications on the Midnight Network.
            </p>
          </div>
        </div>
      </section>

      {/* Implementation Cards */}
      <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-6">
            Explore
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {implementations.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate({ to: item.path })}
                  className="group text-left bg-card rounded-xl border border-border/60 p-6 transition-all duration-200 hover:border-border hover:shadow-lg hover:shadow-black/[0.04] dark:hover:shadow-black/20"
                >
                  <div className={`inline-flex items-center justify-center w-11 h-11 rounded-lg bg-gradient-to-br ${item.accent} mb-4`}>
                    <Icon className={`h-5 w-5 ${item.iconColor}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {item.description}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary group-hover:gap-2.5 transition-all">
                    Get started
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border/60">
        <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.title} className="text-center sm:text-left">
                    <div className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-muted mb-3">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <h3 className="text-sm font-semibold text-foreground mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
