import { motion } from 'framer-motion';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCategories } from '@/hooks/useSweets';
import { useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';

interface SweetFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  category: string;
  setCategory: (category: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
}

export function SweetFilters({
  searchQuery,
  setSearchQuery,
  category,
  setCategory,
  priceRange,
  setPriceRange,
}: SweetFiltersProps) {
  const { data: categories = [] } = useCategories();
  const [localPriceRange, setLocalPriceRange] = useState(priceRange);

  const handlePriceChange = (value: number[]) => {
    setLocalPriceRange([value[0], value[1]]);
  };

  const applyPriceFilter = () => {
    setPriceRange(localPriceRange);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col md:flex-row gap-4 mb-8"
    >
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search sweets..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-12 rounded-xl bg-card border-border/50"
        />
      </div>

      {/* Category Filter */}
      <Select value={category} onValueChange={setCategory}>
        <SelectTrigger className="w-full md:w-48 h-12 rounded-xl bg-card border-border/50">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map((cat) => (
            <SelectItem key={cat} value={cat}>
              {cat}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Price Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="h-12 rounded-xl gap-2 bg-card border-border/50">
            <SlidersHorizontal className="h-4 w-4" />
            Price: ${priceRange[0]} - ${priceRange[1]}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4">
          <div className="space-y-4">
            <h4 className="font-display font-medium">Price Range</h4>
            <Slider
              min={0}
              max={100}
              step={1}
              value={[localPriceRange[0], localPriceRange[1]]}
              onValueChange={handlePriceChange}
              className="mt-6"
            />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>${localPriceRange[0]}</span>
              <span>${localPriceRange[1]}</span>
            </div>
            <Button onClick={applyPriceFilter} className="w-full" variant="candy">
              Apply
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </motion.div>
  );
}
