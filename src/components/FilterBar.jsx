import React, { useState } from 'react'

const FilterBar = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    priceRange: [5000, 50000],
    rating: 0,
    styles: [],
    city: '',
    sortBy: 'rating',
    searchQuery: ''
  })

  const photographyStyles = [
    'Traditional',
    'Candid',
    'Studio',
    'Outdoor',
    'Documentary',
    'Artistic'
  ]

  const cities = ['Bengaluru', 'Mumbai', 'Delhi', 'Chennai', 'Hyderabad']

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name, location, or tag..."
          className="w-full border border-gray-200 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          value={filters.searchQuery}
          onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Price Range Slider */}
        <div>
          <label className="block text-sm font-medium mb-2">Price Range</label>
          <input
            type="range"
            min="5000"
            max="50000"
            step="1000"
            value={filters.priceRange[1]}
            onChange={(e) =>
              handleFilterChange('priceRange', [5000, parseInt(e.target.value)])
            }
            className="w-full border border-gray-200 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          />
          <div className="text-sm text-gray-600">
            ₹5,000 - ₹{filters.priceRange[1].toLocaleString()}
          </div>
        </div>

        {/* Rating Filter */}
        <div>
          <label className="block text-sm font-medium mb-2">Minimum Rating</label>
          <select
            className="w-full border rounded-full px-3 py-2 focus:ring-2 focus:ring-accent focus:border-transparent hover:border-accent cursor-pointer [&>option:hover]:bg-[#de3cab] [&>option:hover]:text-white"
            value={filters.rating}
            onChange={(e) => handleFilterChange('rating', parseFloat(e.target.value))}
          >
            <option value="0">All Ratings</option>
            <option value="4">4+ Stars</option>
            <option value="3">3+ Stars</option>
            <option value="2">2+ Stars</option>
          </select>
        </div>

        {/* City Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">City</label>
          <select
            className="w-full border rounded-full px-3 py-2 focus:ring-2 focus:ring-accent focus:border-transparent hover:border-accent cursor-pointer [&>option:hover]:bg-[#de3cab] [&>option:hover]:text-white"
            value={filters.city}
            onChange={(e) => handleFilterChange('city', e.target.value)}
          >
            <option value="">All Cities</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Photography Styles */}
        <div className="md:col-span-2 lg:col-span-3">
          <label className="block text-sm font-medium mb-2">Photography Styles</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {photographyStyles.map((style) => (
              <label key={style} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.styles.includes(style)}
                  onChange={(e) => {
                    const newStyles = e.target.checked
                      ? [...filters.styles, style]
                      : filters.styles.filter((s) => s !== style)
                    handleFilterChange('styles', newStyles)
                  }}
                  className="h-4 w-4 rounded-full border-gray-300 text-[#de3cab] focus:ring-[#de3cab] transition-colors duration-200 cursor-pointer"
                />
                <span>{style}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Sort Options */}
        <div>
          <label className="block text-sm font-medium mb-2">Sort By</label>
          <select
            className="w-full border rounded-full px-3 py-2 focus:ring-2 focus:ring-accent focus:border-transparent hover:border-accent cursor-pointer [&>option:hover]:bg-[#de3cab] [&>option:hover]:text-white"
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          >
            <option value="rating">Rating: High to Low</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="recent">Recently Added</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default FilterBar