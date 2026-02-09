import { HeroSection, ContentSection } from "../layout";
import BookingSection from "@/app/components/renter/my-rentals/section/booking-section";

export default function RentalsPage() {
  return (
    <HeroSection>
      <div className="w-full flex justify-center mb-12">
        <h1 className="font-black text-5xl text-[#233B5D]">My Rentals</h1>
      </div>
      <BookingSection />
    </HeroSection>
  );
}
