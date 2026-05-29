import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { dummyCarData } from '../assets/assets'
import { assets } from '../assets/assets'
import Loader from '../components/Loader'

const CarDetails = () => {

  const { id } = useParams()
  const navigate = useNavigate()
  const currency = import.meta.env.VITE_CURRENCY
  const today = new Date().toISOString().split("T")[0]

  //state variables
  const [car, setCar] = useState(null)
  const [pickupDate, setPickupDate] = useState('')
  const [returnDate, setReturnDate] = useState('')

  //runs only when id changes
  useEffect(() => {
    setCar(dummyCarData.find(car => car._id === id))
  }, [id])

  const handleBooking = (e) => {
    e.preventDefault()

    if (returnDate < pickupDate) {
      alert('Return date must be after pickup date.')
      return
    }

    navigate('/my-bookings')
  }

  return car ? (

    <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-16">

      {/* Back to all cars button */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 mb-6 text-gray-500 cursor-pointer">
        <img src={assets.arrow_icon} alt="" className="rotate-180 opacity-65" />
        Back to all cars
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

        {/* left side : car image and details */}
        <div className="lg:col-span-2">

          <img src={car.image} alt={`${car.brand} ${car.model}`} className="w-full h-80 object-cover rounded-xl mb-6" />

          <h1 className="text-3xl font-bold">{car.brand} {car.model}</h1>
          <p className="text-gray-500 mb-6">{car.category} • {car.year}</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: assets.users_icon, text: `${car.seating_capacity} Seats` },
              { icon: assets.fuel_icon, text: car.fuel_type },
              { icon: assets.car_icon, text: car.transmission },
              { icon: assets.location_icon, text: car.location },
            ].map((item, index) => (
              <div key={index} className="flex flex-col bg-light items-center p-4 rounded-lg">
                <img src={item.icon} alt="" className="h-5 mb-2" />
                <p>{item.text}</p>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="mt-8">
            <h1 className="text-xl font-medium mb-3">Description</h1>
            <p className="text-gray-500">{car.description}</p>
          </div>

          {/* Features */}
          <div className="mt-8">
            <h1 className="text-xl font-medium mb-3">Features</h1>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {["360 Camera", "Bluetooth", "GPS", "Heated Seats", "Rear View Mirror"].map((item) => (
                <li key={item} className="flex items-center text-gray-500">
                  <img src={assets.check_icon} className="h-4 mr-2" alt="" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right : Booking form */}
        <div className="self-start">

          <form onSubmit={handleBooking} className="shadow-lg h-max rounded-xl p-6 space-y-6 text-gray-500">

            <p className="flex items-center justify-between text-2xl text-gray-800 font-semibold">
              {currency}{car.pricePerDay}
              <span className="text-base text-gray-400 font-normal">per day</span>
            </p>

            <hr className="border-borderColor my-6" />

            <div className="flex flex-col gap-2">
              <label htmlFor="pickup-date">Pickup Date</label>
              <input value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} type="date" id="pickup-date" className="border border-borderColor px-3 py-2 rounded-lg" required min={today} />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="return-date">Return Date</label>
              <input value={returnDate} onChange={(e) => setReturnDate(e.target.value)} type="date" id="return-date" className="border border-borderColor px-3 py-2 rounded-lg" required min={pickupDate || today} />
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-700 transition-all py-3 font-medium text-white rounded-xl cursor-pointer">
              Book Now
            </button>

            <p className='text-center text-sm'>No Credit Card required to reserve</p>

          </form>

        </div>
      </div>

    </div>

  ) : <Loader />
}

export default CarDetails
