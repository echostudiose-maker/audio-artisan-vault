import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { EMOTION_LABELS, STYLE_LABELS, type MusicEmotion, type SfxStyle } from '@/types/database';

interface CategoryFilterProps<T extends string> {
  categories: Record<T, string>;
  selected: T | null;
  onSelect: (category: T | null) => void;
  type: 'emotion' | 'style';
}

export function CategoryFilter<T extends string>({
  categories,
  selected,
  onSelect,
  type,
}: CategoryFilterProps<T>) {
  const entries = Object.entries(categories) as [T, string][];

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex gap-2 pb-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onSelect(null)}
          className={cn(
            "category-chip",
            !selected && "active"
          )}
        >
          Todos
        </Button>
        {entries.map(([key, label]) => (
          <Button
            key={key}
            variant="ghost"
            size="sm"
            onClick={() => onSelect(key)}
            className={cn(
              "category-chip",
              selected === key && "active"
            )}
          >
            {label}
          </Button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

export function EmotionFilter({
  selected,
  onSelect,
}: {
  selected: MusicEmotion | null;
  onSelect: (emotion: MusicEmotion | null) => void;
}) {
  return (
    <CategoryFilter
      categories={EMOTION_LABELS}
      selected={selected}
      onSelect={onSelect}
      type="emotion"
    />
  );
}

export function StyleFilter({
  selected,
  onSelect,
}: {
  selected: SfxStyle | null;
  onSelect: (style: SfxStyle | null) => void;
}) {
  return (
    <CategoryFilter
      categories={STYLE_LABELS}
      selected={selected}
      onSelect={onSelect}
      type="style"
    />
  );
}
