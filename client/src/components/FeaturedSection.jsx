import React from 'react'
import Title from './Title'
import { assets} from '../assets/assets'
import CarCard from './carCard'
import { useNavigate } from 'react-router-dom'
import {useAppContext} from '../Context/AppContext'
import { useTranslation } from 'react-i18next'

const FeaturedSection = () => {

    const navigate = useNavigate()
    const { cars } = useAppContext()
    const { t } = useTranslation('common')

    return (
        <div className="flex flex-col items-center py-24 px-6 md:px-16 lg:px-24 xl:px-32">

            <div>
                <Title title={t('home.featuredTitle')} subTitle={t('home.featuredSubtitle')} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-18">
                {cars.slice(0, 6).map((car) => (
                    <div key={car._id}> <CarCard car={car} /></div>
                ))}
            </div>

            <button
                onClick={() => { navigate('/cars'); window.scrollTo(0, 0); }}
                className="mt-18 flex cursor-pointer items-center justify-center gap-2 rounded-md border border-borderColor px-6 py-2 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
                {t('home.exploreCars')}
                <img src={assets.arrow_icon} alt="arrow" />
            </button>

        </div>
    )
}

export default FeaturedSection
