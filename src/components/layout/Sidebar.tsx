import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import {
  Music,
  Waves,
  Heart,
  ListMusic,
  Download,
  Settings,
  Shield,
  Home,
  Search,
  LogIn,
  Crown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const publicLinks = [
  { href: '/', label: 'Início', icon: Home },
  { href: '/explore', label: 'Explorar', icon: Search },
  { href: '/music', label: 'Músicas', icon: Music },
  { href: '/sfx', label: 'Efeitos Sonoros', icon: Waves },
];

const userLinks = [
  { href: '/favorites', label: 'Favoritos', icon: Heart },
  { href: '/playlists', label: 'Playlists', icon: ListMusic },
  { href: '/downloads', label: 'Meus Downloads', icon: Download },
];

const adminLinks = [
  { href: '/admin', label: 'Painel Admin', icon: Shield },
];

export function Sidebar() {
  const location = useLocation();
  const { user, isAdmin, isSubscribed } = useAuth();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-border bg-sidebar">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-border px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
          <Music className="h-5 w-5 text-white" />
        </div>
        <span className="text-xl font-bold gradient-text">Echo Sound</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {/* Public Links */}
        <div className="space-y-1">
          {publicLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.href;
            
            return (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                )}
              >
                <Icon className="h-5 w-5" />
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* User Links (logged in only) */}
        {user && (
          <>
            <div className="my-4 border-t border-border" />
            <p className="mb-2 px-3 text-xs font-semibold uppercase text-muted-foreground">
              Minha Biblioteca
            </p>
            <div className="space-y-1">
              {userLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.href;
                
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </>
        )}

        {/* Admin Links */}
        {isAdmin && (
          <>
            <div className="my-4 border-t border-border" />
            <p className="mb-2 px-3 text-xs font-semibold uppercase text-muted-foreground">
              Administração
            </p>
            <div className="space-y-1">
              {adminLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname.startsWith(link.href);
                
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-border p-4">
        {!user ? (
          <Link to="/auth">
            <Button className="w-full gap-2" variant="default">
              <LogIn className="h-4 w-4" />
              Entrar
            </Button>
          </Link>
        ) : !isSubscribed ? (
          <Link to="/pricing">
            <Button className="w-full gap-2 gradient-primary hover:opacity-90">
              <Crown className="h-4 w-4" />
              Assinar Premium
            </Button>
          </Link>
        ) : (
          <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2">
            <Crown className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Premium Ativo</span>
          </div>
        )}
      </div>
    </aside>
  );
}
