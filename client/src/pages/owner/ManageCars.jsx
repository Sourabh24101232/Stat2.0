import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Title from '../../components/owner/Title'
import { assets } from '../../assets/assets'
import Loader from '../../components/Loader'
import { useAppContext } from '../../Context/AppContext'

const ManageCars = () => {
  const { axios, currency, fetchCars } = useAppContext()
  const [cars, setCars] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeCarId, setActiveCarId] = useState(null)

  useEffect(() => {
    const fetchOwnerCars = async () => {
      try {
        const { data } = await axios.get('/api/owner/cars')

        if (data.success) {
          setCars(data.cars)
        } else {
          toast.error(data.message)
        }
      } catch (error) {
        toast.error(error.response?.data?.message || error.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOwnerCars()
  }, [axios])

  const toggleAvailability = async (carId) => {
    try {
      setActiveCarId(carId)
      const { data } = await axios.post('/api/owner/toggle-car', { carId })

      if (!data.success) {
        toast.error(data.message)
        return
      }

      setCars((currentCars) => currentCars.map((car) => (
        car._id === carId ? { ...car, isAvailable: !car.isAvailable } : car
      )))
      await fetchCars()
      toast.success(data.message)
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setActiveCarId(null)
    }
  }

  const deleteCar = async (carId) => {
    const shouldDelete = window.confirm('Remove this car from your listings?')

    if (!shouldDelete) {
      return
    }

    try {
      setActiveCarId(carId)
      const { data } = await axios.post('/api/owner/delete-car', { carId })

      if (!data.success) {
        toast.error(data.message)
        return
      }

      setCars((currentCars) => currentCars.filter((car) => car._id !== carId))
      await fetchCars()
      toast.success(data.message)
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setActiveCarId(null)
    }
  }

  if (isLoading) {
    return <Loader />
  }

  return (
    <div className='w-full px-4 pt-10 md:px-10'>

      <Title title="Manage Cars" subTitle="View all listed cars, update their details, or remove them from the booking platform." />

      <div className='mt-6 w-full max-w-3xl overflow-hidden rounded-md border border-borderColor dark:border-gray-700'>

        <table className='w-full border-collapse text-left text-sm text-gray-600 dark:text-gray-300'>
          <thead className='text-gray-500 dark:text-gray-400'>

            <tr>
              <th className='p-3 font-medium'>Car</th>
              <th className='p-3 font-medium max-md:hidden'>Category</th>
              <th className='p-3 font-medium'>Price</th>
              <th className='p-3 font-medium max-md:hidden'>Status</th>
              <th className='p-3 font-medium'>Actions</th>
            </tr>

          </thead>

          <tbody>

            {cars.length === 0 && (
              <tr className='border-t border-borderColor dark:border-gray-700'>
                <td colSpan={5} className='p-6 text-center text-gray-500 dark:text-gray-400'>
                  You have not listed any cars yet.
                </td>
              </tr>
            )}

            {cars.map((car) => (
              <tr key={car._id} className='border-t border-borderColor dark:border-gray-700'>

                <td className='p-3'>
                  <div className='flex items-center gap-3'>

                    <img src={car.image} alt={`${car.brand} ${car.model}`} className="h-12 w-12 aspect-square rounded-md object-cover" />

                    <div className='max-md:hidden'>
                      <p className='font-medium'> {car.brand} {car.model}</p>
                      <p className='text-xs text-gray-500 dark:text-gray-400'>{car.seating_capacity} seats - {car.transmission}</p>
                    </div>

                  </div>
                </td>

                <td className='p-3 max-md:hidden'>{car.category}  </td>
                <td className='p-3'> {currency} {car.pricePerDay}/day </td>

                <td className='p-3 max-md:hidden'>
                  <span className={`rounded-full px-3 py-1 text-xs ${car.isAvailable ? 'bg-green-100 text-green-500 dark:bg-green-400/15' : 'bg-red-100 text-red-500 dark:bg-red-400/15'}`} > {car.isAvailable ? "Available" : "Unavailable"}</span>
                </td>

                <td className='p-3'>
                  <div className='flex items-center gap-3'>
                    <button
                      type='button'
                      disabled={activeCarId === car._id}
                      onClick={() => toggleAvailability(car._id)}
                      className='cursor-pointer disabled:cursor-not-allowed disabled:opacity-50'
                      aria-label={car.isAvailable ? 'Mark car unavailable' : 'Mark car available'}
                    >
                      <img src={car.isAvailable ? assets.eye_close_icon : assets.eye_icon} alt="" />
                    </button>
                    <button
                      type='button'
                      disabled={activeCarId === car._id}
                      onClick={() => deleteCar(car._id)}
                      className='cursor-pointer disabled:cursor-not-allowed disabled:opacity-50'
                      aria-label='Remove car'
                    >
                      <img src={assets.delete_icon} alt="" />
                    </button>
                  </div>
                </td>

              </tr>
            ))}

          </tbody>
        </table>

      </div>

    </div>
  )
}

export default ManageCars
