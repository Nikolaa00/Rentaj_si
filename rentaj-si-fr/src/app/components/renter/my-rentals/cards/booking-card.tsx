"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { bookingService } from "@/services/bookingService";

export interface BookingCardProps {
  id: string;
  carId: string;
  model: string;
  pickupDate: string;
  returnDate: string;
  pickupLocation: string;
  returnLocation: string;
  totalPrice: number;
  status: "Confirmed" | "Pending" | "Cancelled";
}

const DecorativeLine: React.FC = () => (
  <svg
    width="100%"
    height="4"
    viewBox="0 0 328 4"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
  >
    <path
      d="M0.28418 2.4541C5.73038 2.5544 11.1766 2.64968 16.6228 2.73995C65.6386 3.55237 114.654 3.95858 163.67 3.95858C212.686 3.95858 261.702 3.55237 310.717 2.73995C316.164 2.64968 321.61 2.5544 327.056 2.4541C321.61 2.3538 316.164 2.25852 310.717 2.16825C261.702 1.35584 212.686 0.949627 163.67 0.949627C114.654 0.949627 65.6386 1.35584 16.6228 2.16825C11.1766 2.25852 5.73038 2.3538 0.28418 2.4541Z"
      fill="#407BFF"
    />
  </svg>
);

const BookingCard: React.FC<BookingCardProps> = ({
  id,
  carId,
  model,
  pickupDate,
  returnDate,
  pickupLocation,
  returnLocation,
  totalPrice,
  status,
}) => {
  const router = useRouter();
  const [isCancelling, setIsCancelling] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "text-green-700";
      case "Pending":
        return "text-yellow-700";
      case "Cancelled":
        return "text-red-700";
      default:
        return "text-gray-700";
    }
  };

  const handleViewDetails = () => {
    router.push(`/renter/car/${carId}`);
  };

  const handleCancelBooking = async () => {
    if (!confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    try {
      setIsCancelling(true);
      await bookingService.cancel(id);
      alert("Booking cancelled successfully!");
      window.location.reload();
    } catch (error: any) {
      console.error("Error cancelling booking:", error);
      alert(error.response?.data?.error || "Failed to cancel booking");
    } finally {
      setIsCancelling(false);
    }
  };

  const isCancelled = status === "Cancelled";

  return (
    <Card className="bg-[#79A3BD] rounded-3xl p-8 w-full max-w-[400px] gap-2 border-3 border-[#407BFF]">
      <CardHeader className="flex justify-between px-0 items-start">
        <CardTitle className="text-[#233B5D] text-xs font-light">
          <span className="font-semibold">ID</span>-{id.slice(0, 8)}
        </CardTitle>
      </CardHeader>

      <CardTitle className="text-[#233B5D] text-xl font-bold mb-1">
        {model}
      </CardTitle>

      <div className="mb-1">
        <DecorativeLine />
      </div>

      <CardContent>
        <div className="grid grid-cols-2 gap-3 mb-1">
          <div>
            <p className="text-[#233B5D] text-sm font-semibold mb-1">
              Pick-up date:
            </p>
            <p className="text-[#233B5D] text-sm">{pickupDate}</p>
          </div>
          <div>
            <p className="text-[#233B5D] text-sm font-semibold mb-1">
              Return date:
            </p>
            <p className="text-[#233B5D] text-sm">{returnDate}</p>
          </div>
          <div>
            <p className="text-[#233B5D] text-sm font-semibold mb-1">
              Pick-up location:
            </p>
            <p className="text-[#233B5D] text-sm">{pickupLocation}</p>
          </div>
          <div>
            <p className="text-[#233B5D] text-sm font-semibold mb-1">
              Return location:
            </p>
            <p className="text-[#233B5D] text-sm">{returnLocation}</p>
          </div>
        </div>
      </CardContent>

      <div className="mb-1">
        <DecorativeLine />
      </div>

      <CardContent>
        <div className="mb-1">
          <div className="flex justify-between items-center">
            <span className="text-[#233B5D] text-2xl font-bold">
              €{totalPrice.toFixed(2)}
            </span>
            <span className="text-lg font-bold text-[#233B5D]">
              Status: <span className={getStatusColor(status)}>{status}</span>
            </span>
          </div>
        </div>
      </CardContent>

      <div className="flex gap-4">
        <Button variant="viewDetails" onClick={handleViewDetails}>
          View Details
        </Button>
        {!isCancelled && (
          <Button 
            variant="cancel" 
            onClick={handleCancelBooking}
            disabled={isCancelling}
          >
            {isCancelling ? "Cancelling..." : "Cancel"}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default BookingCard;