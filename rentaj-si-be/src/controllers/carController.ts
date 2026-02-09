import { Request, Response } from 'express';
import { prisma } from '../config/database';
import cloudinary from '../config/cloudinary';

export const getAllCars = async (req: Request, res: Response) => {
  try {
    const {
      dealerId,
      carType,
      minPrice,
      maxPrice,
      transmission,
      fuelType,
      make,
      model,
    } = req.query;

    const cars = await prisma.car.findMany({
      where: {
        ...(dealerId && { dealerId: dealerId as string }),
        ...(carType && { carType: carType as any }),
        ...(transmission && { transmission: transmission as any }),
        ...(fuelType && { fuelType: fuelType as any }),
        ...(make && { make: { contains: make as string, mode: 'insensitive' } }),
        ...(model && { model: { contains: model as string, mode: 'insensitive' } }),
        ...(minPrice && {
          pricePerDay: { gte: parseFloat(minPrice as string) },
        }),
        ...(maxPrice && {
          pricePerDay: { lte: parseFloat(maxPrice as string) },
        }),
      },
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
        dealer: {
          select: {
            id: true,
            fullName: true,
            email: true,
            location: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json({ cars, count: cars.length });
  } catch (error) {
    console.error('Get cars error:', error);
    res.status(500).json({ error: 'Failed to fetch cars' });
  }
};

export const getCarById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const car = await prisma.car.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
        dealer: {
          select: {
            id: true,
            fullName: true,
            email: true,
            location: true,
          },
        },
        bookings: {
          where: {
            status: 'CONFIRMED',
          },
          select: {
            id: true,
            pickUpDate: true,
            returnDate: true,
          },
        },
      },
    });

    if (!car) {
      return res.status(404).json({ error: 'Car not found' });
    }

    res.json({ car });
  } catch (error) {
    console.error('Get car error:', error);
    res.status(500).json({ error: 'Failed to fetch car' });
  }
};

export const createCar = async (req: Request, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'DEALER') {
      return res.status(403).json({ error: 'Only dealers can create cars' });
    }

    const {
      title, make, model, year, carType, transmission, fuelType,
      price, pricePerDay, mileage, condition, firstRegistration,
      performance, engineCapacity, cylinders, emissionClass, driveType,
      seats, doors, weight, towingCapacity, color, interior,
      availableFrom, availableTo, pickupLocation, DealerName,
      fuelConsumption, validHUUntil, comfortFeatures, safetyFeatures,
      technologyFeatures, lightingFeatures, driverAssistanceFeatures,
      otherFeatures, images,
    } = req.body;

    if (!title || !make || !model || !year || !carType || !transmission || 
        !fuelType || !price || !pricePerDay || !driveType || !availableFrom || 
        !pickupLocation) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const parseDate = (dateString: string | null | undefined): Date | null => {
      if (!dateString) return null;
      if (dateString.includes('T') && dateString.includes('Z')) {
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? null : date;
      }
      if (dateString.includes('/')) {
        const [month, year] = dateString.split('/');
        if (month && year) {
          const date = new Date(parseInt(year), parseInt(month) - 1, 1);
          return isNaN(date.getTime()) ? null : date;
        }
      }
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? null : date;
    };

    const car = await prisma.car.create({
      data: {
        dealerId: req.user.id,
        renterId: req.user.id,
        title, make, model,
        year: parseInt(year),
        carType, transmission, fuelType,
        price: parseFloat(price),
        pricePerDay: parseFloat(pricePerDay),
        mileage: mileage ? parseInt(mileage) : null,
        condition: condition || 'USED',
        status: 'AVAILABLE', 
        firstRegistration: parseDate(firstRegistration),
        performance, engineCapacity,
        cylinders: cylinders ? parseInt(cylinders) : null,
        emissionClass, driveType,
        seats: seats ? parseInt(seats) : 5,
        doors: doors ? parseInt(doors) : 4,
        weight: weight ? parseInt(weight) : null,
        towingCapacity: towingCapacity ? parseInt(towingCapacity) : null,
        color, interior,
        availableFrom: parseDate(availableFrom) || new Date(),
        availableTo: parseDate(availableTo),
        pickupLocation, DealerName, fuelConsumption,
        validHUUntil: parseDate(validHUUntil),
        comfortFeatures: comfortFeatures || [],
        safetyFeatures: safetyFeatures || [],
        technologyFeatures: technologyFeatures || [],
        lightingFeatures: lightingFeatures || [],
        driverAssistanceFeatures: driverAssistanceFeatures || [],
        otherFeatures: otherFeatures || [],
        images: images?.length > 0
          ? {
              create: images.map((img: any, index: number) => ({
                url: img.url,
                order: index,
                isPrimary: index === 0,
                altText: `${title} - Image ${index + 1}`,
              })),
            }
          : undefined,
      },
      include: {
        images: true,
      },
    });

    res.status(201).json({
      message: 'Car created successfully',
      car,
    });
  } catch (error) {
    console.error('Create car error:', error);
    res.status(500).json({ error: 'Failed to create car' });
  }
};

