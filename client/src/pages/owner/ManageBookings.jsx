import React from 'react'
import { dummyMyBookingsData } from '../../assets/assets'
import Title from '../../components/owner/Title'

const ManageBookings = () => {

  const currency = import.meta.env.VITE_CURRENCY
  const bookings = dummyMyBookingsData

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

            {bookings.map((booking, index) => (
              <tr key={index} className='border-t border-borderColor text-gray-500 dark:border-gray-700 dark:text-gray-400'>

                <td className='p-3'>
                  <div className='flex items-center gap-3'>
                    <img src={booking.car.image} alt="" className='h-12 w-12 aspect-square rounded-md object-cover' />
                    <p className='font-medium max-md:hidden'> {booking.car.brand} {booking.car.model} </p>
                  </div>
                </td>

                <td className='p-3 max-md:hidden'> {booking.pickupDate.split('T')[0]} to {booking.returnDate.split('T')[0]} </td>
                <td className='p-3'> {currency}{booking.price}</td>

                <td className='p-3 max-md:hidden'>
                  <span className='rounded-full bg-gray-100 px-3 py-1 text-xs dark:bg-gray-700'> offline</span>
                </td>

                <td className='p-3'>
                  {booking.status === 'pending' ? (
                    <select value={booking.status} className='mt-1 rounded-md border border-borderColor bg-transparent px-2 py-1.5 text-gray-500 outline-none dark:border-gray-700 dark:text-gray-200'>
                      <option value="pending">Pending</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="confirmed">Confirmed</option>
                    </select>

                  ) : (

                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${booking.status === 'confirmed' ? 'bg-green-100 text-green-500 dark:bg-green-400/15' : ''}`} > {booking.status}</span>

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
