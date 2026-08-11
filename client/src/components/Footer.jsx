import React from 'react'
import { assets } from '../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAppContext } from '../Context/AppContext'

const Footer = () => {
    const { user, setUser, isOwner, setIsOwner, axios, setShowLogin } = useAppContext()
    const navigate = useNavigate()

    const handleListCar = async () => {
        if (!user) {
            toast.error('Please login first to list your car')
            setShowLogin(true)
            return
        }

        if (isOwner) {
            navigate('/owner/add-car')
            return
        }

        try {
            const { data } = await axios.post('/api/owner/change-role')
            if (!data.success) {
                toast.error(data.message)
                return
            }

            setIsOwner(true)
            setUser((currentUser) => ({ ...currentUser, role: data.role }))
            toast.success(data.message)
            navigate('/owner/add-car')
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        }
    }

    return (
        <div
            className='mt-60 px-6 text-sm text-gray-500 dark:text-gray-400 md:px-16 lg:px-24 xl:px-32'>

            <div className='flex flex-wrap items-start justify-between gap-8 border-b border-borderColor pb-6 dark:border-gray-700'>
                <div>

                    <img src={assets.StatLogo} alt="logo" className="h-8 md:h-9" />

                    <p className="max-w-80 mt-3">
                        Premium car rental service with a wide selection of luxury
                        and everyday vehicles for all your driving needs.
                    </p>

                    <div className='flex items-center gap-3 mt-6'>
                        <a href="#"> <img src={assets.facebook_logo} alt="" className='w-5 h-5' /></a>
                        <a href="#"> <img src={assets.instagram_logo} alt="" className='w-5 h-5' /></a>
                        <a href="#"> <img src={assets.twitter_logo} alt="" className='w-5 h-5' /></a>
                        <a href="#"> <img src={assets.gmail_logo} alt="" className='w-5 h-5' /></a>
                    </div>

                </div>

                <div className='flex flex-wrap justify-between w-1/2 gap-8'>

                    <div>
                        <h2 className='text-base font-medium uppercase text-gray-800 dark:text-gray-200'>Quick Links</h2>
                        <ul className='mt-3 flex flex-col gap-1.5'>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/cars">Browse cars</Link></li>
                            <li><button type="button" onClick={handleListCar} className="cursor-pointer">List Your Car</button></li>
                            <li><Link to="/about">About Us</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h2 className='text-base font-medium uppercase text-gray-800 dark:text-gray-200'>Resources</h2>
                        <ul className='mt-3 flex flex-col gap-1.5'>
                            <li><Link to="/help">Help Center</Link></li>
                            <li><Link to="/terms">Terms of service</Link></li>
                            <li><Link to="/privacy">Privacy Policy</Link></li>
                            <li><Link to="/insurance">Insurance</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h2 className='text-base font-medium uppercase text-gray-800 dark:text-gray-200'>Contact</h2>
                        <ul className='mt-3 flex flex-col gap-1.5'>
                            <li>1234 Luxury Drive</li>
                            <li>San Francisco, CA94034</li>
                            <li>1234567893</li>
                            <li>info@gmail.com</li>
                        </ul>
                    </div>

                </div>

            </div>

            <div className='flex flex-col md:flex-row gap-2 items-center justify-between py-5'>
                <p>© {new Date().getFullYear()} <a href="https://prebuiltui.com">PrebuiltUI</a>. All rights reserved.</p>
                <ul className='flex items-center gap-4'>
                    <li><Link to="/privacy">Privacy</Link></li>
                    <li>|</li>
                    <li><Link to="/terms">Terms</Link></li>
                    <li>|</li>
                    <li><a href="#">Sitemap</a></li>
                </ul>
            </div>

        </div>
    )
}

export default Footer
