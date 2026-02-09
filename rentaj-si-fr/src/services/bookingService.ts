import { api } from '@/lib/axios';
import type { Booking, CreateBookingRequest } from '@/types/booking';

export const bookingService = {
  // Get all bookings (for current user)
  getAll: async (): Promise<{ bookings: Booking[]; count: number }> => {
    try {
      const response = await api.get<{ bookings: Booking[]; count: number }>('/api/bookings');
      return response.data;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  },

  // Get booking by ID
  getById: async (id: string): Promise<{ booking: Booking }> => {
    try {
      const response = await api.get<{ booking: Booking }>(`/api/bookings/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching booking ${id}:`, error);
      throw error;
    }
  },

  // Create booking (Renter only)
  create: async (data: CreateBookingRequest): Promise<{ message: string; booking: Booking }> => {
    try {
      const response = await api.post<{ message: string; booking: Booking }>('/api/bookings', data);
      return response.data;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  },

  // Cancel booking
  cancel: async (id: string): Promise<{ message: string; booking: Booking }> => {
    try {
      const response = await api.post<{ message: string; booking: Booking }>(`/api/bookings/${id}/cancel`);
      return response.data;
    } catch (error) {
      console.error(`Error cancelling booking ${id}:`, error);
      throw error;
    }
  },
};