import React, { useState, useEffect } from 'react'
import axios from 'axios'
import FilterBar from '../components/FilterBar'
import { Link } from 'react-router-dom'

const CategoryListing = () => {
  const [photographers, setPhotographers] = useState([])
  const [filteredPhotographers, setFilteredPhotographers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPhotographers = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/photographers`)
        setPhotographers(response.data)
        setFilteredPhotographers(response.data)
        setLoading(false)
      } catch (err) {
        setError('Failed to fetch photographers')
        setLoading(false)
      }
    }

    fetchPhotographers()
  }, [])

  const handleFilterChange = (filters) => {
    setLoading(true)

    // Simulate API delay
    setTimeout(() => {
      let filtered = [...photographers]

      // Apply search filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase()
        filtered = filtered.filter(p =>
          p.name.toLowerCase().includes(query) ||
          p.location.toLowerCase().includes(query) ||
          p.tags.some(tag => tag.toLowerCase().includes(query))
        )
      }

      // Apply price filter
      filtered = filtered.filter(p =>
        p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
      )

      // Apply rating filter
      if (filters.rating > 0) {
        filtered = filtered.filter(p => p.rating >= filters.rating)
      }

      // Apply city filter
      if (filters.city) {
        filtered = filtered.filter(p => p.location === filters.city)
      }

      // Apply style filters
      if (filters.styles.length > 0) {
        filtered = filtered.filter(p =>
          p.styles.some(style => filters.styles.includes(style))
        )
      }

      // Apply sorting
      switch (filters.sortBy) {
        case 'price_asc':
          filtered.sort((a, b) => a.price - b.price)
          break
        case 'price_desc':
          filtered.sort((a, b) => b.price - a.price)
          break
        case 'rating':
          filtered.sort((a, b) => b.rating - a.rating)
          break
        default:
          break
      }

      setFilteredPhotographers(filtered)
      setLoading(false)
    }, 500)
  }

  // Rest of the component remains the same, but use filteredPhotographers instead of photographers
  const [page, setPage] = useState(1)
  const photographersPerPage = 6


  const loadMore = () => {
    setPage(prev => prev + 1)
  }

  const displayedPhotographers = filteredPhotographers.slice(0, page * photographersPerPage)

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Maternity Photographers in Bengaluru</h1>

      {/* Filters */}
      <FilterBar onFilterChange={handleFilterChange} />

      {/* AI Smart Suggestions */}
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <p className="text-blue-800">
          <span className="font-semibold">Smart Suggestion:</span> Top-rated outdoor maternity photographers in Bengaluru
        </p>
      </div>

      {/* Photographer Grid */}
      {loading ? (
        // Skeleton Loader
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayedPhotographers.map(photographer => (
            <div key={photographer.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
              <img src={photographer.profilePic} alt={photographer.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{photographer.name}</h2>
                <p className="text-gray-600 mb-2">📍 {photographer.location}</p>
                <p className="text-gray-600 mb-2">⭐ {photographer.rating}</p>
                <p className="text-gray-600 mb-2">Starting at ₹{photographer.price.toLocaleString()}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {photographer.tags.map(tag => (
                    <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
                <Link to={`/photographer/${photographer.id}`} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full transition-colors">
                  View Profile
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load More Button */}
      {!loading && displayedPhotographers.length < filteredPhotographers.length && (
        <div className="text-center mt-8">
          <button
            onClick={loadMore}
            className="bg-gray-100 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  )
}

export default CategoryListing