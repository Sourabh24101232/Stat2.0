import React from 'react'
import Title from './Title'
import { assets, dummyCarData } from '../assets/assets'
import CarCard from './carCard'
import { useNavigate } from 'react-router-dom'

const FeaturedSection = () => {

    const navigate = useNavigate()

    return (
        <div className="flex flex-col items-center py-24 px-6 md:px-16 lg:px-24 xl:px-32">

            <div>
                <Title title="Featured Vehicles" subTitle="Explore our selection of premium vehicles available for your next adventure." />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-18">
                {dummyCarData.slice(0, 6).map((car) => (
                    <div key={car._id}> <CarCard car={car} /></div>
                ))}
            </div>

            <button
                onClick={() => { navigate('/cars'); window.scrollTo(0, 0); }}
                className="mt-18 flex cursor-pointer items-center justify-center gap-2 rounded-md border border-borderColor px-6 py-2 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
                Explore all cars
                <img src={assets.arrow_icon} alt="arrow" />
            </button>

        </div>
    )
}

export default FeaturedSection
