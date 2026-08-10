import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { assets } from '../assets/assets'
import Title from '../components/Title'
import Loader from '../components/Loader'
import { useAppContext } from '../Context/AppContext'

const formatDate = (date) => new Date(date).toLocaleDateString('en-CA')

const MyBookings = () => {
  const { axios, user, currency } = useAppContext()
  const [bookings, setBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user) return undefined

    let isCurrent = true

    const fetchMyBookings = async () => {
      try {
        const { data } = await axios.get('/api/bookings/user')

        if (!isCurrent) return

        if (data.success) {
          setBookings(data.bookings)
        } else {
          toast.error(data.message)
        }
      } catch (error) {
        if (isCurrent) toast.error(error.response?.data?.message || error.message)
      } finally {
        if (isCurrent) setIsLoading(false)
      }
    }

    fetchMyBookings()

    return () => {
      isCurrent = false
    }
  }, [axios, user])

  if (isLoading) return <Loader />

  return (
    <div className="mt-16 max-w-7xl px-6 text-sm md:px-16 lg:px-24 xl:px-32 2xl:px-48">
      <Title title="My Bookings" subTitle="View and manage all your car bookings" align="left" />

      {bookings.length === 0 ? (
        <p className="mt-12 text-gray-500 dark:text-gray-400">You have no bookings yet.</p>
      ) : (
        <div>
          {bookings.map((booking, index) => (
            <div key={booking._id} className="mt-5 grid grid-cols-1 gap-6 rounded-lg border border-borderColor p-6 first:mt-12 dark:border-gray-700 dark:bg-gray-800 md:grid-cols-4">
              <div className="md:col-span-1">
                <div className="mb-3 overflow-hidden rounded-md">
                  <img src={booking.car.image} alt={`${booking.car.brand} ${booking.car.model}`} className="aspect-video h-auto w-full object-cover" />
                </div>
                <p className="mt-2 text-lg font-medium">{booking.car.brand} {booking.car.model}</p>
                <p className="text-gray-500 dark:text-gray-400">{booking.car.year} - {booking.car.category} - {booking.car.location}</p>
              </div>

              <div className="md:col-span-2">
                <div className="flex items-center gap-2">
                  <p className="rounded bg-light px-3 py-1.5 dark:bg-gray-700">Booking #{index + 1}</p>
                  <p className={`rounded-full px-3 py-1 text-xs ${booking.status === 'confirmed' ? 'bg-green-400/15 text-green-600' : booking.status === 'cancelled' ? 'bg-red-400/15 text-red-600' : 'bg-yellow-400/15 text-yellow-600'}`}>{booking.status}</p>
                </div>

                <div className="mt-3 flex items-start gap-2">
                  <img src={assets.calendar_icon_colored} alt="" className="mt-1 h-4 w-4" />
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Rental Period</p>
                    <p>{formatDate(booking.pickupDate)} To {formatDate(booking.returnDate)}</p>
                  </div>
                </div>

                <div className="mt-3 flex items-start gap-2">
                  <img src={assets.location_icon_colored} alt="" className="mt-1 h-4 w-4" />
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Pick-up Location</p>
                    <p>{booking.car.location}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between gap-6 md:col-span-1">
                <div className="text-right text-sm text-gray-500 dark:text-gray-400">
                  <p>Total Price</p>
                  <h2 className="text-2xl font-semibold text-blue-600">{currency}{booking.price}</h2>
                  <p>Booked on {formatDate(booking.createdAt)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyBookings
