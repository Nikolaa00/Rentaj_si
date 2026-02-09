"use client";
import { useParams, useRouter } from "next/navigation";
import { DetailedCarCard } from "@/app/components/renter/car/cards/detailed-car-card";
import DealerCard from "@/app/components/renter/car/cards/dealer-card";
import { RentalBookingCard } from "@/app/components/renter/car/cards/rental-booking-card";
import { HeroSection } from "@/app/renter/layout";
import { useCar } from "@/hooks/useCar";
import { bookingService } from "@/services/bookingService";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function CarPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const carId = params.id as string;
  const { car, loading, error } = useCar(carId);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  const handleRentNow = async (data: {
    pickupDate: Date | undefined;
    pickupTime: string;
    dropoffDate: Date | undefined;
    dropoffTime: string;
  }) => {
    if (!user) {
      alert('Please login to rent a car');
      router.push('/login');
      return;
    }

    if (!data.pickupDate || !data.dropoffDate) {
      setBookingError('Please select both pickup and drop-off dates');
      return;
    }

    if (!car) {
      setBookingError('Car information not available');
      return;
    }

    if (car.status === 'RENTED') {
      setBookingError('This car is already rented. Please choose another vehicle.');
      return;
    }

    try {
      setBookingLoading(true);
      setBookingError(null);

      // Combine date and time
      const pickupDateTime = new Date(data.pickupDate);
      const [pickupHours, pickupMinutes] = data.pickupTime.split(':');
      pickupDateTime.setHours(parseInt(pickupHours), parseInt(pickupMinutes));

      const dropoffDateTime = new Date(data.dropoffDate);
      const [dropoffHours, dropoffMinutes] = data.dropoffTime.split(':');
      dropoffDateTime.setHours(parseInt(dropoffHours), parseInt(dropoffMinutes));

      // Calculate total days
      const timeDiff = dropoffDateTime.getTime() - pickupDateTime.getTime();
      const totalDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
      const totalPrice = totalDays * Number(car.pricePerDay);

      const bookingData = {
        carId: car.id,
        pickUpDate: pickupDateTime.toISOString(),
        returnDate: dropoffDateTime.toISOString(),
        pickupLocation: car.pickupLocation,
        returnLocation: car.pickupLocation,
        totalPrice: totalPrice,
      };

      const result = await bookingService.create(bookingData);
      
      alert(`🎉 Booking created successfully!\n\nTotal: €${totalPrice} for ${totalDays} days\n\nBooking ID: ${result.booking.id.slice(0, 8)}`);
      router.push('/renter/rentals');
      
    } catch (err: any) {
      console.error('Booking error:', err);
      setBookingError(err.response?.data?.error || 'Failed to create booking');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <HeroSection className="w-full max-w-[1600px]">
        <div className="flex items-center justify-center min-h-screen text-white">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mb-4 mx-auto"></div>
            <p className="text-lg">Loading vehicle details...</p>
          </div>
        </div>
      </HeroSection>
    );
  }

  if (error || !car) {
    return (
      <HeroSection className="w-full max-w-[1600px]">
        <div className="flex items-center justify-center min-h-screen text-white">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              {error || "Car not found"}
            </h1>
            <p className="text-gray-400 mb-6">
              The vehicle you're looking for doesn't exist or couldn't be loaded.
            </p>
            <button
              onClick={() => router.back()}
              className="px-6 py-2 bg-[#407BFF] text-white rounded-full hover:bg-[#3066cc]"
            >
              Go Back
            </button>
          </div>
        </div>
      </HeroSection>
    );
  }

  const dealerData = {
    name: car.dealer.fullName,
    description: car.DealerName || "Professional car dealer",
    contacts: [
      {
        name: car.dealer.fullName,
        role: "Dealer",
        phone: car.dealer.email,
      },
    ],
    address: {
      street: car.pickupLocation,
      city: car.dealer.location || "Unknown City",
      postalCode: "1000",
      country: "Macedonia",
    },
    languages: ["English", "Macedonian"],
    memberSince: new Date().getFullYear().toString(),
    vehicleNumber: `DEALER-${car.dealer.id.slice(0, 8)}`,
  };

  return (
    <HeroSection className="w-full max-w-[1600px]">
      <div className="w-full flex justify-center mb-16">
        <h1 className="font-black text-5xl text-[#233B5D]">Rent your car</h1>
      </div>
      {car.status === 'RENTED' && (
        <div className="bg-red-100 border-2 border-red-400 text-red-700 px-6 py-4 rounded-3xl mb-8 text-center">
          <p className="text-xl font-bold">⚠️ This car is currently rented and unavailable</p>
        </div>
      )}

      <div className="flex flex-row justify-between gap-8 w-full">
        <DetailedCarCard car={car} className="flex-1" />
        <div className="flex flex-col flex-1 gap-8 w-full">
          <DealerCard dealer={dealerData} />
          
          {car.status === 'AVAILABLE' ? (
            <>
              <RentalBookingCard
                description={`Rent this ${car.make} ${car.model} for €${car.pricePerDay}/day`}
                onRentNow={handleRentNow}
              />
              {bookingError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                  {bookingError}
                </div>
              )}
              {bookingLoading && (
                <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-lg">
                  Creating booking...
                </div>
              )}
            </>
          ) : (
            <div className="bg-gray-200 border-2 border-gray-400 rounded-3xl p-8 text-center">
              <p className="text-gray-700 text-xl font-bold mb-4">🚫 Currently Unavailable</p>
              <p className="text-gray-600">This vehicle is already rented. Please check back later or browse other available cars.</p>
              <button
                onClick={() => router.push('/renter/dashboard')}
                className="mt-6 px-6 py-3 bg-[#407BFF] text-white rounded-full hover:bg-[#3066cc] transition"
              >
                Browse Available Cars
              </button>
            </div>
          )}
        </div>
      </div>
    </HeroSection>
  );
}