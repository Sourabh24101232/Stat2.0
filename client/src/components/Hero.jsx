import React from 'react'
import { useState } from 'react'
import { assets, cityList } from '../assets/assets'
import { useAppContext } from '../Context/AppContext'

const Hero = () => {

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
    <div className='h-screen flex flex-col items-center justify-center gap-14 bg-light text-center transition-colors dark:bg-gray-950'>

      {/* Heading */}
      <h1 className='text-4xl md:text-5xl font-semibold'>Luxury cars on Rent</h1>

      {/* Selection Form */}
      <form onSubmit={handleSearch} className='flex flex-col md:flex-row items-start md:items-center justify-between p-6 rounded-lg md:rounded-full w-full max-w-80 md:max-w-200 bg-white shadow-[0px_8px_20px_rgba(0,0,0,0.1)] transition-colors dark:border dark:border-slate-600 dark:bg-gray-800 dark:shadow-[0px_8px_24px_rgba(0,0,0,0.35)]'>

        <div className='flex flex-col md:flex-row items-start md:items-center gap-10 min-md:ml-8'>

          {/* For pickupLocations */}
          <div className='flex flex-col items-start gap-2'>
            {/* Dropdown to show list of pickupLocations */}
            <select required value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)} className='bg-transparent outline-none dark:text-gray-200'>
              <option value="">PickUp Location</option>
              {cityList.map((city) => <option key={city} value={city}>{city}</option>)}
            </select>
            {/* if pickuplocation is selected, show the name of pickupLocation */}
            <p>{pickupLocation ? pickupLocation : "lease select your location"} </p>
          </div>

          {/* For pickUp date */}
          <div className='flex flex-col items-start gap-2'>
            <label htmlFor="pickup-date" >Pick-up-Date</label>
            <input value={pickupDate} onChange={(event) => setPickupDate(event.target.value)} type="date" id='pickup-date' min={new Date().toISOString().split('T')[0]} className='hero-date-input bg-transparent text-sm text-gray-500 outline-none dark:text-gray-400' required />
          </div>

          {/* For return date */}
          <div className='flex flex-col items-start gap-2'>
            <label htmlFor="return-date" >Return Date</label>
            <input value={returnDate} onChange={(event) => setReturnDate(event.target.value)} type="date" id='return-date' min={pickupDate || new Date().toISOString().split('T')[0]} className='hero-date-input bg-transparent text-sm text-gray-500 outline-none dark:text-gray-400' required />
          </div>

        </div>

        {/* Search Button */}
        <button type="submit" className='flex items-center justify-center gap-1 px-9 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full'>
          <img src={assets.search_icon} alt="search" className='brightness-300' />
          Search
        </button>

      </form>

      {/* Car Image */}
      <img src={assets.main_car} alt="Car Image" className='max-h-300px' />

    </div>
  )
}

export default Hero


