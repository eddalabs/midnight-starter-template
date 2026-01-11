import { useNavigate } from '@tanstack/react-router';
import { Wallet, PlusCircle } from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';

export function Home() {
  const navigate = useNavigate();

  const implementations = [
    {
      title: 'Wallet Widget',
      description: 'Connect and manage your digital wallet',
      icon: <Wallet className="w-10 h-10 text-blue-600" />,
      path: '/wallet-ui'
    },
    {
      title: 'Counter Contract',
      description: 'Interactive counter smart contract',
      icon: <PlusCircle className="w-10 h-10 text-blue-600" />,
      path: '/counter'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold text-foreground mb-2">Midnight Starter Template</h1>
            <p className="text-xl text-muted-foreground">Explore our implementations and features</p>
          </div>
          <ModeToggle />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {implementations.map((item, index) => (
            <div 
              key={index}
              className="bg-card text-card-foreground rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-border"
            >
              <div className="p-6 h-full flex flex-col">
                <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                  {item.icon}
                </div>
                <h2 className="text-2xl font-semibold text-foreground mb-2">{item.title}</h2>
                <p className="text-muted-foreground mb-6 flex-grow">{item.description}</p>
                <button
                  className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-200 flex items-center justify-center gap-2"
                  onClick={() => navigate({ to: item.path })}
                >
                  <span>Open {item.title.split(' ')[0]}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-20 mb-12 text-center">
          <p className="text-muted-foreground text-sm mb-10">Get started by exploring the implementations above</p>
          
          <div className="flex flex-col items-center justify-center space-y-1">
            <p className="text-xs text-muted-foreground tracking-wider mb-3">POWERED BY</p>
            <div className="flex items-center justify-center gap-5">              
              <a 
                href="https://eddalabs.io" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center h-5 hover:opacity-80 transition-opacity"
                aria-label="Visit Edda Labs website"
              >
                <img 
                  src="/transparent-logo-white.svg" 
                  alt="Edda Labs" 
                  className="h-5 dark:block hidden object-contain"
                  style={{ width: 'auto' }}
                />
                <img 
                  src="/transparent-logo-black.svg" 
                  alt="Edda Labs" 
                  className="h-5 dark:hidden block object-contain"
                  style={{ width: 'auto' }}
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
