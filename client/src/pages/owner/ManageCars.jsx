import React, { useEffect, useState } from 'react'
import { dummyCarData } from '../../assets/assets'
import Title from '../../components/owner/Title'
import { assets } from '../../assets/assets'

const ManageCars = () => {
  const currency = import.meta.env.VITE_CURRENCY
  const [cars, setCars] = useState([])

  //runs only once
  const fetchOwnerCars = async () => {
    setCars(dummyCarData)
  }

  useEffect(() => {
    fetchOwnerCars()
  }, [])

  return (
    <div className='px-4 pt-10 md:px-10 w-full'>

      <Title title="Manage Cars" subTitle="View all listed cars, update their details, or remove them from the booking platform." />

      <div className='max-w-3xl w-full rounded-md overflow-hidden border border-borderColor mt-6'>

        <table className='w-full border-collapse text-left text-sm text-gray-600'>
          <thead className='text-gray-500'>

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
              <tr key={index} className='border-t border-borderColor'>

                <td className='p-3'>
                  <div className='flex items-center gap-3'>

                    <img src={car.image} alt="" className="h-12 w-12 aspect-square rounded-md object-cover" />

                    <div className='max-md:hidden'>
                      <p className='font-medium'> {car.brand} {car.model}</p>
                      <p className='text-xs text-gray-500'>{car.seating_capacity} • {car.transmission}</p>
                    </div>

                  </div>
                </td>

                <td className='p-3 max-md:hidden'>{car.category}  </td>
                <td className='p-3'> {currency} {car.pricePerDay}/day </td>

                <td className='p-3 max-md:hidden'>
                  <span className={`px-3 py-1 rounded-full text-xs ${car.isAvailable ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'}`} > {car.isAvailable ? "Available" : "Unavailable"}</span>
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