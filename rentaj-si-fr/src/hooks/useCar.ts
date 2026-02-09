import { useState, useEffect } from 'react';
import { carService } from '@/services/carService';
import type { Car } from '@/types/car';

export function useCar(id: string) {
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await carService.getById(id);
        setCar(data.car);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to fetch car');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCar();
    }
  }, [id]);

  return {
    car,
    loading,
    error,
  };
}