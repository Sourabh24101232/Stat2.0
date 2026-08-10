import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import CarCard from '../components/carCard'
import { useAppContext } from '../Context/AppContext'

const Cars = () => {
  const [searchParams] = useSearchParams()
  const pickupLocation = searchParams.get('pickupLocation')
  const pickupDate = searchParams.get('pickupDate')
  const returnDate = searchParams.get('returnDate')
  const isSearchData = Boolean(pickupLocation && pickupDate && returnDate)

  const { cars, axios } = useAppContext()
  const [input, setInput] = useState('')
  const [availableCars, setAvailableCars] = useState([])
  const carsToDisplay = isSearchData ? availableCars : cars

  const filteredCars = useMemo(() => {
    const query = input.trim().toLowerCase()

    if (!query) return carsToDisplay

    return carsToDisplay.filter((car) => (
      car.brand.toLowerCase().includes(query)
      || car.model.toLowerCase().includes(query)
      || car.category.toLowerCase().includes(query)
      || car.transmission.toLowerCase().includes(query)
    ))
  }, [carsToDisplay, input])

  useEffect(() => {
    if (!isSearchData) return undefined

    let isCurrent = true

    const searchCarAvailability = async () => {
      try {
        const { data } = await axios.post('/api/bookings/check-availability', {
          location: pickupLocation,
          pickupDate,
          returnDate,
        })

        if (!isCurrent) return

        if (data.success) {
          setAvailableCars(data.availableCars)
          if (data.availableCars.length === 0) toast('No cars available')
        } else {
          toast.error(data.message)
          setAvailableCars([])
        }
      } catch (error) {
        if (!isCurrent) return
        toast.error(error.response?.data?.message || error.message)
        setAvailableCars([])
      }
    }

    searchCarAvailability()

    return () => {
      isCurrent = false
    }
  }, [axios, isSearchData, pickupDate, pickupLocation, returnDate])

  return (
    <div>
      <div className="flex flex-col items-center bg-light py-20 transition-colors dark:bg-gray-950 max-md:px-4">
        <Title title="Available Cars" subTitle="Browse our selection of premium vehicles available for your next adventure" />

        <div className="relative mt-6 flex h-12 w-full max-w-140 items-center rounded-full bg-white px-4 shadow dark:border dark:border-slate-600 dark:bg-gray-800 dark:shadow-[0px_10px_25px_rgba(0,0,0,0.35)]">
          <img src={assets.search_icon} alt="" className="w-4.5 h-4.5 mr-2" />
          <input onChange={(event) => setInput(event.target.value)} value={input} type="text" placeholder="Search by make, model, or features" className="cars-search-input h-full w-full bg-transparent text-gray-500 outline-none placeholder-gray-500 focus:outline-none focus:ring-0 dark:text-gray-200 dark:placeholder-gray-400" />
          <img src={assets.filter_icon} alt="" className="w-4.5 h-4.5" />
        </div>
      </div>

      <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-10">
        <p className="mx-auto max-w-7xl text-gray-500 dark:text-gray-400 xl:px-20">Showing {filteredCars.length} Cars</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4 xl:px-20 max-w-7xl mx-auto">
          {filteredCars.map((car) => (
            <div key={car._id}><CarCard car={car} /></div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Cars
