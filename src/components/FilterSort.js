import React from 'react';

const FilterSort = ({ 
  sortBy, 
  handleSortChange, 
  priceRange, 
  handlePriceRangeChange, 
  availability, 
  handleAvailabilityChange, 
  searchQuery, 
  handleSearchChange,
  hasDiscount, 
  handleDiscountChange 
}) => (
  <div className="space-y-4">
    <input 
      type="text" 
      placeholder="Search Products..." 
      value={searchQuery} 
      onChange={handleSearchChange} 
      className="w-full p-2 border border-gray-300 rounded" 
    />
    <div>
      <label className="block text-sm font-medium text-gray-700">Sort By</label>
      <select value={sortBy} onChange={handleSortChange} className="mt-1 block w-full p-2 border border-gray-300 rounded">
        <option value="">Default</option>
        <option value="name, ASC">Name (A-Z)</option>
        <option value="name, DESC">Name (Z-A)</option>
        <option value="price, ASC">Price (Low to High)</option>
        <option value="price, DESC">Price (High to Low)</option>
        <option value="rating, DESC">Rating (High to Low)</option>
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
      </select>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700">Price Range</label>
      <div className="flex space-x-2">
        <input 
          type="number" 
          name="minPrice" 
          value={priceRange.minPrice} 
          onChange={handlePriceRangeChange} 
          placeholder="Min Price" 
          className="w-full p-2 border border-gray-300 rounded" 
        />
        <input 
          type="number" 
          name="maxPrice" 
          value={priceRange.maxPrice} 
          onChange={handlePriceRangeChange} 
          placeholder="Max Price" 
          className="w-full p-2 border border-gray-300 rounded" 
        />
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700">Availability</label>
      <select value={availability} onChange={handleAvailabilityChange} className="mt-1 block w-full p-2 border border-gray-300 rounded">
        <option value="">All</option>
        <option value="In Stock">In Stock</option>
        <option value="Out of Stock">Out of Stock</option>
      </select>
    </div>

    <div>
    <label className="inline-flex items-center">
  <input 
    type="checkbox" 
    checked={hasDiscount} 
    onChange={handleDiscountChange} 
    className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out" 
  />
  <span className="ml-2 text-sm text-gray-700">Discounted Products Only</span>
</label>
    </div>
  </div>
);

export default FilterSort;
