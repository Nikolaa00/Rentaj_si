"use client";
import React from "react";
import VehicleCard from "@/app/components/renter/dashboard/cards/vehicle-card";
import CarRentalInterface from "@/app/components/renter/dashboard/filter/dashboard-filter";
import { HeroSection, ContentSection } from "../layout";
import PageNavigator from "@/app/components/renter/dashboard/paggination/page-navigator";
import Image from "next/image";
import { useCars } from "@/hooks/useCars";
import type { SearchCarsRequest } from "@/types/car";

export default function DashboardPage() {
  const [currentPage, setCurrentPage] = React.useState(1);
  const { cars, loading, error, count, searchCars } = useCars();

  const itemsPerPage = 15;
  const totalPages = Math.ceil(count / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = cars.slice(startIndex, endIndex);

  const handleSearch = async (filters: {
    searchQuery: string;
    pickupLocation: string;
    pickupDate?: Date;
    dropoffDate?: Date;
    carTypes: string[];
  }) => {
    setCurrentPage(1); 

    const searchRequest: SearchCarsRequest = {
      searchQuery: filters.searchQuery || undefined,
      pickupLocation: filters.pickupLocation || undefined,
      pickupDate: filters.pickupDate?.toISOString() || undefined,
      returnDate: filters.dropoffDate?.toISOString() || undefined,
      carTypes: filters.carTypes.length > 0 ? filters.carTypes as any : undefined,
    };

    await searchCars(searchRequest);
  };

  return (
    <>
      <HeroSection>
        <div className="flex flex-col w-full items-center gap-7 mb-14">
          <div className="w-full flex justify-center mb-16">
            <h1 className="font-black text-5xl text-[#233B5D]">
              Rent your car
            </h1>
          </div>
          <Image
            src="/svg/dashboard image.svg"
            alt="Dashboard illustration"
            width={600}
            height={400}
            className="mb-12"
          />
          <CarRentalInterface className="" onSearch={handleSearch} />
        </div>
      </HeroSection>

      <ContentSection className="max-w-[1600px] mx-auto px-4 md:px-10 lg:px-20 flex flex-col items-center">
        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-white">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mb-4"></div>
            <p className="text-lg">Loading vehicles...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex flex-col items-center justify-center py-20 text-white">
            <svg
              className="w-24 h-24 mb-4 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-2xl font-bold mb-2">Error</h3>
            <p className="text-gray-300 mb-4">{error}</p>
          </div>
        )}

        {/* Results Summary */}
        {!loading && !error && (
          <div className="w-full mb-6 text-center">
            <p className="text-white text-lg">
              Found <span className="font-bold">{count}</span> vehicle
              {count !== 1 ? "s" : ""}
            </p>
          </div>
        )}

        {/* Cars Grid */}
        {!loading && !error && currentItems.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-12 place-items-center w-full">
              {currentItems.map((car) => (
                <VehicleCard
                  key={car.id}
                  id={car.id}
                  model={car.title}
                  category={car.carType}
                  pricePerDay={car.pricePerDay}
                  imageUrl={car.images[0]?.url || "/images/car.jpg"}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <PageNavigator
                totalPages={totalPages}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                className="mb-12"
              />
            )}
          </>
        ) : (
          !loading &&
          !error && (
            <div className="flex flex-col items-center justify-center py-20 text-white">
              <svg
                className="w-24 h-24 mb-4 opacity-50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-2xl font-bold mb-2">No vehicles found</h3>
              <p className="text-gray-300 mb-4">
                Try adjusting your filters or search criteria
              </p>
            </div>
          )
        )}
      </ContentSection>
    </>
  );}