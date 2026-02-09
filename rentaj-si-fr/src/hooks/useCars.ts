import { useState, useEffect } from 'react';
import { carService } from '@/services/carService';
import type { Car, SearchCarsRequest } from '@/types/car';

export function useCars() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [count, setCount] = useState(0);

  const fetchCars = async (params?: any) => {
    try {
      setLoading(true);
      setError(null);
      const data = await carService.getAll(params);
      setCars(data.cars);
      setCount(data.count);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch cars');
    } finally {
      setLoading(false);
    }
  };

  const searchCars = async (filters: SearchCarsRequest) => {
    try {
      setLoading(true);
      setError(null);
      const data = await carService.search(filters);
      setCars(data.cars);
      setCount(data.count);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to search cars');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  return {
    cars,
    loading,
    error,
    count,
    fetchCars,
    searchCars,
  };
}