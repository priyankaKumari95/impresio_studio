import React, { useState, useEffect } from 'react'
import axios from 'axios'
import FilterBar from '../components/FilterBar'
import { Link } from 'react-router-dom'

const CategoryListing = () => {
  const [photographers, setPhotographers] = useState([])
  const [filteredPhotographers, setFilteredPhotographers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const photographersPerPage = 6

  useEffect(() => {
    const fetchPhotographers = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/photographers`)
        setPhotographers(response.data)
        setFilteredPhotographers(response.data)
      } catch (err) {
        setError('Failed to fetch photographers')
      } finally {
        setLoading(false)
      }
    }

    fetchPhotographers()
  }, [])

  const handleFilterChange = (filters) => {
    setLoading(true)

    setTimeout(() => {
      let filtered = [...photographers]

      // Apply search
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase()
        filtered = filtered.filter(p =>
          p.name.toLowerCase().includes(query) ||
          p.location.toLowerCase().includes(query) ||
          p.tags?.some(tag => tag.toLowerCase().includes(query))
        )
      }

      // Price filter
      filtered = filtered.filter(p =>
        p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
      )

      // Rating
      if (filters.rating > 0) {
        filtered = filtered.filter(p => p.rating >= filters.rating)
      }

      // City
      if (filters.city) {
        filtered = filtered.filter(p => p.location === filters.city)
      }

      // Styles
      if (filters.styles.length > 0) {
        filtered = filtered.filter(p =>
          p.styles?.some(style => filters.styles.includes(style))
        )
      }

      // Sort
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
      }

      setFilteredPhotographers(filtered)
      setPage(1)
      setLoading(false)
    }, 500)
  }

  const displayedPhotographers = filteredPhotographers.slice(0, page * photographersPerPage)

  const loadMore = () => setPage(prev => prev + 1)

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">{error}</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-primary-text text-2xl font-bold mb-6">
        Maternity Photographers in Bengaluru
      </h1>

      <FilterBar onFilterChange={handleFilterChange} />

      <div className="bg-pink-50 p-4 rounded-lg mb-6">
        <p className="text-secondary-text">
          <span className="font-semibold">Smart Suggestion:</span>{' '}
          Top-rated outdoor maternity photographers in Bengaluru
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-48 rounded-lg mb-4" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayedPhotographers.map((p) => (
            <div
              key={p.id}
              className="bg-white shadow-sm rounded-lg overflow-hidden hover:shadow-md transition-shadow hover:scale-105 duration-200"
            >
              <img
                src={p.profilePic || '/placeholder.jpg'}
                alt={p.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{p.name}</h2>
                <p className="text-secondary-text mb-1">📍 {p.location}</p>
                <p className="text-secondary-text mb-1">⭐ {p.rating}</p>
                <p className="text-secondary-text mb-3">
                  Starting at ₹{p.price.toLocaleString()}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {p.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm hover:underline"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <Link
                  to={`/photographer/${p.id}`}
                  className="bg-accent hover:bg-accent-dark text-white rounded-full px-6 py-2 inline-block transition-colors"
                >
                  View Profile
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && displayedPhotographers.length < filteredPhotographers.length && (
        <div className="text-center mt-8">
          <button
            onClick={loadMore}
            className="bg-accent hover:bg-accent-dark text-white rounded-full px-6 py-2 transition-colors"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  )
}

export default CategoryListing
