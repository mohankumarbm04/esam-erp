import React, { useState, useEffect, useRef } from "react";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  AdjustmentsHorizontalIcon,
  ClockIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/outline";

const SearchFilter = ({
  searchTerm,
  onSearchChange,
  filters = [],
  onFilterChange,
  totalResults = 0,
  placeholder = "Search...",
  showFilters = true,
  suggestions = [],
  onSuggestionClick,
}) => {
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      setRecentSearches(JSON.parse(saved).slice(0, 5));
    }
  }, []);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFilterChange = (filterName, value) => {
    const newFilters = { ...activeFilters, [filterName]: value };
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

  const handleSearchFocus = () => {
    setShowSuggestions(true);
  };

  const handleSearchChange = (e) => {
    onSearchChange(e.target.value);
    if (e.target.value.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    onSearchChange(suggestion);
    setShowSuggestions(false);

    // Save to recent searches
    const updated = [
      suggestion,
      ...recentSearches.filter((s) => s !== suggestion),
    ].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));

    if (onSuggestionClick) {
      onSuggestionClick(suggestion);
    }
  };

  const activeFilterCount = Object.keys(activeFilters).length;

  // Get icon component based on filter name
  const getFilterIcon = (filterName) => {
    switch (filterName) {
      case "department":
        return BuildingOfficeIcon;
      case "semester":
        return AcademicCapIcon;
      case "type":
        return AdjustmentsHorizontalIcon;
      case "status":
        return ClockIcon;
      default:
        return FunnelIcon;
    }
  };

  return (
    <div className="search-filter-container" ref={searchRef}>
      {/* Google-style Search Bar */}
      <div className="search-row">
        <div className="search-wrapper" style={{ position: "relative" }}>
          <MagnifyingGlassIcon
            className="search-icon"
            style={{ left: "1.25rem" }}
          />
          <input
            ref={inputRef}
            type="text"
            className="search-input"
            placeholder={placeholder}
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={handleSearchFocus}
            style={{
              padding: "1rem 1rem 1rem 3.5rem",
              fontSize: "1rem",
              borderRadius: "2rem",
              border: "2px solid #e2e8f0",
              boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
            }}
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange("")}
              style={{
                position: "absolute",
                right: "1.25rem",
                top: "50%",
                transform: "translateY(-50%)",
                background: "#f1f5f9",
                border: "none",
                borderRadius: "50%",
                width: "2rem",
                height: "2rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#64748b",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#e2e8f0")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#f1f5f9")
              }
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          )}

          {/* Google-style Search Suggestions */}
          {showSuggestions &&
            (searchTerm.length > 0 || recentSearches.length > 0) && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 0.5rem)",
                  left: 0,
                  right: 0,
                  background: "white",
                  borderRadius: "1.5rem",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                  border: "1px solid #e2e8f0",
                  zIndex: 1000,
                  overflow: "hidden",
                }}
              >
                {/* Recent Searches */}
                {!searchTerm && recentSearches.length > 0 && (
                  <div style={{ padding: "0.75rem" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        padding: "0.5rem 1rem",
                        color: "#64748b",
                        fontSize: "0.875rem",
                      }}
                    >
                      <ClockIcon className="w-4 h-4" />
                      <span>Recent searches</span>
                    </div>
                    {recentSearches.map((search, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleSuggestionClick(search)}
                        style={{
                          padding: "0.75rem 1rem",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.75rem",
                          borderRadius: "0.75rem",
                          margin: "0.25rem 0",
                          transition: "background 0.2s ease",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = "#f8fafc")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "white")
                        }
                      >
                        <MagnifyingGlassIcon className="w-4 h-4 text-gray-400" />
                        <span>{search}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Search Suggestions */}
                {searchTerm && suggestions.length > 0 && (
                  <div style={{ padding: "0.75rem" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        padding: "0.5rem 1rem",
                        color: "#64748b",
                        fontSize: "0.875rem",
                      }}
                    >
                      <MagnifyingGlassIcon className="w-4 h-4" />
                      <span>Suggestions</span>
                    </div>
                    {suggestions.map((suggestion, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleSuggestionClick(suggestion)}
                        style={{
                          padding: "0.75rem 1rem",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.75rem",
                          borderRadius: "0.75rem",
                          margin: "0.25rem 0",
                          transition: "background 0.2s ease",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = "#f8fafc")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "white")
                        }
                      >
                        <span style={{ fontWeight: 500 }}>{suggestion}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* No results */}
                {searchTerm && suggestions.length === 0 && (
                  <div
                    style={{
                      padding: "2rem",
                      textAlign: "center",
                      color: "#94a3b8",
                    }}
                  >
                    No suggestions found
                  </div>
                )}
              </div>
            )}
        </div>

        {showFilters && (
          <>
            <button
              className={`toggle-filters ${showFilterPanel ? "active" : ""}`}
              onClick={() => setShowFilterPanel(!showFilterPanel)}
              style={{
                padding: "1rem 1.5rem",
                borderRadius: "2rem",
                fontSize: "0.95rem",
                minWidth: "120px",
              }}
            >
              <AdjustmentsHorizontalIcon className="w-5 h-5" />
              Filters
              {activeFilterCount > 0 && (
                <span className="filter-badge" style={{ marginLeft: "0.5rem" }}>
                  {activeFilterCount}
                </span>
              )}
            </button>

            {activeFilterCount > 0 && (
              <button
                className="clear-filters"
                onClick={clearAllFilters}
                style={{
                  padding: "1rem 1.5rem",
                  borderRadius: "2rem",
                  fontSize: "0.95rem",
                }}
              >
                <XMarkIcon className="w-5 h-5" />
                Clear all
              </button>
            )}
          </>
        )}

        <div
          className="filter-stats"
          style={{
            padding: "1rem 1.5rem",
            borderRadius: "2rem",
            fontSize: "0.95rem",
          }}
        >
          <FunnelIcon className="w-5 h-5" />
          <span>{totalResults} results</span>
        </div>
      </div>

      {/* Filter Panel - Google-style */}
      {showFilters && showFilterPanel && (
        <div
          className="filter-section"
          style={{
            marginTop: "1.5rem",
            paddingTop: "1.5rem",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1rem",
              width: "100%",
            }}
          >
            {filters.map((filter, index) => {
              const FilterIcon = getFilterIcon(filter.name);
              return (
                <div
                  key={index}
                  className="filter-group"
                  style={{
                    background: "#f8fafc",
                    borderRadius: "2rem",
                    padding: "0.25rem",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <span
                    className="filter-label"
                    style={{
                      background: "white",
                      borderRadius: "2rem",
                      padding: "0.5rem 1rem",
                    }}
                  >
                    <FilterIcon className="w-4 h-4" />
                    {filter.label}:
                  </span>
                  <select
                    className="filter-select"
                    value={activeFilters[filter.name] || ""}
                    onChange={(e) =>
                      handleFilterChange(filter.name, e.target.value)
                    }
                    style={{
                      padding: "0.5rem 2rem 0.5rem 1rem",
                      borderRadius: "2rem",
                      fontSize: "0.95rem",
                    }}
                  >
                    <option value="">All {filter.label}s</option>
                    {filter.options.map((option, idx) => (
                      <option key={idx} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>

          {/* Quick Filter Chips */}
          <div
            className="filter-chips"
            style={{
              marginTop: "1rem",
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
            }}
          >
            {filters.map((filter, index) =>
              filter.chips?.map((chip, chipIndex) => {
                const ChipIcon = chip.icon || getFilterIcon(filter.name);
                return (
                  <button
                    key={`${index}-${chipIndex}`}
                    className={`filter-chip ${activeFilters[filter.name] === chip.value ? "active" : ""}`}
                    onClick={() =>
                      handleFilterChange(
                        filter.name,
                        activeFilters[filter.name] === chip.value
                          ? ""
                          : chip.value,
                      )
                    }
                    style={{
                      padding: "0.5rem 1rem",
                      borderRadius: "2rem",
                      fontSize: "0.875rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.375rem",
                      background:
                        activeFilters[filter.name] === chip.value
                          ? "#667eea"
                          : "white",
                      color:
                        activeFilters[filter.name] === chip.value
                          ? "white"
                          : "#475569",
                      border: "1px solid #e2e8f0",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <ChipIcon className="w-4 h-4" />
                    {chip.label}
                  </button>
                );
              }),
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilter;
