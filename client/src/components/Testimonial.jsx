import React from 'react'
import { assets } from '../assets/assets';
import Title from './Title';

const Testimonial = () => {

    const testimonials = [
        {
            name: "Emma Rodriguez",
            location: "Barcelona, Spain",
            image: assets.testimonial_image_1,
            testimonial: "I've rented cars from various companies, but the experience with CarRental was exceptional."
        },

        {
            name: "John Smith",
            location: "New York, USA",
            image: assets.testimonial_image_2,
            testimonial: "CarRental made my trip so much easier. The car was delivered right to my door, and the customer service was fantastic!"
        },

        {
            name: "Ava Johnson",
            location: "Sydney, Australia",
            image: assets.testimonial_image_1,
            testimonial: "I highly recommend CarRental! Their fleet is amazing, and I always feel like I'm getting the best deal with excellent service."
        }
    ];


    return (
        <div className="py-28 px-6 md:px-16 lg:px-24 xl:px-44">

            <Title
                title="What Our Customers Say"
                subTitle="Discover why discerning travelers choose StayVenture for their luxury accommodations around the world."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-18">
                {testimonials.map((testimonial,index) => (
                    <div key={index} className="rounded-xl bg-white p-6 shadow-lg transition-all duration-500 hover:-translate-y-1 dark:border dark:border-gray-700 dark:bg-gray-800 dark:shadow-[0px_10px_25px_rgba(0,0,0,0.35)]">
                        <div className="flex items-center gap-3">
                            <img className="w-12 h-12 rounded-full" src={testimonial.image} alt={testimonial.name} />
                            <div>
                                <p className="text-xl">{testimonial.name}</p>
                                <p className="text-gray-500 dark:text-gray-400">{testimonial.location}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 mt-4">
                            {Array(5).fill(0).map((_, index) => (
                                <img key={index} src={assets.star_icon} alt="star-icon"/>
                            ))}
                        </div>
                        <p className="max-w-90 mt-4 font-light text-gray-500 dark:text-gray-400">"{testimonial.testimonial}"</p>
                    </div>
                ))}
            </div>

        </div>
    )
}

export default Testimonial
