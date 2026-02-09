-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('RENTER', 'DEALER');

-- CreateEnum
CREATE TYPE "CarStatus" AS ENUM ('AVAILABLE', 'RENTED');

-- CreateEnum
CREATE TYPE "CarType" AS ENUM ('SUV', 'CROSSOVER', 'WAGON', 'FAMILIY_MBP', 'SPORT_SUPERCAR', 'COMPACT', 'COUPE', 'PICK_UP', 'SEDAN', 'LIMOUSEINE', 'CONVERTABLE');

-- CreateEnum
CREATE TYPE "TransmissionType" AS ENUM ('MANUAL', 'AUTOMATIC');

-- CreateEnum
CREATE TYPE "FuelType" AS ENUM ('PETROL', 'DIESEL', 'ELECTRIC', 'HYBRID');

-- CreateEnum
CREATE TYPE "CarCondition" AS ENUM ('NEW', 'USED');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('CONFIRMED', 'CANCELLED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'RENTER',
    "location" TEXT DEFAULT 'Bitola',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cars" (
    "id" TEXT NOT NULL,
    "dealer_id" TEXT NOT NULL,
    "renter_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "car_type" "CarType" NOT NULL,
    "first_registration" TIMESTAMP(3),
    "price" DECIMAL(10,2) NOT NULL,
    "price_per_day" DECIMAL(10,2) NOT NULL,
    "mileage" INTEGER,
    "condition" "CarCondition" NOT NULL DEFAULT 'USED',
    "status" "CarStatus" NOT NULL DEFAULT 'AVAILABLE',
    "transmission" "TransmissionType" NOT NULL,
    "fuel_type" "FuelType" NOT NULL,
    "drive_type" VARCHAR(50) NOT NULL,
    "performance" TEXT,
    "engine_capacity" TEXT,
    "cylinders" INTEGER,
    "emission_class" TEXT,
    "fuel_consumption" TEXT,
    "valid_hu_until" TIMESTAMP(3),
    "seats" INTEGER NOT NULL DEFAULT 5,
    "doors" INTEGER NOT NULL DEFAULT 4,
    "weight" INTEGER,
    "towing_capacity" INTEGER,
    "color" TEXT,
    "interior" TEXT,
    "available_from" TIMESTAMP(3) NOT NULL,
    "available_to" TIMESTAMP(3),
    "pickup_location" TEXT NOT NULL,
    "company_name" TEXT,
    "comfort_features" TEXT[],
    "safety_features" TEXT[],
    "technology_features" TEXT[],
    "lighting_features" TEXT[],
    "driver_assistance_features" TEXT[],
    "other_features" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cars_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "car_images" (
    "id" TEXT NOT NULL,
    "car_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt_text" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "car_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookings" (
    "id" TEXT NOT NULL,
    "renter_id" TEXT NOT NULL,
    "dealer_id" TEXT NOT NULL,
    "car_id" TEXT NOT NULL,
    "pick_up_date" TIMESTAMP(3) NOT NULL,
    "return_date" TIMESTAMP(3) NOT NULL,
    "pickup_location" TEXT NOT NULL,
    "return_location" TEXT,
    "total_price" DECIMAL(10,2) NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'CONFIRMED',
    "cancellation_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "users_isVerified_idx" ON "users"("isVerified");

-- CreateIndex
CREATE INDEX "cars_dealer_id_idx" ON "cars"("dealer_id");

-- CreateIndex
CREATE INDEX "cars_car_type_idx" ON "cars"("car_type");

-- CreateIndex
CREATE INDEX "cars_make_model_idx" ON "cars"("make", "model");

-- CreateIndex
CREATE INDEX "cars_price_per_day_idx" ON "cars"("price_per_day");

-- CreateIndex
CREATE INDEX "cars_created_at_idx" ON "cars"("created_at");

-- CreateIndex
CREATE INDEX "car_images_car_id_idx" ON "car_images"("car_id");

-- CreateIndex
CREATE INDEX "car_images_car_id_is_primary_idx" ON "car_images"("car_id", "is_primary");

-- CreateIndex
CREATE INDEX "bookings_renter_id_idx" ON "bookings"("renter_id");

-- CreateIndex
CREATE INDEX "bookings_dealer_id_idx" ON "bookings"("dealer_id");

-- CreateIndex
CREATE INDEX "bookings_car_id_idx" ON "bookings"("car_id");

-- CreateIndex
CREATE INDEX "bookings_status_idx" ON "bookings"("status");

-- CreateIndex
CREATE INDEX "bookings_pick_up_date_return_date_idx" ON "bookings"("pick_up_date", "return_date");

-- CreateIndex
CREATE INDEX "bookings_created_at_idx" ON "bookings"("created_at");

-- AddForeignKey
ALTER TABLE "cars" ADD CONSTRAINT "cars_dealer_id_fkey" FOREIGN KEY ("dealer_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "car_images" ADD CONSTRAINT "car_images_car_id_fkey" FOREIGN KEY ("car_id") REFERENCES "cars"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_renter_id_fkey" FOREIGN KEY ("renter_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_dealer_id_fkey" FOREIGN KEY ("dealer_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_car_id_fkey" FOREIGN KEY ("car_id") REFERENCES "cars"("id") ON DELETE CASCADE ON UPDATE CASCADE;
