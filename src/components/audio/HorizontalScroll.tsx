import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface HorizontalScrollSectionProps {
  title: string;
  seeAllHref?: string;
  seeAllLabel?: string;
  children: ReactNode;
}

export function HorizontalScrollSection({
  title,
  seeAllHref,
  seeAllLabel = 'Ver todos',
  children,
}: HorizontalScrollSectionProps) {
  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">{title}</h2>
        {seeAllHref && (
          <Link
            to={seeAllHref}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {seeAllLabel}
            <ChevronRight className="h-4 w-4" />
          </Link>
        )}
      </div>
      <ScrollArea className="w-full">
        <div className="flex gap-4 pb-4">
          {children}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  );
}
