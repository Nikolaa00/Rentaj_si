"use client";
import React, { useState, useEffect } from "react";
import { HeroSection } from "../layout";
import PageNavigator from "@/app/components/renter/dashboard/paggination/page-navigator";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Trash2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { carService } from "@/services/carService";
import type { Car } from "@/types/car";

export default function DashboardPage() {
  const router = useRouter();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "available" | "rented">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const CARS_PER_PAGE = 4;

  // Fetch cars од backend
  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await carService.getAll();
        setCars(data.cars);
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to fetch cars");
        console.error("Error fetching cars:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  // Filter cars - SINGLE DECLARATION
  const filteredCars = cars.filter((car) => {
    const matchesSearch =
      car.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.year.toString().includes(searchQuery);

    // ✅ USE car.status INSTEAD OF bookings
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "available" && car.status === "AVAILABLE") ||
      (filterStatus === "rented" && car.status === "RENTED");

    return matchesSearch && matchesStatus;
  });

  const availableCars = cars.filter((car) => car.status === "AVAILABLE").length;
  const rentedCars = cars.filter((car) => car.status === "RENTED").length;
  const totalValue = cars.reduce((sum, car) => sum + Number(car.price), 0);

  const totalPages = Math.ceil(filteredCars.length / CARS_PER_PAGE);
  const startIndex = (currentPage - 1) * CARS_PER_PAGE;
  const endIndex = startIndex + CARS_PER_PAGE;
  const currentCars = filteredCars.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterStatus]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this car?")) {
      return;
    }

    try {
      await carService.delete(id);
      setCars((prev) => prev.filter((car) => car.id !== id));
      alert("Car deleted successfully!");
    } catch (error: any) {
      console.error("Error deleting car:", error);
      alert(error.response?.data?.error || "Failed to delete car");
    }
  };

  const handleAddNewCar = () => {
    router.push("/dealer/add-car");
  };

  if (loading) {
    return (
      <HeroSection>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#407BFF]"></div>
        </div>
      </HeroSection>
    );
  }

  if (error) {
    return (
      <HeroSection>
        <div className="text-center py-12">
          <p className="text-2xl text-red-600 mb-4">⚠️ {error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </HeroSection>
    );
  }

  return (
    <HeroSection>
      <div className="w-full flex mb-16 justify-center mt-16">
        <h1 className="font-black text-5xl text-[#233B5D]">
          Manage Your vehicle listings
        </h1>
      </div>

      <div className="flex justify-end mb-6 mx-12">
        <Button variant="addCar" className="w-fit" onClick={handleAddNewCar}>
          <Plus strokeWidth={4} className="w-3 h-3 text-white" />
          <span className="text-white">Add New Car</span>
        </Button>
      </div>

      {/* Search & Filter */}
      <Card className="bg-[#233B5D] border-2 border-[#407BFF] rounded-[50px] p-6 mb-8">
        <div className="flex gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              className="bg-[#1a2b42] text-white border-[#407BFF] pl-12 h-12"
              placeholder="Search by make, model, or year..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="addCar"
              className={cn(
                "transition-all duration-200",
                filterStatus === "all"
                  ? "bg-gray-800 border-2 border-gray-400 text-white"
                  : "bg-gray-300 border-none text-black"
              )}
              onClick={() => setFilterStatus("all")}
            >
              All
            </Button>
            <Button
              variant="addCar"
              className={cn(
                "transition-all duration-200",
                filterStatus === "available"
                  ? "bg-gray-800 border-2 border-gray-400 text-white"
                  : "bg-gray-300 border-none text-black"
              )}
              onClick={() => setFilterStatus("available")}
            >
              Available
            </Button>
            <Button
              variant="addCar"
              className={cn(
                "transition-all duration-200",
                filterStatus === "rented"
                  ? "bg-gray-800 border-2 border-gray-400 text-white"
                  : "bg-gray-300 border-none text-black"
              )}
              onClick={() => setFilterStatus("rented")}
            >
              Rented
            </Button>
          </div>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <Card className="bg-[#233B5D] border-2 border-[#407BFF] rounded-3xl p-6">
          <h3 className="text-gray-400 text-sm mb-2">Total Cars</h3>
          <p className="text-4xl font-bold text-white">{cars.length}</p>
        </Card>
        <Card className="bg-[#233B5D] border-2 border-[#407BFF] rounded-3xl p-6">
          <h3 className="text-gray-400 text-sm mb-2">Available</h3>
          <p className="text-4xl font-bold text-white">{availableCars}</p>
        </Card>
        <Card className="bg-[#233B5D] border-2 border-[#407BFF] rounded-3xl p-6">
          <h3 className="text-gray-400 text-sm mb-2">Rented</h3>
          <p className="text-4xl font-bold text-white">{rentedCars}</p>
        </Card>
        <Card className="bg-[#233B5D] border-2 border-[#407BFF] rounded-3xl p-6">
          <h3 className="text-gray-400 text-sm mb-2">Total Value</h3>
          <p className="text-4xl font-bold text-white">
            €{totalValue.toLocaleString()}
          </p>
        </Card>
      </div>

      {/* Cars Grid */}
      {filteredCars.length === 0 ? (
        <Card className="bg-[#233B5D] border-2 border-[#407BFF] rounded-[50px] p-12">
          <div className="text-center">
            <p className="text-2xl text-gray-400">No cars found</p>
            <p className="text-gray-500 mt-2">
              Try adjusting your search or filters
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          {currentCars.map((car) => (
            <Card
              key={car.id}
              className="bg-[#233B5D] border-2 border-[#407BFF] rounded-[50px] overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="relative h-64 bg-[#1a2b42]">
                <img
                  src={car.images[0]?.url || "/images/car.jpg"}
                  alt={`${car.make} ${car.model}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      car.status === "AVAILABLE"
                        ? "bg-green-700 text-white"
                        : "bg-yellow-700 text-white"
                    }`}
                  >
                    {car.status === "AVAILABLE" ? "Available" : "Rented"}
                  </span>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-white mb-1">
                    {car.make} {car.model}
                  </h2>
                  <p className="text-gray-400 text-sm">
                    {car.year} • {car.condition}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Price</p>
                    <p className="text-[#407BFF] font-bold text-xl">
                      €{Number(car.price).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Mileage</p>
                    <p className="text-white font-semibold">
                      {car.mileage?.toLocaleString() || 0} km
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 justify-end">
                  <Button
                    variant="cancel"
                    className="border-gray-500"
                    onClick={() => handleDelete(car.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <PageNavigator
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      )}
    </HeroSection>
  );
}