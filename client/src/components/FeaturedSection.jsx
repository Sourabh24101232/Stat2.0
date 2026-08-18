import React from 'react'
import Title from './Title'
import { assets} from '../assets/assets'
import CarCard from './carCard'
import { useNavigate } from 'react-router-dom'
import {useAppContext} from '../Context/AppContext'
import { useTranslation } from 'react-i18next'
import { motion as Motion } from 'framer-motion'

const FeaturedSection = () => {

    const navigate = useNavigate()
    const { cars } = useAppContext()
    const { t } = useTranslation('common')

    return (
        <div className="flex flex-col items-center py-24 px-6 md:px-16 lg:px-24 xl:px-32">

            <div>
                <Title title={t('home.featuredTitle')} subTitle={t('home.featuredSubtitle')} />
            </div>

            <Motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
                variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
                className="grid grid-cols-1 gap-8 mt-16 sm:grid-cols-2 lg:grid-cols-3"
            >
                {cars.slice(0, 6).map((car) => (
                    <Motion.div key={car._id} variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }} transition={{ duration: 0.35 }}>
                        <CarCard car={car} />
                    </Motion.div>
                ))}
            </Motion.div>

            <Motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { navigate('/cars'); window.scrollTo(0, 0); }}
                className="mt-16 flex cursor-pointer items-center justify-center gap-2 rounded-md border border-borderColor px-6 py-2 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
                {t('home.exploreCars')}
                <img src={assets.arrow_icon} alt="arrow" />
            </Motion.button>

        </div>
    )
}

export default FeaturedSection
