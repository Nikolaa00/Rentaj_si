import { Request, Response } from 'express';
import { prisma } from '../config/database';

export const getAllBookings = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const bookings = await prisma.booking.findMany({
      where:
        req.user.role === 'RENTER'
          ? { renterId: req.user.id }
          : { dealerId: req.user.id },
      include: {
        car: {
          include: {
            images: {
              where: { isPrimary: true },
              take: 1,
            },
          },
        },
        renter: {
          select: {
            id: true,
            fullName: true,
            email: true,
            location: true,
          },
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

    res.json({ bookings, count: bookings.length });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

export const getBookingById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        car: {
          include: {
            images: true,
          },
        },
        renter: {
          select: {
            id: true,
            fullName: true,
            email: true,
            location: true,
          },
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
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (
      booking.renterId !== req.user.id &&
      booking.dealerId !== req.user.id
    ) {
      return res.status(403).json({ error: 'Unauthorized to view this booking' });
    }

    res.json({ booking });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
};

export const createBooking = async (req: Request, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'RENTER') {
      return res.status(403).json({ error: 'Only renters can create bookings' });
    }

    const {
      carId, pickUpDate, returnDate,
      pickupLocation, returnLocation, totalPrice,
    } = req.body;

    if (!carId || !pickUpDate || !returnDate || !totalPrice) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const car = await prisma.car.findUnique({
      where: { id: carId },
      include: { dealer: true },
    });

    if (!car) {
      return res.status(400).json({ error: 'Car not found' });
    }

    if (car.status === 'RENTED') {
      return res.status(400).json({ error: 'Car is already rented' });
    }

    const pickup = new Date(pickUpDate);
    const returnD = new Date(returnDate);
    
    if (pickup >= returnD) {
      return res.status(400).json({ error: 'Return date must be after pickup date' });
    }

    if (pickup < new Date()) {
      return res.status(400).json({ error: 'Pickup date cannot be in the past' });
    }

    const overlapping = await prisma.booking.findFirst({
      where: {
        carId,
        status: 'CONFIRMED',
        OR: [
          {
            AND: [
              { pickUpDate: { lte: pickup } },
              { returnDate: { gte: pickup } },
            ],
          },
          {
            AND: [
              { pickUpDate: { lte: returnD } },
              { returnDate: { gte: returnD } },
            ],
          },
          {
            AND: [
              { pickUpDate: { gte: pickup } },
              { returnDate: { lte: returnD } },
            ],
          },
        ],
      },
    });

    if (overlapping) {
      return res.status(400).json({
        error: 'Car already booked for these dates',
      });
    }

    const [booking] = await prisma.$transaction([
      prisma.booking.create({
        data: {
          renterId: req.user.id,
          dealerId: car.dealerId,
          carId,
          pickUpDate: pickup,
          returnDate: returnD,
          pickupLocation: pickupLocation || car.pickupLocation,
          returnLocation,
          totalPrice: parseFloat(totalPrice),
          status: 'CONFIRMED',
        },
        include: {
          car: {
            include: {
              images: true,
            },
          },
          dealer: {
            select: {
              fullName: true,
              email: true,
              location: true,
            },
          },
        },
      }),
      prisma.car.update({
        where: { id: carId },
        data: { status: 'RENTED' },
      }),
    ]);

    res.status(201).json({
      message: 'Booking created successfully',
      booking,
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
};

export const updateBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const existingBooking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!existingBooking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (
      existingBooking.renterId !== req.user.id &&
      existingBooking.dealerId !== req.user.id
    ) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updateData: any = { ...req.body };

    if (updateData.pickUpDate)
      updateData.pickUpDate = new Date(updateData.pickUpDate);
    if (updateData.returnDate)
      updateData.returnDate = new Date(updateData.returnDate);
    if (updateData.totalPrice)
      updateData.totalPrice = parseFloat(updateData.totalPrice);

    const booking = await prisma.booking.update({
      where: { id },
      data: updateData,
      include: {
        car: {
          include: {
            images: true,
          },
        },
        renter: true,
        dealer: true,
      },
    });

    res.json({ message: 'Booking updated successfully', booking });
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({ error: 'Failed to update booking' });
  }
};

export const cancelBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const booking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (
      booking.renterId !== req.user.id &&
      booking.dealerId !== req.user.id
    ) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (booking.status === 'CANCELLED') {
      return res.status(400).json({ error: 'Booking already cancelled' });
    }


    const [updatedBooking] = await prisma.$transaction([
      prisma.booking.update({
        where: { id },
        data: {
          status: 'CANCELLED',
          cancellationDate: new Date(),
        },
        include: {
          car: true,
          renter: true,
          dealer: true,
        },
      }),
      prisma.car.update({
        where: { id: booking.carId },
        data: { status: 'AVAILABLE' },
      }),
    ]);

    res.json({
      message: 'Booking cancelled successfully',
      booking: updatedBooking,
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
};