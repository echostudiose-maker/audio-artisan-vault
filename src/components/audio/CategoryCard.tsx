import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface CategoryCardProps {
  label: string;
  href: string;
  color: string;
  count?: number;
}

export function CategoryCard({ label, href, color, count }: CategoryCardProps) {
  return (
    <Link
      to={href}
      className="group relative flex-shrink-0 w-40 h-40 rounded-xl overflow-hidden transition-transform hover:scale-105"
    >
      <div className={cn('absolute inset-0', color)} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      <div className="relative h-full flex flex-col justify-between p-4">
        <h3 className="text-lg font-bold text-white">{label}</h3>
        {count !== undefined && (
          <span className="text-xs text-white/70">{count} trilhas</span>
        )}
      </div>
    </Link>
  );
}
