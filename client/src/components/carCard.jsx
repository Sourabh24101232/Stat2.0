import React from 'react'
import { assets } from '../assets/assets'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const CarCard = ({ car }) => {
    const currency = import.meta.env.VITE_CURRENCY
    const navigate = useNavigate()
    const location = useLocation()
    const { t } = useTranslation('common')

    const openCarDetails = () => {
        // Keep the active availability-search dates when opening a car.
        const search = location.pathname === '/cars' ? location.search : ''
        navigate(`/car-details/${car._id}${search}`)
        scrollTo(0, 0)
    }

    return (
        <div onClick={openCarDetails} className="group cursor-pointer overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-500 hover:-translate-y-1 dark:border dark:border-gray-700 dark:bg-gray-800 dark:shadow-[0px_10px_25px_rgba(0,0,0,0.35)]">

            <div className="relative h-48 overflow-hidden">
                <img src={car.image} alt="Car Image" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />

                {car.isAvailable && (<p className="absolute left-4 top-4 rounded-full bg-primary/90 px-2.5 py-1 text-xs text-white">{t('cars.availableNow')}</p>)}

                <div className="absolute bottom-4 right-4 rounded-lg bg-black/80 px-3 py-2 text-white backdrop-blur-sm">
                    <span className="font-semibold">{currency}{car.pricePerDay}</span>
                    <span className="text-sm text-white/80"> {t('cars.perDay')}</span>
                </div>
            </div>

            <div className="p-4 sm:p-5">
                <div className="mb-2 flex items-start justify-between">
                    <div>
                        <h3 className="text-lg font-medium">{car.brand} {car.model}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{car.category} - {car.year}</p>
                        <div className="mt-2 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <img src={assets.star_icon} alt="rating" className="h-4 w-4" />
                            <span>{(car.averageRating || 0).toFixed(1)}</span>
                            <span>({t('cars.reviews', { count: car.reviewCount || 0 })})</span>
                        </div>
                    </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-y-2 text-gray-600 dark:text-gray-300">
                    <div className="flex items-center text-sm">
                        <img src={assets.users_icon} alt="" className="mr-2 h-4" />
                        <span>{t('booking.seats', { count: car.seating_capacity })}</span>
                    </div>

                    <div className="flex items-center text-sm">
                        <img src={assets.fuel_icon} alt="" className="mr-2 h-4" />
                        <span>{car.fuel_type}</span>
                    </div>

                    <div className="flex items-center text-sm">
                        <img src={assets.car_icon} alt="" className="mr-2 h-4" />
                        <span>{car.transmission}</span>
                    </div>

                    <div className="flex items-center text-sm">
                        <img src={assets.location_icon} alt="" className="mr-2 h-4" />
                        <span>{car.location}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CarCard
