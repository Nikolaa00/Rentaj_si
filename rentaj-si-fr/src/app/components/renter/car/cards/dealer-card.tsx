"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Clock, Globe, MessageSquare } from "lucide-react";
import { DealerInfo } from "@/types/dealer";


interface DealerCardProps extends React.ComponentProps<"div"> {
  dealer: DealerInfo;
}

export function DealerCard({ dealer, className, ...props }: DealerCardProps) {
  return (
    <Card
      className={cn(
        "flex flex-col w-full border-2 rounded-[50px] border-[#407BFF] bg-[#233B5D] p-8",
        className
      )}
      {...props}
    >
      {/* Header */}
      <div className=" text-center">
        <h2 className="text-white text-xl font-semibold">
          Dealer: <span className="text-[#407BFF]">{dealer.name}</span>
        </h2>
      </div>

      {/* Content Container */}
      <CardContent className="bg-[#1a2b42] rounded-3xl  p-6 space-y-4">
        {/* Description */}
        {dealer.description && (
          <div className="text-white text-xs leading-relaxed mb-4 pb-4 border-b border-gray-500">
            <p className="italic">{dealer.description}</p>
          </div>
        )}

        <div className="flex  ">
          {/* Contacts Section */}
          <div className="space-y-3 w-[47%] px-3 ">
            <h4 className="text-[#407BFF] font-semibold text-sm">Contacts:</h4>
            {dealer.contacts.map((contact, index) => (
              <div key={index} className="space-y-1">
                <p className="text-white font-bold text-xs">
                  {contact.name}{" "}
                  <span className="font-normal text-gray-300">
                    - {contact.role}
                  </span>
                </p>
                <div className="flex items-center gap-2">
                  <Phone className="w-3 h-3 text-[#407BFF]" />
                  <div className="text-white text-xs braeak-words">
                    {contact.phone}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="border-l border-gray-500"></div>
          {/* Address Section */}
          <div className="space-y-2 w-[47%] px-3  ">
            <div className="flex items-start gap-3">
              <MapPin className="w-3 h-3 text-[#407BFF] shrink-0 mt-0.5" />
              <div className="text-white text-xs wrap-break-word">
                <p>{dealer.address.street}</p>
                <p>
                  {dealer.address.postalCode} {dealer.address.city}
                </p>
                <p>{dealer.address.country}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default DealerCard;
