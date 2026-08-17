import React from "react";
import { assets } from "../assets/assets";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const CarCard = ({ car }) => {
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation("common");

  const openCarDetails = () => {
    // Keep the active availability-search dates when opening a car.
    const search = location.pathname === "/cars" ? location.search : "";
    navigate(`/car-details/${car._id}${search}`);
    scrollTo(0, 0);
  };

  const whatsappNumber = car.owner?.whatsappNumber?.replace(/\D/g, "");

  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        `Hello, I am interested in your ${car.brand} ${car.model} listed on STAT.`,
      )}`
    : "";

  return (
    <div
      onClick={openCarDetails}
      className="group cursor-pointer overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-500 hover:-translate-y-1 dark:border dark:border-gray-700 dark:bg-gray-800 dark:shadow-[0px_10px_25px_rgba(0,0,0,0.35)]"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={car.image}
          alt="Car Image"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {car.isAvailable && (
          <p className="absolute left-4 top-4 rounded-full bg-primary/90 px-2.5 py-1 text-xs text-white">
            {t("cars.availableNow")}
          </p>
        )}

        <div className="absolute bottom-4 right-4 rounded-lg bg-black/80 px-3 py-2 text-white backdrop-blur-sm">
          <span className="font-semibold">
            {currency}
            {car.pricePerDay}
          </span>
          <span className="text-sm text-white/80"> {t("cars.perDay")}</span>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <div className="mb-2 flex items-start justify-between">
          <div>
            <h3 className="text-lg font-medium">
              {car.brand} {car.model}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {car.category} - {car.year}
            </p>
            <div className="mt-2 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <img src={assets.star_icon} alt="rating" className="h-4 w-4" />
              <span>{(car.averageRating || 0).toFixed(1)}</span>
              <span>
                ({t("cars.reviews", { count: car.reviewCount || 0 })})
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-y-2 text-gray-600 dark:text-gray-300">
          <div className="flex items-center text-sm">
            <img src={assets.users_icon} alt="" className="mr-2 h-4" />
            <span>{t("booking.seats", { count: car.seating_capacity })}</span>
          </div>

          <div className="flex items-center text-sm">
            <img src={assets.fuel_icon} alt="" className="mr-2 h-4" />
            <span>{car.fuel_type}</span>
          </div>

          <div className="flex items-center text-sm">
            <img src={assets.car_icon} alt="" className="mr-2 h-4" />
            <span>{car.transmission}</span>
          </div>

          <div className="flex items-center text-sm">
            <img src={assets.location_icon} alt="" className="mr-2 h-4" />
            <span>{car.location}</span>
          </div>
        </div>
      </div>

      {whatsappUrl && (
  <a
    href={whatsappUrl}
    target="_blank"
    rel="noopener noreferrer"
    onClick={(event) => event.stopPropagation()}
    aria-label={`Chat with the owner of ${car.brand} ${car.model} on WhatsApp`}
    className="mx-4 mb-4 flex items-center justify-center gap-2 rounded-lg bg-[#25D366] px-4 py-2.5 font-medium text-white transition hover:bg-[#1ebe5d] sm:mx-5"
  >
    <svg viewBox="0 0 32 32" className="h-5 w-5 fill-current" aria-hidden="true">
      <path d="M16.02 3C8.84 3 3 8.84 3 16.02c0 2.3.6 4.55 1.75 6.53L3 29l6.64-1.74a12.94 12.94 0 0 0 6.38 1.68h.01C23.2 28.94 29 23.1 29 15.96 29 8.84 23.2 3 16.02 3Zm0 23.58c-2.03 0-4.02-.55-5.76-1.58l-.41-.24-3.94 1.03 1.05-3.84-.27-.43a10.6 10.6 0 1 1 9.33 5.06Zm5.81-7.94c-.32-.16-1.88-.93-2.17-1.03-.29-.11-.5-.16-.71.16-.21.32-.81 1.03-.99 1.24-.18.21-.37.24-.69.08-.32-.16-1.34-.49-2.55-1.57-.94-.84-1.58-1.88-1.76-2.2-.18-.32-.02-.49.14-.65.14-.14.32-.37.48-.55.16-.18.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.71-1.71-.97-2.34-.26-.62-.52-.54-.71-.55h-.61c-.21 0-.56.08-.85.4-.29.32-1.12 1.09-1.12 2.66s1.15 3.08 1.31 3.3c.16.21 2.26 3.45 5.47 4.84.76.33 1.35.53 1.81.68.76.24 1.45.21 2 .13.61-.09 1.88-.77 2.15-1.51.27-.75.27-1.39.19-1.52-.08-.13-.29-.21-.61-.37Z" />
    </svg>
    WhatsApp owner
  </a>
)}
    </div>
  );
};

export default CarCard;
