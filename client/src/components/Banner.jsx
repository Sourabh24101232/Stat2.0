import React from 'react'
import { assets } from '../assets/assets'
import { useAppContext } from '../Context/AppContext'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

const Banner = () => {
    const { user, setUser, isOwner, setIsOwner, axios, navigate, setShowLogin } = useAppContext()
    const { t } = useTranslation('common')

    const handleListCar = async () => {

        //if user is not logged in
        if (!user) {
            toast.error(t('owner.loginFirst'))
            setShowLogin(true)
            return
        }

        //if logged in and also an owner
        if (isOwner) {
            navigate('/owner/add-car')
            return
        }

        //logged in but not an owner --> make it owner
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
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 px-8 md:px-14 py-12 bg-gradient-to-r from-[#0558FE] to-[#A9CFFF] w-full max-w-7xl mx-auto rounded-2xl overflow-hidden mt-15 mb-10">

            {/* LEFT TEXT SECTION */}
            <div className="text-white text-center md:text-left md:w-1/2">

                <h2 className="text-3xl font-medium">
                    {t('home.ownerTitle')}
                </h2>

                <p className="mt-2">
                    {t('home.ownerText')}
                </p>

                <p className="max-w-[500px]">
                    We take care of insurance, driver verification and secure payments –
                    so you can earn passive income, stress-free.
                </p>

                <button onClick={handleListCar} className="px-6 py-2 bg-white hover:bg-slate-100 transition-all text-primary rounded-lg text-sm mt-4 cursor-pointer">
                    {t('navbar.listYourCar')}
                </button>
            </div>

            {/* RIGHT IMAGE */}
            <img
                src={assets.banner_car_image}
                alt="car"
                className="w-full max-w-md max-h-[260px] md:max-h-[320px] object-contain"
            />

        </div>
    )
}

export default Banner
