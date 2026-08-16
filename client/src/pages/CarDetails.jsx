import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { assets } from "../assets/assets";
import Loader from "../components/Loader";
import { useAppContext } from "../Context/AppContext";
import { useTranslation } from "react-i18next";

const CarDetails = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const {
    cars,
    axios,
    currency,
    navigate,
    token,
    setShowLogin,
    pickupDate,
    setPickupDate,
    returnDate,
    setReturnDate,
  } = useAppContext();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const today = new Date().toISOString().split("T")[0];
  const car = cars.find((item) => item._id === id);
  const { t } = useTranslation("common");

  useEffect(() => {
    const pickupDateFromUrl = searchParams.get("pickupDate");
    const returnDateFromUrl = searchParams.get("returnDate");

    if (pickupDateFromUrl) setPickupDate(pickupDateFromUrl);
    if (returnDateFromUrl) setReturnDate(returnDateFromUrl);
  }, [searchParams, setPickupDate, setReturnDate]);

  const handleBooking = async (event) => {
    event.preventDefault();

    if (!token) {
      setShowLogin(true);
      return;
    }

    if (returnDate <= pickupDate) {
      toast.error(t("booking.returnAfterPickup"));
      return;
    }

    setIsSubmitting(true);
    try {
      const { data } = await axios.post("/api/bookings/create", {
        car: id,
        pickupDate,
        returnDate,
      });

      if (data.success) {
        toast.success(data.message);
        navigate("/my-bookings");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await axios.get(`/api/reviews/car/${id}`);

        if (data.success) {
          setReviews(data.reviews);
          setAverageRating(data.averageRating);
          setTotalReviews(data.totalReviews);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchReviews();
  }, [axios, id]);

  if (!car) return <Loader />;

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-16">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex cursor-pointer items-center gap-2 text-gray-500 dark:text-gray-400"
      >
        <img src={assets.arrow_icon} alt="" className="rotate-180 opacity-65" />
        {t("booking.back")}
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        <div className="lg:col-span-2">
          <img
            src={car.image}
            alt={`${car.brand} ${car.model}`}
            className="w-full h-80 object-cover rounded-xl mb-6"
          />
          <h1 className="text-3xl font-bold">
            {car.brand} {car.model}
          </h1>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xl text-yellow-400" aria-label={`${averageRating} out of 5 stars`}>
              {'\u2605'.repeat(Math.round(averageRating))}
              {'\u2606'.repeat(5 - Math.round(averageRating))}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {averageRating.toFixed(1)} ({t("cars.reviews", { count: totalReviews })})
            </span>
          </div>
          <p className="mb-6 text-gray-500 dark:text-gray-400">
            {car.category} &bull; {car.year}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              {
                icon: assets.users_icon,
                text: t("booking.seats", { count: car.seating_capacity }),
              },
              { icon: assets.fuel_icon, text: car.fuel_type },
              { icon: assets.car_icon, text: car.transmission },
              { icon: assets.location_icon, text: car.location },
            ].map((item) => (
              <div
                key={item.text}
                className="flex flex-col items-center rounded-lg bg-light p-4 dark:bg-gray-800"
              >
                <img src={item.icon} alt="" className="h-5 mb-2" />
                <p>{item.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-medium mb-3">{t("booking.description")}</h2>
            <p className="text-gray-500 dark:text-gray-400">
              {car.description}
            </p>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-medium mb-3">{t("booking.features")}</h2>
            {car.features?.length ? (
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {car.features.map((item) => (
                <li
                  key={item}
                  className="flex items-center text-gray-500 dark:text-gray-400"
                >
                  <img src={assets.check_icon} className="h-4 mr-2" alt="" />
                  {item}
                </li>
              ))}
              </ul>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">{t("booking.noFeatures")}</p>
            )}
          </div>
        </div>

        <div className="self-start">
          <form
            onSubmit={handleBooking}
            className="h-max space-y-6 rounded-xl bg-white p-6 text-gray-500 shadow-lg dark:border dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:shadow-[0px_10px_25px_rgba(0,0,0,0.35)]"
          >
            <p className="flex items-center justify-between text-2xl font-semibold text-gray-800 dark:text-gray-100">
              {currency}
              {car.pricePerDay}
              <span className="text-base text-gray-400 font-normal">
                {t("booking.perDay")}
              </span>
            </p>

            <hr className="my-6 border-borderColor dark:border-gray-700" />

            <div className="flex flex-col gap-2">
              <label htmlFor="pickup-date">{t("booking.pickupDate")}</label>
              <input
                value={pickupDate}
                onChange={(event) => setPickupDate(event.target.value)}
                type="date"
                id="pickup-date"
                className="rounded-lg border border-borderColor bg-transparent px-3 py-2 text-gray-700 outline-none dark:border-gray-700 dark:text-gray-200"
                required
                min={today}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="return-date">{t("booking.returnDate")}</label>
              <input
                value={returnDate}
                onChange={(event) => setReturnDate(event.target.value)}
                type="date"
                id="return-date"
                className="rounded-lg border border-borderColor bg-transparent px-3 py-2 text-gray-700 outline-none dark:border-gray-700 dark:text-gray-200"
                required
                min={pickupDate || today}
              />
            </div>

            <button
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 transition-all py-3 font-medium text-white rounded-xl cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? t("booking.booking") : t("booking.bookNow")}
            </button>
            <p className="text-center text-sm">
              {t("booking.noCard")}
            </p>
          </form>
        </div>

        <div className="mt-10 lg:col-span-2">
          <h2 className="text-xl font-medium">{t("booking.reviews")}</h2>

          {reviews.length === 0 ? (
            <p className="mt-3 text-gray-500 dark:text-gray-400">
              {t("booking.noReviews")}
            </p>
          ) : (
            <div className="mt-4 space-y-4">
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="rounded-lg bg-light p-4 dark:bg-gray-800"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{review.user.name}</p>
                    <span className="text-yellow-400">
                      {'\u2605'.repeat(review.rating)}
                      {'\u2606'.repeat(5 - review.rating)}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-500 dark:text-gray-400">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarDetails;
