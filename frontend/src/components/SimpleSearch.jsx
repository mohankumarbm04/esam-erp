import React, { useState } from "react";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const SimpleSearch = ({
  searchTerm,
  onSearchChange,
  filters = [],
  onFilterChange,
  totalResults = 0,
  placeholder = "Search...",
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});

  const handleFilterChange = (filterName, value) => {
    const newFilters = { ...activeFilters, [filterName]: value };
    setActiveFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  const clearFilter = (filterName) => {
    const newFilters = { ...activeFilters };
    delete newFilters[filterName];
    setActiveFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  const clearAllFilters = () => {
    setActiveFilters({});
    if (onFilterChange) {
      onFilterChange({});
    }
  };

  const activeFilterCount = Object.keys(activeFilters).length;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
      {/* Search Row */}
      <div className="flex items-center p-2 gap-2 flex-wrap">
        <div className="flex-1 relative min-w-[250px]">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-full text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchTerm && (
            <button
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => onSearchChange("")}
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          )}
        </div>

        <button
          className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 ${
            showFilters
              ? "bg-blue-50 text-blue-600 border border-blue-300"
              : "bg-gray-50 text-gray-700 border border-gray-300 hover:bg-gray-100"
          }`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <FunnelIcon className="w-4 h-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="bg-blue-500 text-white rounded-full px-1.5 py-0.5 text-xs ml-1">
              {activeFilterCount}
            </span>
          )}
        </button>

        <div className="px-3 py-2 bg-gray-50 rounded-full text-sm text-gray-600 flex items-center gap-1">
          <span className="font-medium">{totalResults}</span>
          <span>results</span>
        </div>

        {activeFilterCount > 0 && (
          <button
            className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-full text-sm font-medium flex items-center gap-1"
            onClick={clearAllFilters}
          >
            <XMarkIcon className="w-4 h-4" />
            Clear all
          </button>
        )}
      </div>

      {/* Active Filter Badges */}
      {activeFilterCount > 0 && (
        <div className="px-4 pb-3 flex flex-wrap gap-2">
          {Object.entries(activeFilters).map(([key, value]) => {
            const filter = filters.find((f) => f.name === key);
            if (!filter) return null;
            const option = filter.options.find((o) => o.value === value);
            return (
              <span
                key={key}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
              >
                {filter.label}: {option?.label || value}
                <button
                  onClick={() => clearFilter(key)}
                  className="ml-1 hover:text-blue-900"
                >
                  <XMarkIcon className="w-3 h-3" />
                </button>
              </span>
            );
          })}
        </div>
      )}

      {/* Filter Panel */}
      {showFilters && (
        <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filters.map((filter) => (
              <div key={filter.name}>
                <label className="block text-xs font-medium text-gray-500 uppercase mb-1">
                  {filter.label}
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  value={activeFilters[filter.name] || ""}
                  onChange={(e) =>
                    handleFilterChange(filter.name, e.target.value)
                  }
                >
                  <option value="">All {filter.label}s</option>
                  {filter.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleSearch;
