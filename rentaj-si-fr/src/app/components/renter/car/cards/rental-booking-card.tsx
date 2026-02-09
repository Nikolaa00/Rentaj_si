"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface RentalBookingCardProps extends React.ComponentProps<"div"> {
  pickupDate?: Date;
  pickupTime?: string;
  dropoffDate?: Date;
  dropoffTime?: string;
  description?: string;
  onRentNow?: (data: {
    pickupDate: Date | undefined;
    pickupTime: string;
    dropoffDate: Date | undefined;
    dropoffTime: string;
  }) => void;
}

export function RentalBookingCard({ 
  pickupDate,
  pickupTime = "14:00",
  dropoffDate,
  dropoffTime = "14:00",
  description = "Изберете датум и време за преземање и враќање на возилото. Резервирајте го вашето возило денес и уживајте во удобноста на нашата услуга!",
  onRentNow,
  className,
  ...props 
}: RentalBookingCardProps) {
  const [selectedPickupDate, setSelectedPickupDate] = React.useState<Date | undefined>(pickupDate);
  const [selectedPickupTime, setSelectedPickupTime] = React.useState(pickupTime);
  const [selectedDropoffDate, setSelectedDropoffDate] = React.useState<Date | undefined>(dropoffDate);
  const [selectedDropoffTime, setSelectedDropoffTime] = React.useState(dropoffTime);


  const parseTime = (timeStr: string) => {
    const [hours = "00", minutes = "00"] = timeStr.split(":");
    return { hours, minutes };
  };

  const formatTime = (hours: string, minutes: string) => {
    return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
  };

  const [pickupTimeComponents, setPickupTimeComponents] = React.useState(() => parseTime(pickupTime));
  const [dropoffTimeComponents, setDropoffTimeComponents] = React.useState(() => parseTime(dropoffTime));

  const handleRentNow = () => {
    if (onRentNow) {
      onRentNow({
        pickupDate: selectedPickupDate,
        pickupTime: selectedPickupTime,
        dropoffDate: selectedDropoffDate,
        dropoffTime: selectedDropoffTime,
      });
    }
  };

  const updatePickupTime = (field: "hours" | "minutes", value: string) => {
    const newComponents = { ...pickupTimeComponents, [field]: value };
    setPickupTimeComponents(newComponents);
    setSelectedPickupTime(formatTime(newComponents.hours, newComponents.minutes));
  };

  const updateDropoffTime = (field: "hours" | "minutes", value: string) => {
    const newComponents = { ...dropoffTimeComponents, [field]: value };
    setDropoffTimeComponents(newComponents);
    setSelectedDropoffTime(formatTime(newComponents.hours, newComponents.minutes));
  };

  return (
    <Card
      className={cn(
        "flex flex-col w-fit  rounded-[50px] bg-[#5A818E] p-8 mb-10 border border-[#407BFF]",
        className
      )}
      {...props}
    >
      <div className="flex justify-between items-start gap-3 ">
        <div>
          <Label className="text-white text-xs font-semibold italic">
            Pick-up date and time
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="dateTime"
                className={cn(
                  "w-full bg-white border border-[#407BFF] rounded-full scale-none drop-shadow-none flex items-center gap-3 justify-start text-left font-normal",
                  !selectedPickupDate && "text-gray-400"
                )}
              >
                <CalendarIcon className="w-4 h-4 text-gray-700" />
                <span className="text-gray-700 text-xs">
                  {selectedPickupDate 
                    ? `${format(selectedPickupDate, "MMMM do, yyyy")} ${selectedPickupTime}` 
                    : "Pick a date and time"}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 border-[#407BFF] border rounded-3xl" side="left" align="end">
              <div className="flex flex-col">
                <Calendar
                  mode="single"
                  selected={selectedPickupDate}
                  onSelect={setSelectedPickupDate}
                  autoFocus
                  className="border-none"
                />
                <div className="border-none rounded-b-3xl p-4 bg-[#97E4FF]">
                  <div className="flex gap-7 items-center justify-center">
                    <div className="flex flex-col items-center">
                      <Label className="text-xs text-gray-800 mb-2">Hours</Label>
                      <Input
                        type="number"
                        min="0"
                        max="23"
                        value={pickupTimeComponents.hours}
                        onChange={(e) => updatePickupTime("hours", e.target.value)}
                        className="w-15 bg-[#ffffff] text-center"
                      />
                    </div>
                    <div className="flex flex-col items-center">
                      <Label className="text-xs text-gray-800 mb-2">Minutes</Label>
                      <Input
                        type="number"
                        min="0"
                        max="59"
                        value={pickupTimeComponents.minutes}
                        onChange={(e) => updatePickupTime("minutes", e.target.value)}
                        className="w-15 bg-[#ffffff] text-center"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Drop-off */}
        <div>
          <Label className="text-white text-xs font-semibold italic">
            Drop-off date and time
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="dateTime"
                className={cn(
                  "w-full bg-white rounded-full scale-none drop-shadow-none flex items-center gap-3 border border-[#407BFF] justify-start text-left font-normal",
                  !selectedDropoffDate && "text-gray-400"
                )}
              >
                <CalendarIcon className="w-4 h-4 text-gray-700" />
                <span className="text-gray-700 text-xs">
                  {selectedDropoffDate 
                    ? `${format(selectedDropoffDate, "MMMM do, yyyy")} ${selectedDropoffTime}` 
                    : "Pick a date and time"}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 border-[#407BFF] border rounded-3xl" side="left" align="end">
              <div className="flex flex-col">
                <Calendar
                  mode="single"
                  selected={selectedDropoffDate}
                  onSelect={setSelectedDropoffDate}
                  autoFocus
                  disabled={(date: Date) => 
                    selectedPickupDate ? date < selectedPickupDate : false
                  }
                />
                <div className="border-none rounded-b-3xl p-4 bg-[#97E4FF]">
                  <div className="flex gap-7 items-center justify-center">
                    <div className="flex flex-col items-center">
                      <Label className="text-xs text-gray-800 mb-2">Hours</Label>
                      <Input
                        type="number"
                        min="0"
                        max="23"
                        value={dropoffTimeComponents.hours}
                        onChange={(e) => updateDropoffTime("hours", e.target.value)}
                        className="w-15 bg-[#ffffff] text-center"
                      />
                    </div>
                    <div className="flex flex-col items-center">
                      <Label className="text-xs text-gray-800 mb-2">Minutes</Label>
                      <Input
                        type="number"
                        min="0"
                        max="59"
                        value={dropoffTimeComponents.minutes}
                        onChange={(e) => updateDropoffTime("minutes", e.target.value)}
                        className="w-15 bg-[#ffffff] text-center"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Description Area */}
      <CardContent className="bg-[#99B3BA] rounded-3xl border-[#407BFF] border p-3 flex items-center justify-center">
        <p className="text-gray-800 text-center text-xs leading-relaxed">
          {description}
        </p>
      </CardContent>

      {/* Rent Now Button */}
      <div className="flex justify-end">
        <Button 
          variant={"submit"}
          onClick={handleRentNow}
          className="transition-all hover:scale-105"
        >
          Rent now
        </Button>
      </div>
    </Card>
  );
}
