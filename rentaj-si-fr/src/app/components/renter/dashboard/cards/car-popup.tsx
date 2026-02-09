/*"use client";
import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { Car } from "@/types/car";  
import {Card,
  CardContent,} from "@/components/ui/card";

interface CarPopupProps extends React.ComponentProps<"div"> {
  car: Car;
  className?: string;
  onViewDetails?: (car: Car) => void;
}


export default function CarPopup({ car, className, onViewDetails, ...props }: CarPopupProps) {
  return (
    <Card
      className={cn(
        "flex flex-col justify-between items-center h-fit w-[500px] border rounded-[50px] border-[#407BFF] bg-[#233B5D]",
        className
      )}
      {...props}
    >
      <div className="relative border rounded-[50px] border-[#407BFF] w-[450px] h-[300px] overflow-hidden mt-5">
        <Image
          src={car.imageUrl ?? "/images/car.jpg"}
          alt={car.title}
          fill
          className={cn("object-cover", className)}
        />
      </div>

      <CardContent className="relative flex w-[450px]   items-center text-base text-white">
        <div className="w-[235px] flex flex-col gap-2 pr-5">
          <div>
            <span className="font-semibold text-white">Title: </span>
            <span className="text-gray-200">{car.title}</span>
          </div>
          <div>
            <span className="font-semibold text-white">Type of car: </span>
            <span className="text-gray-200">{car.carType}</span>
          </div>
          <div>
            <span className="font-semibold text-white">Transmission: </span>
            <span className="text-gray-200">{car.transmission}</span>
          </div>
          <div>
            <span className="font-semibold text-white">Type of fuel: </span>
            <span className="text-gray-200">{car.fuelType}</span>
          </div>
        </div>

        <Image src="svg/blue-vertical-line.svg" alt={car.title} fill />

        <div className="w-[235px] flex flex-col gap-2 pl-7">
          <div>
            <span className="font-semibold text-white">Price: </span>
            <span className="text-gray-200">{car.pricePerDay}€/day</span>
          </div>
          <div>
            <span className="font-semibold text-white">Available: </span>
            <span className="text-gray-200">
              from {car.availableFrom} to {car.availableTo}
            </span>
          </div>
          <div>
            <span className="font-semibold text-white">Pick-up Location: </span>
            <span className="text-gray-200">{car.pickupLocation}</span>
          </div>
          <div>
            <span className="font-semibold text-white">Dealer name: </span>
            <span className="text-gray-200">{car.dealerName}</span>
          </div>
        </div>
      </CardContent>
      <Button
        variant="viewDetails"
        onClick={() => onViewDetails && onViewDetails(car)}
        className="mb-[30px] px-[30px] py-2 text-xl "
        asChild
      >
         <Link href={`/cars/${car.id}`}>View Details</Link>
      </Button>
    </Card>
  );
}
*/