import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import {
  Music,
  Waves,
  Heart,
  ListMusic,
  Download,
  Home,
  Search,
  LogIn,
  Crown,
  Shield,
  ChevronLeft,
  ChevronRight,
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

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation();
  const { user, isAdmin, isSubscribed } = useAuth();

  const linkClass = (isActive: boolean) =>
    cn(
      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
      collapsed && 'justify-center px-2',
      isActive
        ? 'bg-primary text-primary-foreground'
        : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
    );

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-border bg-sidebar transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Floating toggle on the sidebar edge */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-sidebar text-muted-foreground shadow-md hover:bg-sidebar-accent hover:text-foreground transition-colors"
      >
        {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
      </button>

      {/* Logo */}
      <div className="flex h-16 items-center border-b border-border px-3">
        <Link to="/" className="flex items-center gap-2 overflow-hidden">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg gradient-primary">
            <Music className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <span className="text-xl font-bold whitespace-nowrap">
              <span className="text-primary">Echo</span>
              <span className="text-foreground">Music</span>
            </span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {publicLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.href;
            return (
              <Link key={link.href} to={link.href} className={linkClass(isActive)} title={collapsed ? link.label : undefined}>
                <Icon className="h-5 w-5 shrink-0" />
                {!collapsed && link.label}
              </Link>
            );
          })}
        </div>

        {user && (
          <>
            <div className="my-4 border-t border-border" />
            {!collapsed && (
              <p className="mb-2 px-3 text-xs font-semibold uppercase text-muted-foreground">
                Minha Biblioteca
              </p>
            )}
            <div className="space-y-1">
              {userLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.href;
                return (
                  <Link key={link.href} to={link.href} className={linkClass(isActive)} title={collapsed ? link.label : undefined}>
                    <Icon className="h-5 w-5 shrink-0" />
                    {!collapsed && link.label}
                  </Link>
                );
              })}
            </div>
          </>
        )}

        {isAdmin && (
          <>
            <div className="my-4 border-t border-border" />
            {!collapsed && (
              <p className="mb-2 px-3 text-xs font-semibold uppercase text-muted-foreground">
                Administração
              </p>
            )}
            <div className="space-y-1">
              {adminLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname.startsWith(link.href);
                return (
                  <Link key={link.href} to={link.href} className={linkClass(isActive)} title={collapsed ? link.label : undefined}>
                    <Icon className="h-5 w-5 shrink-0" />
                    {!collapsed && link.label}
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-border p-2">
        {!user ? (
          <Link to="/auth">
            <Button className={cn('w-full gap-2', collapsed && 'px-0')} variant="default" size={collapsed ? 'icon' : 'default'}>
              <LogIn className="h-4 w-4 shrink-0" />
              {!collapsed && 'Entrar'}
            </Button>
          </Link>
        ) : !isSubscribed ? (
          <Link to="/pricing">
            <Button className={cn('w-full gap-2 gradient-primary hover:opacity-90', collapsed && 'px-0')} size={collapsed ? 'icon' : 'default'}>
              <Crown className="h-4 w-4 shrink-0" />
              {!collapsed && 'Assinar Premium'}
            </Button>
          </Link>
        ) : (
          <div className={cn('flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2', collapsed && 'justify-center px-2')}>
            <Crown className="h-4 w-4 text-primary shrink-0" />
            {!collapsed && <span className="text-sm font-medium text-primary">Premium Ativo</span>}
          </div>
        )}
      </div>
    </aside>
  );
}
