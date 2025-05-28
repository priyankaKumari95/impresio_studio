import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import CategoryListing from './pages/CategoryListing'
import PhotographerProfile from './pages/PhotographerProfile'

function App() {
  return (
    <Router>
      <div className="bg-primary-bg min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<CategoryListing />} />
          <Route path="/photographer/:id" element={<PhotographerProfile />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
