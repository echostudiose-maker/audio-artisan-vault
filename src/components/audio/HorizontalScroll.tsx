import { ReactNode, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

interface HorizontalScrollSectionProps {
  title: string;
  seeAllLabel?: string;
  children: ReactNode;
  allItems?: ReactNode;
  seeAllHref?: string;
}

export function HorizontalScrollSection({
  title,
  seeAllLabel = 'Ver todos',
  children,
  allItems,
}: HorizontalScrollSectionProps) {
  const [open, setOpen] = useState(false);

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">{title}</h2>
        {allItems && (
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 text-sm text-muted-foreground hover:text-foreground"
            onClick={() => setOpen(true)}
          >
            {seeAllLabel}
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
      <ScrollArea className="w-full">
        <div className="flex gap-4 pb-4">
          {children}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{title}</SheetTitle>
          </SheetHeader>
          <div className="grid grid-cols-2 gap-3 mt-6">
            {allItems}
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
}
