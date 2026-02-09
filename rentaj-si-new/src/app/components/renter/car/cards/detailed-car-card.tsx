"use client";
import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Car } from "@/types/car";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DetailedCarCardProps extends React.ComponentProps<"div"> {
  car: Car;
}

export function DetailedCarCard({
  car,
  className,
  ...props
}: DetailedCarCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  
  const images = car.images && car.images.length > 0 
    ? car.images.map(img => img.url)
    : ["/images/car.jpg"]; 

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const selectImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <Card
      className={cn(
        "flex flex-col items-center w-full border-2 rounded-[50px] border-[#407BFF] bg-[#233B5D] p-8",
        className
      )}
      {...props}
    >
      {/* Header */}
      <div className="text-center">
        <h2 className="text-white text-xl font-semibold">
          Car:
          <span className="text-[#407BFF]">
            {` ${car.make} ${car.model} ${car.year}`}
          </span>
        </h2>
      </div>

      {/* Main Image */}
      <div className="relative w-full h-[400px] rounded-[50px] border-2 border-[#407BFF] overflow-hidden">
        <Image
          src={images[currentImageIndex]}
          alt={`${car.title} - Image ${currentImageIndex + 1}`}
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="w-full h-fit">
        {/* Thumbnail Gallery */}
        {images.length > 1 && (
          <div className="flex gap-2 w-full justify-center items-center">
            {images.length > 5 && (
              <button
                onClick={prevImage}
                className="relative w-5 h-5 rounded-full bg-[#97E4FF] flex items-center text-[#233B5D] justify-center"
              >
                <ChevronLeft className="w-5 h-5 text-[#233B5D]" />
              </button>
            )}
            {images.slice(0, 5).map((img, index) => (
              <button
                key={index}
                onClick={() => selectImage(index)}
                className={cn(
                  "relative w-13 h-12 rounded-lg border-2 overflow-hidden shrink-0 transition",
                  currentImageIndex === index
                    ? "border-[#407BFF]"
                    : "border-gray-500 opacity-60 hover:opacity-100"
                )}
              >
                <Image
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
            {images.length > 5 && (
              <button
                onClick={nextImage}
                className="relative w-5 h-5 rounded-full bg-[#97E4FF] flex items-center text-[#233B5D] justify-center"
              >
                <ChevronRight className="w-5 h-5 text-[#233B5D]" />
              </button>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-row gap-8">
        <div className="flex flex-col gap-8">
          {/* Details Section */}
          <CardContent className="w-[300px] bg-[#1a2b42] rounded-[50px] py-6 px-6 text-white space-y-3">
            <div className="space-y-2">
              <h3 className="text-[#407BFF] font-semibold text-sm uppercase">
                Basic Information
              </h3>
              <DetailRow label="Model" value={`${car.make} ${car.model}`} />
              <DetailRow label="First registration" value={car.firstRegistration} />
              <DetailRow 
                label="Mileage" 
                value={car.mileage ? `${car.mileage.toLocaleString()} km` : undefined} 
              />
              <DetailRow label="Condition" value={car.condition} />
              {car.price && (
                <DetailRow label="Price" value={`€${car.price.toLocaleString()}`} />
              )}
              <DetailRow 
                label="Price per day" 
                value={`€${car.pricePerDay.toLocaleString()}`} 
              />
            </div>
          </CardContent>

          <CardContent className="w-[300px] bg-[#1a2b42] rounded-[50px] py-6 px-6 text-white space-y-3">
            <div className="space-y-2">
              <h3 className="text-[#407BFF] font-semibold text-sm uppercase">
                Technical Data
              </h3>
              <DetailRow label="Performance" value={car.performance} />
              <DetailRow 
                label="Engine capacity" 
                value={
                  car.engineCapacity
                    ? `${car.engineCapacity}, ${car.cylinders} cylinders`
                    : undefined
                } 
              />
              <DetailRow label="Fuel type" value={car.fuelType} />
              <DetailRow label="Transmission" value={car.transmission} />
              <DetailRow label="Drive" value={car.driveType} />
              <DetailRow label="Emission standard" value={car.emissionClass} />
              <DetailRow label="Valid HU until" value={car.validHUUntil} />
            </div>
          </CardContent>

          <CardContent className="w-[300px] bg-[#1a2b42] rounded-[50px] py-6 px-6 text-white space-y-3">
            <div className="space-y-2">
              <h3 className="text-[#407BFF] font-semibold text-sm uppercase">
                Dimensions & Capacity
              </h3>
              <DetailRow label="Seats" value={car.seats?.toString()} />
              <DetailRow label="Doors" value={car.doors?.toString()} />
              <DetailRow 
                label="Towing capacity" 
                value={car.towingCapacity ? `${car.towingCapacity} kg` : undefined} 
              />
              <DetailRow 
                label="Weight" 
                value={car.weight ? `${car.weight} kg` : undefined} 
              />
            </div>
          </CardContent>
        </div>

        <div className="flex flex-col gap-8">
          <CardContent className="w-[300px] bg-[#1a2b42] rounded-[50px] py-6 px-6 text-white space-y-3">
            <div className="space-y-2">
              <h3 className="text-[#407BFF] font-semibold text-sm uppercase">
                Color & Interior
              </h3>
              <DetailRow label="Color" value={car.color} />
              <DetailRow label="Interior" value={car.interior} />
            </div>
          </CardContent>

          <CardContent className="w-[300px] bg-[#1a2b42] rounded-[50px] py-6 px-6 text-white space-y-3">
            <div className="space-y-2">
              <h3 className="text-[#407BFF] font-semibold text-sm uppercase">
                Equipment
              </h3>
              {car.comfortFeatures && car.comfortFeatures.length > 0 && (
                <EquipmentList title="Comfort" items={car.comfortFeatures} />
              )}
              {car.safetyFeatures && car.safetyFeatures.length > 0 && (
                <EquipmentList title="Safety" items={car.safetyFeatures} />
              )}
              {car.technologyFeatures && car.technologyFeatures.length > 0 && (
                <EquipmentList title="Technology" items={car.technologyFeatures} />
              )}
              {car.lightingFeatures && car.lightingFeatures.length > 0 && (
                <EquipmentList title="Lighting" items={car.lightingFeatures} />
              )}
              {car.driverAssistanceFeatures && car.driverAssistanceFeatures.length > 0 && (
                <EquipmentList title="Driver Assistance" items={car.driverAssistanceFeatures} />
              )}
              {car.otherFeatures && car.otherFeatures.length > 0 && (
                <EquipmentList title="Other" items={car.otherFeatures} />
              )}
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  );
}

function DetailRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;

  return (
    <div className="flex text-xs">
      <span className="font-semibold text-white min-w-[120px]">{label}:</span>
      <span className="text-gray-400">{value}</span>
    </div>
  );
}

function EquipmentList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="ml-2">
      <p className="text-xs font-semibold text-white">{title}:</p>
      <ul className="ml-4 text-xs text-gray-400 list-disc">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}