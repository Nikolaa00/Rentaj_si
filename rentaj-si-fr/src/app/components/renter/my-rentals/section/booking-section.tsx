"use client";
import { useState, useEffect } from "react";
import BookingCard from "@/app/components/renter/my-rentals/cards/booking-card";
import FilterDropdown from "@/app/components/renter/my-rentals/filter/rentals-filter";
import { HorizontalDivider } from "@/app/components/renter/my-rentals/section/divider/horizontal-divider";
import PageNavigator from "@/app/components/renter/dashboard/paggination/page-navigator";
import { bookingService } from "@/services/bookingService";
import type { Booking } from "@/types/booking";

type FilterStatus = "All" | "Confirmed" | "Canceled";

export default function BookingSection() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<FilterStatus>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await bookingService.getAll();
        setBookings(data.bookings);
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to fetch bookings");
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter((booking) => {
    if (selectedFilter === "All") return true;
    if (selectedFilter === "Canceled") return booking.status === "CANCELLED";
    return booking.status === selectedFilter.toUpperCase();
  });

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBookings = filteredBookings.slice(startIndex, endIndex);

  const handleFilterChange = (filter: FilterStatus) => {
    setSelectedFilter(filter);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="w-full max-w-[1500px] mx-auto py-8 bg-[#97E4FF] flex flex-col items-center justify-center border-3 border-[#407BFF] rounded-[50px] min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#407BFF] mx-auto mb-4"></div>
          <p className="text-xl text-[#233B5D] font-semibold">Loading your rentals...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-[1500px] mx-auto py-8 bg-[#97E4FF] flex flex-col items-center justify-center border-3 border-[#407BFF] rounded-[50px] min-h-[400px]">
        <div className="text-center">
          <p className="text-xl text-red-600 font-semibold mb-4">⚠️ {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-[#407BFF] text-white rounded-full hover:bg-[#3366CC] transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1500px] mx-auto py-8 bg-[#97E4FF] flex flex-col items-center justify-center border-3 border-[#407BFF] rounded-[50px]">
      <div className="flex justify-between items-center mb-6 w-full px-24">
        <h1 className="text-3xl font-bold text-[#233B5D] ml-3">
          List of your rented cars
        </h1>
        <FilterDropdown onFilterChange={handleFilterChange} />
      </div>

      <div className="mb-8 w-full px-16">
        <HorizontalDivider />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-8 px-20">
        {currentBookings.length > 0 ? (
          currentBookings.map((booking) => (
            <BookingCard
              key={booking.id}
              id={booking.id}
              carId={booking.carId}
              model={booking.car?.title || `${booking.car?.make} ${booking.car?.model}` || "Unknown Car"}
              pickupDate={new Date(booking.pickUpDate).toLocaleDateString('en-GB')}
              returnDate={new Date(booking.returnDate).toLocaleDateString('en-GB')}
              pickupLocation={booking.pickupLocation}
              returnLocation={booking.returnLocation || "Same as pickup"}
              totalPrice={Number(booking.totalPrice)}
              status={booking.status === "CANCELLED" ? "Cancelled" : "Confirmed"}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-xl text-gray-600">
              {selectedFilter === "All" 
                ? "You have no rentals yet. Start exploring cars!" 
                : `No ${selectedFilter.toLowerCase()} bookings found.`}
            </p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <PageNavigator
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  );
}