export const updateCar = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!req.user || req.user.role !== 'DEALER') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const existingCar = await prisma.car.findUnique({
      where: { id },
    });

    if (!existingCar || existingCar.dealerId !== req.user.id) {
      return res.status(404).json({ error: 'Car not found or unauthorized' });
    }

    const updateData: any = { ...req.body };

    if (updateData.year) updateData.year = parseInt(updateData.year);
    if (updateData.price) updateData.price = parseFloat(updateData.price);
    if (updateData.pricePerDay)
      updateData.pricePerDay = parseFloat(updateData.pricePerDay);
    if (updateData.mileage) updateData.mileage = parseInt(updateData.mileage);
    if (updateData.seats) updateData.seats = parseInt(updateData.seats);
    if (updateData.doors) updateData.doors = parseInt(updateData.doors);
    if (updateData.weight) updateData.weight = parseInt(updateData.weight);
    if (updateData.cylinders)
      updateData.cylinders = parseInt(updateData.cylinders);
    if (updateData.towingCapacity)
      updateData.towingCapacity = parseInt(updateData.towingCapacity);

    const parseDate = (dateString: string): Date | null => {
      if (!dateString) return null;
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? null : date;
    };

    if (updateData.availableFrom)
      updateData.availableFrom = parseDate(updateData.availableFrom);
    if (updateData.availableTo)
      updateData.availableTo = parseDate(updateData.availableTo);
    if (updateData.firstRegistration)
      updateData.firstRegistration = parseDate(updateData.firstRegistration);
    if (updateData.validHUUntil)
      updateData.validHUUntil = parseDate(updateData.validHUUntil);

    const updatedCar = await prisma.car.update({
      where: { id },
      data: updateData,
      include: {
        images: true,
      },
    });

    res.json({ message: 'Car updated successfully', car: updatedCar });
  } catch (error) {
    console.error('Update car error:', error);
    res.status(500).json({ error: 'Failed to update car' });
  }
};

export const deleteCar = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!req.user || req.user.role !== 'DEALER') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const existingCar = await prisma.car.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!existingCar || existingCar.dealerId !== req.user.id) {
      return res.status(404).json({ error: 'Car not found or unauthorized' });
    }

    if (existingCar.images.length > 0) {
      const deletePromises = existingCar.images.map((img) => {
        const publicId = img.url.split('/').slice(-2).join('/').split('.')[0];
        return cloudinary.uploader.destroy(publicId);
      });
      await Promise.all(deletePromises);
    }

    await prisma.car.delete({
      where: { id },
    });

    res.json({ message: 'Car deleted successfully' });
  } catch (error) {
    console.error('Delete car error:', error);
    res.status(500).json({ error: 'Failed to delete car' });
  }
};

export const searchCars = async (req: Request, res: Response) => {
  try {
    const {
      searchQuery, carTypes, pickupLocation, pickupDate, returnDate,
      minPrice, maxPrice, transmission, fuelType,
    } = req.body;

    const parseDate = (dateString: string): Date | null => {
      if (!dateString) return null;
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? null : date;
    };

    const pickup = parseDate(pickupDate);
    const returnD = parseDate(returnDate);

    const cars = await prisma.car.findMany({
      where: {
        AND: [
          searchQuery
            ? {
                OR: [
                  { title: { contains: searchQuery, mode: 'insensitive' } },
                  { make: { contains: searchQuery, mode: 'insensitive' } },
                  { model: { contains: searchQuery, mode: 'insensitive' } },
                ],
              }
            : {},
          carTypes?.length > 0 ? { carType: { in: carTypes } } : {},
          pickupLocation
            ? { pickupLocation: { contains: pickupLocation, mode: 'insensitive' } }
            : {},
          pickup && returnD
            ? {
                AND: [
                  { availableFrom: { lte: pickup } },
                  {
                    OR: [
                      { availableTo: { gte: returnD } },
                      { availableTo: null },
                    ],
                  },
                ],
              }
            : {},
          minPrice ? { pricePerDay: { gte: parseFloat(minPrice) } } : {},
          maxPrice ? { pricePerDay: { lte: parseFloat(maxPrice) } } : {},
          transmission ? { transmission } : {},
          fuelType ? { fuelType } : {},
        ],
      },
      include: {
        images: {
          where: { isPrimary: true },
          take: 1,
        },
        dealer: {
          select: {
            fullName: true,
            location: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json({ cars, count: cars.length });
  } catch (error) {
    console.error('Search cars error:', error);
    res.status(500).json({ error: 'Failed to search cars' });
  }
};