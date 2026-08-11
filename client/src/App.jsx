import Navbar from './components/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom'

//imports of default export function
import Home from './pages/Home'
import CarDetails from './pages/CarDetails'
import Cars from './pages/Cars'
import MyBookings from './pages/MyBookings'
import About from './pages/About'
import HelpCenter from './pages/HelpCenter'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import Insurance from './pages/Insurance'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'

import Layout from './pages/owner/Layout'
import Dashboard from './pages/owner/Dashboard'
import AddCar from './pages/owner/AddCar'
import ManageCars from './pages/owner/ManageCars'
import ManageBookings from './pages/owner/ManageBookings'
import Login from './components/Login'
import ProtectedRoute from './components/ProtectedRoute'

import { Toaster } from 'react-hot-toast'
import { useAppContext } from './Context/AppContext'
const App = () => {

  //showLogin → stores whether the login popup is visible

  const {showLogin}=useAppContext()
  const isOwnerPath = useLocation().pathname.startsWith('/owner')

  return (
    <div className="min-h-screen bg-white text-gray-900 transition-colors dark:bg-gray-900 dark:text-gray-200">

      <Toaster />
      <ScrollToTop />

      {/* Conditional Navbar */}
      {!isOwnerPath && <Navbar/>}

      {/* to display the Login component only when showLogin=true */}
      {showLogin && <Login/>}

      <Routes>

        <Route path='/' element={<Home />} />
        <Route path='/cars' element={<Cars />} />
        <Route path='/my-bookings' element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
        <Route path='/about' element={<About />} />
        <Route path='/help' element={<HelpCenter />} />
        <Route path='/terms' element={<Terms />} />
        <Route path='/privacy' element={<Privacy />} />
        <Route path='/insurance' element={<Insurance />} />
        {/* Dynamic route */}
        <Route path='/car-details/:id' element={<CarDetails />} />


        {/* Nested Routes for owner */}
        <Route path='/owner' element={<ProtectedRoute ownerOnly><Layout /></ProtectedRoute>}>
          {/* index means default route */}
          <Route index element={<Dashboard />} />
          <Route path='add-car' element={<AddCar />} />
          <Route path='manage-cars' element={<ManageCars />} />
          <Route path='manage-bookings' element={<ManageBookings />} />
        </Route>

      </Routes>

      {/* Conditional Footer */}
      {!isOwnerPath && <Footer />}
    </div>
  )
}

export default App 
