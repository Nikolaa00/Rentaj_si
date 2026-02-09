import { api } from '@/lib/axios';
import type { Car, SearchCarsRequest } from '@/types/car';

export const carService = {
  // ========== PUBLIC ROUTES ==========
  
  // Get all cars
  getAll: async (params?: any): Promise<{ cars: Car[]; count: number }> => {
    try {
      const response = await api.get<{ cars: Car[]; count: number }>('/api/cars', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching cars:', error);
      throw error;
    }
  },

  // Get car by ID
  getById: async (id: string): Promise<{ car: Car }> => {
    try {
      const response = await api.get<{ car: Car }>(`/api/cars/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching car ${id}:`, error);
      throw error;
    }
  },

  // Search cars
  search: async (data: SearchCarsRequest): Promise<{ cars: Car[]; count: number }> => {
    try {
      const response = await api.post<{ cars: Car[]; count: number }>('/api/cars/search', data);
      return response.data;
    } catch (error) {
      console.error('Error searching cars:', error);
      throw error;
    }
  },

  // ========== DEALER ONLY ROUTES ==========

  // Create new car (Dealer only)
  create: async (carData: any): Promise<{ message: string; car: Car }> => {
    try {
      const response = await api.post<{ message: string; car: Car }>('/api/cars', carData);
      return response.data;
    } catch (error) {
      console.error('Error creating car:', error);
      throw error;
    }
  },

  // Update car (Dealer only)
  update: async (id: string, carData: any): Promise<{ message: string; car: Car }> => {
    try {
      const response = await api.put<{ message: string; car: Car }>(`/api/cars/${id}`, carData);
      return response.data;
    } catch (error) {
      console.error(`Error updating car ${id}:`, error);
      throw error;
    }
  },

  // Delete car (Dealer only)
  delete: async (id: string): Promise<{ message: string }> => {
    try {
      const response = await api.delete<{ message: string }>(`/api/cars/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting car ${id}:`, error);
      throw error;
    }
  },
};