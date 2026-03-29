import { Button } from "@/components/ui/button";
import { type TipCategory, CATEGORY_COLORS, CATEGORIES } from "@/lib/data-seed";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  selected: TipCategory | null;
  onChange: (category: TipCategory | null) => void;
}

export default function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={selected === null ? "default" : "outline"}
        size="sm"
        onClick={() => onChange(null)}
        className="rounded-full"
      >
        All Categories
      </Button>
      {CATEGORIES.map(category => (
        <button
          key={category}
          onClick={() => onChange(selected === category ? null : category)}
          className={cn(
            "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-all border",
            selected === category
              ? cn(CATEGORY_COLORS[category], "border-current ring-2 ring-current ring-offset-1")
              : cn(CATEGORY_COLORS[category], "opacity-70 hover:opacity-100 border-transparent")
          )}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
