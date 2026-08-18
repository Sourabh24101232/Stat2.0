import React from 'react'
import { useState } from 'react'
import { assets, cityList } from '../assets/assets'
import { useAppContext } from '../Context/AppContext'
import { useTranslation } from 'react-i18next'
import { motion as Motion } from 'framer-motion'

const Hero = () => {
  const { t } = useTranslation('common')

  const [pickupLocation, setPickupLocation] = useState('')
  const {
    pickupDate,
    setPickupDate,
    returnDate,
    setReturnDate,
    navigate,
  } = useAppContext()

  const handleSearch = (event) => {
    event.preventDefault()

    const searchParams = new URLSearchParams({
      pickupLocation,
      pickupDate,
      returnDate,
    })

    navigate(`/cars?${searchParams.toString()}`)
    //similar to this version-
  //   navigate(
  //   '/cars?pickupLocation=' + pickupLocation +
  //   '&pickupDate=' + pickupDate +
  //   '&returnDate=' + returnDate
  // )
  }

  return (
    <div className='flex min-h-screen flex-col items-center justify-center gap-10 bg-light px-4 py-28 text-center transition-colors dark:bg-gray-950 md:gap-14'>

      {/* Heading */}
      <Motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className='text-4xl font-semibold md:text-5xl'
      >
        {t('hero.title')}
      </Motion.h1>

      {/* Selection Form */}
      <Motion.form
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        onSubmit={handleSearch}
        className='flex w-full max-w-80 flex-col items-start justify-between rounded-lg bg-white p-6 shadow-[0px_8px_20px_rgba(0,0,0,0.1)] transition-colors dark:border dark:border-slate-600 dark:bg-gray-800 dark:shadow-[0px_8px_24px_rgba(0,0,0,0.35)] md:max-w-200 md:flex-row md:items-center md:rounded-full'
      >

        <div className='flex flex-col items-start gap-6 md:ml-8 md:flex-row md:items-center md:gap-10'>

          {/* For pickupLocations */}
          <div className='flex flex-col items-start gap-2'>
            {/* Dropdown to show list of pickupLocations */}
            <select required value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)} className='bg-transparent outline-none dark:text-gray-200'>
              <option value="">{t('hero.pickupLocation')}</option>
              {cityList.map((city) => <option key={city} value={city}>{city}</option>)}
            </select>
            {/* if pickuplocation is selected, show the name of pickupLocation */}
            <p>{pickupLocation || t('hero.selectLocation')} </p>
          </div>

          {/* For pickUp date */}
          <div className='flex flex-col items-start gap-2'>
            <label htmlFor="pickup-date" >{t('hero.pickupDate')}</label>
            <input value={pickupDate} onChange={(event) => setPickupDate(event.target.value)} type="date" id='pickup-date' min={new Date().toISOString().split('T')[0]} className='hero-date-input bg-transparent text-sm text-gray-500 outline-none dark:text-gray-400' required />
          </div>

          {/* For return date */}
          <div className='flex flex-col items-start gap-2'>
            <label htmlFor="return-date" >{t('hero.returnDate')}</label>
            <input value={returnDate} onChange={(event) => setReturnDate(event.target.value)} type="date" id='return-date' min={pickupDate || new Date().toISOString().split('T')[0]} className='hero-date-input bg-transparent text-sm text-gray-500 outline-none dark:text-gray-400' required />
          </div>

        </div>

        {/* Search Button */}
        <Motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} type="submit" className='mt-6 flex items-center justify-center gap-1 rounded-full bg-blue-600 px-9 py-3 text-white hover:bg-blue-700 md:mt-0'>
          <img src={assets.search_icon} alt="search" className='brightness-300' />
          {t('hero.search')}
        </Motion.button>

      </Motion.form>

      {/* Car Image */}
      <Motion.img
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        src={assets.main_car}
        alt="Car Image"
        className='max-h-[300px] w-full max-w-2xl object-contain'
      />

    </div>
  )
}

export default Hero


