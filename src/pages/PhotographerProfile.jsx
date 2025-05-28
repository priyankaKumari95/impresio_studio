import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'

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
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/photographers/${id}`)
        setPhotographer(response.data)
        setLoading(false)
      } catch (err) {
        setError('Failed to fetch photographer details')
        setLoading(false)
      }
    }

    fetchPhotographer()
  }, [id])

  const handleInquirySubmit = (e) => {
    e.preventDefault()
    // Handle form submission here
    console.log('Inquiry submitted:', inquiryForm)
    setShowInquiryModal(false)
    setInquiryForm({ name: '', email: '', phone: '', message: '', date: '' })
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === photographer?.portfolio.length - 1 ? 0 : prev + 1
    )
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? photographer?.portfolio.length - 1 : prev - 1
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
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
    <div className="container mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
        <div className="md:flex">
          <div className="md:w-1/3 p-8">
            <h1 className="text-3xl font-bold mb-4">{photographer.name}</h1>
            <div className="flex items-center mb-4">
              <span className="text-yellow-400 text-xl mr-2">⭐</span>
              <span className="text-gray-600">{photographer.rating}</span>
            </div>
            <p className="text-gray-600 mb-4">📍 {photographer.location}</p>
            <p className="text-gray-600 mb-6">Starting at ₹{photographer.price.toLocaleString()}</p>
            <button
              onClick={() => setShowInquiryModal(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 w-full transition-colors"
            >
              Send Inquiry
            </button>
          </div>
          <div className="md:w-2/3 p-8">
            <h2 className="text-2xl font-semibold mb-4">About Me</h2>
            <p className="text-gray-600 mb-6">{photographer.bio}</p>
            
            {/* Styles and Tags */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Styles</h3>
              <div className="flex flex-wrap gap-2">
                {photographer.styles.map((style) => (
                  <span key={style} className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm">
                    {style}
                  </span>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {photographer.tags.map((tag) => (
                  <span key={tag} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                    {tag}
                  </span>
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
            className="w-full h-[600px] object-cover rounded-lg"
          />
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
          >
            ←
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
          >
            →
          </button>
        </div>
        <div className="grid grid-cols-6 gap-4 mt-4">
          {photographer.portfolio.map((photo, index) => (
            <img
              key={index}
              src={photo}
              alt={`Thumbnail ${index + 1}`}
              className={`w-full h-20 object-cover rounded-lg cursor-pointer transition-opacity ${index === currentImageIndex ? 'opacity-100 ring-2 ring-blue-600' : 'opacity-60 hover:opacity-100'}`}
              onClick={() => setCurrentImageIndex(index)}
            />
          ))}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-semibold mb-6">Client Reviews</h2>
        <div className="space-y-6">
          {photographer.reviews.map((review) => ( 
            <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">{review.name}</h3>
                <span className="text-gray-500 text-sm">{review.date}</span>
              </div>
              <div className="flex items-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-lg ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  >
                    ⭐
                  </span>
                ))}
              </div>
              <p className="text-gray-600">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Inquiry Modal */}
      {showInquiryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-semibold mb-6">Send Inquiry</h2>
            <form onSubmit={handleInquirySubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={inquiryForm.name}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={inquiryForm.email}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="tel"
                  value={inquiryForm.phone}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Preferred Date</label>
                <input
                  type="date"
                  value={inquiryForm.date}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, date: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea
                  value={inquiryForm.message}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 h-32"
                  required
                ></textarea>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowInquiryModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
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