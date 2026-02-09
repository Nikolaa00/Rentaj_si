import { Router } from 'express';
import {
  getAllCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
  searchCars,
} from '../controllers/carController';
import { authenticate, authorize } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getAllCars);
router.get('/:id', getCarById);
router.post('/search', searchCars);

router.post('/', authenticate, authorize('DEALER'), createCar);
router.put('/:id', authenticate, authorize('DEALER'), updateCar);
router.delete('/:id', authenticate, authorize('DEALER'), deleteCar);

export default router;