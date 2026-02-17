import { ReactNode, useState } from 'react';
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
        <PlayerBar />
      </div>

      {/* Mobile bottom nav */}
      <MobileBottomNav />
    </div>
  );
}
