import { Link, useRouterState } from '@tanstack/react-router';
import { ReactNode } from 'react';
import { ModeToggle } from '@/components/mode-toggle';
import { Home, Hash, Wallet } from 'lucide-react';

interface MainLayoutProps {
  children: ReactNode;
}

const navItems = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/counter', label: 'Counter', icon: Hash },
  { to: '/wallet-ui', label: 'Wallet', icon: Wallet },
] as const;

export const MainLayout = ({ children }: MainLayoutProps) => {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto flex items-center justify-between h-16 px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img
              src="/transparent-logo-white.svg"
              alt="Edda Labs"
              className="h-5 hidden dark:block"
            />
            <img
              src="/transparent-logo-black.svg"
              alt="Edda Labs"
              className="h-5 dark:hidden block"
            />
          </Link>

          <nav className="flex items-center gap-1">
            {navItems.map(({ to, label, icon: Icon }) => {
              const isActive = currentPath === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                    ${isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{label}</span>
                </Link>
              );
            })}
          </nav>

          <ModeToggle />
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t border-border/60 py-6">
        <div className="container mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            Built on Midnight Network
          </p>
          <a
            href="https://eddalabs.io"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            aria-label="Visit Edda Labs website"
          >
            <span className="text-xs text-muted-foreground">Powered by</span>
            <img
              src="/transparent-logo-white.svg"
              alt="Edda Labs"
              className="h-3.5 hidden dark:block"
            />
            <img
              src="/transparent-logo-black.svg"
              alt="Edda Labs"
              className="h-3.5 dark:hidden block"
            />
          </a>
        </div>
      </footer>
    </div>
  );
};
