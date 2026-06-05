import React, { useState } from 'react';
import './FilterSidebar.css';

const FilterSidebar = ({ filters, onFilterChange, isMobile = false, onClose }) => {
  const [priceRange, setPriceRange] = useState({
    min: filters.minPrice || '',
    max: filters.maxPrice || ''
  });

  const categories = [
    'Pottery & Ceramics',
    'Textiles & Fabrics',
    'Jewelry',
    'Home Decor',
    'Paintings',
    'Sculptures',
    'Handicrafts',
    'Other'
  ];

  const handleCategoryChange = (category) => {
    const newCategories = filters.categories?.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...(filters.categories || []), category];
    
    onFilterChange({ ...filters, categories: newCategories });
  };

  const handlePriceChange = (field, value) => {
    setPriceRange(prev => ({ ...prev, [field]: value }));
  };

  const applyPriceFilter = () => {
    onFilterChange({
      ...filters,
      minPrice: priceRange.min,
      maxPrice: priceRange.max
    });
  };

  const clearFilters = () => {
    setPriceRange({ min: '', max: '' });
    onFilterChange({
      categories: [],
      minPrice: '',
      maxPrice: '',
      inStock: false
    });
  };

  const handleStockChange = (e) => {
    onFilterChange({ ...filters, inStock: e.target.checked });
  };

  return (
    <>
      {isMobile && <div className={`filter-overlay ${isMobile ? 'active' : ''}`} onClick={onClose}></div>}
      
      <div className={`filter-sidebar ${isMobile ? 'active' : ''}`}>
        <div className="filter-header">
          <h2 className="filter-title">Filters</h2>
          {isMobile && (
            <button className="filter-close" onClick={onClose}>×</button>
          )}
          <button className="filter-clear" onClick={clearFilters}>
            Clear All
          </button>
        </div>

        {/* Categories */}
        <div className="filter-section">
          <h3 className="filter-section-title">Categories</h3>
          <div className="filter-options">
            {categories.map(category => (
              <label key={category} className="filter-option">
                <input
                  type="checkbox"
                  className="filter-checkbox"
                  checked={filters.categories?.includes(category) || false}
                  onChange={() => handleCategoryChange(category)}
                />
                <span className="filter-label">{category}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="filter-section">
          <h3 className="filter-section-title">Price Range</h3>
          <div className="price-range">
            <input
              type="number"
              placeholder="Min"
              className="price-input"
              value={priceRange.min}
              onChange={(e) => handlePriceChange('min', e.target.value)}
            />
            <span className="price-separator">-</span>
            <input
              type="number"
              placeholder="Max"
              className="price-input"
              value={priceRange.max}
              onChange={(e) => handlePriceChange('max', e.target.value)}
            />
          </div>
          <button className="btn btn-primary btn-small filter-apply" onClick={applyPriceFilter}>
            Apply
          </button>
        </div>

        {/* Availability */}
        <div className="filter-section">
          <h3 className="filter-section-title">Availability</h3>
          <label className="filter-option">
            <input
              type="checkbox"
              className="filter-checkbox"
              checked={filters.inStock || false}
              onChange={handleStockChange}
            />
            <span className="filter-label">In Stock Only</span>
          </label>
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;