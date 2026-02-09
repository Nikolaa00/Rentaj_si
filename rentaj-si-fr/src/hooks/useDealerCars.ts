import { useState, useEffect } from 'react';
import { carService } from '@/services/carService';
import type { Car } from '@/types/car';

export function useDealerCars() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCars = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await carService.getAll();
      setCars(data.cars);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch cars');
    } finally {
      setLoading(false);
    }
  };

  const deleteCar = async (id: string) => {
    try {
      await carService.delete(id);
      setCars((prev) => prev.filter((car) => car.id !== id));
      return true;
    } catch (err: any) {
      throw new Error(err.response?.data?.error || 'Failed to delete car');
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  return {
    cars,
    loading,
    error,
    fetchCars,
    deleteCar,
  };
}