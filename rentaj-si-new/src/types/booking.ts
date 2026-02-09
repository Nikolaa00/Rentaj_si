import { Car } from './car';
export type BookingStatus = 'CONFIRMED' | 'CANCELLED';

export interface Booking {
  id: string;
  renterId: string;
  dealerId: string;
  carId: string;
  pickUpDate: string;
  returnDate: string;
  pickupLocation: string;
  returnLocation: string | null;
  totalPrice: number;
  status: BookingStatus;
  cancellationDate: string | null;
  createdAt: string;
  updatedAt: string;
  car?: Car;
  renter?: {
    id: string;
    fullName: string;
    email: string;
    location: string | null;
  };
  dealer?: {
    id: string;
    fullName: string;
    email: string;
    location: string | null;
  };
}

export interface CreateBookingRequest {
  carId: string;
  pickUpDate: string;
  returnDate: string;
  pickupLocation?: string;
  returnLocation?: string;
  totalPrice: number;
}