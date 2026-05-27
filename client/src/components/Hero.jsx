import React from 'react'
import { useState } from 'react'
import { assets, cityList } from '../assets/assets'

const Hero = () => {

  const [pickupLocation, setPickupLocation] = useState('')

  return (
    <div className='h-screen flex flex-col items-center justify-center gap-14 bg-light text-center'>

      {/* Heading */}
      <h1 className='text-4xl md:text-5xl font-semibold'>
        Luxury cars on Rent
      </h1>

      {/* Selection Form */}
      <form action="" className='flex flex-col md:flex-row items-start md:items-center justify-between p-6 rounded-lg md:rounded-full w-full max-w-80 md:max-w-200 bg-white shadow-[0px_8px_20px_rgba(0,0,0,0.1)] dark:border dark:border-slate-600'>

        <div className='flex flex-col md:flex-row items-start md:items-center gap-10 min-md:ml-8'>

          {/* For pickupLocations */}
          <div className='flex flex-col items-start gap-2'>
            {/* Dropdown to show list of pickupLocations */}
            <select required value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)}>
              <option value="">PickUp Location</option>
              {cityList.map((city) => <option key={city} value={city}>{city}</option>)}
            </select>
            {/* if pickuplocation is selected, show the name of pickupLocation */}
            <p>{pickupLocation ? pickupLocation : "lease select your location"} </p>
          </div>

          {/* For pickUp date */}
          <div className='flex flex-col items-start gap-2'>
            <label htmlFor="pickup-date" >Pick-up-Date</label>
            <input type="date" id='pickup-date' min={new Date().toISOString().split('T')[0]} className='hero-date-input text-sm text-gray-500' required />
          </div>

          {/* For return date */}
          <div className='flex flex-col items-start gap-2'>
            <label htmlFor="return-date" >Return Date</label>
            <input type="date" id='return-date' className='hero-date-input text-sm text-gray-500' required />
          </div>

        </div>

        {/* Search Button */}
        <button className='flex items-center justify-center gap-1 px-9 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full'>
          <img src={assets.search_icon} alt="search" className='brightness-300'/>
          Search
        </button>

      </form>

      {/* Car Image */}
      <img src={assets.main_car} alt="Car Image" className='max-h-[400px]' />

    </div>
  )
}

export default Hero


// import React, { useState } from 'react'
// import { assets } from "../assets/assets"
// import { cityList } from '../assets/assets'
// import { useAppContext } from '../context/AppContext'
// import { motion, scale } from 'motion/react'

// const Hero = () => {

//     const [pickupLocation, setPickupLocation] = useState('')

//     const { pickupDate, setPickupDate, returnDate, setReturnDate, navigate } = useAppContext();

//     const handleSearch = (e) => {
//         e.preventDefault()
//         navigate(
//             '/cars?pickupLocation=' + pickupLocation +
//             '&pickupDate=' + pickupDate +
//             '&returnDate=' + returnDate
//         )
//     }

//     return (
//         <motion.div

//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 0.8 }}

//             className='h-screen flex flex-col items-center justify-center gap-14 bg-light text-center'>

//             <motion.h1
//                 initial={{ y: -20, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 transition={{ duration: 0.5 }}
//                 className='text-4xl md:text-5xl font-semibold'>Luxury Cars on Rent
//             </motion.h1>

//             <motion.form
//                 initial={{ y: 50, opacity: 0, scale: 0.95 }}
//                 animate={{ y: 0, opacity: 1, scale: 1 }}
//                 transition={{ duration: 0.6, delay: 0.4 }}

//                 onSubmit={handleSearch} className='flex flex-col md:flex-row items-start md:items-center justify-between p-6 rounded-lg md:rounded-full w-full max-w-80 md:max-w-200 bg-white shadow-[0px_8px_20px_rgba(0,0,0,0.1)] dark:border dark:border-slate-600'>

//                 <div className='flex flex-col md:flex-row items-start md:items-center gap-10 min-md:ml-8'>

//                     <div className='flex flex-col items-start gap-2'>
//                         <select required value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)}><option value="">Pickup Location</option>{cityList.map((city) => (<option key={city} value={city}>{city}</option>))}</select>
//                         <p className='px-1 text-sm text-gray-500' >{pickupLocation ? pickupLocation : 'Please select location'}</p>
//                     </div>

//                     <div className='flex flex-col items-start gap-2'>
//                         <label htmlFor="pickup-date" >Pick-up-Date</label>
//                         <input value={pickupDate} onChange={e => setPickupDate(e.target.value)} type="date" id='pickup-date' min={new Date().toISOString().split('T')[0]} className='hero-date-input text-sm text-gray-500' required />
//                     </div>

//                     <div className='flex flex-col items-start gap-2'>
//                         <label htmlFor="return-date" >Return Date</label>
//                         <input value={returnDate} onChange={e => setReturnDate(e.target.value)} type="date" id='return-date' className='hero-date-input text-sm text-gray-500' required />
//                     </div>

//                 </div>

//                 <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     className='flex items-center justify-center gap-1 px-9 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full'><img src={assets.search_icon} alt="search" className='brightness-300' />Search
//                 </motion.button>

//             </motion.form>

//             <motion.img
//                 initial={{ y: 100, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1}}
//                 transition={{ duration: 0.8, delay: 0.6 }}

//                 src={assets.main_car} alt="car" className='max-h-[400px]' />

//         </motion.div>
//     )
// }

// export default Hero
