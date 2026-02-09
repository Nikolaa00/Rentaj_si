import { Booking } from './booking';
export type CarType = 
  | 'SUV'
  | 'CROSSOVER'
  | 'WAGON'
  | 'FAMILIY_MBP'
  | 'SPORT_SUPERCAR'
  | 'COMPACT'
  | 'COUPE'
  | 'PICK_UP'
  | 'SEDAN'
  | 'LIMOUSEINE'
  | 'CONVERTABLE';

export type TransmissionType = 'MANUAL' | 'AUTOMATIC';
export type FuelType = 'PETROL' | 'DIESEL' | 'ELECTRIC' | 'HYBRID';
export type CarCondition = 'NEW' | 'USED';
export type CarStatus = 'AVAILABLE' | 'RENTED';

export interface CarImage {
  id: string;
  carId: string;
  url: string;
  altText: string | null;
  order: number;
  isPrimary: boolean;
  createdAt: string;
}

export interface Car {
  id: string;
  dealerId: string;
  title: string;
  make: string;
  model: string;
  year: number;
  carType: CarType;
  firstRegistration: string | null;
  price: number;
  pricePerDay: number;
  mileage: number | null;
  condition: CarCondition;
  status: CarStatus;
  transmission: TransmissionType;
  fuelType: FuelType;
  driveType: string;
  performance: string | null;
  engineCapacity: string | null;
  cylinders: number | null;
  emissionClass: string | null;
  fuelConsumption: string | null;
  validHUUntil: string | null;
  seats: number;
  doors: number;
  weight: number | null;
  towingCapacity: number | null;
  color: string | null;
  interior: string | null;
  availableFrom: string;
  availableTo: string | null;
  pickupLocation: string;
  DealerName: string | null;
  comfortFeatures: string[];
  safetyFeatures: string[];
  technologyFeatures: string[];
  lightingFeatures: string[];
  driverAssistanceFeatures: string[];
  otherFeatures: string[];
  createdAt: string;
  updatedAt: string;
  images: CarImage[];
  dealer: {
    id: string;
    fullName: string;
    email: string;
    location: string | null;
  };
  bookings?: Booking[];
}

export interface SearchCarsRequest {
  searchQuery?: string;
  carTypes?: CarType[];
  pickupLocation?: string;
  pickupDate?: string;
  returnDate?: string;
  minPrice?: number;
  maxPrice?: number;
  transmission?: TransmissionType;
  fuelType?: FuelType;
}