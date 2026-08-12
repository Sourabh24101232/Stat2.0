import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Title from '../../components/owner/Title'
import Loader from '../../components/Loader'
import { useAppContext } from '../../Context/AppContext'

const ManageBookings = () => {

  const { axios, currency } = useAppContext()
  const [bookings, setBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeBookingId, setActiveBookingId] = useState(null)

  useEffect(() => {
    const fetchOwnerBookings = async () => {
      try {
        const { data } = await axios.get('/api/bookings/owner')

        if (data.success) {
          setBookings(data.bookings)
        } else {
          toast.error(data.message)
        }
      } catch (error) {
        toast.error(error.response?.data?.message || error.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOwnerBookings()
  }, [axios])

  const changeBookingStatus = async (bookingId, status) => {
    try {
      setActiveBookingId(bookingId)
      const { data } = await axios.post('/api/bookings/change-status', {
        bookingId,
        status,
      })

      if (!data.success) {
        toast.error(data.message)
        return
      }

      setBookings((currentBookings) => currentBookings.map((booking) => (
        booking._id === bookingId ? { ...booking, status } : booking
      )))
      toast.success(data.message)
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setActiveBookingId(null)
    }
  }

  if (isLoading) {
    return <Loader />
  }

  return (
    <div className='px-4 pt-10 md:px-10 w-full'>

      <Title title="Manage Bookings" subTitle="Track all customer bookings, approve or cancel requests, and manage booking statuses." />

      <div className='mt-6 w-full max-w-3xl overflow-hidden rounded-md border border-borderColor dark:border-gray-700'>

        <table className='w-full border-collapse text-left text-sm text-gray-600 dark:text-gray-300'>
          <thead className='text-gray-500 dark:text-gray-400'>

            <tr>
              <th className='p-3 font-medium'>Car</th>
              <th className='p-3 font-medium max-md:hidden'>Date Range</th>
              <th className='p-3 font-medium'>Total</th>
              <th className='p-3 font-medium max-md:hidden'>Payment</th>
              <th className='p-3 font-medium'>Actions</th>
            </tr>

          </thead>

          <tbody>

            {bookings.length === 0 && (
              <tr className='border-t border-borderColor dark:border-gray-700'>
                <td colSpan={5} className='p-6 text-center text-gray-500 dark:text-gray-400'>
                  No bookings found.
                </td>
              </tr>
            )}

            {bookings.map((booking) => (
              <tr key={booking._id} className='border-t border-borderColor text-gray-500 dark:border-gray-700 dark:text-gray-400'>

                <td className='p-3'>
                  <div className='flex items-center gap-3'>
                    {booking.car?.image && (
                      <img
                        src={booking.car.image}
                        alt={`${booking.car.brand} ${booking.car.model}`}
                        className='h-12 w-12 aspect-square rounded-md object-cover'
                      />
                    )}
                    <div className='max-md:hidden'>
                      <p className='font-medium'>
                        {booking.car ? `${booking.car.brand} ${booking.car.model}` : 'Car unavailable'}
                      </p>
                      <p className='text-xs'>{booking.user?.name || booking.user?.email || 'Customer'}</p>
                    </div>
                  </div>
                </td>

                <td className='p-3 max-md:hidden'> {booking.pickupDate.split('T')[0]} to {booking.returnDate.split('T')[0]} </td>
                <td className='p-3'> {currency}{booking.price}</td>

                <td className='p-3 max-md:hidden'>
                  <span className='rounded-full bg-gray-100 px-3 py-1 text-xs dark:bg-gray-700'> offline</span>
                </td>

                <td className='p-3'>
                  {booking.status === 'pending' || booking.status === 'confirmed' ? (
                    <select
                      value={booking.status}
                      disabled={activeBookingId === booking._id}
                      onChange={(event) => changeBookingStatus(booking._id, event.target.value)}
                      className='mt-1 rounded-md border border-borderColor bg-transparent px-2 py-1.5 text-gray-500 outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-200'
                    >
                      {booking.status === 'pending' ? (
                        <>
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="cancelled">Cancelled</option>
                        </>
                      ) : (
                        <>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </>
                      )}
                    </select>

                  ) : (

                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${booking.status === 'confirmed' ? 'bg-green-100 text-green-500 dark:bg-green-400/15' : 'bg-red-100 text-red-500 dark:bg-red-400/15'}`} > {booking.status}</span>

                  )}
                </td>

              </tr>
            ))}

          </tbody>
        </table>

      </div>

    </div >
  )
}

export default ManageBookings
