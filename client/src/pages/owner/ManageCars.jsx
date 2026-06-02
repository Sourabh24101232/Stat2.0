import React from 'react'
import { dummyCarData } from '../../assets/assets'
import Title from '../../components/owner/Title'
import { assets } from '../../assets/assets'

const ManageCars = () => {
  const currency = import.meta.env.VITE_CURRENCY
  const cars = dummyCarData

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

            {cars.map((car, index) => (
              <tr key={index} className='border-t border-borderColor dark:border-gray-700'>

                <td className='p-3'>
                  <div className='flex items-center gap-3'>

                    <img src={car.image} alt="" className="h-12 w-12 aspect-square rounded-md object-cover" />

                    <div className='max-md:hidden'>
                      <p className='font-medium'> {car.brand} {car.model}</p>
                      <p className='text-xs text-gray-500 dark:text-gray-400'>{car.seating_capacity} - {car.transmission}</p>
                    </div>

                  </div>
                </td>

                <td className='p-3 max-md:hidden'>{car.category}  </td>
                <td className='p-3'> {currency} {car.pricePerDay}/day </td>

                <td className='p-3 max-md:hidden'>
                  <span className={`rounded-full px-3 py-1 text-xs ${car.isAvailable ? 'bg-green-100 text-green-500 dark:bg-green-400/15' : 'bg-red-100 text-red-500 dark:bg-red-400/15'}`} > {car.isAvailable ? "Available" : "Unavailable"}</span>
                </td>

                <td className='p-3'>
                  <div className='flex items-center'>
                    <img src={car.isAvailable ? assets.eye_close_icon : assets.eye_icon} alt="" className='cursor-pointer' />
                    <img src={assets.delete_icon} alt="" className='cursor-pointer' />
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
