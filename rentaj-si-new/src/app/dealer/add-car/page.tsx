"use client";
import * as React from "react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { X, Upload, Plus, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { HeroSection } from "../layout";
import { carService } from "@/services/carService";
import { uploadService } from "@/services/uploadService";
import { useRouter } from "next/navigation";

export default function AddCarPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [selectedAvailableFrom, setSelectedAvailableFrom] = useState<Date>();
  const [selectedAvailableTo, setSelectedAvailableTo] = useState<Date>();
  
  const [formData, setFormData] = useState({
    title: "",
    carType: "",
    make: "",
    model: "",
    year: "",
    firstRegistration: "",
    mileage: "",
    condition: "",
    price: "",
    pricePerDay: "",
    performance: "",
    engineCapacity: "",
    cylinders: "",
    fuelType: "",
    transmission: "",
    drive: "",
    emissionStandard: "",
    validHuUntil: "",
    fuelConsumption: "",
    seats: "",
    doors: "",
    weight: "",
    towingCapacity: "",
    color: "",
    interior: "",
    pickupLocation: "",
    dealerName: "",
  });

  const [equipment, setEquipment] = useState({
    comfort: [] as string[],
    safety: [] as string[],
    technology: [] as string[],
    lighting: [] as string[],
    driverAssistance: [] as string[],
    other: [] as string[],
  });

  const [newEquipmentInput, setNewEquipmentInput] = useState({
    comfort: "",
    safety: "",
    technology: "",
    lighting: "",
    driverAssistance: "",
    other: "",
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setImageFiles((prev) => [...prev, ...newFiles]);
      
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addEquipmentItem = (category: keyof typeof equipment) => {
    const value = newEquipmentInput[category];
    if (value.trim()) {
      setEquipment((prev) => ({
        ...prev,
        [category]: [...prev[category], value.trim()],
      }));
      setNewEquipmentInput((prev) => ({
        ...prev,
        [category]: "",
      }));
    }
  };

  const removeEquipmentItem = (
    category: keyof typeof equipment,
    index: number
  ) => {
    setEquipment((prev) => ({
      ...prev,
      [category]: prev[category].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      // 1. Upload images first
      let uploadedImages: { url: string; publicId: string }[] = [];
      if (imageFiles.length > 0) {
        const uploadResult = await uploadService.uploadImages(imageFiles);
        uploadedImages = uploadResult.images;
      }

      // 2. Prepare car data
      const carData = {
        title: formData.title,
        make: formData.make,
        model: formData.model,
        year: parseInt(formData.year),
        carType: formData.carType,
        transmission: formData.transmission.toUpperCase(),
        fuelType: formData.fuelType.toUpperCase(),
        price: parseFloat(formData.price),
        pricePerDay: parseFloat(formData.pricePerDay),
        mileage: formData.mileage ? parseInt(formData.mileage) : null,
        condition: formData.condition.toUpperCase(),
        driveType: formData.drive,
        performance: formData.performance || null,
        engineCapacity: formData.engineCapacity || null,
        cylinders: formData.cylinders ? parseInt(formData.cylinders) : null,
        emissionClass: formData.emissionStandard || null,
        fuelConsumption: formData.fuelConsumption || null,
        validHUUntil: formData.validHuUntil || null,
        seats: formData.seats ? parseInt(formData.seats) : 5,
        doors: formData.doors ? parseInt(formData.doors) : 4,
        weight: formData.weight ? parseInt(formData.weight) : null,
        towingCapacity: formData.towingCapacity ? parseInt(formData.towingCapacity) : null,
        color: formData.color || null,
        interior: formData.interior || null,
        availableFrom: selectedAvailableFrom?.toISOString() || new Date().toISOString(),
        availableTo: selectedAvailableTo?.toISOString() || null,
        pickupLocation: formData.pickupLocation,
        DealerName: formData.dealerName || null,
        firstRegistration: formData.firstRegistration || null,
        comfortFeatures: equipment.comfort,
        safetyFeatures: equipment.safety,
        technologyFeatures: equipment.technology,
        lightingFeatures: equipment.lighting,
        driverAssistanceFeatures: equipment.driverAssistance,
        otherFeatures: equipment.other,
        images: uploadedImages,
      };

      // 3. Create car
      await carService.create(carData);

      alert("Car added successfully!");
      router.push("/dealer/dashboard");
    } catch (error: any) {
      console.error("Error adding car:", error);
      alert(error.response?.data?.error || "Failed to add car");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <HeroSection>
      <div className="max-w-[1600px] mx-auto">
        <div className="w-full flex mb-16 justify-center mt-16">
          <h1 className="font-black text-5xl text-[#233B5D]">Add a new car</h1>
        </div>

        <div className="space-y-6">
          {/* Image Upload */}
          <Card className="bg-[#233B5D] border-2 border-[#407BFF] rounded-[50px] p-8">
            <h2 className="text-2xl font-bold text-[#407BFF] mb-6">
              Car Images
            </h2>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-5 gap-4">
                {imagePreviews.map((img, index) => (
                  <div
                    key={index}
                    className="relative aspect-video rounded-[50px] overflow-hidden border-2 border-[#407BFF]"
                  >
                    <img
                      src={img}
                      alt={`Car ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <Button
                      onClick={() => removeImage(index)}
                      variant="addCar"
                      className="text-white absolute top-2 right-2 rounded-full p-1"
                    >
                      <X className="w-4 h-4 text-white" />
                    </Button>
                  </div>
                ))}
                <label className="aspect-video rounded-[50px] border-2 border-dashed border-[#407BFF] flex flex-col items-center justify-center cursor-pointer hover:bg-[#1a2b42] transition">
                  <Upload className="w-8 h-8 text-[#407BFF] mb-2" />
                  <span className="text-xs text-gray-400">Upload</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Basic Info - Keep your existing structure but add validation */}
          <Card className="bg-[#233B5D] border-2 border-[#407BFF] rounded-[50px] p-8">
            <h2 className="text-2xl font-bold text-[#407BFF] mb-6">
              Basic Information
            </h2>
            <CardContent className="flex flex-wrap gap-4">
              {/* Title */}
              <div className="col-span-3 w-full">
                <Label className="text-white mb-2 ml-8">Title *</Label>
                <Input
                  className="bg-[#1a2b42] text-white border-[#407BFF]"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="e.g., 2023 Audi A7 Sportback"
                  required
                />
              </div>

              {/* Car Type */}
              <div>
                <Label className="text-white mb-2 ml-8">Car Type *</Label>
                <Select onValueChange={(value) => handleInputChange("carType", value)}>
                  <SelectTrigger className="bg-[#1a2b42] text-white border-[#407BFF]">
                    <SelectValue placeholder="Select car type" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#97E4FF] text-[#1a2b42] border-[#407BFF] rounded-3xl text-lg font-bold">
                    <SelectItem value="SUV" className="hover:bg-[#34386f]/40 rounded-3xl">SUV</SelectItem>
                    <SelectItem value="CROSSOVER" className="hover:bg-[#34386f]/40 rounded-3xl">CROSSOVER</SelectItem>
                    <SelectItem value="WAGON" className="hover:bg-[#34386f]/40 rounded-3xl">WAGON</SelectItem>
                    <SelectItem value="FAMILIY_MBP" className="hover:bg-[#34386f]/40 rounded-3xl">FAMILY_MBP</SelectItem>
                    <SelectItem value="SPORT_SUPERCAR" className="hover:bg-[#34386f]/40 rounded-3xl">SPORT_SUPERCAR</SelectItem>
                    <SelectItem value="COMPACT" className="hover:bg-[#34386f]/40 rounded-3xl">COMPACT</SelectItem>
                    <SelectItem value="COUPE" className="hover:bg-[#34386f]/40 rounded-3xl">COUPE</SelectItem>
                    <SelectItem value="PICK_UP" className="hover:bg-[#34386f]/40 rounded-3xl">PICK_UP</SelectItem>
                    <SelectItem value="SEDAN" className="hover:bg-[#34386f]/40 rounded-3xl">SEDAN</SelectItem>
                    <SelectItem value="LIMOUSEINE" className="hover:bg-[#34386f]/40 rounded-3xl">LIMOUSINE</SelectItem>
                    <SelectItem value="CONVERTABLE" className="hover:bg-[#34386f]/40 rounded-3xl">CONVERTIBLE</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Make */}
              <div>
                <Label className="text-white mb-2 ml-8">Make *</Label>
                <Input
                  className="bg-[#1a2b42] text-white border-[#407BFF]"
                  value={formData.make}
                  onChange={(e) => handleInputChange("make", e.target.value)}
                  placeholder="e.g., Audi"
                  required
                />
              </div>

              {/* Model */}
              <div>
                <Label className="text-white mb-2 ml-8">Model *</Label>
                <Input
                  className="bg-[#1a2b42] text-white border-[#407BFF]"
                  value={formData.model}
                  onChange={(e) => handleInputChange("model", e.target.value)}
                  placeholder="e.g., A7"
                  required
                />
              </div>

              {/* Year */}
              <div>
                <Label className="text-white mb-2 ml-8">Year *</Label>
                <Input
                  type="number"
                  className="bg-[#1a2b42] text-white border-[#407BFF]"
                  value={formData.year}
                  onChange={(e) => handleInputChange("year", e.target.value)}
                  placeholder="2023"
                  required
                />
              </div>
              {/* First Registration */}
              <div>
                <Label className="text-white mb-2 ml-8">First Registration</Label>
                <Input
                  className="bg-[#1a2b42] text-white border-[#407BFF]"
                  value={formData.firstRegistration}
                  onChange={(e) => handleInputChange("firstRegistration", e.target.value)}
                  placeholder="03/2023"
                />
              </div>

              {/* Mileage */}
              <div>
                <Label className="text-white mb-2 ml-8">Mileage (km)</Label>
                <Input
                  type="number"
                  className="bg-[#1a2b42] text-white border-[#407BFF]"
                  value={formData.mileage}
                  onChange={(e) => handleInputChange("mileage", e.target.value)}
                  placeholder="18000"
                />
              </div>

              {/* Price */}
              <div>
                <Label className="text-white mb-2 ml-8">Price (€) *</Label>
                <Input
                  type="number"
                  className="bg-[#1a2b42] text-white border-[#407BFF]"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  placeholder="80000"
                  required
                />
              </div>

              {/* Price Per Day */}
              <div>
                <Label className="text-white mb-2 ml-8">Price Per Day (€) *</Label>
                <Input
                  type="number"
                  className="bg-[#1a2b42] text-white border-[#407BFF]"
                  value={formData.pricePerDay}
                  onChange={(e) => handleInputChange("pricePerDay", e.target.value)}
                  placeholder="150"
                  required
                />
              </div>

              {/* Condition */}
              <div>
                <Label className="text-white mb-2 ml-8">Condition *</Label>
                <Select onValueChange={(value) => handleInputChange("condition", value)}>
                  <SelectTrigger className="bg-[#1a2b42] text-white border-[#407BFF]">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#97E4FF] text-[#1a2b42] border-[#407BFF] rounded-3xl text-lg font-bold">
                    <SelectItem value="NEW" className="hover:bg-[#34386f]/40 rounded-3xl">New vehicle</SelectItem>
                    <SelectItem value="USED" className="hover:bg-[#34386f]/40 rounded-3xl">Used</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Technical Data */}
          <Card className="bg-[#233B5D] border-2 border-[#407BFF] rounded-[50px] p-8">
            <h2 className="text-2xl font-bold text-[#407BFF] mb-6">Technical Data</h2>
            <CardContent className="flex flex-wrap gap-4">
              {/* Performance */}
              <div>
                <Label className="text-white mb-2 ml-8">Performance</Label>
                <Input
                  className="bg-[#1a2b42] text-white border-[#407BFF]"
                  value={formData.performance}
                  onChange={(e) => handleInputChange("performance", e.target.value)}
                  placeholder="250 kW (340 HP)"
                />
              </div>

              {/* Engine Capacity */}
              <div>
                <Label className="text-white mb-2 ml-8">Engine Capacity</Label>
                <Input
                  className="bg-[#1a2b42] text-white border-[#407BFF]"
                  value={formData.engineCapacity}
                  onChange={(e) => handleInputChange("engineCapacity", e.target.value)}
                  placeholder="3,000 cm³"
                />
              </div>

              {/* Cylinders */}
              <div>
                <Label className="text-white mb-2 ml-8">Cylinders</Label>
                <Input
                  type="number"
                  className="bg-[#1a2b42] text-white border-[#407BFF]"
                  value={formData.cylinders}
                  onChange={(e) => handleInputChange("cylinders", e.target.value)}
                  placeholder="6"
                />
              </div>

              {/* Drive */}
              <div>
                <Label className="text-white mb-2 ml-8">Drive *</Label>
                <Input
                  className="bg-[#1a2b42] text-white border-[#407BFF]"
                  value={formData.drive}
                  onChange={(e) => handleInputChange("drive", e.target.value)}
                  placeholder="Quattro AWD"
                  required
                />
              </div>

              {/* Emission Standard */}
              <div>
                <Label className="text-white mb-2 ml-8">Emission Standard</Label>
                <Input
                  className="bg-[#1a2b42] text-white border-[#407BFF]"
                  value={formData.emissionStandard}
                  onChange={(e) => handleInputChange("emissionStandard", e.target.value)}
                  placeholder="Euro 6"
                />
              </div>

              {/* Valid HU Until */}
              <div>
                <Label className="text-white mb-2 ml-8">Valid HU Until</Label>
                <Input
                  className="bg-[#1a2b42] text-white border-[#407BFF]"
                  value={formData.validHuUntil}
                  onChange={(e) => handleInputChange("validHuUntil", e.target.value)}
                  placeholder="03/2025"
                />
              </div>

              {/* Fuel Consumption */}
              <div>
                <Label className="text-white mb-2 ml-8">Fuel Consumption</Label>
                <Input
                  className="bg-[#1a2b42] text-white border-[#407BFF]"
                  value={formData.fuelConsumption}
                  onChange={(e) => handleInputChange("fuelConsumption", e.target.value)}
                  placeholder="7.5 L/100km"
                />
              </div>

              {/* Fuel Type */}
              <div>
                <Label className="text-white mb-2 ml-8">Fuel Type *</Label>
                <Select onValueChange={(value) => handleInputChange("fuelType", value)}>
                  <SelectTrigger className="bg-[#1a2b42] text-white border-[#407BFF]">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#97E4FF] text-[#1a2b42] border-[#407BFF] rounded-3xl text-lg font-bold">
                    <SelectItem value="PETROL" className="hover:bg-[#34386f]/40 rounded-3xl">Petrol</SelectItem>
                    <SelectItem value="DIESEL" className="hover:bg-[#34386f]/40 rounded-3xl">Diesel</SelectItem>
                    <SelectItem value="ELECTRIC" className="hover:bg-[#34386f]/40 rounded-3xl">Electric</SelectItem>
                    <SelectItem value="HYBRID" className="hover:bg-[#34386f]/40 rounded-3xl">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Transmission */}
              <div>
                <Label className="text-white mb-2 ml-8">Transmission *</Label>
                <Select onValueChange={(value) => handleInputChange("transmission", value)}>
                  <SelectTrigger className="bg-[#1a2b42] text-white border-[#407BFF]">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#97E4FF] text-[#1a2b42] border-[#407BFF] rounded-3xl text-lg font-bold">
                    <SelectItem value="AUTOMATIC" className="hover:bg-[#34386f]/40 rounded-3xl">Automatic</SelectItem>
                    <SelectItem value="MANUAL" className="hover:bg-[#34386f]/40 rounded-3xl">Manual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Dimensions */}
          <Card className="bg-[#233B5D] border-2 border-[#407BFF] rounded-[50px] p-8">
            <h2 className="text-2xl font-bold text-[#407BFF] mb-6">Dimensions & Capacity</h2>
            <CardContent className="flex flex-wrap gap-8 justify-around">
              <div>
                <Label className="text-white mb-2 ml-8">Seats</Label>
                <Input
                  type="number"
                  className="bg-[#1a2b42] text-white border-[#407BFF]"
                  value={formData.seats}
                  onChange={(e) => handleInputChange("seats", e.target.value)}
                  placeholder="5"
                />
              </div>
              <div>
                <Label className="text-white mb-2 ml-8">Doors</Label>
                <Input
                  type="number"
                  className="bg-[#1a2b42] text-white border-[#407BFF]"
                  value={formData.doors}
                  onChange={(e) => handleInputChange("doors", e.target.value)}
                  placeholder="5"
                />
              </div>
              <div>
                <Label className="text-white mb-2 ml-8">Weight (kg)</Label>
                <Input
                  type="number"
                  className="bg-[#1a2b42] text-white border-[#407BFF]"
                  value={formData.weight}
                  onChange={(e) => handleInputChange("weight", e.target.value)}
                  placeholder="2000"
                />
              </div>
              <div>
                <Label className="text-white mb-2 ml-8">Towing Capacity</Label>
                <Input
                  className="bg-[#1a2b42] text-white border-[#407BFF]"
                  value={formData.towingCapacity}
                  onChange={(e) => handleInputChange("towingCapacity", e.target.value)}
                  placeholder="2,000 kg"
                />
              </div>
            </CardContent>
          </Card>

          {/* Color & Interior */}
          <Card className="bg-[#233B5D] border-2 border-[#407BFF] rounded-[50px] p-8">
            <h2 className="text-2xl font-bold text-[#407BFF] mb-6">Color & Interior</h2>
            <CardContent className="flex flex-wrap gap-8 justify-around">
              <div>
                <Label className="text-white mb-2 ml-8">Color</Label>
                <Input
                  className="bg-[#1a2b42] text-white border-[#407BFF]"
                  value={formData.color}
                  onChange={(e) => handleInputChange("color", e.target.value)}
                  placeholder="Daytona Grey"
                />
              </div>
              <div>
                <Label className="text-white mb-2 ml-8">Interior</Label>
                <Input
                  className="bg-[#1a2b42] text-white border-[#407BFF]"
                  value={formData.interior}
                  onChange={(e) => handleInputChange("interior", e.target.value)}
                  placeholder="Leather, black"
                />
              </div>
            </CardContent>
          </Card>

          {/* Availability & Location */}
          <Card className="bg-[#233B5D] border-2 border-[#407BFF] rounded-[50px] p-8">
            <h2 className="text-2xl font-bold text-[#407BFF] mb-6">Availability & Location</h2>
            <CardContent className="flex flex-wrap gap-6 justify-around">
              {/* Available From */}
              <div>
                <Label className="text-white mb-2 ml-8">Available From *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="dateTime"
                      className={cn(
                        "bg-[#1a2b42] text-white border-[#407BFF] w-[443px] h-[55px]",
                        !selectedAvailableFrom && "text-gray-400"
                      )}
                    >
                      <CalendarIcon className="ml-1 w-5 h-5 text-gray-400" />
                      <span className="text-left font-light italic text-gray-400 text-lg">
                        {selectedAvailableFrom
                          ? format(selectedAvailableFrom, "MMMM do, yyyy")
                          : "Choose available from date"}
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 border-[#407BFF] border-2 rounded-3xl" side="bottom" align="center">
                    <Calendar
                      mode="single"
                      selected={selectedAvailableFrom}
                      onSelect={setSelectedAvailableFrom}
                      autoFocus
                      className="rounded-3xl"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Available To */}
              <div>
                <Label className="text-white mb-2 ml-8">Available To</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="dateTime"
                      className={cn(
                        "bg-[#1a2b42] text-white border-[#407BFF] w-[443px] h-[55px]",
                        !selectedAvailableTo && "text-gray-400"
                      )}
                    >
                      <CalendarIcon className="ml-1 w-5 h-5 text-gray-400" />
                      <span className="text-left font-light italic text-gray-400 text-lg">
                        {selectedAvailableTo
                          ? format(selectedAvailableTo, "MMMM do, yyyy")
                          : "Choose available to date"}
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 border-[#407BFF] border-2 rounded-3xl" side="bottom" align="center">
                    <Calendar
                      mode="single"
                      selected={selectedAvailableTo}
                      onSelect={setSelectedAvailableTo}
                      autoFocus
                      className="rounded-3xl "
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Pickup Location */}
              <div>
                <Label className="text-white mb-2 ml-8">Pickup Location *</Label>
                <Input
                  className="bg-[#1a2b42] text-white border-[#407BFF]"
                  value={formData.pickupLocation}
                  onChange={(e) => handleInputChange("pickupLocation", e.target.value)}
                  placeholder="e.g., Berlin, Germany"
                  required
                />
              </div>

              {/* Dealer Name */}
              <div>
                <Label className="text-white mb-2 ml-8">Dealer Name</Label>
                <Input
                  className="bg-[#1a2b42] text-white border-[#407BFF]"
                  value={formData.dealerName}
                  onChange={(e) => handleInputChange("dealerName", e.target.value)}
                  placeholder="e.g., Premium Auto"
                />
              </div>
            </CardContent>
          </Card>

          {/* Equipment */}
          <Card className="bg-[#233B5D] border-2 border-[#407BFF] rounded-[50px] p-8">
            <h2 className="text-2xl font-bold text-[#407BFF] mb-6">Equipment</h2>
            <CardContent className="space-y-6">
              {Object.entries(equipment).map(([category, items]) => (
                <div key={category}>
                  <Label className="text-white capitalize mb-2 block ml-8">
                    {category.replace(/([A-Z])/g, " $1")}
                  </Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      className="bg-[#1a2b42] text-white border-[#407BFF]"
                      placeholder={`Add ${category} feature`}
                      value={newEquipmentInput[category as keyof typeof equipment]}
                      onChange={(e) =>
                        setNewEquipmentInput((prev) => ({
                          ...prev,
                          [category]: e.target.value,
                        }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addEquipmentItem(category as keyof typeof equipment);
                        }
                      }}
                    />
                    <Button
                      variant="addCar"
                      className="text-white"
                      onClick={() => addEquipmentItem(category as keyof typeof equipment)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {items.map((item, index) => (
                      <span
                        key={index}
                        className="bg-[#1a2b42] text-white px-3 py-1 rounded-full text-sm flex items-center gap-2"
                      >
                        {item}
                        <Button
                          variant="addCar"
                          onClick={() => removeEquipmentItem(category as keyof typeof equipment, index)}
                          className="hover:text-red-400"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex justify-center gap-4 pb-8">
            <Button
              variant="cancel"
              className="px-12 py-6 text-lg"
              onClick={() => router.push("/dealer/dashboard")}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="addCar"
              className="text-white px-12 py-6 text-lg"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding Car..." : "Add Car"}
            </Button>
          </div>
        </div>
      </div>
    </HeroSection>
  );
}