import React from 'react'
import { assets } from '../assets/assets'

const Newsletter = () => {
    return (
        <div className="flex flex-col items-center justify-center text-center space-y-2 mx-mid:px-4 my-10 mb-40 ">

            <h1 className="md:text-4xl text-2xl font-semibold">Never Miss a Deal!</h1>

            <p className="md:text-lg text-gray-500/70 pb-8"> Subscribe to get the latest offers, new arrivals, and exclusive discounts</p>

            <form className="flex items-center justify-between max-w-2xl w-full md:h-13 h-12">
                <input className="border border-gray-300 rounded-md h-full border-r-0 outline-none w-full rounded-r-none px-3 text-gray-500" type="text" placeholder="Enter your email id" required />
                <button type="submit" className="h-full px-10 text-white bg-blue-600 hover:bg-blue-700 transition-all rounded-r-md" > Subscribe </button>
            </form>

        </div>
    )
}

export default Newsletter