import React, { useState } from 'react'
import { assets, menuLinks } from '../assets/assets'
import { Link, useLocation, useNavigate } from 'react-router-dom'
//for dark mode
import { useTheme } from '../Context/ThemeContext'
//for App Context
import { useAppContext } from '../Context/AppContext'
import toast from 'react-hot-toast'

const Navbar = () => {

  //from AppContext.jsx
  const { setShowLogin, user, setUser, logout, isOwner, axios, setIsOwner } = useAppContext()

  const location = useLocation() //gives information about the current URL/page.
  const [open, setOpen] = useState(false) //state variable to hide menu links on smaller screen
  const navigate = useNavigate()

  const changeRole = async () => {
    if (!user) {
      setShowLogin(true)
      return
    }

    try {
      const { data } = await axios.post('/api/owner/change-role');
      if (data.success) {
        setIsOwner(true);
        setUser((currentUser) => ({ ...currentUser, role: data.role }))
        toast.success(data.message);
        navigate('/owner')
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // dark mode
  const { theme, toggleTheme } = useTheme()

  return (
    <div className={`flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 text-gray-600 dark:text-gray-200 border-b border-borderColor dark:border-gray-700 relative transition-all ${location.pathname === "/" ? "bg-light dark:bg-gray-900" : "bg-white dark:bg-gray-900"}`}>

      {/* Logo */}
      <Link to='/'>
        {/* <img src={assets.logo} alt="logo" className='h-8' /> */}
        {/* sirf assests wale folder mein image paste kar dene se nhi hoga, usko assets.js mein jaake import aur export bhi karna padega */}
        <img src={assets.StatLogo} alt="logo" className='h-12' />
      </Link>

      <div className={`max-sm:fixed max-sm:h-screen max-sm:w-full max-sm:top-16 max-sm:border-t border-borderColor dark:border-gray-700 right-0 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 max-sm:p-4 transition-all duration-300 z-50 ${location.pathname === "/" ? "bg-light dark:bg-gray-900" : "bg-white dark:bg-gray-900"} ${open ? "max-sm:translate-x-0" : "max-sm:translate-x-full"}`}>

        {menuLinks.map((link, index) => (
          <Link key={index} to={link.path}>
            {link.name}
          </Link>
        ))}

        {/* search bar */}
        <div className='hidden lg:flex items-center text-sm gap-2 border border-borderColor dark:border-gray-700 px-3 rounded-full max-w-56'>
          <input
            type="text"
            className='py-1.5 w-full bg-transparent outline-none placeholder-gray-500 dark:placeholder-gray-400'
            placeholder='Search products'
          />
          <img src={assets.search_icon} alt="search" />
        </div>

        {/* Dashboard , Login and dark mode Button */}
        <div className='flex max-sm:flex-col items-start sm:items-center gap-6'>

          {/* Dark mode */}
          <button onClick={toggleTheme} className='flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-borderColor dark:border-gray-700' aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}>
            {theme === "light" ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M21 14.8A8.5 8.5 0 0 1 9.2 3a7 7 0 1 0 11.8 11.8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </button>

          <button onClick={() => isOwner ? navigate('/owner') : changeRole()} className='cursor-pointer'>
            {isOwner ? 'Dashboard' : 'List your car'}
          </button>

          <button onClick={() => { user ? logout() : setShowLogin(true) }} className='cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition-all text-white rounded-lg'>
            {user ? 'Logout' : 'Login'}
          </button>

        </div>
      </div>

      {/* mobile menu toggle button. */}
      <button className='sm:hidden cursor-pointer' aria-label='Menu' onClick={() => setOpen(!open)}>
        <img src={open ? assets.close_icon : assets.menu_icon} alt="menu" />
      </button>

    </div>
  )
}

export default Navbar
