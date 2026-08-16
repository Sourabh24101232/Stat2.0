import React from 'react'
import { assets } from '../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAppContext } from '../Context/AppContext'
import { useTranslation } from 'react-i18next'

const Footer = () => {
    const { user, setUser, isOwner, setIsOwner, axios, setShowLogin } = useAppContext()
    const navigate = useNavigate()
    const { t } = useTranslation('common')

    const handleListCar = async () => {
        if (!user) {
            toast.error(t('owner.loginFirst'))
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
                        {t('footer.description')}
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
                        <h2 className='text-base font-medium uppercase text-gray-800 dark:text-gray-200'>{t('footer.quickLinks')}</h2>
                        <ul className='mt-3 flex flex-col gap-1.5'>
                            <li><Link to="/">{t('navbar.home')}</Link></li>
                            <li><Link to="/cars">{t('footer.browseCars')}</Link></li>
                            <li><button type="button" onClick={handleListCar} className="cursor-pointer">{t('navbar.listYourCar')}</button></li>
                            <li><Link to="/about">{t('navbar.aboutUs')}</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h2 className='text-base font-medium uppercase text-gray-800 dark:text-gray-200'>{t('footer.resources')}</h2>
                        <ul className='mt-3 flex flex-col gap-1.5'>
                            <li><Link to="/help">{t('footer.helpCenter')}</Link></li>
                            <li><Link to="/terms">{t('footer.terms')}</Link></li>
                            <li><Link to="/privacy">{t('footer.privacy')}</Link></li>
                            <li><Link to="/insurance">{t('footer.insurance')}</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h2 className='text-base font-medium uppercase text-gray-800 dark:text-gray-200'>{t('footer.contact')}</h2>
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
                    <li><Link to="/privacy">{t('footer.privacy')}</Link></li>
                    <li>|</li>
                    <li><Link to="/terms">{t('footer.terms')}</Link></li>
                    <li>|</li>
                    <li><a href="#">{t('footer.sitemap')}</a></li>
                </ul>
            </div>

        </div>
    )
}

export default Footer
