'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter, SortAsc, SortDesc } from 'lucide-react';

export interface FilterOption {
  value: string;
  label: string;
}

export interface SortOption {
  value: string;
  label: string;
}

interface FilterSortProps {
  // Search
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;

  // Filters
  filters: Record<string, string>;
  filterOptions: Record<string, FilterOption[]>;
  onFilterChange: (filterKey: string, value: string) => void;

  // Sorting
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  sortOptions: SortOption[];
  onSortChange: (sortBy: string) => void;
  onSortOrderChange: (order: 'asc' | 'desc') => void;

  // Optional styling
  className?: string;
}

const FilterSort: React.FC<FilterSortProps> = ({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
  filters,
  filterOptions,
  onFilterChange,
  sortBy,
  sortOrder,
  sortOptions,
  onSortChange,
  onSortOrderChange,
  className = '',
}) => {
  return (
    <div className={`bg-white p-4 rounded-lg border border-gray-200 shadow-sm ${className}`}>
      <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center">
        {/* Search */}
        <div className="w-full lg:flex-none lg:w-[340px] xl:w-[400px] min-w-0">
          <div className="relative z-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 w-full lg:w-auto">
          {Object.entries(filterOptions).map(([filterKey, options]) => (
            <div key={filterKey} className="flex items-center gap-2 relative z-10">
              <Filter className="w-4 h-4 text-gray-500" />
              <Select
                value={filters[filterKey] || 'All'}
                onValueChange={(value) => onFilterChange(filterKey, value)}
              >
                <SelectTrigger className="w-44">
                  <SelectValue placeholder={`All ${filterKey}`} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All {filterKey}</SelectItem>
                  {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>

        {/* Sorting */}
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="flex items-center gap-1"
          >
            {sortOrder === 'asc' ? (
              <SortAsc className="w-4 h-4" />
            ) : (
              <SortDesc className="w-4 h-4" />
            )}
            {sortOrder === 'asc' ? 'Asc' : 'Desc'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterSort;