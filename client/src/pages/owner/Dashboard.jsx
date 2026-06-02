import React from 'react'
import { assets } from '../../assets/assets';
import { dummyDashboardData } from '../../assets/assets';
import Title from '../../components/owner/Title';

const Dashboard = () => {

  const currency = import.meta.env.VITE_CURRENCY
  const data = dummyDashboardData;

  const dashboardCards = [
    { title: "Total Cars", value: data.totalCars, icon: assets.carIconColored, },
    { title: "Total Bookings", value: data.totalBookings, icon: assets.listIconColored, },
    { title: "Pending", value: data.pendingBookings, icon: assets.cautionIconColored, },
    { title: "Confirmed", value: data.completedBookings, icon: assets.listIconColored, },
  ];

  return (
    <div className='px-4 pt-10 md:px-10 flex-1'>

      {/* use Owner Title component */}
      <Title title="Admin Dashboard" subTitle="Monitor overall platform performance including total cars, bookings, revenue, and recent activities" />


      <div className='grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-8 max-w-3xl'>
        {dashboardCards.map((card, index) => (
          <div key={index} className='flex items-center justify-between gap-2 rounded-md border border-borderColor p-4 dark:border-gray-700 dark:bg-gray-800'>

            <div>
              <h1 className='text-xs text-gray-500 dark:text-gray-400'>{card.title}</h1>
              <p className='text-lg font-semibold'>{card.value}</p>
            </div>

            <div className='flex items-center justify-center w-10 h-10 rounded-full bg-primary/10'>
              <img src={card.icon} alt="" className='h-4 w-4' />
            </div>

          </div>
        ))}
      </div>

      <div className='flex flex-wrap items-start gap-6 mb-8 w-full'>

        {/* recent booking */}
        <div className='w-full max-w-lg rounded-md border border-borderColor p-4 dark:border-gray-700 dark:bg-gray-800 md:p-6'>
          <h1 className='text-lg font-medium'>Recent Bookings</h1>
          <p className='text-gray-600 dark:text-gray-400'>Latest customer bookings</p>

          {data.recentBookings.map((booking, index) => (
            <div key={index} className='mt-4 flex items-center justify-between'>

              <div className='flex items-center gap-2'>
                <div className='hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-primary/10'>
                  <img src={assets.listIconColored} alt="" className='h-5 w-5' />
                </div>

                <div>
                  <p>{booking.car.brand} {booking.car.model}</p>
                  <p className='text-sm text-gray-500 dark:text-gray-400'>{booking.createdAt.split('T')[0]}</p>
                </div>
              </div>

              <div className='flex items-center gap-2 font-medium'>
                <p className='text-sm text-gray-500 dark:text-gray-400'> {currency}{booking.price}  </p>
                <p className='rounded-full border border-borderColor px-3 py-0.5 text-sm dark:border-gray-700'> {booking.status} </p>
              </div>

            </div>
          ))}
        </div>

        {/* monthly revenue */}
        <div className='mb-6 w-full rounded-md border border-borderColor bg-white p-4 dark:border-gray-700 dark:bg-gray-800 md:max-w-xs md:p-6'>
          <h1 className='text-lg font-medium'>Monthly Revenue</h1>
          <p className='text-gray-500 dark:text-gray-400'>Revenue for current month</p>
          <p className='text-3xl mt-6 font-semibold text-blue-600'> {currency}{data.monthlyRevenue}</p>
        </div>

      </div>

    </div>
  );
};

export default Dashboard
