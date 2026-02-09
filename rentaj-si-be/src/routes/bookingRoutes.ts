import { Router } from 'express';
import {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBooking,
  cancelBooking,
} from '../controllers/bookingController';
import { authenticate, authorize } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticate);

router.get('/', getAllBookings);
router.get('/:id', getBookingById);
router.post('/', authorize('RENTER'), createBooking);
router.put('/:id', updateBooking);
router.post('/:id/cancel', cancelBooking);

export default router;