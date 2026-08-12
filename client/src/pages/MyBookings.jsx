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
  const [ratings, setRatings] = useState({})
  const [comments, setComments] = useState({})
  const [submittingBookingId, setSubmittingBookingId] = useState(null)

  useEffect(() => {
    if (!user) return undefined

    let isCurrent = true
    const fetchMyBookings = async () => {
      try {
        const { data } = await axios.get('/api/bookings/user')
        if (!isCurrent) return

        if (data.success) setBookings(data.bookings)
        else toast.error(data.message)
      } catch (error) {
        if (isCurrent) toast.error(error.response?.data?.message || error.message)
      } finally {
        if (isCurrent) setIsLoading(false)
      }
    }

    fetchMyBookings()
    return () => { isCurrent = false }
  }, [axios, user])

  const submitReview = async (bookingId) => {
    const rating = ratings[bookingId]
    const comment = comments[bookingId]?.trim()

    if (!rating || !comment) {
      toast.error('Please select a star rating and write a review.')
      return
    }

    try {
      setSubmittingBookingId(bookingId)
      const { data } = await axios.post('/api/reviews', { bookingId, rating, comment })

      if (data.success) {
        setBookings((currentBookings) => currentBookings.map((booking) => (
          booking._id === bookingId ? { ...booking, hasReview: true } : booking
        )))
        setRatings((current) => ({ ...current, [bookingId]: 0 }))
        setComments((current) => ({ ...current, [bookingId]: '' }))
        toast.success(data.message)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setSubmittingBookingId(null)
    }
  }

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
                  <p className={`rounded-full px-3 py-1 text-xs ${booking.status === 'confirmed' || booking.status === 'completed' ? 'bg-green-400/15 text-green-600' : booking.status === 'cancelled' ? 'bg-red-400/15 text-red-600' : 'bg-yellow-400/15 text-yellow-600'}`}>{booking.status}</p>
                </div>
                <div className="mt-3 flex items-start gap-2">
                  <img src={assets.calendar_icon_colored} alt="" className="mt-1 h-4 w-4" />
                  <div><p className="text-gray-500 dark:text-gray-400">Rental Period</p><p>{formatDate(booking.pickupDate)} To {formatDate(booking.returnDate)}</p></div>
                </div>
                <div className="mt-3 flex items-start gap-2">
                  <img src={assets.location_icon_colored} alt="" className="mt-1 h-4 w-4" />
                  <div><p className="text-gray-500 dark:text-gray-400">Pick-up Location</p><p>{booking.car.location}</p></div>
                </div>
              </div>

              <div className="flex flex-col justify-between gap-6 md:col-span-1">
                <div className="text-right text-sm text-gray-500 dark:text-gray-400">
                  <p>Total Price</p><h2 className="text-2xl font-semibold text-blue-600">{currency}{booking.price}</h2><p>Booked on {formatDate(booking.createdAt)}</p>
                </div>
              </div>

              {booking.status === 'completed' && !booking.hasReview && (
                <div className="border-t border-borderColor pt-4 dark:border-gray-700 md:col-span-4">
                  <p className="mb-2 font-medium">Rate your experience</p>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} type="button" onClick={() => setRatings((current) => ({ ...current, [booking._id]: star }))} className={`cursor-pointer text-2xl ${star <= (ratings[booking._id] || 0) ? 'text-yellow-400' : 'text-gray-300'}`} aria-label={`Give ${star} star${star === 1 ? '' : 's'}`}>
                        {'\u2605'}
                      </button>
                    ))}
                  </div>
                  <textarea value={comments[booking._id] || ''} onChange={(event) => setComments((current) => ({ ...current, [booking._id]: event.target.value }))} placeholder="Write your review..." className="mt-3 w-full rounded-lg border border-borderColor bg-transparent p-3 outline-none dark:border-gray-700" rows="3" maxLength="500" />
                  <button type="button" disabled={submittingBookingId === booking._id} onClick={() => submitReview(booking._id)} className="mt-3 cursor-pointer rounded-lg bg-primary px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-60">
                    {submittingBookingId === booking._id ? 'Submitting...' : 'Submit review'}
                  </button>
                </div>
              )}

              {booking.status === 'completed' && booking.hasReview && (
                <p className="text-green-600 md:col-span-4">Thanks for reviewing this car.</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyBookings
