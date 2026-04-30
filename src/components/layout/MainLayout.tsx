import { ReactNode, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { PlayerBar } from '../player/PlayerBar';
import { MobileBottomNav } from './MobileBottomNav';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar - hidden on mobile */}
      <div className="hidden md:block">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      </div>

      {/* Main content area */}
      <div className={`transition-all duration-300 ${collapsed ? 'md:pl-16' : 'md:pl-64'}`}>
        <Header />
        <main className="min-h-[calc(100vh-4rem)] pb-36 md:pb-24">
          {children}
        </main>
        <footer className="border-t border-border bg-card/50 py-6 mb-20 md:mb-16">
          <div className="container flex flex-col items-center gap-3 text-sm text-muted-foreground">
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/terms" className="hover:text-foreground transition-colors">Termos de Uso</Link>
              <Link to="/privacy" className="hover:text-foreground transition-colors">Privacidade</Link>
              <Link to="/license" className="hover:text-foreground transition-colors">Licenciamento</Link>
              <Link to="/pricing" className="hover:text-foreground transition-colors">Premium</Link>
            </div>
            <p>&copy; {new Date().getFullYear()} EchoMusic. Todos os direitos reservados.</p>
          </div>
        </footer>
        <PlayerBar />
      </div>

      {/* Mobile bottom nav */}
      <MobileBottomNav />
    </div>
  );
}
