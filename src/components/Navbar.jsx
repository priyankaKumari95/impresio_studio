import React from 'react'

const Navbar = () => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold">Logo</h1>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar