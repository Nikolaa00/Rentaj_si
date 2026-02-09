import React from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface VehicleCardProps {
  id: string;
  model: string;
  category: string;
  pricePerDay: number | string;
  imageUrl: string;
}

const VehicleCard: React.FC<VehicleCardProps> = ({
  id,
  model,
  category,
  pricePerDay,
  imageUrl,
}) => {
  const formatPrice = (price: number | string): string => {
    try {
      const num = typeof price === 'string' ? parseFloat(price) : price;
      if (isNaN(num)) return '0.00';
      return num.toFixed(2);
    } catch {
      return '0.00';
    }
  };

  return (
    <Card className="bg-[#273549] p-6 border-2 border-blue-500 gap-2 rounded-[50px] w-full max-w-[350px]">
      <div className="border-2 border-[#407BFF] rounded-[50px] overflow-hidden mb-1">
        <img
          src={imageUrl}
          alt={model}
          className="w-[320px] h-[225] object-cover"
        />
      </div>
      <div>
        <CardTitle className="text-white text-2xl font-bold">
          {model}
        </CardTitle>
        <p className="text-gray-300 text-lg mb-6">{category}</p>
        <div className="flex items-baseline mb-6">
          <span className="text-white text-2xl font-black">
            {formatPrice(pricePerDay)}€
          </span>
          <span className="text-gray-400 text-xl font-normal">/day</span>
        </div>
        <Link href={`car/${id}`}>
          <Button variant="submit" className="mx-auto block text-2xl drop-shadow-xl w-full">
            Rent now
          </Button>
        </Link>
      </div>
    </Card>
  );
};

export default VehicleCard;