import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Music, Waves, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const navItems = [
  { href: '/', label: 'Início', icon: Home },
  { href: '/explore', label: 'Explorar', icon: Search },
  { href: '/music', label: 'Músicas', icon: Music },
  { href: '/sfx', label: 'SFX', icon: Waves },
  { href: '/auth', label: 'Perfil', icon: User, authHref: '/favorites' },
];

export function MobileBottomNav() {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden h-16 items-center justify-around border-t border-border bg-card/95 backdrop-blur-xl">
      {navItems.map((item) => {
        const href = item.authHref && user ? item.authHref : item.href;
        const Icon = item.icon;
        const isActive = location.pathname === href || (href !== '/' && location.pathname.startsWith(href));
        return (
          <Link
            key={item.label}
            to={href}
            className={cn(
              'flex flex-col items-center gap-0.5 px-3 py-1.5 text-[10px] font-medium transition-colors',
              isActive ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            <Icon className="h-5 w-5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
