import React from 'react'
import Title from '../components/Title'
import { assets, dummyCarData } from '../assets/assets'
import { useState } from 'react'
import CarCard from '../components/carCard'

const Cars = () => {

  const [input, setInput] = useState('')

  return (
    <div>

      {/* upper section */}
      <div className="flex flex-col items-center py-20 bg-light max-md:px-4">

        {/* Use Title component */}
        <Title title="Available Cars" subTitle="Browse our selection of premium vehicles available for your next adventure" />

        {/* search Bar */}
        <div className="relative flex items-center bg-white px-4 mt-6 max-w-140 w-full h-12 rounded-full shadow dark:border dark:border-slate-600">

          {/* search icon */}
          <img src={assets.search_icon} alt="" className="w-4.5 h-4.5 mr-2" />
          {/* Take input */}
          <input onChange={(e) => setInput(e.target.value)} value={input} type="text" placeholder="Search by make, model, or features" className="cars-search-input w-full h-full outline-none focus:outline-none focus:ring-0 text-gray-500" />
          {/* Filter icon */}
          <img src={assets.filter_icon} alt="" className="w-4.5 h-4.5" />

        </div>

      </div>


      {/* List of cars */}
      <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-10">

        {/* show no of cars */}
        <p className='text-gray-500 xl:px-20 max-w-7xl mx-auto'>Showing {dummyCarData.length} Cars</p>

        {/* show all cars in form of carcard */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4 xl:px-20 max-w-7xl mx-auto">
          {dummyCarData.map((car, index) => (
            <div key={index} > <CarCard car={car} /></div>))}
        </div>

      </div>

    </div>
  )
}

export default Cars















