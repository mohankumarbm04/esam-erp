import React from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

/**
 * filters: Array<{ key, label, value, onChange, options: Array<{ value, label }> }>
 */
const AdminSearchBar = ({
  searchTerm,
  onSearchChange,
  placeholder = "Search...",
  filters = [],
  rightText,
}) => {
  return (
    <div className="modern-card mb-6">
      <div className="admin-searchbar">
        <div className="admin-searchbar__search">
          <MagnifyingGlassIcon className="admin-searchbar__icon" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={placeholder}
            className="form-input admin-searchbar__input"
          />
        </div>

        {filters.map((f) => (
          <div className="admin-searchbar__filter" key={f.key}>
            <select
              value={f.value}
              onChange={(e) => f.onChange(e.target.value)}
              className="form-input"
              aria-label={f.label}
            >
              {f.options.map((opt) => (
                <option key={`${f.key}-${opt.value}`} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        ))}

        {rightText ? (
          <div className="admin-searchbar__meta text-sm text-muted">
            {rightText}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default AdminSearchBar;

