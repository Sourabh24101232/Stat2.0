import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import CarCard from '../components/carCard'
import { useAppContext } from '../Context/AppContext'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion as Motion } from 'framer-motion'

const Cars = () => {
  const [searchParams] = useSearchParams()
  const pickupLocation = searchParams.get('pickupLocation')
  const pickupDate = searchParams.get('pickupDate')
  const returnDate = searchParams.get('returnDate')
  const isSearchData = Boolean(pickupLocation && pickupDate && returnDate)

  const { cars, axios } = useAppContext()
  const { t } = useTranslation('common')
  const [input, setInput] = useState('')
  const [availableCars, setAvailableCars] = useState([])
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    category: '',
    transmission: '',
    seats: '',
    maxPrice: '',
    sort: 'newest',
  })
  const carsToDisplay = isSearchData ? availableCars : cars

  const filteredCars = useMemo(() => {
    const query = input.trim().toLowerCase()

    const matchingCars = carsToDisplay.filter((car) => {
      const matchesSearch = !query || car.brand.toLowerCase().includes(query)
        || car.model.toLowerCase().includes(query)
        || car.category.toLowerCase().includes(query)
        || car.transmission.toLowerCase().includes(query)
        || car.fuel_type.toLowerCase().includes(query)

      return matchesSearch
        && (!filters.category || car.category === filters.category)
        && (!filters.transmission || car.transmission === filters.transmission)
        && (!filters.seats || car.seating_capacity === Number(filters.seats))
        && (!filters.maxPrice || car.pricePerDay <= Number(filters.maxPrice))
    })

    return matchingCars.sort((firstCar, secondCar) => {
      if (filters.sort === 'price-low') return firstCar.pricePerDay - secondCar.pricePerDay
      if (filters.sort === 'price-high') return secondCar.pricePerDay - firstCar.pricePerDay
      return new Date(secondCar.createdAt) - new Date(firstCar.createdAt)
    })
  }, [carsToDisplay, filters, input])

  const filterOptions = useMemo(() => ({
    categories: [...new Set(carsToDisplay.map((car) => car.category))],
    transmissions: [...new Set(carsToDisplay.map((car) => car.transmission))],
    seats: [...new Set(carsToDisplay.map((car) => car.seating_capacity))].sort((firstSeat, secondSeat) => firstSeat - secondSeat),
  }), [carsToDisplay])

  const updateFilter = (event) => {
    const { name, value } = event.target
    setFilters((currentFilters) => ({ ...currentFilters, [name]: value }))
  }

  const clearFilters = () => {
    setFilters({ category: '', transmission: '', seats: '', maxPrice: '', sort: 'newest' })
  }

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
          if (data.availableCars.length === 0) toast(t('cars.noneAvailable'))
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
  }, [axios, isSearchData, pickupDate, pickupLocation, returnDate, t])

  return (
    <div>
      <div className="flex flex-col items-center bg-light py-20 transition-colors dark:bg-gray-950 max-md:px-4">
        <Motion.div initial={{ y: -16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4 }}>
          <Title title={t('cars.availableTitle')} subTitle={t('cars.availableSubtitle')} />
        </Motion.div>

        <Motion.div initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4, delay: 0.1 }} className="relative mt-6 flex h-12 w-full max-w-140 items-center rounded-full bg-white px-4 shadow dark:border dark:border-slate-600 dark:bg-gray-800 dark:shadow-[0px_10px_25px_rgba(0,0,0,0.35)]">
          <img src={assets.search_icon} alt="" className="w-4.5 h-4.5 mr-2" />
          <input onChange={(event) => setInput(event.target.value)} value={input} type="text" placeholder={t('cars.searchPlaceholder')} className="cars-search-input h-full w-full bg-transparent text-gray-500 outline-none placeholder-gray-500 focus:outline-none focus:ring-0 dark:text-gray-200 dark:placeholder-gray-400" />
          <button type="button" onClick={() => setShowFilters((isOpen) => !isOpen)} aria-label={t('cars.showFilters')} aria-expanded={showFilters} className="cursor-pointer">
            <img src={assets.filter_icon} alt="" className="h-4.5 w-4.5" />
          </button>

          <AnimatePresence>
          {showFilters && (
            <Motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="absolute right-0 top-14 z-10 w-72 rounded-xl bg-white p-4 text-left shadow-lg dark:border dark:border-slate-600 dark:bg-gray-800">
              <div className="mb-3 flex items-center justify-between">
                <p className="font-medium text-gray-800 dark:text-gray-100">{t('cars.filterCars')}</p>
                <button type="button" onClick={clearFilters} className="cursor-pointer text-sm text-primary">{t('cars.clear')}</button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <label className="flex flex-col gap-1 text-gray-600 dark:text-gray-300">{t('cars.carType')}
                  <select name="category" value={filters.category} onChange={updateFilter} className="rounded border border-borderColor bg-transparent p-2 outline-none dark:border-gray-600">
                    <option value="">{t('cars.all')}</option>
                    {filterOptions.categories.map((category) => <option key={category} value={category}>{category}</option>)}
                  </select>
                </label>
                <label className="flex flex-col gap-1 text-gray-600 dark:text-gray-300">{t('cars.transmission')}
                  <select name="transmission" value={filters.transmission} onChange={updateFilter} className="rounded border border-borderColor bg-transparent p-2 outline-none dark:border-gray-600">
                    <option value="">{t('cars.all')}</option>
                    {filterOptions.transmissions.map((transmission) => <option key={transmission} value={transmission}>{transmission}</option>)}
                  </select>
                </label>
                <label className="flex flex-col gap-1 text-gray-600 dark:text-gray-300">{t('cars.seats')}
                  <select name="seats" value={filters.seats} onChange={updateFilter} className="rounded border border-borderColor bg-transparent p-2 outline-none dark:border-gray-600">
                    <option value="">{t('cars.any')}</option>
                    {filterOptions.seats.map((seat) => <option key={seat} value={seat}>{seat}</option>)}
                  </select>
                </label>
                <label className="flex flex-col gap-1 text-gray-600 dark:text-gray-300">{t('cars.maxPerDay')}
                  <input name="maxPrice" value={filters.maxPrice} onChange={updateFilter} type="number" min="0" placeholder={t('cars.any')} className="rounded border border-borderColor bg-transparent p-2 outline-none dark:border-gray-600" />
                </label>
              </div>

              <label className="mt-3 flex flex-col gap-1 text-sm text-gray-600 dark:text-gray-300">{t('cars.sortBy')}
                <select name="sort" value={filters.sort} onChange={updateFilter} className="rounded border border-borderColor bg-transparent p-2 outline-none dark:border-gray-600">
                  <option value="newest">{t('cars.newest')}</option>
                  <option value="price-low">{t('cars.priceLowHigh')}</option>
                  <option value="price-high">{t('cars.priceHighLow')}</option>
                </select>
              </label>
            </Motion.div>
          )}
          </AnimatePresence>
        </Motion.div>
      </div>

      <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-10">
        <p className="mx-auto max-w-7xl text-gray-500 dark:text-gray-400 xl:px-20">{t('cars.showing', { count: filteredCars.length })}</p>

        <Motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.06 } } }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4 xl:px-20 max-w-7xl mx-auto">
          {filteredCars.map((car) => (
            <Motion.div key={car._id} variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: 0.3 }}><CarCard car={car} /></Motion.div>
          ))}
        </Motion.div>
      </div>
    </div>
  )
}

export default Cars
