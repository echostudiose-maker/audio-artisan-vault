import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface CategoryCardProps {
  label: string;
  href: string;
  color: string;
  count?: number;
  coverUrl?: string;
}

export function CategoryCard({ label, href, color, count, coverUrl }: CategoryCardProps) {
  return (
    <Link
      to={href}
      className="group relative flex-shrink-0 w-32 h-32 sm:w-40 sm:h-40 rounded-xl overflow-hidden transition-transform hover:scale-105"
    >
      {coverUrl ? (
        <img src={coverUrl} alt={label} className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <div className={cn('absolute inset-0', color)} />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      <div className="relative h-full flex flex-col justify-between p-3 sm:p-4">
        <h3 className="text-sm sm:text-lg font-bold text-white">{label}</h3>
        {count !== undefined && (
          <span className="text-xs text-white/70">{count} trilhas</span>
        )}
      </div>
    </Link>
  );
}
