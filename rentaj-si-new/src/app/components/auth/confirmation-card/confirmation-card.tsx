import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export interface ConfirmationCardProps {
  vehicleModel: string;
  pickupDate: string;
  returnDate: string;
  pickupLocation: string;
  returnLocation: string;
  totalPrice: number;
}

// Confirmation Card Component
export default function ConfirmationCard({
  vehicleModel,
  pickupDate,
  returnDate,
  pickupLocation,
  returnLocation,
  totalPrice,
}: ConfirmationCardProps) {
  return (
    <Card className="bg-[#E2FDFF] rounded-[50px] p-8 w-full min-w-[550px] max-w-[600px] border-3 border-[#407BFF] my-8">
      <CardHeader className="text-center gap-0  ">
        <h2 className="text-[#233B5D] text-5xl font-black mb-8">
          Your Rental is
          <br />
          Confirmed!
        </h2>
        <p className="text-black font-black text-2xl ">
          Thank you for your payment!
        </p>
        <p className="text-black font-normal text-2xl">
          Your rental has been successfully booked.
        </p>
      </CardHeader>

      <CardContent className="bg-[#97E4FF] rounded-2xl p-6 mb-6 space-y-4">
        <div className="bg-[#6FB3DD] rounded-lg p-3">
          <p className="text-[#233B5D] font-semibold text-sm">Vehicle:</p>
          <p className="text-[#233B5D] font-bold">{vehicleModel}</p>
        </div>

        <div className="bg-[#6FB3DD] rounded-lg p-3">
          <p className="text-[#233B5D] font-semibold text-sm">Pick-up:</p>
          <p className="text-[#233B5D] font-bold">
            {pickupDate} - {pickupLocation}
          </p>
        </div>

        <div className="bg-[#6FB3DD] rounded-lg p-3">
          <p className="text-[#233B5D] font-semibold text-sm">Return:</p>
          <p className="text-[#233B5D] font-bold">
            {returnDate} - {returnLocation}
          </p>
        </div>

        <div className="bg-[#6FB3DD] rounded-lg p-3">
          <p className="text-[#233B5D] font-semibold text-sm">Duration:</p>
          <p className="text-[#233B5D] font-bold">1 Day</p>
        </div>

        <div className="bg-[#6FB3DD] rounded-lg p-3">
          <p className="text-[#233B5D] font-semibold text-sm">
            Total Amount Paid:
          </p>
          <p className="text-[#233B5D] font-bold text-xl">
            €{totalPrice.toFixed(2)}
          </p>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between  p-0 ">
        <Button variant={"viewDetailsDark"} className="m-0 text-2xl font-black">
          My Rentals
        </Button>
        <Button variant={"viewDetailsDark"} className="m-0 text-2xl font-black">
          Back to Dashboard
        </Button>
      </CardFooter>
    </Card>
  );
}