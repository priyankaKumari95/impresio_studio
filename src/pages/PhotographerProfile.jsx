import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'

// Reusable StarRating Component
const StarRating = ({ rating }) => (
  <div className="flex items-center">
    {[...Array(5)].map((_, i) => (
      <span key={i} className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>⭐</span>
    ))}
  </div>
)

const PhotographerProfile = () => {
  const { id } = useParams()
  const [photographer, setPhotographer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showInquiryModal, setShowInquiryModal] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    date: ''
  })

  useEffect(() => {
    const fetchPhotographer = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/photographers/${id}`, { timeout: 8000 })
        setPhotographer(response.data)
        setLoading(false)
      } catch (err) {
        console.error(err)
        setError('Failed to fetch photographer details')
        setLoading(false)
      }
    }
    fetchPhotographer()
  }, [id])

  const handleInquirySubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/inquiries`, {
        ...inquiryForm,
        photographerId: id
      })
      alert('Inquiry sent successfully!')
    } catch (err) {
      console.error(err)
      alert('Failed to send inquiry.')
    } finally {
      setShowInquiryModal(false)
      setInquiryForm({ name: '', email: '', phone: '', message: '', date: '' })
    }
  }

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) =>
      prev === photographer?.portfolio.length - 1 ? 0 : prev + 1
    )
  }, [photographer])

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? photographer?.portfolio.length - 1 : prev - 1
    )
  }, [photographer])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
      </div>
    )
  }

  if (!photographer) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-50 text-yellow-600 p-4 rounded-lg">
          Photographer not found
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-primary-bg min-h-screen">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
        <div className="md:flex">
          <div className="md:w-1/3 p-8">
            <h1 className="text-primary-text text-2xl font-bold mb-4">{photographer.name}</h1>
            <div className="flex items-center mb-4">
              <StarRating rating={photographer.rating} />
              <span className="ml-2 text-gray-600">{photographer.rating}</span>
            </div>
            <p className="text-secondary-text mb-4">📍 {photographer.location}</p>
            <p className="text-secondary-text mb-6">Starting at ₹{photographer.price.toLocaleString()}</p>
            <button
              onClick={() => setShowInquiryModal(true)}
              className="w-full bg-accent hover:bg-accent-dark text-white rounded-full px-6 py-2 transition-colors duration-200"
            >
              Send Inquiry
            </button>
          </div>
          <div className="md:w-2/3 p-8">
            <h2 className="text-2xl font-semibold mb-4">About Me</h2>
            <p className="text-secondary-text mb-6">{photographer.bio}</p>

            {/* Styles */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Styles</h3>
              <div className="flex flex-wrap gap-2">
                {photographer.styles.map((style) => (
                  <span key={style} className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm">{style}</span>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {photographer.tags.map((tag) => (
                  <span key={tag} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Gallery */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-semibold mb-6">Portfolio Gallery</h2>
        <div className="relative">
          <img
            src={photographer.portfolio[currentImageIndex]}
            alt={`Portfolio ${currentImageIndex + 1}`}
            className="w-full h-[400px] md:h-[600px] object-cover rounded-lg"
          />
          <button
            onClick={prevImage}
            aria-label="Previous image"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-accent hover:bg-accent-dark text-white rounded-full px-3 py-2"
          >←</button>
          <button
            onClick={nextImage}
            aria-label="Next image"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-accent hover:bg-accent-dark text-white rounded-full px-3 py-2"
          >→</button>
        </div>
        <div className="grid grid-cols-6 gap-4 mt-4">
          {photographer.portfolio.map((photo, index) => (
            <img
              key={index}
              src={photo}
              alt={`Thumbnail ${index + 1}`}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-full h-20 object-cover rounded-lg cursor-pointer transition-opacity ${index === currentImageIndex ? 'opacity-100 ring-2 ring-[#de3cab]' : 'opacity-60 hover:opacity-100'}`}
            />
          ))}
        </div>
      </div>

      {/* Reviews */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-semibold mb-6">Client Reviews</h2>
        <div className="space-y-6">
          {photographer.reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">{review.name}</h3>
                <span className="text-gray-500 text-sm">{review.date}</span>
              </div>
              <StarRating rating={review.rating} />
              <p className="text-secondary-text">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Inquiry Modal */}
      {showInquiryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-semibold mb-6">Send Inquiry</h2>
            <form onSubmit={handleInquirySubmit} className="space-y-4">
              {['name', 'email', 'phone'].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium mb-1 capitalize">{field}</label>
                  <input
                    type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
                    value={inquiryForm[field]}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, [field]: e.target.value })}
                    required
                    className="w-full border border-gray-200 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium mb-1">Preferred Date</label>
                <input
                  type="date"
                  value={inquiryForm.date}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, date: e.target.value })}
                  required
                  className="w-full border border-gray-200 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea
                  value={inquiryForm.message}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                  required
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent h-32"
                ></textarea>
              </div>
              <div className="flex justify-end gap-4">
                <button type="button" onClick={() => setShowInquiryModal(false)} className="px-4 py-2 bg-gray-300 rounded-full hover:bg-gray-400">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2 bg-accent hover:bg-accent-dark text-white rounded-full">
                  Send Inquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default PhotographerProfile
